import React from 'react';
import { Box, Text } from 'ink';
import { ConfirmInput } from '@inkjs/ui';
import { type MeshConfig } from './ConfigScreen.js';
import { ACCENT } from '../components/Logo.js';
import {
  DEPTH_NOTE_COUNT,
  TOKENS_PER_NOTE,
  MODEL_PRICE_PER_1M,
  MODEL_SHORT_LABEL,
} from '../constants.js';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CostEstimateScreenProps {
  topic: string;
  config: MeshConfig;
  onConfirm: () => void;
  onCancel: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function estimateCost(model: string, depth: MeshConfig['depth']): number {
  const notes      = DEPTH_NOTE_COUNT[depth];
  const totalTokens = notes * TOKENS_PER_NOTE;
  const pricePerM  = MODEL_PRICE_PER_1M[model] ?? 5.00;
  return (totalTokens / 1_000_000) * pricePerM;
}

function formatCost(usd: number): string {
  if (usd < 0.01) return '< $0.01';
  return `~$${usd.toFixed(2)}`;
}

// ── Summary row ───────────────────────────────────────────────────────────────

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Box gap={0}>
      <Box width={14}>
        <Text dimColor>{label}</Text>
      </Box>
      <Text color={accent ? ACCENT : 'white'} bold={accent}>
        {value}
      </Text>
    </Box>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CostEstimateScreen({
  topic,
  config,
  onConfirm,
  onCancel,
}: CostEstimateScreenProps) {
  const noteCount  = DEPTH_NOTE_COUNT[config.depth];
  const totalCost  = estimateCost(config.model, config.depth);
  const modelLabel = MODEL_SHORT_LABEL[config.model] ?? config.model;

  return (
    <Box flexDirection="column" paddingTop={1} paddingX={2} gap={1}>

      {/* Header */}
      <Box gap={1}>
        <Text color={ACCENT} bold>❯</Text>
        <Text bold>Ready to generate</Text>
      </Box>

      {/* Summary table */}
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="gray"
        paddingX={2}
        paddingY={1}
        gap={0}
      >
        <Row label="Topic"   value={topic}           accent />
        <Row label="Model"   value={modelLabel} />
        <Row label="Output"  value={config.outputPath} />
        <Row label="Depth"   value={config.depth} />
        <Row label="Notes"   value={`~${noteCount} notes`} />

        {/* Divider */}
        <Box marginTop={1} marginBottom={1}>
          <Text dimColor>{'─'.repeat(40)}</Text>
        </Box>

        {/* Cost estimate */}
        <Box gap={1}>
          <Box width={14}>
            <Text dimColor>Est. cost</Text>
          </Box>
          <Text color="white" bold>{formatCost(totalCost)}</Text>
          <Text dimColor>  via OpenRouter</Text>
        </Box>

        <Box marginTop={1}>
          <Text dimColor italic>
            Estimates are approximate. Actual cost depends on model
            pricing at time of generation.
          </Text>
        </Box>
      </Box>

      {/* Confirmation prompt */}
      <Box gap={1} marginTop={1}>
        <Text bold>Generate vault?  </Text>
        <ConfirmInput
          defaultChoice="confirm"
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      </Box>

    </Box>
  );
}
