/**
 * comparison.ts — Side-by-side analysis of two or more alternatives.
 *
 * Purpose: help the reader choose between options by exposing trade-offs,
 *          use-case fit, and the decision criteria that matter most.
 * Structure varies by depth:
 *   concise  — what is compared · at-a-glance table · when to choose each
 *   standard — context · table · per-option analysis · decision guide · pitfalls
 *   deep     — context · full table · deep per-option analysis · benchmarks ·
 *              decision framework · migration · pitfalls
 */
import { type PromptVariants, type PromptContext, frontmatter, seeAlso, WORD_COUNT } from '../types.js';

export const comparison: PromptVariants = {

  // ── Concise ────────────────────────────────────────────────────────────────
  concise: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **concise comparison note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.concise}

Write the following sections in order. Use these exact headings.

## What Is Being Compared
One sentence naming the alternatives and the decision context in which this comparison arises within ${ctx.parent}. State *when* a practitioner needs to make this choice.

## At a Glance
A comparison table with real, specific values — not placeholders. Replace Option A / Option B with the actual names. Choose the 3–4 criteria that matter most for the decision:

| Criterion | [Option A] | [Option B] |
|-----------|------------|------------|
|           |            |            |

## When to Choose Each
One bullet per option. Each bullet: **option name** in bold, then the specific condition under which it is the better choice. Be concrete — name a scenario, constraint, or requirement, not a vague preference.

${seeAlso(ctx)}`,

  // ── Standard ───────────────────────────────────────────────────────────────
  standard: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **standard comparison note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.standard}

Write the following sections in order. Use these exact headings.

## What Is Being Compared
Two to three sentences. Name the alternatives, describe the class of problem they both address, and state the practical context in which a practitioner must choose between them within ${ctx.parent}. Make clear what the options have in common as well as how they diverge.

## Comparison Table
A table with the actual option names as column headers (not placeholders). Include 5–7 criteria that matter to the choice. Each cell must contain a specific, accurate value — not "N/A" or empty. Criteria should span: core approach, performance characteristics, complexity, scalability, and best-fit scenario.

| Criterion | [Option A] | [Option B] | [Option C if applicable] |
|-----------|------------|------------|--------------------------|
|           |            |            |                          |

## Individual Analysis
One paragraph per option. Cover: its core design philosophy, its primary strength in the context of ${ctx.parent}, its most significant limitation, and the type of project or team for which it is the natural choice.

## Decision Guide
A numbered or conditional list answering "choose [option] when [condition]". Each entry must be a specific, testable condition — not a preference or style choice. Cover at least one scenario per option.

## Common Pitfalls
Two to three pitfalls that arise from choosing the wrong option or misapplying the right one. For each: **bold** pitfall name, the scenario that leads to it, and the consequence.

${seeAlso(ctx)}`,

  // ── Deep ───────────────────────────────────────────────────────────────────
  deep: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **deep comparison note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.deep}

Write the following sections in order. Use these exact headings.

## What Is Being Compared
Three to four sentences establishing full context: the problem each option solves, their shared origin or domain, why this comparison matters practically (what decision hinges on it), and what is out of scope for this comparison.

## Comprehensive Comparison Table
A table with actual option names as column headers. Include 8–10 criteria covering the full decision surface: core paradigm, time complexity, space complexity, ease of implementation, scalability, fault tolerance, ecosystem maturity, learning curve, operational overhead, and primary use case. Every cell must contain a specific, accurate value.

| Criterion | [Option A] | [Option B] | [Option C] |
|-----------|------------|------------|------------|
|           |            |            |            |

## Deep Analysis: [Option A]
One substantial paragraph. Cover: the design philosophy and key architectural decisions, the specific conditions under which it outperforms alternatives, its fundamental limitations (not implementation issues — inherent structural limits), and two representative use cases from ${ctx.parent}.

## Deep Analysis: [Option B]
Same structure as Option A analysis above.

## Deep Analysis: [Option C] *(omit if only two options)*
Same structure as Option A analysis above.

## Benchmark & Empirical Evidence
Two to three sentences citing known benchmarks, widely-accepted performance characteristics, or empirical studies that inform the comparison. Name the benchmark or study if well-known. Where exact numbers are not available, state the direction and approximate magnitude of differences.

## Decision Framework
A structured decision guide. Use a Mermaid flowchart to model the decision:
\`\`\`mermaid
flowchart TD
  Q1{Primary criterion?} -->|Condition A| R1[Choose Option A]
  Q1 -->|Condition B| Q2{Secondary criterion?}
  Q2 -->|Condition C| R2[Choose Option B]
  Q2 -->|Condition D| R3[Choose Option C]
\`\`\`
Follow with a brief prose explanation of the key branching criteria.

## Migration Paths
Two to three sentences on what switching between the options looks like in practice: the primary cost (re-implementation, data migration, retraining), the main risk, and any tool or technique that makes the transition feasible.

## Pitfalls & Anti-Patterns
Three to four pitfalls. For each: **bold** pitfall name, the specific scenario that produces it, the observable consequence, and the corrective action.

${seeAlso(ctx)}`,

};
