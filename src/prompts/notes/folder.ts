/**
 * folder.ts — Static folder-index note. No AI call — generated locally.
 *
 * Purpose: the entry point for a topic folder in Obsidian's graph view.
 *          Lists child notes as wiki-links, provides breadcrumb navigation.
 *
 * Note: the folder prompt variants are never sent to the AI.
 *       They are used by buildFolderNote() in noteWriter.ts to produce
 *       the static content directly. They are included here so the registry
 *       is complete and so future AI-enriched folder notes can be added
 *       by swapping in the prompt.
 */
import { type PromptVariants, type PromptContext, frontmatter } from '../types.js';

function buildFolderContent(ctx: PromptContext): string {
  const fm          = frontmatter(ctx, ['folder-index']);
  const childLinks  = ctx.node.children.map(c => `- [[${c.title}]]`).join('\n');
  const parent      = ctx.node.path.length > 1
    ? ctx.node.path[ctx.node.path.length - 2]!
    : null;
  const navFooter   = parent
    ? `[[${parent}|← ${parent}]]  ·  [[${ctx.rootTopic} — index|Index]]`
    : `[[${ctx.rootTopic} — index|← Index]]`;

  return [
    fm,
    '',
    `# ${ctx.node.title}`,
    '',
    `> Part of the **[[${ctx.rootTopic} — index|${ctx.rootTopic}]]** knowledge vault.`,
    '',
    '## Subtopics',
    '',
    childLinks || '_No subtopics._',
    '',
    '---',
    '',
    navFooter,
  ].join('\n');
}

// All three depth variants produce identical output for folder notes —
// they are static and depth-independent.
export const folder: PromptVariants = {
  concise:  (ctx: PromptContext) => buildFolderContent(ctx),
  standard: (ctx: PromptContext) => buildFolderContent(ctx),
  deep:     (ctx: PromptContext) => buildFolderContent(ctx),
};
