import { getApiKey } from '../session.js';
import { type MeshConfig } from '../screens/ConfigScreen.js';
import { type TopicNode } from './indexer.js';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NoteResult {
  content:    string;
  tokensUsed: number;
}

// ── Prompt ────────────────────────────────────────────────────────────────────

function buildNotePrompt(node: TopicNode, rootTopic: string, depth: MeshConfig['depth']): string {
  const breadcrumb  = node.path.join(' > ');
  const parent      = node.path.length > 1 ? node.path[node.path.length - 2]! : rootTopic;
  const siblingHint = depth === 'concise' ? 'concise overview' : depth === 'deep' ? 'in-depth analysis' : 'solid coverage';

  // Leaf siblings are linked via wiki-links in the content — give the model
  // the parent path so it can produce accurate backlinks.
  return `You are an expert knowledge base author writing for an Obsidian vault.

Write a comprehensive Markdown note about the topic below.

---
Root subject:  ${rootTopic}
Current topic: ${node.title}
Breadcrumb:    ${breadcrumb}
Parent note:   ${parent}
Coverage:      ${siblingHint}
---

Requirements:
1. Start with YAML frontmatter (title, topic, parent, tags, created)
2. Open with a one-sentence definition of "${node.title}"
3. Include these sections (adapt headings to suit the topic):
   - Overview
   - Key Concepts
   - Details / How It Works
   - Examples or Use Cases
   - Common Pitfalls or Limitations (if applicable)
   - See Also
4. The "See Also" section must contain Obsidian wiki-links to related notes,
   including: [[${parent}]] and [[${rootTopic} — index]]
5. Use clean Markdown: headers, bullet lists, code blocks where relevant
6. Be factually accurate and concise — avoid filler sentences
7. Do NOT wrap the output in markdown fences

Length guideline: ${depth === 'concise' ? '150–250' : depth === 'deep' ? '400–700' : '250–400'} words.`;
}

// ── OpenRouter call ───────────────────────────────────────────────────────────

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Token budget per note by depth — used to cap API spend and set max_tokens.
const MAX_TOKENS: Record<MeshConfig['depth'], number> = {
  concise:  512,
  standard: 1024,
  deep:     2048,
};

export async function generateNote(
  node:       TopicNode,
  rootTopic:  string,
  config:     MeshConfig,
): Promise<NoteResult> {
  const key = getApiKey();
  if (!key) throw new Error('No API key in session.');

  const prompt    = buildNotePrompt(node, rootTopic, config.depth);
  const maxTokens = MAX_TOKENS[config.depth];

  const res = await fetch(API_URL, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model:       config.model,
      messages:    [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens:  maxTokens,
    }),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('Invalid API key.');
    if (res.status === 429) throw new Error('Rate limit reached.');
    throw new Error(`OpenRouter ${res.status}: ${res.statusText}`);
  }

  const json = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
    usage?:  { total_tokens?: number };
  };

  const content = json.choices[0]?.message?.content ?? '';
  if (!content) throw new Error(`Empty response for note "${node.title}".`);

  // Use reported token count when available; fall back to a character estimate.
  const tokensUsed = json.usage?.total_tokens ?? Math.ceil(content.length / 4);

  return { content, tokensUsed };
}

// ── Folder-note content builder ───────────────────────────────────────────────

/**
 * Build the _index note written at the root of every topic folder.
 * This note lists all child subtopics as wiki-links and acts as the
 * folder's entry point in Obsidian's graph view.
 */
export function buildFolderNote(node: TopicNode, rootTopic: string): string {
  const date      = new Date().toISOString().split('T')[0];
  const parent    = node.path.length > 1 ? node.path[node.path.length - 2]! : null;
  const childLinks = node.children
    .map(c => `- [[${c.title}]]`)
    .join('\n');

  const tags = ['mesh-generated', 'folder-index', node.title.toLowerCase().replace(/\s+/g, '-')];

  return [
    '---',
    `title: "${node.title}"`,
    `topic: "${rootTopic}"`,
    `parent: "${parent ?? rootTopic}"`,
    `created: ${date}`,
    `tags: [${tags.join(', ')}]`,
    '---',
    '',
    `# ${node.title}`,
    '',
    `> Part of the **[[${rootTopic} — index|${rootTopic}]]** knowledge vault.`,
    '',
    '## Subtopics',
    '',
    childLinks || '_No subtopics._',
    '',
    '---',
    '',
    parent ? `[[${parent}|← ${parent}]]  ·  [[${rootTopic} — index|Index]]` : `[[${rootTopic} — index|← Index]]`,
  ].join('\n');
}
