/**
 * example.ts — Concrete worked example or case study.
 *
 * Purpose: ground abstract concepts in reality through a specific,
 *          reproducible example the reader can follow, adapt, and extend.
 * Structure: problem statement → setup → step-by-step walkthrough →
 *            annotated result → variations → see also.
 */
import { type PromptVariants, type PromptContext, frontmatter, seeAlso, WORD_COUNT } from '../types.js';

export const example: PromptVariants = {

  concise: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

Write a concise worked-example note (${WORD_COUNT.concise}) illustrating **${ctx.node.title}** in the context of ${ctx.rootTopic}.

Breadcrumb: ${ctx.breadcrumb}

## The Problem
One sentence stating what this example demonstrates.

## Setup
Minimal context needed to follow the example (data, preconditions, tools).

## Walkthrough
A numbered sequence showing the example in action.
Use a code block if the example is computational:
\`\`\`
# example code or pseudocode
\`\`\`

## What to Notice
Two or three bullet points highlighting the key learning from this example.

${seeAlso(ctx)}`,

  standard: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

Write a standard worked-example note (${WORD_COUNT.standard}) illustrating **${ctx.node.title}** in the context of ${ctx.rootTopic}.

Breadcrumb: ${ctx.breadcrumb}

## Problem Statement
What question does this example answer? What does it demonstrate?

## Setup
Data, environment, assumptions, and imports needed to follow along.

## Step-by-Step Walkthrough
Numbered steps (4–7) guiding the reader through the example.
Each step includes the action, the reasoning, and the intermediate result.
Include code blocks for computational steps:
\`\`\`
# code or pseudocode
\`\`\`

## Annotated Result
The final output, explained. What does each part of the result mean?

## Key Takeaways
Bullet list of what this example teaches about ${ctx.parent}.

## Try It Yourself
One or two suggested variations the reader can attempt independently.

${seeAlso(ctx)}`,

  deep: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

Write an in-depth worked-example note (${WORD_COUNT.deep}) for **${ctx.node.title}** in the context of ${ctx.rootTopic}.

Breadcrumb: ${ctx.breadcrumb}

## Problem Statement
A precise statement of the problem, including scope, constraints, and goals.

## Background
What prior knowledge this example assumes. Link to [[concept notes]] as needed.

## Setup & Environment
Complete setup: data, dependencies, configuration, and any initialisation code.

## Full Walkthrough
Comprehensive step-by-step narrative (6–10 steps).
Each step: motivation → action → code/calculation → output → interpretation.
\`\`\`
# annotated code blocks for each significant step
\`\`\`

## Deep Dive: What's Happening Internally
One section explaining the non-obvious mechanics revealed by this example.

## Annotated Output
The final result with each component explained.

## Failure Modes
What happens if the setup is wrong or a step is skipped. Show a broken version.

## Variations & Extensions
Three or more variations that explore different aspects of ${ctx.parent}.

## Key Takeaways
Numbered list of principles this example validates or illustrates.

${seeAlso(ctx)}`,

};
