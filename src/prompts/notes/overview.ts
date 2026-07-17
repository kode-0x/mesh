/**
 * overview.ts — Broad survey of a subject area.
 *
 * Purpose: orient the reader, map the territory, and link to child notes.
 * Structure: what it is → why it exists → major sub-areas → how this vault
 *            covers the topic → navigation links.
 */
import { type PromptVariants, type PromptContext, frontmatter, seeAlso, WORD_COUNT } from '../types.js';

export const overview: PromptVariants = {

  concise: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

Write a concise overview note (${WORD_COUNT.concise}) that orients a reader arriving at **${ctx.node.title}** for the first time within the ${ctx.rootTopic} vault.

Breadcrumb: ${ctx.breadcrumb}

## What Is ${ctx.node.title}?
One paragraph: a clear, high-level description.

## Core Areas
Bullet list of 3–5 major sub-areas or themes covered under this topic.

## In This Vault
Brief note on what notes exist under this topic (reference child notes as [[wiki-links]] if known from the breadcrumb).

${seeAlso(ctx)}`,

  standard: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

Write a standard overview note (${WORD_COUNT.standard}) surveying **${ctx.node.title}** within the ${ctx.rootTopic} vault.

Breadcrumb: ${ctx.breadcrumb}

## What Is ${ctx.node.title}?
Two paragraphs: definition and purpose. Situate it within ${ctx.parent}.

## Why It Matters
The significance of ${ctx.node.title} in the broader field of ${ctx.rootTopic}.

## Major Sub-Areas
Bullet list (4–6 items) of the key themes or disciplines that fall under this topic.
Use [[wiki-links]] for any that have their own notes.

## Core Challenges
Two or three sentences on the central problems or open questions in this area.

## In This Vault
A short navigation paragraph describing what the child notes cover.

${seeAlso(ctx)}`,

  deep: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

Write a comprehensive overview note (${WORD_COUNT.deep}) that serves as the authoritative entry point for **${ctx.node.title}** in the ${ctx.rootTopic} vault.

Breadcrumb: ${ctx.breadcrumb}

## What Is ${ctx.node.title}?
A thorough definition: scope, purpose, and situating it within ${ctx.parent} and ${ctx.rootTopic}.

## Historical Development
How this area emerged and evolved over time.

## Major Sub-Areas
Detailed breakdown (5–8 items) of the key themes, disciplines, or sub-fields.
For each: one sentence explaining what it covers and why it is distinct.

## Foundational Concepts
The three to five ideas a reader must understand before going deeper.
Link each to its concept note with [[wiki-links]].

## Core Challenges & Open Questions
The active problems researchers and practitioners wrestle with today.

## Relationships to Other Areas
How ${ctx.node.title} connects to adjacent fields within ${ctx.rootTopic}.

## In This Vault
A structured navigation guide to child notes and sub-sections.

${seeAlso(ctx)}`,

};
