/**
 * concept.ts — Defines a single term, idea, or principle with precision.
 *
 * Purpose: give the reader a clear, unambiguous mental model of one concept.
 * Structure varies by depth:
 *   concise  — definition · significance · key properties
 *   standard — definition · background · properties · relationship · misconceptions
 *   deep     — rigorous definition · history · properties · formal treatment ·
 *              relationships · implications · misconceptions & edge cases
 */
import { type PromptVariants, type PromptContext, frontmatter, seeAlso, WORD_COUNT } from '../types.js';

export const concept: PromptVariants = {

  // ── Concise ────────────────────────────────────────────────────────────────
  concise: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **concise concept note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.concise} — every sentence must earn its place.

Write the following sections in order. Use these exact headings.

## Definition
Write exactly one sentence. It must be precise enough that a reader could distinguish "${ctx.node.title}" from similar concepts. No hedging words ("may", "can be", "often"). State what it IS.

## Why It Matters
Two sentences maximum. State the single most important consequence of this concept within ${ctx.parent}, then state one downstream effect that consequence enables.

## Key Properties
A bullet list of exactly 3–5 properties. Each bullet: one noun phrase + one clause explaining why that property is significant. No bullets that merely restate the definition.

${seeAlso(ctx)}`,

  // ── Standard ───────────────────────────────────────────────────────────────
  standard: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **standard concept note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.standard}

Write the following sections in order. Use these exact headings.

## Definition
One to two sentences. Lead with the genus (what category of thing this is), then the differentia (what makes it distinct). Avoid circular definitions that use the term itself.

## Background
Two to three sentences placing "${ctx.node.title}" in context: where the concept originates, what problem it was designed to solve, and how it fits within ${ctx.parent}. Do not repeat the definition.

## Key Properties
A bullet list of 4–6 properties. For each: state the property name in **bold**, then one sentence of explanation. Cover both structural properties (what it is made of / how it behaves) and functional properties (what it enables or prevents).

## How It Relates to ${ctx.parent}
Two to three sentences. Explain the dependency or interaction: does "${ctx.node.title}" extend, constrain, enable, or derive from ${ctx.parent}? Be specific — name the mechanism of the relationship.

## Common Misconceptions
Two misconceptions, each as a **bold** false belief followed by one sentence of correction. Choose misconceptions that practitioners actually hold, not obvious beginner mistakes.

${seeAlso(ctx)}`,

  // ── Deep ───────────────────────────────────────────────────────────────────
  deep: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **deep concept note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.deep}

Write the following sections in order. Use these exact headings.

## Definition
A complete, rigorous definition in two to three sentences. Include: (1) the formal or technical definition, (2) an intuitive restatement in plain language, and (3) the boundary condition — what something must have to qualify as "${ctx.node.title}" and what excludes it.

## Historical Background
Three to four sentences tracing the origin of "${ctx.node.title}": who introduced or formalised it, in what context, what problem it was solving, and how the understanding has evolved. Name specific contributors or papers if they are well-established.

## Core Properties
A bullet list of 6–8 properties. For each: **property name** in bold, one sentence of precise explanation, and (where applicable) a note on which property distinguishes this concept from its nearest alternatives in ${ctx.parent}.

## Formal Treatment
Provide a formal specification, mathematical notation, or structured pseudocode that captures the precise behaviour of "${ctx.node.title}". If the concept is mathematical, include the key equation or definition with each symbol explained. If algorithmic, provide pseudocode with a brief complexity remark. If neither applies, provide a formal structural breakdown (pre-conditions, invariants, post-conditions).

## Relationship to Related Concepts
Three to five [[wiki-links]] to related concepts in ${ctx.parent}, each with one sentence explaining the relationship type (generalisation, specialisation, complement, trade-off, dependency). Make the direction of each relationship explicit.

## Practical Implications
Three to four sentences. Describe what a practitioner can do differently — or what errors they can avoid — by having a precise understanding of "${ctx.node.title}". Be concrete: name a class of task or decision that this concept directly informs.

## Common Misconceptions & Edge Cases
Three or more entries. For each: state the misconception or edge case in **bold**, then provide a correction or clarification of at least two sentences. Prefer misconceptions that arise from partial understanding rather than complete ignorance.

${seeAlso(ctx)}`,

};
