import path from 'node:path';
import { type MeshConfig } from '../screens/ConfigScreen.js';
import { getApiKey } from '../session.js';
import { initVault, writeNote, verifyVault, sanitiseFilename } from './vault.js';
import {
  generateIndex,
  countLeaves,
  type TopicNode,
} from './indexer.js';
import { generateNote, buildFolderNote } from './noteWriter.js';

// ── Event types ───────────────────────────────────────────────────────────────

export type GenerationEvent =
  | { type: 'start';        total: number }
  | { type: 'vault-ready';  resolvedPath: string }
  | { type: 'index-start' }
  | { type: 'index-done';   nodeCount: number }
  | { type: 'note-start';   index: number; total: number; title: string; relativePath: string }
  | { type: 'note-done';    index: number; total: number; title: string; filePath: string; tokensUsed: number }
  | { type: 'log';          level: 'info' | 'warn' | 'error'; message: string }
  | { type: 'paused' }
  | { type: 'resumed' }
  | { type: 'cancelled' }
  | { type: 'complete';     notesWritten: number; totalTokens: number; elapsedMs: number; resolvedPath: string };

// ── Control handle ────────────────────────────────────────────────────────────

export interface GenerationHandle {
  pause():  void;
  resume(): void;
  cancel(): void;
}

export type HandleWithEmitter = GenerationHandle & {
  _paused:    boolean;
  _cancelled: boolean;
  _emit:      ((event: GenerationEvent) => void) | null;
};

export function createHandle(): HandleWithEmitter {
  const h: HandleWithEmitter = {
    _paused:    false,
    _cancelled: false,
    _emit:      null,
    pause() {
      if (h._cancelled || h._paused) return;
      h._paused = true;
      h._emit?.({ type: 'paused' });
    },
    resume() {
      if (!h._paused) return;
      h._paused = false;
      h._emit?.({ type: 'resumed' });
    },
    cancel() {
      if (h._cancelled) return;
      h._cancelled = true;
      h._paused    = false;
      h._emit?.({ type: 'cancelled' });
    },
  };
  return h;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

type Handle = HandleWithEmitter;

/**
 * Build the relative filesystem path for a node inside the vault.
 *
 * Rules:
 *  - Root node children  → <Title>/<Title>.md
 *  - Deeper nodes        → path[1]/.../path[n]/<Title>.md
 *    (path[0] is always the root topic which maps to the vault root)
 *
 * Example: path = ["Machine Learning", "Supervised Learning", "Regression"]
 *   → "Supervised Learning/Regression/Regression.md"   (leaf)
 *   → "Supervised Learning/Supervised Learning.md"     (folder note, 1 level)
 */
function nodeRelativePath(node: TopicNode, isFolder: boolean): string {
  // Drop the root topic segment (path[0]) — it maps to the vault root itself
  const segments = node.path.slice(1).map(sanitiseFilename);

  if (isFolder) {
    // Folder note lives inside its own folder: Folder/Folder.md
    return path.join(...segments, sanitiseFilename(node.title) + '.md');
  }

  // Leaf note: place inside its parent folder (last segment of path)
  // If depth=1 (direct child of root), write directly into vault root
  if (segments.length === 1) {
    return sanitiseFilename(node.title) + '.md';
  }
  return path.join(...segments.slice(0, -1), sanitiseFilename(node.title) + '.md');
}

/** Pause/resume gate — awaits until unpaused or cancelled. */
async function gate(handle: Handle): Promise<'continue' | 'cancelled'> {
  if (!handle._paused) return 'continue';
  await new Promise<void>(resolve => {
    const t = setInterval(() => {
      if (!handle._paused || handle._cancelled) { clearInterval(t); resolve(); }
    }, 100);
  });
  return handle._cancelled ? 'cancelled' : 'continue';
}

// ── Recursive traversal ───────────────────────────────────────────────────────

interface TraversalState {
  rootTopic:    string;
  vaultPath:    string;
  config:       MeshConfig;
  handle:       Handle;
  counter:      { done: number; total: number; tokens: number };
  emit:         (event: GenerationEvent) => void;
}

/**
 * Recursively traverse the topic tree, writing notes and folder-index files.
 *
 * For each non-leaf node:
 *   1. Write a folder-index note (no AI call — static wikilink list)
 *   2. Recurse into each child
 *
 * For each leaf node:
 *   1. Call OpenRouter to generate note content
 *   2. Write the note to its nested path on disk
 */
async function traverseNode(node: TopicNode, state: TraversalState): Promise<void> {
  const { rootTopic, vaultPath, config, handle, counter, emit } = state;

  if (handle._cancelled) return;

  const isLeaf   = node.children.length === 0;
  const relPath  = nodeRelativePath(node, !isLeaf);
  const display  = node.path.slice(1).join(' / ') || node.title;

  // ── Pause gate ──────────────────────────────────────────────────────────
  if (handle._paused) {
    const result = await gate(handle);
    if (result === 'cancelled') return;
  }

  emit({
    type:         'note-start',
    index:        counter.done,
    total:        counter.total,
    title:        display,
    relativePath: relPath,
  });

  if (isLeaf) {
    // ── Leaf: generate note with AI ──────────────────────────────────────
    let content:    string;
    let tokensUsed: number;

    try {
      const result = await generateNote(node, rootTopic, config);
      content    = result.content;
      tokensUsed = result.tokensUsed;
    } catch (err) {
      emit({ type: 'log', level: 'error', message: `Note "${display}" failed: ${err instanceof Error ? err.message : String(err)}` });
      counter.done++;
      return;
    }

    const write = writeNote(vaultPath, relPath, content);
    if (!write.ok) {
      emit({ type: 'log', level: 'error', message: `Write failed "${relPath}": ${write.error}` });
    } else {
      counter.tokens += tokensUsed;
      emit({ type: 'note-done', index: counter.done, total: counter.total, title: display, filePath: write.filePath, tokensUsed });
    }
    counter.done++;

  } else {
    // ── Non-leaf: write static folder-index note, then recurse ───────────
    const folderContent = buildFolderNote(node, rootTopic);
    const write         = writeNote(vaultPath, relPath, folderContent);

    if (!write.ok) {
      emit({ type: 'log', level: 'error', message: `Folder note failed "${relPath}": ${write.error}` });
    } else {
      emit({ type: 'note-done', index: counter.done, total: counter.total, title: display, filePath: write.filePath, tokensUsed: 0 });
    }
    counter.done++;

    for (const child of node.children) {
      if (handle._cancelled) return;
      await traverseNode(child, state);
    }
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function* runGeneration(
  topic:  string,
  config: MeshConfig,
  handle: Handle,
): AsyncGenerator<GenerationEvent> {
  // Adapter: collect emitted events into a queue the generator can yield
  const queue: GenerationEvent[] = [];
  let   resolve: (() => void) | null = null;

  function emit(event: GenerationEvent) {
    queue.push(event);
    resolve?.();
    resolve = null;
  }

  // Wire handle so pause()/resume()/cancel() can emit events directly
  handle._emit = emit;

  async function waitForEvent(): Promise<void> {
    if (queue.length > 0) return;
    await new Promise<void>(r => { resolve = r; });
  }

  // Run the generation pipeline in a background async task
  const pipeline = (async () => {
    // ── API key ───────────────────────────────────────────────────────────
    if (!getApiKey()) {
      emit({ type: 'log', level: 'error', message: 'No API key in session. Aborting.' });
      return;
    }

    // ── Init vault on disk ───────────────────────────────────────────────
    const vaultInit = initVault(config.outputPath);
    if (!vaultInit.ok) {
      emit({ type: 'log', level: 'error', message: vaultInit.error ?? 'Failed to create vault directory.' });
      return;
    }

    const resolvedPath = vaultInit.resolvedPath;
    emit({ type: 'vault-ready', resolvedPath });
    emit({ type: 'log', level: 'info', message: `Vault: ${resolvedPath}` });
    emit({ type: 'log', level: 'info', message: `Model: ${config.model}` });
    emit({ type: 'log', level: 'info', message: `Depth: ${config.depth}` });
    if (config.customPrompt) {
      const preview = config.customPrompt.length > 60
        ? config.customPrompt.slice(0, 57) + '…'
        : config.customPrompt;
      emit({ type: 'log', level: 'info', message: `Instructions: "${preview}"` });
    }

    const startTime = Date.now();

    // ── Generate index (topic tree) ──────────────────────────────────────
    emit({ type: 'index-start' });
    emit({ type: 'log', level: 'info', message: 'Generating topic tree from AI…' });

    let root: TopicNode;
    try {
      root = await generateIndex(topic, config);
    } catch (err) {
      emit({ type: 'log', level: 'error', message: `Index generation failed: ${err instanceof Error ? err.message : String(err)}` });
      return;
    }

    // Count ALL nodes (folder notes + leaf notes) for the progress total
    // +1 for the root's direct children folder notes
    const totalNotes = countAllNodes(root);
    emit({ type: 'index-done', nodeCount: totalNotes });
    emit({ type: 'start', total: totalNotes });
    emit({ type: 'log', level: 'info', message: `Index ready: ${totalNotes} notes to generate` });

    // ── Traverse tree and write notes ────────────────────────────────────
    const counter = { done: 0, total: totalNotes, tokens: 0 };

    const state: TraversalState = {
      rootTopic: topic,
      vaultPath: resolvedPath,
      config,
      handle,
      counter,
      emit,
    };

    for (const child of root.children) {
      if (handle._cancelled) break;
      await traverseNode(child, state);
    }

    if (handle._cancelled) {
      return;
    }

    // ── Verify ───────────────────────────────────────────────────────────
    const verify = verifyVault(resolvedPath);
    if (verify.ok) {
      emit({ type: 'log', level: 'info', message: `Verified: ${verify.noteCount} notes on disk` });
    } else {
      emit({ type: 'log', level: 'warn', message: `Verification: ${verify.error ?? 'no .md files found'}` });
    }

    emit({
      type:         'complete',
      notesWritten: counter.done,
      totalTokens:  counter.tokens,
      elapsedMs:    Date.now() - startTime,
      resolvedPath,
    });
  })();

  // Yield events as they arrive from the pipeline
  let done = false;
  pipeline.finally(() => { done = true; handle._emit = null; resolve?.(); resolve = null; });

  while (true) {
    await waitForEvent();
    while (queue.length > 0) {
      yield queue.shift()!;
    }
    if (done && queue.length === 0) break;
  }
}

// ── Tree node count (folder notes + leaf notes) ───────────────────────────────

function countAllNodes(node: TopicNode): number {
  // Every non-root node generates exactly one file (folder note or leaf note)
  return node.children.reduce((sum, child) => sum + 1 + countAllNodes(child), 0);
}
