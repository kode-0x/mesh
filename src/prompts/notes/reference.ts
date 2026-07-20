/**
 * reference.ts — Structured lookup table, cheat-sheet, or API reference.
 *
 * Purpose: a note the reader returns to repeatedly for quick lookups,
 *          not a note they read once for understanding.
 * Structure varies by depth:
 *   concise  — quick reference · key items table · gotchas
 *   standard — quick card · full reference table · syntax · patterns · gotchas
 *   deep     — quick card · full reference · syntax · per-item detail ·
 *              patterns · performance · compatibility · gotchas
 */
import { type PromptVariants, type PromptContext, frontmatter, seeAlso, WORD_COUNT } from '../types.js';

export const reference: PromptVariants = {

  // ── Concise ────────────────────────────────────────────────────────────────
  concise: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **concise reference note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.concise} — optimise every line for scannability, not readability.

Write the following sections in order. Use these exact headings.

## Quick Reference
The 3–5 most frequently looked-up facts, values, or syntax patterns for "${ctx.node.title}". Use a tight bullet list or small table. No prose — each entry should be readable in under three seconds.

## Key Items

Fill this table with real, accurate entries for "${ctx.node.title}". Every row must have a value in every column:

| Name | Description | Notes |
|------|-------------|-------|
|      |             |       |

Aim for 4–8 rows covering the most important items a practitioner references.

## Common Gotchas
A bullet list of 2–3 gotchas. Each: **bold** name of the trap, then one sentence on the incorrect assumption that causes it and one sentence on the correct behaviour.

${seeAlso(ctx)}`,

  // ── Standard ───────────────────────────────────────────────────────────────
  standard: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **standard reference note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.standard} — structure for fast lookup, not sequential reading.

Write the following sections in order. Use these exact headings.

## Quick Reference Card
A compact summary of the most critical information — the section a practitioner scans first on every visit. Use a table or two-column bullet list. Include the 5–7 items that come up most often in practice.

## Complete Reference

Fill every cell with accurate, specific information. No empty cells:

| Item | Type / Value | Description | Example |
|------|--------------|-------------|---------|
|      |              |             |         |

Cover every significant item in "${ctx.node.title}". Aim for 8–15 rows.

## Syntax / API Details
One or two annotated code blocks showing canonical usage. Each line or block that demonstrates a non-obvious feature should have an inline comment explaining it:
\`\`\`
# annotated canonical usage
\`\`\`

## Common Patterns
Three to five patterns showing "${ctx.node.title}" used in realistic context within ${ctx.parent}. Each pattern: a **bold** name, one sentence of context, and a code block.

## Gotchas & Deprecations
A bullet list of 3–4 entries. For each: **bold** name, the incorrect assumption or deprecated usage, and the correct alternative. Include at least one version-specific or platform-specific difference if applicable.

${seeAlso(ctx)}`,

  // ── Deep ───────────────────────────────────────────────────────────────────
  deep: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **deep reference note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.deep} — comprehensive and precise; every entry must be accurate.

Write the following sections in order. Use these exact headings.

## Quick Reference Card
A compact at-a-glance summary covering the 8–10 most-reached-for facts. Format as a two-column table (Item | Value/Summary). This is the first thing a returning practitioner reads.

## Full Reference

Fill every cell with precise, accurate information. No empty cells or placeholders:

| Item | Signature / Value | Description | Constraints | Example |
|------|-------------------|-------------|-------------|---------|
|      |                   |             |             |         |

Cover every significant item in "${ctx.node.title}". Aim for completeness — omit only items that are aliases or trivial variants of already-listed entries.

## Syntax Reference
A complete syntax specification with annotated code blocks. Show the full option set for each construct, with comments explaining each optional part:
\`\`\`
# full syntax — required parts unmarked, optional parts labelled [optional]
\`\`\`

## Detailed Item Descriptions
One subsection per major item (use ### Item Name as the heading). For each subsection cover:
- **Purpose**: what it does and when to use it
- **Parameters / Fields**: each parameter with type, valid values, and default
- **Return / Output**: what it produces and in what form
- **Error Conditions**: what raises an error and what the error means
- **Example**: one minimal usage example in a code block

## Common Patterns & Idioms
Five or more patterns. Each: **bold** pattern name, one sentence of context, a code block showing the idiom, and one sentence on when not to use it.

## Performance Characteristics
A bullet list of known complexity, throughput, or resource implications. Each: **bold** item name, the characteristic (with Big-O or throughput figure where known), and one sentence of explanation or caveat.

## Version & Compatibility Notes
Differences in behaviour across major versions or platforms relevant to ${ctx.rootTopic}. Format as a bullet list: **Version/Platform**, then the specific difference.

## Gotchas, Deprecations & Anti-Patterns
Four or more entries. For each: **bold** name, the incorrect assumption or deprecated feature, the consequence of using it, and the correct modern alternative.

${seeAlso(ctx)}`,

};
