/**
 * Prompt registry — the single entry point for building note prompts.
 *
 * Usage:
 *   import { buildPrompt } from '../prompts/index.js';
 *   const { system, user } = buildPrompt(node, rootTopic, depth, customPrompt);
 */

import { type TopicNode } from '../services/indexer.js';
import { type MeshConfig } from '../screens/ConfigScreen.js';
import {
  type PromptContext,
  type NoteType,
  classifyNoteType,
  SYSTEM_PROMPT,
} from './types.js';

import { concept    } from './notes/concept.js';
import { overview   } from './notes/overview.js';
import { howItWorks } from './notes/howItWorks.js';
import { example    } from './notes/example.js';
import { comparison } from './notes/comparison.js';
import { reference  } from './notes/reference.js';
import { deepDive   } from './notes/deepDive.js';
import { folder     } from './notes/folder.js';

// ── Registry ──────────────────────────────────────────────────────────────────

const REGISTRY: Record<NoteType, import('./types.js').PromptVariants> = {
  concept,
  overview,
  howItWorks,
  example,
  comparison,
  reference,
  deepDive,
  folder,
};

// ── Public API ────────────────────────────────────────────────────────────────

export interface BuiltPrompt {
  /** Sent as the system message to the model. */
  system:   string;
  /** Sent as the user message to the model. */
  user:     string;
  /** The note type that was resolved for this node. */
  noteType: NoteType;
}

/**
 * Build a depth-specific prompt for a leaf node.
 *
 * @param node          The topic node being written.
 * @param rootTopic     The top-level user-supplied subject.
 * @param depth         Vault depth chosen by the user.
 * @param customPrompt  Optional extra instructions appended after the template.
 */
export function buildPrompt(
  node:          TopicNode,
  rootTopic:     string,
  depth:         MeshConfig['depth'],
  customPrompt?: string,
): BuiltPrompt {
  const noteType:  NoteType = classifyNoteType(node.title);
  const parent:    string   = node.path.length > 1
    ? node.path[node.path.length - 2]!
    : rootTopic;
  const breadcrumb: string  = node.path.join(' > ');

  const ctx: PromptContext = {
    rootTopic,
    node,
    depth,
    noteType,
    parent,
    breadcrumb,
  };

  const variants  = REGISTRY[noteType];
  const baseUser  = variants[depth](ctx);

  // Append custom instructions after the template, separated by a clear divider.
  // The template's structure (frontmatter, sections, See Also) is preserved;
  // the custom instructions refine tone, focus, or formatting on top of it.
  const user = customPrompt?.trim()
    ? `${baseUser}\n\n---\n\n## Additional Instructions\n\n${customPrompt.trim()}`
    : baseUser;

  return { system: SYSTEM_PROMPT, user, noteType };
}
