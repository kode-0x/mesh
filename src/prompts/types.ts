import { type MeshConfig } from '../screens/ConfigScreen.js';
import { type TopicNode }  from '../services/indexer.js';

// ── Note types ────────────────────────────────────────────────────────────────

/**
 * Every leaf note in a vault is classified as one of these types.
 * The type drives which prompt template is selected from the registry.
 *
 *  concept      — defines a term or idea with precision
 *  overview     — broad survey of a subject area
 *  howItWorks   — mechanism, process, or algorithm explanation
 *  example      — concrete worked example or case study
 *  comparison   — side-by-side analysis of alternatives
 *  reference    — structured lookup table / cheat-sheet
 *  deepDive     — exhaustive technical treatment
 *  folder       — static folder-index note (no AI call)
 */
export type NoteType =
  | 'concept'
  | 'overview'
  | 'howItWorks'
  | 'example'
  | 'comparison'
  | 'reference'
  | 'deepDive'
  | 'folder';

// ── Depth shorthand ───────────────────────────────────────────────────────────

export type Depth = MeshConfig['depth']; // 'concise' | 'standard' | 'deep'

// ── Prompt context ────────────────────────────────────────────────────────────

/**
 * All information available to a prompt builder function.
 * Passed unchanged to every prompt template so each can pick
 * whatever fields it needs.
 */
export interface PromptContext {
  /** The top-level user-supplied subject (never changes in recursion). */
  rootTopic:   string;
  /** The node being written. */
  node:        TopicNode;
  /** Vault depth chosen by the user. */
  depth:       Depth;
  /** Note type resolved by the registry. */
  noteType:    NoteType;
  /** Parent title (one level up in the breadcrumb). */
  parent:      string;
  /** Full breadcrumb string, e.g. "Machine Learning > Supervised Learning". */
  breadcrumb:  string;
}

// ── Prompt variant set ────────────────────────────────────────────────────────

/**
 * A note type exports one PromptVariants object.
 * Each variant is a function that receives a PromptContext and returns
 * the final prompt string to send to the model.
 */
export interface PromptVariants {
  concise:  (ctx: PromptContext) => string;
  standard: (ctx: PromptContext) => string;
  deep:     (ctx: PromptContext) => string;
}

// ── Shared frontmatter builder ────────────────────────────────────────────────

/**
 * Produce consistent YAML frontmatter for every note in the vault.
 * All prompt templates call this to guarantee a uniform metadata block.
 */
export function frontmatter(ctx: PromptContext, extraTags: string[] = []): string {
  const date = new Date().toISOString().split('T')[0]!;
  const slug = ctx.node.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const tags = [
    'mesh-generated',
    ctx.noteType,
    slug,
    ...extraTags,
  ];
  return [
    '---',
    `title: "${ctx.node.title}"`,
    `topic: "${ctx.rootTopic}"`,
    `parent: "${ctx.parent}"`,
    `type: ${ctx.noteType}`,
    `depth: ${ctx.depth}`,
    `created: ${date}`,
    `tags: [${tags.join(', ')}]`,
    '---',
  ].join('\n');
}

// ── Shared footer builder ─────────────────────────────────────────────────────

/**
 * Consistent "See Also" section and navigation footer for every note.
 */
export function seeAlso(ctx: PromptContext, extras: string[] = []): string {
  const links = [
    `[[${ctx.parent}]]`,
    `[[${ctx.rootTopic} — index]]`,
    ...extras,
  ];
  return [
    '## See Also',
    '',
    ...links.map(l => `- ${l}`),
    '',
    '---',
    '',
    `[[${ctx.parent}|← ${ctx.parent}]]  ·  [[${ctx.rootTopic} — index|Index]]`,
  ].join('\n');
}

// ── Length guidelines ─────────────────────────────────────────────────────────

export const WORD_COUNT: Record<Depth, string> = {
  concise:  '120–200 words',
  standard: '280–450 words',
  deep:     '500–900 words',
};

export const MAX_TOKENS: Record<Depth, number> = {
  concise:  400,
  standard: 900,
  deep:     2000,
};

// ── System prompt ─────────────────────────────────────────────────────────────

/**
 * Shared system prompt prepended to every note generation call.
 * Sets tone, format rules, and Obsidian conventions once rather than
 * repeating them in every template.
 */
export const SYSTEM_PROMPT = `You are a professional knowledge-base author writing notes for an Obsidian vault.

Output rules (follow exactly):
- Write raw Markdown — never wrap output in fences or add explanatory text
- Begin with YAML frontmatter (it will be provided in the user prompt — copy it verbatim)
- Use ATX headings (##, ###) — never use setext-style underline headings
- Use Obsidian wiki-links [[Like This]] for cross-references — never bare URLs for internal links
- Every note ends with a "## See Also" section followed by a navigation footer
- Be factually accurate, precise, and free of filler phrases
- Maintain a clear, authoritative, encyclopaedic voice throughout the vault`;
