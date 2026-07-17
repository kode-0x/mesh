/**
 * howItWorks.ts — Explains a mechanism, process, or algorithm step by step.
 *
 * Purpose: answer "how does X actually work?" with enough precision that the
 *          reader could implement, trace, or debug the process.
 * Structure: inputs/prerequisites → step-by-step mechanism → internals →
 *            edge cases → complexity / trade-offs → see also.
 */
import { type PromptVariants, type PromptContext, frontmatter, seeAlso, WORD_COUNT } from '../types.js';

export const howItWorks: PromptVariants = {

  concise: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

Write a concise how-it-works note (${WORD_COUNT.concise}) explaining the mechanism of **${ctx.node.title}** within ${ctx.rootTopic}.

Breadcrumb: ${ctx.breadcrumb}

## Prerequisites
Bullet list: what the reader must know before reading this note.

## The Process
A numbered list (3–6 steps) describing how ${ctx.node.title} works at a high level.
Be concrete and sequential. Avoid vague language.

## Key Insight
One sentence capturing the most important thing to understand about how this works.

${seeAlso(ctx)}`,

  standard: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

Write a standard how-it-works note (${WORD_COUNT.standard}) for **${ctx.node.title}** within ${ctx.rootTopic}.

Breadcrumb: ${ctx.breadcrumb}

## Prerequisites
What foundational knowledge is needed. Link to [[concept notes]] where applicable.

## Inputs & Outputs
What goes in, what comes out, and any preconditions or postconditions.

## Step-by-Step Mechanism
Numbered list (4–8 steps) with one paragraph per step.
Each step: what happens, why, and what state changes.

## Under the Hood
One section going one level deeper — the internal mechanics that are invisible at the surface level.

## Common Failure Modes
Two or three ways this process can go wrong and how to detect them.

${seeAlso(ctx)}`,

  deep: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

Write a detailed how-it-works note (${WORD_COUNT.deep}) providing a thorough technical explanation of **${ctx.node.title}** within ${ctx.rootTopic}.

Breadcrumb: ${ctx.breadcrumb}

## Prerequisites
Full list of required background knowledge with [[wiki-links]] to concept notes.

## System Model
The conceptual model: components, state, and invariants.
Use a Mermaid diagram if it adds clarity:
\`\`\`mermaid
flowchart TD
  A[Input] --> B[Process] --> C[Output]
\`\`\`

## Detailed Mechanism
Numbered steps with a full paragraph each.
Include: what triggers the step, what computation occurs, what the output is, and any error conditions.

## Algorithmic Complexity
Time and space complexity where applicable. Big-O notation.

## Implementation Considerations
Language-agnostic notes on data structures, concurrency, memory, or performance trade-offs.

## Variants & Alternatives
Other approaches to the same problem and when each is preferable.

## Common Failure Modes & Debugging
Systematic list of failure modes with root causes and diagnostic strategies.

${seeAlso(ctx)}`,

};
