/**
 * howItWorks.ts — Explains a mechanism, process, or algorithm step by step.
 *
 * Purpose: answer "how does X actually work?" with enough precision that the
 *          reader could implement, trace, or debug the process.
 * Structure varies by depth:
 *   concise  — prerequisites · the process · key insight
 *   standard — prerequisites · inputs/outputs · mechanism · internals · failure modes
 *   deep     — prerequisites · system model · detailed mechanism · complexity ·
 *              implementation · variants · failure modes & debugging
 */
import { type PromptVariants, type PromptContext, frontmatter, seeAlso, WORD_COUNT } from '../types.js';

export const howItWorks: PromptVariants = {

  // ── Concise ────────────────────────────────────────────────────────────────
  concise: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **concise how-it-works note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.concise}

Write the following sections in order. Use these exact headings.

## Prerequisites
A bullet list of 2–4 items. Each item names one concept or skill the reader must already understand. No explanation needed — just the name, optionally as a [[wiki-link]]. Only list genuine prerequisites, not nice-to-haves.

## The Process
A numbered list of 3–6 steps. Each step is one sentence stating the action and its direct result. Steps must be sequential and concrete — a reader should be able to mentally trace the state of the system through each step. Avoid meta-steps like "initialise" or "clean up" unless they are mechanically significant.

## Key Insight
Exactly one sentence. State the single non-obvious thing that explains *why* "${ctx.node.title}" works — the insight that makes the mechanism make sense rather than just describing what happens.

${seeAlso(ctx)}`,

  // ── Standard ───────────────────────────────────────────────────────────────
  standard: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **standard how-it-works note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.standard}

Write the following sections in order. Use these exact headings.

## Prerequisites
A bullet list of 3–5 prerequisites. Each bullet: the concept or skill name (as a [[wiki-link]] if a note exists), followed by one clause explaining why it is needed specifically for understanding "${ctx.node.title}".

## Inputs & Outputs
A short table or two bullet groups (Inputs / Outputs). For each input: name, type or form, and any constraints. For each output: name, type or form, and what it represents. Include preconditions (what must be true before the process runs) and postconditions (what is guaranteed after).

## Step-by-Step Mechanism
A numbered list of 4–8 steps. For each step: a **bold** one-line header naming the action, followed by a short paragraph explaining what happens, why it happens at this point, and what state or data changes as a result. Be precise enough that a reader could implement or trace each step.

## Under the Hood
One paragraph (3–4 sentences) going one level below the surface description. Identify the internal mechanism that is invisible at the abstraction level most practitioners work at — the data structure being manipulated, the mathematical operation being performed, or the protocol being followed.

## Common Failure Modes
A bullet list of 2–3 failure modes. For each: **bold** name of the failure, one sentence describing its cause, and one sentence on how to detect or diagnose it.

${seeAlso(ctx)}`,

  // ── Deep ───────────────────────────────────────────────────────────────────
  deep: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **deep how-it-works note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.deep}

Write the following sections in order. Use these exact headings.

## Prerequisites
A bullet list of 4–6 prerequisites. For each: the concept name as a [[wiki-link]], one sentence on why it is required, and a note on what misunderstanding of this prerequisite would cause a reader to go wrong later in this note.

## System Model
Two to three sentences establishing the conceptual model: what are the components, what state does the system maintain, and what invariants must always hold. Then include a Mermaid flowchart capturing the high-level structure:
\`\`\`mermaid
flowchart TD
  A[Input] --> B[Step 1] --> C[Step 2] --> D[Output]
\`\`\`
Adapt the diagram to accurately reflect "${ctx.node.title}" — do not use generic placeholder labels.

## Detailed Mechanism
A numbered list of 5–9 steps. For each step: a **bold** header, then a paragraph covering: what triggers this step, what computation or transformation occurs, what the intermediate output is, and what error condition could arise here. Write with enough precision that a competent engineer could implement each step from your description alone.

## Algorithmic Complexity
Time complexity, space complexity, and any relevant amortised or worst-case bounds. Use Big-O notation with a one-sentence justification for each bound. If there are multiple configurations or input shapes with different complexities, address each.

## Implementation Considerations
Three to five implementation-level concerns: data structure choices, concurrency or ordering constraints, memory or I/O trade-offs, and platform-specific behaviour. Each as a **bold** label followed by two to three sentences of guidance.

## Variants & Alternatives
Two to three alternative approaches to the same problem. For each: the approach name, one sentence on how it differs mechanically from "${ctx.node.title}", and one sentence on when it is preferable.

## Common Failure Modes & Debugging
Three to five failure modes. For each: **bold** failure name, the root cause (one sentence), observable symptoms (one sentence), and the diagnostic strategy or fix (one to two sentences).

${seeAlso(ctx)}`,

};
