/**
 * comparison.ts — Side-by-side analysis of two or more alternatives.
 *
 * Purpose: help the reader choose between options by exposing trade-offs,
 *          use-case fit, and the decision criteria that matter most.
 * Structure: what is being compared → comparison table → per-option analysis
 *            → decision guide → see also.
 */
import { type PromptVariants, type PromptContext, frontmatter, seeAlso, WORD_COUNT } from '../types.js';

export const comparison: PromptVariants = {

  concise: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

Write a concise comparison note (${WORD_COUNT.concise}) for **${ctx.node.title}** within ${ctx.rootTopic}.

Breadcrumb: ${ctx.breadcrumb}

## What Is Being Compared
One sentence identifying the alternatives and why comparing them matters.

## At a Glance

| Criterion | Option A | Option B |
|-----------|----------|----------|
| Strength  |          |          |
| Weakness  |          |          |
| Best for  |          |          |

Fill in the table with real values for ${ctx.node.title}.

## When to Choose Each
A brief bullet per option: the primary use case where it wins.

${seeAlso(ctx)}`,

  standard: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

Write a standard comparison note (${WORD_COUNT.standard}) for **${ctx.node.title}** within ${ctx.rootTopic}.

Breadcrumb: ${ctx.breadcrumb}

## What Is Being Compared
Introduce the alternatives and the context in which the choice arises.

## Comparison Table

| Criterion          | Option A | Option B | Option C (if applicable) |
|--------------------|----------|----------|--------------------------|
| Core approach      |          |          |                          |
| Performance        |          |          |                          |
| Complexity         |          |          |                          |
| Scalability        |          |          |                          |
| Ecosystem/tooling  |          |          |                          |
| Best suited for    |          |          |                          |

## Individual Analysis
One paragraph per option: strengths, weaknesses, and ideal context.

## Decision Guide
A numbered or conditional list answering "choose X when Y".

## Common Pitfalls
Mistakes practitioners make when choosing between these options.

${seeAlso(ctx)}`,

  deep: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

Write an in-depth comparison note (${WORD_COUNT.deep}) for **${ctx.node.title}** within ${ctx.rootTopic}.

Breadcrumb: ${ctx.breadcrumb}

## What Is Being Compared
Full context: what problem each option solves, its origins, and why this comparison is practically important.

## Comprehensive Comparison Table

| Criterion                  | Option A | Option B | Option C |
|----------------------------|----------|----------|----------|
| Core paradigm              |          |          |          |
| Time complexity            |          |          |          |
| Space complexity           |          |          |          |
| Ease of implementation     |          |          |          |
| Scalability                |          |          |          |
| Fault tolerance            |          |          |          |
| Ecosystem maturity         |          |          |          |
| Learning curve             |          |          |          |
| Best suited for            |          |          |          |

Fill every cell with accurate, specific values.

## Deep Analysis: Option A
Strengths, weaknesses, internal design decisions, and representative use cases.

## Deep Analysis: Option B
Strengths, weaknesses, internal design decisions, and representative use cases.

## Deep Analysis: Option C (if applicable)
Strengths, weaknesses, internal design decisions, and representative use cases.

## Benchmark & Empirical Evidence
Cite known benchmarks, studies, or widely-accepted performance characteristics.

## Decision Framework
A structured decision tree or weighted criteria guide.
Format as a Mermaid diagram if helpful:
\`\`\`mermaid
flowchart TD
  Q1{Criterion?} -->|Yes| A[Option A]
  Q1 -->|No| Q2{Next criterion?}
\`\`\`

## Migration Paths
What switching between options looks like in practice.

## Pitfalls & Anti-Patterns
Documented mistakes teams make when choosing or switching between these options.

${seeAlso(ctx)}`,

};
