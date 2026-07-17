/**
 * deepDive.ts — Exhaustive technical treatment of a complex topic.
 *
 * Purpose: the note a practitioner reads when they need to truly master
 *          a topic, not just understand it at a working level.
 * Structure: full definition → theory → formal treatment → internals →
 *            advanced applications → research frontier → see also.
 */
import { type PromptVariants, type PromptContext, frontmatter, seeAlso, WORD_COUNT } from '../types.js';

export const deepDive: PromptVariants = {

  concise: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

Write a focused deep-dive note (${WORD_COUNT.concise}) covering the core technical substance of **${ctx.node.title}** within ${ctx.rootTopic}.

Breadcrumb: ${ctx.breadcrumb}

## Core Technical Insight
The single most important technical fact about ${ctx.node.title} that separates experts from novices.

## Mechanism
The essential internal mechanism in three to five sentences. Be precise.

## Critical Detail
One important detail that is widely misunderstood or overlooked.

${seeAlso(ctx)}`,

  standard: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

Write a standard deep-dive note (${WORD_COUNT.standard}) on **${ctx.node.title}** within ${ctx.rootTopic}.

Breadcrumb: ${ctx.breadcrumb}

## Overview
Precise definition and scope. Why this topic warrants deeper study.

## Theory & Foundations
The theoretical underpinnings. Include formal notation or mathematical treatment where it adds precision.

## Internal Mechanism
How it works at the implementation level — below the abstraction layer most practitioners operate at.

## Advanced Usage Patterns
Two or three patterns that demonstrate non-obvious or sophisticated use of ${ctx.node.title}.

## Performance & Limitations
Concrete performance characteristics and fundamental limitations.

## Current Challenges
Open problems or active areas of improvement in this space.

${seeAlso(ctx)}`,

  deep: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

Write an exhaustive deep-dive note (${WORD_COUNT.deep}) on **${ctx.node.title}** within ${ctx.rootTopic}.

Breadcrumb: ${ctx.breadcrumb}

## Precise Definition
A rigorous, complete definition. Include all meaningful edge cases in the definition itself.

## Theoretical Foundations
The mathematical, logical, or scientific theory that underlies ${ctx.node.title}.
Use formal notation, proofs sketches, or derivations where they add precision.

## Architecture & Internals
A full technical description of the internal structure.
Include a Mermaid architecture diagram:
\`\`\`mermaid
graph TD
  subgraph Internal
    A --> B --> C
  end
\`\`\`

## Algorithmic Treatment
Pseudocode, recurrences, or formal algorithm specifications.
Include correctness argument and complexity analysis.

## Advanced Patterns & Techniques
Five or more advanced usage patterns with detailed explanation of when and why to use each.

## Interactions & Dependencies
How ${ctx.node.title} interacts with other components of ${ctx.parent}.
What it assumes, what it guarantees, and what breaks those guarantees.

## Performance Analysis
Empirical benchmarks, theoretical bounds, scaling behaviour, and bottleneck identification.

## Known Limitations & Open Problems
Documented fundamental limitations and active research directions.

## Implementation Considerations
Language-specific, platform-specific, or environment-specific concerns.

## Research Frontier
Current academic or industrial research advancing the state of the art.

${seeAlso(ctx)}`,

};
