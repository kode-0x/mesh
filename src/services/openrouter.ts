import { getApiKey } from '../session.js';

export interface OpenRouterModel {
  id: string;
  name: string;
  contextLength: number;
  pricePerMillion: number;
}

interface RawModel {
  id: string;
  name: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
}

interface RawModelsResponse {
  data: RawModel[];
}

const MODELS_URL = 'https://openrouter.ai/api/v1/models';

const EXCLUDE_PATTERNS = [
  'embed',
  'moderat',
  'whisper',
  'tts',
  'dall-e',
  'stable-diffusion',
];

function shouldExclude(id: string): boolean {
  const lower = id.toLowerCase();
  return EXCLUDE_PATTERNS.some(p => lower.includes(p));
}

function blendedPricePerMillion(raw: RawModel): number {
  const prompt     = parseFloat(raw.pricing.prompt)     || 0;
  const completion = parseFloat(raw.pricing.completion) || 0;
  return ((prompt + completion) / 2) * 1_000_000;
}

export async function fetchModels(): Promise<OpenRouterModel[]> {
  const key = getApiKey();
  if (!key) throw new Error('API key not set. Call setApiKey() before fetching models.');

  const response = await fetch(MODELS_URL, {
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error('Invalid API key. Please check and try again.');
    throw new Error(`OpenRouter returned ${response.status}: ${response.statusText}`);
  }

  const json = (await response.json()) as RawModelsResponse;

  return json.data
    .filter(m => !shouldExclude(m.id))
    .map(m => ({
      id:              m.id,
      name:            m.name,
      contextLength:   m.context_length,
      pricePerMillion: blendedPricePerMillion(m),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function formatPrice(pricePerMillion: number): string {
  if (pricePerMillion === 0) return 'Free';
  return `$${pricePerMillion.toFixed(2)}/1M`;
}

/** Format context length: "128k", "1M", etc. */
export function formatContext(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(0)}M ctx`;
  if (tokens >= 1_000)     return `${(tokens / 1_000).toFixed(0)}k ctx`;
  return `${tokens} ctx`;
}
