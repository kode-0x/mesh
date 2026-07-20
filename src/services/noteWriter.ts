import { getApiKey } from '../session.js';
import { type MeshConfig } from '../screens/ConfigScreen.js';
import { type TopicNode } from './indexer.js';
import { buildPrompt } from '../prompts/index.js';
import { MAX_TOKENS } from '../prompts/types.js';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface NoteResult {
  content:    string;
  tokensUsed: number;
}

// ── OpenRouter call ───────────────────────────────────────────────────────────

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function generateNote(
  node:       TopicNode,
  rootTopic:  string,
  config:     MeshConfig,
): Promise<NoteResult> {
  const key = getApiKey();
  if (!key) throw new Error('No API key in session.');

  const { system, user } = buildPrompt(node, rootTopic, config.depth, config.customPrompt);
  const maxTokens        = MAX_TOKENS[config.depth];

  const res = await fetch(API_URL, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model:      config.model,
      messages:   [
        { role: 'system', content: system },
        { role: 'user',   content: user   },
      ],
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
