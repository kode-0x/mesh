/**
 * overview.ts — Broad survey of a subject area.
 *
 * Purpose: orient the reader, map the territory, and link to child notes.
 * Structure varies by depth:
 *   concise  — what it is · core areas · vault navigation
 *   standard — definition · significance · sub-areas · challenges · navigation
 *   deep     — thorough definition · history · sub-areas · foundations ·
 *              challenges · relationships · navigation
 */
import { type PromptVariants, type PromptContext, frontmatter, seeAlso, WORD_COUNT } from '../types.js';

export const overview: PromptVariants = {

  // ── Concise ────────────────────────────────────────────────────────────────
  concise: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **concise overview note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.concise}

Write the following sections in order. Use these exact headings.

## What Is ${ctx.node.title}?
One tight paragraph (3–4 sentences). State what "${ctx.node.title}" is, what problem or purpose it addresses, and where it sits within ${ctx.rootTopic}. Write for a reader who has never encountered this area before.

## Core Areas
A bullet list of 3–5 sub-areas or major themes. Each bullet: the sub-area name in **bold**, followed by a single clause explaining what it covers. These should map to real divisions within "${ctx.node.title}", not invented categories.

## In This Vault
One sentence describing what the notes under "${ctx.node.title}" cover. Use [[wiki-links]] for any child topics visible in the breadcrumb.

${seeAlso(ctx)}`,

  // ── Standard ───────────────────────────────────────────────────────────────
  standard: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **standard overview note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.standard}

Write the following sections in order. Use these exact headings.

## What Is ${ctx.node.title}?
Two paragraphs. First paragraph: definition, scope, and purpose. Second paragraph: how "${ctx.node.title}" fits within ${ctx.parent} — what it shares with adjacent areas and what makes it distinct. Avoid vague openers like "In the world of…".

## Why It Matters
One substantial paragraph. State the practical or theoretical significance of "${ctx.node.title}" within ${ctx.rootTopic}. Name a concrete consequence of understanding this area well, and a concrete consequence of misunderstanding or ignoring it.

## Major Sub-Areas
A bullet list of 4–6 sub-areas. For each: **sub-area name** in bold, one sentence on what it covers, and a [[wiki-link]] if the sub-area has its own note in this vault. The list should be mutually exclusive and collectively exhaustive within "${ctx.node.title}".

## Core Challenges
Two to three sentences naming the central unsolved problems, design tensions, or conceptual difficulties in "${ctx.node.title}". These should be challenges that motivate the structure of the rest of the vault notes.

## In This Vault
A short paragraph (2–3 sentences) describing how the child notes under "${ctx.node.title}" are organised and what a reader will find in each area. Use [[wiki-links]] for child topics where appropriate.

${seeAlso(ctx)}`,

  // ── Deep ───────────────────────────────────────────────────────────────────
  deep: (ctx: PromptContext) => `${frontmatter(ctx)}

# ${ctx.node.title}

You are writing a **deep overview note** for an Obsidian vault on **${ctx.rootTopic}**.
Topic: **${ctx.node.title}**
Breadcrumb: ${ctx.breadcrumb}
Target length: ${WORD_COUNT.deep}

Write the following sections in order. Use these exact headings.

## What Is ${ctx.node.title}?
Three to four sentences. Provide a thorough definition covering: scope (what falls within this area and what does not), purpose (what questions or problems this area addresses), and position (how it relates to ${ctx.parent} and to ${ctx.rootTopic} as a whole). Be precise enough that an expert would not disagree with your characterisation.

## Historical Development
Three to four sentences tracing how "${ctx.node.title}" emerged as a distinct area: key milestones, influential contributors or works, and how the field's scope or methods have shifted over time. Ground the history in specific events or publications where possible.

## Major Sub-Areas
A bullet list of 5–8 sub-areas. For each: **sub-area name** in bold, one sentence explaining what it studies or builds, one sentence on what distinguishes it from the other sub-areas, and a [[wiki-link]] if a dedicated note exists. Organise the list from foundational to advanced.

## Foundational Concepts
Three to five concepts a reader must understand before exploring the child notes. For each: the concept name as a [[wiki-link]] (if it has a note), followed by one sentence on why it is prerequisite — not just what it is, but why not understanding it creates confusion downstream.

## Core Challenges & Open Questions
A paragraph of four to five sentences describing the active problems researchers and practitioners wrestle with in "${ctx.node.title}" today. Distinguish between challenges that are fundamentally hard (no known solution) and those that are practically hard (solutions exist but are difficult to apply).

## Relationships to Other Areas
Three to five other areas within ${ctx.rootTopic} that "${ctx.node.title}" interacts with. For each: one sentence naming the type of interaction (depends on, informs, competes with, extends). Use [[wiki-links]] where notes exist.

## In This Vault
A structured navigation guide: one paragraph explaining the overall organisation of child notes, followed by a bullet list of the major sub-sections with one-sentence summaries. Use [[wiki-links]] throughout.

${seeAlso(ctx)}`,

};
