import React, { useEffect, useState } from 'react';
import { Box, Text, useStdout, useInput } from 'ink';
import { Select, Spinner, TextInput } from '@inkjs/ui';
import {
  fetchModels,
  formatPrice,
  formatContext,
  type OpenRouterModel,
} from '../services/openrouter.js';
import { ACCENT } from '../components/Logo.js';

// ── Constants ─────────────────────────────────────────────────────────────────

const VISIBLE_ROWS = 10;

// ── Types ─────────────────────────────────────────────────────────────────────

type FetchState = 'loading' | 'ready' | 'error';
type InputMode  = 'search' | 'navigate';

interface ModelSelectScreenProps {
  onSelect: (model: OpenRouterModel) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildLabel(model: OpenRouterModel, columns: number): string {
  const idWidth = columns >= 100 ? 42 : 28;
  const id      = model.id.length > idWidth
    ? model.id.slice(0, idWidth - 1) + '…'
    : model.id.padEnd(idWidth);
  const ctx   = formatContext(model.contextLength).padEnd(10);
  const price = formatPrice(model.pricePerMillion);
  return `${id}  ${ctx}  ${price}`;
}

function filterModels(models: OpenRouterModel[], query: string): OpenRouterModel[] {
  if (!query.trim()) return models;
  const q = query.toLowerCase();
  return models.filter(
    m => m.id.toLowerCase().includes(q) || m.name.toLowerCase().includes(q),
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ModelSelectScreen({ onSelect }: ModelSelectScreenProps) {
  const { stdout } = useStdout();
  const columns = stdout?.columns ?? 80;

  const [fetchState, setFetchState] = useState<FetchState>('loading');
  const [models, setModels]         = useState<OpenRouterModel[]>([]);
  const [error, setError]           = useState('');
  const [query, setQuery]           = useState('');

  // Two-mode focus: 'search' means TextInput is active, Select is disabled.
  // 'navigate' means TextInput is disabled, Select receives all key events.
  // This prevents both components from consuming the same keystrokes at once.
  const [mode, setMode] = useState<InputMode>('search');

  useEffect(() => {
    fetchModels()
      .then(data => { setModels(data); setFetchState('ready'); })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to fetch models.');
        setFetchState('error');
      });
  }, []);

  // Tab toggles between search and navigate modes regardless of which
  // component currently has focus. Escape always returns to search mode.
  useInput((_input, key) => {
    if (fetchState !== 'ready') return;
    if (key.tab) {
      setMode(prev => prev === 'search' ? 'navigate' : 'search');
    }
    if (key.escape) {
      setMode('search');
    }
  });

  function handleSearchSubmit() {
    // Enter on the search box switches to navigate mode so the user can
    // immediately use arrow keys without re-pressing Tab.
    setMode('navigate');
  }

  function handleSelect(id: string) {
    const model = models.find(m => m.id === id);
    if (model) onSelect(model);
  }

  // ── Loading ────────────────────────────────────────────────────────────────

  if (fetchState === 'loading') {
    return (
      <Box flexDirection="column" paddingTop={1} paddingX={2} gap={1}>
        <Box gap={1}>
          <Text color={ACCENT} bold>❯</Text>
          <Text bold>Choose a model</Text>
        </Box>
        <Box gap={2} marginLeft={2}>
          <Spinner />
          <Text dimColor>Fetching models from OpenRouter…</Text>
        </Box>
      </Box>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────

  if (fetchState === 'error') {
    return (
      <Box flexDirection="column" paddingTop={1} paddingX={2} gap={1}>
        <Box gap={1}>
          <Text color={ACCENT} bold>❯</Text>
          <Text bold>Choose a model</Text>
        </Box>
        <Box
          borderStyle="round"
          borderColor="red"
          paddingX={2}
          paddingY={1}
          flexDirection="column"
          gap={0}
        >
          <Text color="red" bold>Could not load models</Text>
          <Text dimColor>{error}</Text>
        </Box>
        <Text dimColor>
          Check your API key and network connection, then restart.
        </Text>
      </Box>
    );
  }

  // ── Ready ──────────────────────────────────────────────────────────────────

  const filtered = filterModels(models, query);
  const options  = filtered.map(m => ({ label: buildLabel(m, columns), value: m.id }));
  const isSearching  = mode === 'search';
  const isNavigating = mode === 'navigate';

  return (
    <Box flexDirection="column" paddingTop={1} paddingX={2} gap={0}>

      {/* Header */}
      <Box gap={1} marginBottom={1}>
        <Text color={ACCENT} bold>❯</Text>
        <Text bold>Choose a model</Text>
        <Text dimColor>
          {'  '}
          {filtered.length === models.length
            ? `${models.length} available`
            : `${filtered.length} of ${models.length}`}
        </Text>
      </Box>

      {/* Search box */}
      <Box
        borderStyle="round"
        borderColor={isSearching ? ACCENT : 'gray'}
        paddingX={1}
        width={Math.min(62, columns - 6)}
        marginBottom={1}
      >
        <Text color={isSearching ? ACCENT : 'gray'} bold>{'⌕ '}</Text>
        <TextInput
          isDisabled={isNavigating}
          placeholder="filter by name or provider…"
          onChange={val => { setQuery(val); setMode('search'); }}
          onSubmit={handleSearchSubmit}
        />
      </Box>

      {/* Column headers */}
      <Box marginLeft={1} marginBottom={0}>
        <Text dimColor>
          {'Model'.padEnd(columns >= 100 ? 44 : 30)}
          {'Context'.padEnd(12)}
          {'Price'}
        </Text>
      </Box>

      {/* Model list */}
      {options.length > 0 ? (
        <Select
          isDisabled={isSearching}
          options={options}
          onChange={handleSelect}
          visibleOptionCount={VISIBLE_ROWS}
        />
      ) : (
        <Box marginLeft={2} marginTop={1}>
          <Text dimColor>No models match "{query}" — try a different search.</Text>
        </Box>
      )}

      {/* Mode-aware hint */}
      <Box marginTop={1} height={1}>
        {isSearching ? (
          <Text dimColor>
            {'  '}type to filter
            {'  ·  '}
            <Text color="white" bold>Enter</Text> or <Text color="white" bold>Tab</Text> to navigate list
          </Text>
        ) : (
          <Text dimColor>
            {'  '}
            <Text color="white" bold>↑ ↓</Text> navigate
            {'  ·  '}
            <Text color="white" bold>Enter</Text> select
            {'  ·  '}
            <Text color="white" bold>Tab</Text> or <Text color="white" bold>Esc</Text> to search
          </Text>
        )}
      </Box>

    </Box>
  );
}
