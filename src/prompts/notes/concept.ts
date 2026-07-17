/**
 * concept.ts — Defines a single term, idea, or principle with precision.
 *
 * Purpose: give the reader a clear, unambiguous mental model of one concept.
 * Structure: definition → why it matters → how it relates to the parent topic
 *            → key properties / characteristics → common misconceptions → see also.
 */
import { type PromptVariants, type PromptContext, frontmatter, seeAlso, WORD_COUNT } from '../types.js';

function body(ctx: PromptContext, extra: string): string {
  const fm = frontmatter(ctx);
  const sa = seeAlso(ctx);
  return `${fm}

# ${ctx.node.title}

${extra}

${sa}`;
}

export const concept: PromptVariants = {

  concise: (ctx: PromptContext) => `${body(ctx, `
Write a concise concept note (${WORD_COUNT.concise}) about **${ctx.node.title}** within the context of ${ctx.rootTopic}.

Breadcrumb: ${ctx.breadcrumb}

Structure (use these exact headings):
## Definition
One precise sentence that fully defines "${ctx.node.title}". No filler, no hedging.

## Why It Matters
Two to three sentences on why this concept is significant in the context of ${ctx.parent}.

## Key Properties
A tight bullet list (3–5 items) of the most important characteristics.

## See Also
(generated automatically — do not add extra links)
`)}`,

  standard: (ctx: PromptContext) => `${body(ctx, `
Write a standard concept note (${WORD_COUNT.standard}) about **${ctx.node.title}** within the context of ${ctx.rootTopic}.

Breadcrumb: ${ctx.breadcrumb}

Structure (use these exact headings):
## Definition
One or two sentences providing a precise, authoritative definition.

## Background
Brief context — where this concept comes from and how it fits into ${ctx.parent}.

## Key Properties
Bullet list (4–6 items) of the most important characteristics or attributes.

## How It Relates to ${ctx.parent}
Two or three sentences explaining the direct relationship.

## Common Misconceptions
One or two misconceptions that practitioners frequently encounter.

## See Also
(generated automatically)
`)}`,

  deep: (ctx: PromptContext) => `${body(ctx, `
Write an in-depth concept note (${WORD_COUNT.deep}) about **${ctx.node.title}** within the context of ${ctx.rootTopic}.

Breadcrumb: ${ctx.breadcrumb}

Structure (use these exact headings):
## Definition
A precise, multi-faceted definition. Include formal definition where appropriate.

## Historical Background
Origin and evolution of the concept. Who introduced it and why.

## Core Properties
Detailed bullet list (6–8 items) covering every significant characteristic.

## Formal Treatment
Mathematical notation, formal specification, or pseudocode where applicable.
If not applicable, use a detailed structural breakdown instead.

## Relationship to Related Concepts
How "${ctx.node.title}" connects to, contrasts with, or extends nearby ideas in ${ctx.parent}.

## Practical Implications
What understanding this concept enables a practitioner to do differently.

## Common Misconceptions & Edge Cases
Three or more misconceptions or subtle edge cases, with corrections.

## See Also
(generated automatically)
`)}`,

};
