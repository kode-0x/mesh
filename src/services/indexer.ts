import { getApiKey } from '../session.js';
import { type MeshConfig } from '../screens/ConfigScreen.js';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TopicNode {
  /** Display title — also used as folder/file name. */
  title:    string;
  /** Depth in the tree: 0 = root, 1 = subtopic, 2 = sub-subtopic … */
  depth:    number;
  /** Breadcrumb path from root: ["Machine Learning", "Supervised Learning"] */
  path:     string[];
  /** Child subtopics. Empty array = leaf node → generates a note. */
  children: TopicNode[];
}

// ── Depth → subtopic budget ───────────────────────────────────────────────────
// Controls how wide and deep the tree grows for each vault depth setting.

interface TreeShape {
  /** Max nesting levels below root (0 = root only). */
  maxDepth:      number;
  /** Target root-level subtopics. */
  rootBranches:  number;
  /** Target children per non-root node. */
  childBranches: number;
}

const TREE_SHAPE: Record<MeshConfig['depth'], TreeShape> = {
  concise:  { maxDepth: 1, rootBranches: 6,  childBranches: 4  },
  standard: { maxDepth: 2, rootBranches: 8,  childBranches: 5  },
  deep:     { maxDepth: 3, rootBranches: 10, childBranches: 6  },
};

// ── OpenRouter call ───────────────────────────────────────────────────────────

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function callOpenRouter(model: string, prompt: string): Promise<string> {
  const key = getApiKey();
  if (!key) throw new Error('No API key in session.');

  const res = await fetch(API_URL, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages:    [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens:  2048,
    }),
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('Invalid API key.');
    if (res.status === 429) throw new Error('Rate limit reached. Please wait and try again.');
    throw new Error(`OpenRouter ${res.status}: ${res.statusText}`);
  }

  const json = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  const content = json.choices[0]?.message?.content ?? '';
  if (!content) throw new Error('Empty response from model.');
  return content;
}

// ── Prompt builders ───────────────────────────────────────────────────────────

function buildRootIndexPrompt(topic: string, shape: TreeShape): string {
  return `You are a knowledge architect. Generate a structured topic outline for a comprehensive knowledge vault about "${topic}".

Return ONLY a JSON array of exactly ${shape.rootBranches} top-level subtopics. Each subtopic should be a clear, distinct area of "${topic}".

Rules:
- Return raw JSON only — no markdown fences, no explanation
- Each item must be a plain string (the subtopic title)
- Titles should be concise (2–5 words), specific, and non-overlapping
- Cover the full breadth of "${topic}" from fundamentals to advanced areas

Example format:
["Subtopic One", "Subtopic Two", "Subtopic Three"]`;
}

function buildChildIndexPrompt(
  rootTopic:    string,
  parentTitle:  string,
  parentPath:   string[],
  shape:        TreeShape,
): string {
  const breadcrumb = parentPath.join(' > ');
  return `You are a knowledge architect. Generate subtopics for a knowledge vault node.

Root subject: "${rootTopic}"
Current node: "${parentTitle}"
Breadcrumb: ${breadcrumb}

Return ONLY a JSON array of exactly ${shape.childBranches} subtopics that are direct children of "${parentTitle}" within the context of "${rootTopic}".

Rules:
- Return raw JSON only — no markdown fences, no explanation
- Each item must be a plain string (the subtopic title)
- Titles should be concise (2–5 words), specific, and non-overlapping
- Do NOT repeat parent concepts — go one level deeper

Example format:
["Child One", "Child Two", "Child Three"]`;
}

// ── JSON parser (tolerant) ────────────────────────────────────────────────────

function parseStringArray(raw: string): string[] {
  // Strip markdown code fences if present
  const stripped = raw
    .replace(/^```[a-z]*\n?/im, '')
    .replace(/```\s*$/m, '')
    .trim();

  // Find the first JSON array in the output
  const match = stripped.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`Model did not return a JSON array. Got: ${raw.slice(0, 200)}`);

  const parsed = JSON.parse(match[0]) as unknown;
  if (!Array.isArray(parsed)) throw new Error('Parsed value is not an array.');

  return parsed
    .filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
    .map(v => v.trim());
}

// ── Recursive tree builder ────────────────────────────────────────────────────

/**
 * Recursively build a TopicNode tree by calling the AI for each level.
 *
 * @param rootTopic  The top-level user-supplied topic (never changes in recursion)
 * @param title      Title of the node being expanded
 * @param nodePath   Breadcrumb path including this node's title
 * @param nodeDepth  Current depth in the tree (0 = root level children)
 * @param shape      Tree shape controls from depth setting
 * @param model      OpenRouter model id
 */
async function buildSubtree(
  rootTopic: string,
  title:     string,
  nodePath:  string[],
  nodeDepth: number,
  shape:     TreeShape,
  model:     string,
): Promise<TopicNode> {
  // Leaf: at max depth or depth 0 with no further expansion wanted
  if (nodeDepth >= shape.maxDepth) {
    return { title, depth: nodeDepth, path: nodePath, children: [] };
  }

  // Ask the AI for children of this node
  const prompt   = buildChildIndexPrompt(rootTopic, title, nodePath, shape);
  const raw      = await callOpenRouter(model, prompt);
  const children = parseStringArray(raw);

  // Recursively expand each child
  const childNodes: TopicNode[] = await Promise.all(
    children.map(childTitle =>
      buildSubtree(
        rootTopic,
        childTitle,
        [...nodePath, childTitle],
        nodeDepth + 1,
        shape,
        model,
      ),
    ),
  );

  return { title, depth: nodeDepth, path: nodePath, children: childNodes };
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Generate a full TopicNode tree for the given topic and vault depth.
 * Makes one AI call for the root outline, then one call per non-leaf node
 * to expand its children.
 *
 * Returns the root node whose children are the top-level subtopics.
 */
export async function generateIndex(
  topic:  string,
  config: MeshConfig,
): Promise<TopicNode> {
  const shape = TREE_SHAPE[config.depth];

  // Step 1 — get root-level subtopics
  const rootPrompt   = buildRootIndexPrompt(topic, shape);
  const rootRaw      = await callOpenRouter(config.model, rootPrompt);
  const rootTitles   = parseStringArray(rootRaw);

  // Step 2 — expand each root subtopic in parallel
  const children: TopicNode[] = await Promise.all(
    rootTitles.map(title =>
      buildSubtree(
        topic,
        title,
        [topic, title],
        1,              // depth 1 = direct children of root
        shape,
        config.model,
      ),
    ),
  );

  // Synthetic root node (the topic itself)
  return {
    title:    topic,
    depth:    0,
    path:     [topic],
    children,
  };
}

// ── Tree utilities ────────────────────────────────────────────────────────────

/** Count total leaf nodes (notes to be written) in a tree. */
export function countLeaves(node: TopicNode): number {
  if (node.children.length === 0) return 1;
  return node.children.reduce((sum, child) => sum + countLeaves(child), 0);
}

/** Count total nodes (folders + notes) in a tree, excluding the root. */
export function countNodes(node: TopicNode): number {
  return node.children.reduce(
    (sum, child) => sum + 1 + countNodes(child),
    0,
  );
}

/** Flatten all leaf nodes into a pre-order array. */
export function flattenLeaves(node: TopicNode): TopicNode[] {
  if (node.children.length === 0) return [node];
  return node.children.flatMap(flattenLeaves);
}
