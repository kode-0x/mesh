/**
 * reference.ts — Structured lookup table, cheat-sheet, or API reference.
 *
 * Purpose: a note the reader returns to repeatedly for quick lookups,
 *          not a note they read once for understanding.
 * Structure: quick-reference summary → tables/lists → syntax/API details
 *            → common patterns → gotchas → see also.
 */
import { type PromptVariants, type PromptContext, frontmatter, seeAlso, WORD_COUNT } from '../types.js';

export const reference: PromptVariants = {

  concise: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

Write a concise reference note (${WORD_COUNT.concise}) for **${ctx.node.title}** within ${ctx.rootTopic}.

Breadcrumb: ${ctx.breadcrumb}

## Quick Reference
The most important facts, values, or syntax a practitioner looks up most often.
Use a table or tight bullet list — optimise for scannability, not prose.

## Key Items

| Name | Description | Notes |
|------|-------------|-------|
|      |             |       |

Fill with real entries for ${ctx.node.title}.

## Common Gotchas
Two or three things that trip practitioners up.

${seeAlso(ctx)}`,

  standard: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

Write a standard reference note (${WORD_COUNT.standard}) for **${ctx.node.title}** within ${ctx.rootTopic}.

Breadcrumb: ${ctx.breadcrumb}

## Quick Reference Card
The essential lookup table. Optimise for speed of access, not readability.

## Complete Reference

| Item | Type / Value | Description | Example |
|------|--------------|-------------|---------|
|      |              |             |         |

Fill with accurate entries for every significant item in ${ctx.node.title}.

## Syntax / API Details
Code blocks showing correct usage patterns:
\`\`\`
# canonical usage pattern
\`\`\`

## Common Patterns
Three to five patterns showing ${ctx.node.title} used in realistic context.

## Gotchas & Deprecations
Known pitfalls, version differences, or deprecated patterns to avoid.

${seeAlso(ctx)}`,

  deep: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

Write a comprehensive reference note (${WORD_COUNT.deep}) for **${ctx.node.title}** within ${ctx.rootTopic}.

Breadcrumb: ${ctx.breadcrumb}

## Quick Reference Card
At-a-glance summary table — the first thing a practitioner reads when returning to this note.

## Full Reference

| Item | Signature / Value | Description | Constraints | Example |
|------|-------------------|-------------|-------------|---------|
|      |                   |             |             |         |

Fill every row with precise, accurate information.

## Syntax Reference
Complete syntax specification with annotated code blocks:
\`\`\`
# full syntax with all options shown
\`\`\`

## Detailed Item Descriptions
One subsection per major item (### Item Name) covering:
- Purpose and when to use it
- Parameters / fields and their types
- Return values and side effects
- Error conditions

## Common Patterns & Idioms
Five or more real-world usage patterns with short explanations.

## Performance Characteristics
Known complexity, throughput, or resource implications where applicable.

## Version & Compatibility Notes
Behavioural differences across versions or platforms.

## Gotchas, Deprecations & Anti-Patterns
Comprehensive list of known issues, deprecated features, and patterns to avoid.

${seeAlso(ctx)}`,

};
