/**
 * example.ts — Concrete worked example or case study.
 *
 * Purpose: ground abstract concepts in reality through a specific,
 *          reproducible example the reader can follow, adapt, and extend.
 * Structure varies by depth:
 *   concise  — problem · setup · walkthrough · what to notice
 *   standard — problem · setup · walkthrough · result · takeaways · try it yourself
 *   deep     — problem · background · setup · full walkthrough · internals ·
 *              annotated output · failure modes · variations · takeaways
 */
import { type PromptVariants, type PromptContext, frontmatter, seeAlso, WORD_COUNT } from '../types.js';

export const example: PromptVariants = {

  // ── Concise ────────────────────────────────────────────────────────────────
  concise: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **concise worked-example note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.concise}

Write the following sections in order. Use these exact headings.

## The Problem
Exactly one sentence stating what this example demonstrates and why it is a useful illustration of a concept in ${ctx.parent}. Prefer a concrete scenario over an abstract description.

## Setup
Two to four lines giving only the minimum context needed to follow the example: the input data or scenario, any assumptions, and the tools or notation used. Do not explain concepts here — link to [[wiki-links]] if background is needed.

## Walkthrough
A numbered list of 3–5 steps. Each step is one to two sentences: the action taken and the immediate result. If the example is computational, include a code block with the relevant snippet:
\`\`\`
# code or pseudocode
\`\`\`

## What to Notice
A bullet list of exactly 2–3 observations. Each observation points to a specific moment in the walkthrough and names the principle or pattern it illustrates. Do not restate steps — extract the insight from them.

${seeAlso(ctx)}`,

  // ── Standard ───────────────────────────────────────────────────────────────
  standard: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **standard worked-example note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.standard}

Write the following sections in order. Use these exact headings.

## Problem Statement
Two to three sentences. State: (1) what question this example answers or what concept it demonstrates, (2) why this particular example was chosen over simpler or more complex alternatives, and (3) what the reader will be able to do after working through it.

## Setup
A short block covering data or scenario description, environment or notation, and any assumptions. Format as a brief list or short paragraph — not prose explanations. If code is involved, include an imports or initialisation block:
\`\`\`
# setup code
\`\`\`

## Step-by-Step Walkthrough
A numbered list of 4–7 steps. For each step: a **bold** one-line header describing the action, one to two sentences explaining the reasoning behind this action, the action itself (code block if computational), and the intermediate result. Each step should build directly on the previous one.

## Annotated Result
The final output with an explanation of what each part means. If the result is a value or data structure, annotate each component. If it is a graph or diagram, describe what it shows. Do not assume the result is self-explanatory.

## Key Takeaways
A bullet list of 3–5 takeaways. Each takeaway names a principle from ${ctx.parent} that this example validates, with one sentence explaining how the example validates it. Write takeaways at the level of generalisable insight, not descriptions of the specific example.

## Try It Yourself
Two suggested variations the reader can attempt independently. For each: one sentence describing the change to make and one sentence predicting how the result will differ. The variations should isolate different aspects of "${ctx.node.title}".

${seeAlso(ctx)}`,

  // ── Deep ───────────────────────────────────────────────────────────────────
  deep: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **deep worked-example note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.deep}

Write the following sections in order. Use these exact headings.

## Problem Statement
Three to four sentences precisely stating: the problem domain, the specific question this example answers, the scope and constraints (what simplifications are made and what is left out), and what the reader will have demonstrated by the end.

## Background
Two to three sentences stating what prior knowledge this example assumes. Use [[wiki-links]] to prerequisite concept notes. Note any notation or conventions introduced that differ from common alternatives.

## Setup & Environment
Complete setup: input data with its full specification, any dependencies or libraries with versions, configuration details, and initialisation code. This section must be complete enough for a reader to reproduce the example from scratch:
\`\`\`
# complete setup code
\`\`\`

## Full Walkthrough
A numbered list of 6–10 steps. For each step: a **bold** header, one sentence of motivation (why this step now), the action with annotated code or calculation, the output or intermediate state, and one sentence of interpretation. Where the example reveals a non-obvious behaviour, call it out explicitly within the step rather than deferring to a later section.

## What Is Happening Internally
One paragraph of four to five sentences explaining the mechanism that the surface-level walkthrough conceals. Name the data structure transformations, mathematical operations, or protocol exchanges that are driving the observed behaviour.

## Annotated Output
The final output with every component labelled and explained. If it is a data structure, annotate each field. If it is a plot or diagram, describe each axis, curve, or region and what it means in terms of "${ctx.node.title}".

## Failure Modes
Two to three ways this example can go wrong. For each: the specific mistake (a change to the setup or a step), the incorrect output it produces, and how to diagnose the root cause from the symptom.

## Variations & Extensions
Three or more variations. For each: the modification to make, the expected change in outcome, and which aspect of ${ctx.parent} it further illustrates. Variations should be progressively more challenging.

## Key Takeaways
A numbered list of 4–6 takeaways. Each takeaway states a principle from ${ctx.parent} and references the specific step or output in this example that demonstrates it. Write at the level of transferable insight.

${seeAlso(ctx)}`,

};
