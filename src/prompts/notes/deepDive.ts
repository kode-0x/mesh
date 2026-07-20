/**
 * deepDive.ts — Exhaustive technical treatment of a complex topic.
 *
 * Purpose: the note a practitioner reads when they need to truly master
 *          a topic, not just understand it at a working level.
 * Structure varies by depth:
 *   concise  — core insight · mechanism · critical detail
 *   standard — overview · theory · internals · advanced patterns ·
 *              performance · current challenges
 *   deep     — definition · theory · architecture · algorithms ·
 *              advanced patterns · interactions · performance ·
 *              limitations · implementation · research frontier
 */
import { type PromptVariants, type PromptContext, frontmatter, seeAlso, WORD_COUNT } from '../types.js';

export const deepDive: PromptVariants = {

  // ── Concise ────────────────────────────────────────────────────────────────
  concise: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **concise deep-dive note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.concise}

Write the following sections in order. Use these exact headings.

## Core Technical Insight
Exactly one paragraph of two to three sentences. State the single most important technical fact about "${ctx.node.title}" that distinguishes expert-level understanding from surface-level familiarity. This is not a definition — it is the insight that makes the rest of the mechanism make sense.

## Mechanism
Three to five sentences. Describe the essential internal mechanism: what components are involved, how they interact, and what drives the behaviour the practitioner observes. Be precise — name the data structures, mathematical operations, or protocols, not just the high-level behaviour.

## Critical Detail
One to two sentences naming an aspect of "${ctx.node.title}" that is widely misunderstood, frequently overlooked, or systematically underestimated by practitioners working in ${ctx.parent}. State the correct understanding.

${seeAlso(ctx)}`,

  // ── Standard ───────────────────────────────────────────────────────────────
  standard: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **standard deep-dive note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.standard}

Write the following sections in order. Use these exact headings.

## Overview
Two to three sentences. Define "${ctx.node.title}" precisely, state why it warrants deeper study (what surface-level descriptions miss), and name the key technical property that the rest of this note elaborates.

## Theory & Foundations
One paragraph of four to five sentences covering the theoretical underpinnings of "${ctx.node.title}": the mathematical framework, the formal model, or the scientific principle that governs its behaviour. Include formal notation or a key equation where it adds precision over prose. Explain each symbol used.

## Internal Mechanism
One paragraph of four to five sentences describing how "${ctx.node.title}" works at the implementation level — the level below the abstraction that most practitioners in ${ctx.parent} operate at. Name the specific data structures, transformations, or protocol steps involved.

## Advanced Usage Patterns
Two to three patterns. For each: **bold** pattern name, one sentence describing the non-obvious or sophisticated use case, and two to three sentences explaining why the standard approach falls short here and how this pattern addresses it.

## Performance & Limitations
A bullet list of three to five items. Cover: the primary performance characteristic (with complexity or magnitude), the main scalability constraint, and at least one fundamental limitation — a property that cannot be improved by better implementation and is inherent to the design of "${ctx.node.title}".

## Current Challenges
Two to three sentences identifying the open problems or active improvement areas in "${ctx.node.title}" within ${ctx.parent}. Distinguish between problems that are being actively worked on and those that remain fundamentally open.

${seeAlso(ctx)}`,

  // ── Deep ───────────────────────────────────────────────────────────────────
  deep: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **deep exhaustive deep-dive note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.deep}

Write the following sections in order. Use these exact headings.

## Precise Definition
Three sentences. (1) The formal or rigorous technical definition. (2) An intuitive restatement. (3) The boundary: what edge cases are included by the definition and what nearby concepts are explicitly excluded.

## Theoretical Foundations
One paragraph of five to six sentences. Lay out the mathematical, logical, or scientific theory underlying "${ctx.node.title}". Include the key equation, formal model, or theorem with each term or symbol defined inline. State what the theory guarantees and what it leaves unspecified.

## Architecture & Internals
A full technical description of the internal structure of "${ctx.node.title}". Name every major component, its role, and how it interacts with adjacent components. Include a Mermaid diagram capturing the architecture — use actual component names, not generic labels:
\`\`\`mermaid
graph TD
  subgraph "${ctx.node.title}"
    A[Component 1] -->|relationship| B[Component 2]
    B --> C[Component 3]
  end
\`\`\`

## Algorithmic Treatment
Pseudocode for the core algorithm or procedure. Include: input/output specification, each significant step with a one-line comment, a correctness argument in two to three sentences, and time and space complexity with justification.

## Advanced Patterns & Techniques
Four to five patterns. For each: **bold** pattern name, the scenario that motivates it, the technique itself described with enough detail to implement, and the trade-off it introduces.

## Interactions & Dependencies
A bullet list of three to five other components or concepts in ${ctx.parent} that "${ctx.node.title}" interacts with. For each: what "${ctx.node.title}" assumes from it (pre-condition), what it guarantees to it (post-condition), and what breaks those guarantees.

## Performance Analysis
Cover all of: theoretical time complexity, space complexity, real-world throughput or latency characteristics, scaling behaviour (what happens as input size grows), and known bottlenecks. Use Big-O notation with justification. Where empirical data exists, state the approximate figures and their source.

## Known Limitations & Open Problems
Three to four entries. For each: **bold** limitation name, whether it is inherent (cannot be fixed by better implementation) or accidental (implementation-dependent), a one-sentence explanation of why it exists, and the current best known mitigation if one exists.

## Implementation Considerations
Three to five concerns specific to implementing or deploying "${ctx.node.title}" in ${ctx.parent}. Each as a **bold** heading followed by two to three sentences of concrete guidance on data structure choice, concurrency, memory management, or environment-specific behaviour.

## Research Frontier
Two to three sentences describing the current direction of academic or industrial research on "${ctx.node.title}". Name active research areas, landmark recent results, or open questions that practitioners in ${ctx.parent} should be aware of.

${seeAlso(ctx)}`,

};
