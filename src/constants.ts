import { type MeshConfig } from './screens/ConfigScreen.js';

// Note counts per depth tier
export const DEPTH_NOTE_COUNT: Record<MeshConfig['depth'], number> = {
  concise:  30,
  standard: 80,
  deep:     150,
};

// Approximate tokens per note (prompt + completion)
export const TOKENS_PER_NOTE = 1500;

// OpenRouter pricing in USD per 1M tokens (input + output blended estimate).
// Figures are approximate and for display purposes only.
export const MODEL_PRICE_PER_1M: Record<string, number> = {
  'anthropic/claude-sonnet-4-5': 4.50,
  'anthropic/claude-opus-4':     22.50,
  'openai/gpt-4.1':               4.00,
  'google/gemini-2.5-pro':        5.00,
  'deepseek/deepseek-r1':         0.70,
};

// Friendly short labels for model display (no provider prefix)
export const MODEL_SHORT_LABEL: Record<string, string> = {
  'anthropic/claude-sonnet-4-5': 'claude-sonnet-4-5',
  'anthropic/claude-opus-4':     'claude-opus-4',
  'openai/gpt-4.1':              'gpt-4.1',
  'google/gemini-2.5-pro':       'gemini-2.5-pro',
  'deepseek/deepseek-r1':        'deepseek-r1',
};
