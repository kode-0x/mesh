import fs   from 'node:fs';
import path from 'node:path';
import os   from 'node:os';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface VaultInitResult {
  ok:           boolean;
  resolvedPath: string;
  error?:       string;
}

export interface NoteWriteResult {
  ok:       boolean;
  filePath: string;
  error?:   string;
}

// ── Path resolution ───────────────────────────────────────────────────────────

/**
 * Resolve a user-supplied output path to an absolute path.
 * Handles:
 *   - Leading ~  →  expanded to home directory
 *   - Relative   →  resolved against cwd
 *   - Absolute   →  used as-is
 *   - Backslashes on Windows normalised to forward slashes for display
 */
export function resolveOutputPath(raw: string): string {
  const trimmed = raw.trim() || './vault';
  const expanded = trimmed.startsWith('~')
    ? path.join(os.homedir(), trimmed.slice(1))
    : trimmed;
  return path.resolve(expanded);
}

// ── Vault initialisation ──────────────────────────────────────────────────────

/**
 * Prepare the vault root directory at the resolved output path.
 *
 * - Expands and resolves the raw path
 * - Creates the directory (and all parent directories) if missing
 * - Verifies write permission by touching a temp file
 * - Returns a VaultInitResult so callers can surface errors without throwing
 */
export function initVault(rawOutputPath: string): VaultInitResult {
  const resolved = resolveOutputPath(rawOutputPath);

  try {
    fs.mkdirSync(resolved, { recursive: true });
  } catch (err) {
    return {
      ok:           false,
      resolvedPath: resolved,
      error:        `Could not create directory: ${errMessage(err)}`,
    };
  }

  // Verify we can actually write into the directory
  const probe = path.join(resolved, '.mesh-write-check');
  try {
    fs.writeFileSync(probe, '');
    fs.unlinkSync(probe);
  } catch (err) {
    return {
      ok:           false,
      resolvedPath: resolved,
      error:        `No write permission at ${resolved}: ${errMessage(err)}`,
    };
  }

  return { ok: true, resolvedPath: resolved };
}

// ── Note writing ──────────────────────────────────────────────────────────────

/**
 * Write a single Markdown note to disk.
 *
 * @param vaultRoot    Absolute path to the vault root (from initVault).
 * @param relativePath Relative path within the vault including filename,
 *                     e.g. "Machine Learning/Supervised Learning/Regression.md".
 *                     Parent directories are created automatically.
 * @param content      Full Markdown content to write.
 */
export function writeNote(
  vaultRoot:    string,
  relativePath: string,
  content:      string,
): NoteWriteResult {
  const filePath = path.join(vaultRoot, relativePath);
  const parent   = path.dirname(filePath);

  try {
    fs.mkdirSync(parent, { recursive: true });
  } catch (err) {
    return { ok: false, filePath, error: `mkdir failed: ${errMessage(err)}` };
  }

  try {
    fs.writeFileSync(filePath, content, 'utf8');
  } catch (err) {
    return { ok: false, filePath, error: `write failed: ${errMessage(err)}` };
  }

  return { ok: true, filePath };
}

// ── Vault verification ────────────────────────────────────────────────────────

/**
 * Verify the vault exists and contains at least one .md file.
 * Called after generation completes to confirm the output is present.
 */
export function verifyVault(vaultRoot: string): { ok: boolean; noteCount: number; error?: string } {
  try {
    const entries = fs.readdirSync(vaultRoot);
    const mdCount = entries.filter(e => e.endsWith('.md')).length;
    return { ok: mdCount > 0, noteCount: mdCount };
  } catch (err) {
    return { ok: false, noteCount: 0, error: errMessage(err) };
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Convert any thrown value to a readable string. */
function errMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

/**
 * Turn a note title into a safe filesystem filename segment.
 * Strips or replaces characters that are invalid on Windows, macOS, and Linux.
 * Exported so callers can build relative paths before calling writeNote.
 */
export function sanitiseFilename(title: string): string {
  return title
    .replace(/[/\\?%*:|"<>]/g, '-')  // illegal on Windows/Unix
    .replace(/\s+/g, ' ')             // collapse whitespace
    .replace(/\.+$/g, '')             // no trailing dots (Windows)
    .trim()
    .slice(0, 200);                   // max filename length headroom
}

// ── INSTRUCTIONS.md ──────────────────────────────────────────────────────────

/**
 * Attempt to read an INSTRUCTIONS.md file from the resolved output path.
 *
 * Returns the trimmed file contents if the file exists and is readable,
 * or null if the file is absent or cannot be read.
 */
export function readInstructions(rawOutputPath: string): string | null {
  const resolved = resolveOutputPath(rawOutputPath);
  const filePath = path.join(resolved, 'INSTRUCTIONS.md');
  try {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, 'utf8').trim();
    return content.length > 0 ? content : null;
  } catch {
    return null;
  }
}

// ── Index files ───────────────────────────────────────────────────────────────

/** The three filenames that together constitute the vault index. */
export const INDEX_FILENAMES = ['index.md', 'MOC.md', 'Learning Path.md'] as const;
export type  IndexFilename   = typeof INDEX_FILENAMES[number];

export interface IndexFile {
  filename: IndexFilename;
  title:    string;
  filePath: string;
}

export interface IndexCreateResult {
  ok:      boolean;
  files:   IndexFile[];
  skipped: IndexFilename[]; // files that already existed
  errors:  Array<{ filename: IndexFilename; error: string }>;
}

/**
 * Check whether the vault index already exists.
 * Returns true only if ALL three index files are present on disk.
 */
export function indexExists(vaultRoot: string): boolean {
  return INDEX_FILENAMES.every(name =>
    fs.existsSync(path.join(vaultRoot, name)),
  );
}

/**
 * Check which index files are missing from the vault.
 * Used to decide whether to show the "Create Index" action.
 */
export function missingIndexFiles(vaultRoot: string): IndexFilename[] {
  return INDEX_FILENAMES.filter(
    name => !fs.existsSync(path.join(vaultRoot, name)),
  );
}

/**
 * Write the vault index files (index.md, MOC.md, Learning Path.md).
 *
 * - Skips any file that already exists on disk (never overwrites)
 * - Returns a typed result describing what was written, skipped, and failed
 * - Never throws
 */
export function createVaultIndex(
  vaultRoot: string,
  topic:     string,
  noteCount: number,
): IndexCreateResult {
  const result: IndexCreateResult = { ok: true, files: [], skipped: [], errors: [] };

  const definitions: Array<{ filename: IndexFilename; content: string }> = [
    {
      filename: 'index.md',
      content:  buildIndexContent(topic, vaultRoot, noteCount),
    },
    {
      filename: 'MOC.md',
      content:  buildMocContent(topic, vaultRoot),
    },
    {
      filename: 'Learning Path.md',
      content:  buildLearningPathContent(topic),
    },
  ];

  for (const { filename, content } of definitions) {
    const filePath = path.join(vaultRoot, filename);

    // Skip if already present — never overwrite user edits
    if (fs.existsSync(filePath)) {
      result.skipped.push(filename);
      continue;
    }

    try {
      fs.writeFileSync(filePath, content, 'utf8');
      result.files.push({ filename, title: filename.replace('.md', ''), filePath });
    } catch (err) {
      result.ok = false;
      result.errors.push({ filename, error: errMessage(err) });
    }
  }

  // Partial success (some written, some errored) is still considered ok
  // as long as at least one file was written without error.
  if (result.errors.length > 0 && result.files.length === 0) {
    result.ok = false;
  }

  return result;
}

// ── Index content builders ────────────────────────────────────────────────────

function buildIndexContent(topic: string, vaultRoot: string, noteCount: number): string {
  const date = new Date().toISOString().split('T')[0];

  // Collect existing .md filenames to link from the index
  let noteLinks = '';
  try {
    const entries = fs.readdirSync(vaultRoot)
      .filter(e => e.endsWith('.md') && !INDEX_FILENAMES.includes(e as IndexFilename))
      .sort();
    noteLinks = entries
      .map(e => `- [[${e.replace('.md', '')}]]`)
      .join('\n');
  } catch {
    noteLinks = '_Notes not yet available._';
  }

  return [
    '---',
    `title: "${topic} — Index"`,
    `topic: "${topic}"`,
    `created: ${date}`,
    'tags: [index, mesh-generated]',
    '---',
    '',
    `# ${topic}`,
    '',
    `> Root entry point for the **${topic}** knowledge vault.`,
    `> Generated by mesh · ${noteCount} notes · ${date}`,
    '',
    '## Navigation',
    '',
    '- [[MOC]] — Map of Content',
    '- [[Learning Path]] — Recommended study sequence',
    '',
    '## All Notes',
    '',
    noteLinks || '_No notes found._',
  ].join('\n');
}

function buildMocContent(topic: string, vaultRoot: string): string {
  const date = new Date().toISOString().split('T')[0];

  let noteLinks = '';
  try {
    const entries = fs.readdirSync(vaultRoot)
      .filter(e => e.endsWith('.md') && !INDEX_FILENAMES.includes(e as IndexFilename))
      .sort();
    noteLinks = entries
      .map(e => `- [[${e.replace('.md', '')}]]`)
      .join('\n');
  } catch {
    noteLinks = '_Notes not yet available._';
  }

  return [
    '---',
    `title: "${topic} — Map of Content"`,
    `topic: "${topic}"`,
    `created: ${date}`,
    'tags: [moc, mesh-generated]',
    '---',
    '',
    `# ${topic} — Map of Content`,
    '',
    '> A structured overview of every concept in this vault.',
    '',
    '## Contents',
    '',
    noteLinks || '_No notes found._',
    '',
    '---',
    '',
    '[[index|← Back to Index]]',
  ].join('\n');
}

function buildLearningPathContent(topic: string): string {
  const date = new Date().toISOString().split('T')[0];

  return [
    '---',
    `title: "${topic} — Learning Path"`,
    `topic: "${topic}"`,
    `created: ${date}`,
    'tags: [learning-path, mesh-generated]',
    '---',
    '',
    `# ${topic} — Learning Path`,
    '',
    '> A recommended sequence for studying this vault from beginner to advanced.',
    '',
    '## Stage 1 — Foundations',
    '',
    `- Start with **[[${topic} — Overview]]** for a broad picture`,
    `- Read **[[${topic} — Core Concepts]]** to build vocabulary`,
    `- Study **[[${topic} — Terminology & Definitions]]**`,
    '',
    '## Stage 2 — Core Knowledge',
    '',
    `- Work through **[[${topic} — Key Principles]]**`,
    `- Study **[[${topic} — Foundational Theory]]**`,
    `- Review **[[${topic} — Common Patterns]]**`,
    '',
    '## Stage 3 — Application',
    '',
    `- Explore **[[${topic} — Practical Applications]]**`,
    `- Study **[[${topic} — Tools & Ecosystem]]**`,
    `- Review **[[${topic} — Best Practices]]**`,
    '',
    '## Stage 4 — Advanced',
    '',
    `- Tackle **[[${topic} — Advanced Topics]]**`,
    `- Read **[[${topic} — Case Studies]]**`,
    `- Explore **[[${topic} — Current Research]]**`,
    '',
    '---',
    '',
    '[[index|← Back to Index]]  ·  [[MOC|Map of Content]]',
  ].join('\n');
}
