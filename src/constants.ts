import { type MeshConfig } from './screens/ConfigScreen.js';

export const DEPTH_NOTE_COUNT: Record<MeshConfig['depth'], number> = {
  concise:  30,
  standard: 80,
  deep:     150,
};

export const TOKENS_PER_NOTE = 1500;

export const MODEL_PRICE_PER_1M: Record<string, number> = {
  'anthropic/claude-sonnet-4-5': 4.50,
  'anthropic/claude-opus-4':     22.50,
  'openai/gpt-4.1':               4.00,
  'google/gemini-2.5-pro':        5.00,
  'deepseek/deepseek-r1':         0.70,
};

export const MODEL_SHORT_LABEL: Record<string, string> = {
  'anthropic/claude-sonnet-4-5': 'claude-sonnet-4-5',
  'anthropic/claude-opus-4':     'claude-opus-4',
  'openai/gpt-4.1':              'gpt-4.1',
  'google/gemini-2.5-pro':       'gemini-2.5-pro',
  'deepseek/deepseek-r1':        'deepseek-r1',
};
