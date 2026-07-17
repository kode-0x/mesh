import React, { useState } from 'react';
import { Box, Text, useStdout } from 'ink';
import { Select, TextInput } from '@inkjs/ui';
import { ACCENT } from '../components/Logo.js';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MeshConfig {
  model: string;
  outputPath: string;
  depth: 'concise' | 'standard' | 'deep';
}

interface ConfigScreenProps {
  topic: string;
  onComplete: (config: MeshConfig) => void;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const MODEL_OPTIONS = [
  {
    label: 'claude-sonnet-4-5          — Anthropic  · balanced',
    value: 'anthropic/claude-sonnet-4-5',
  },
  {
    label: 'claude-opus-4              — Anthropic  · most capable',
    value: 'anthropic/claude-opus-4',
  },
  {
    label: 'gpt-4.1                    — OpenAI     · fast & reliable',
    value: 'openai/gpt-4.1',
  },
  {
    label: 'gemini-2.5-pro             — Google     · large context',
    value: 'google/gemini-2.5-pro',
  },
  {
    label: 'deepseek-r1                — DeepSeek   · cost efficient',
    value: 'deepseek/deepseek-r1',
  },
];

const DEPTH_OPTIONS = [
  {
    label: 'Concise   — ~30 notes   · quick overview',
    value: 'concise' as const,
  },
  {
    label: 'Standard  — ~80 notes   · solid coverage',
    value: 'standard' as const,
  },
  {
    label: 'Deep      — ~150 notes  · exhaustive vault',
    value: 'deep' as const,
  },
];

// ── Step indicator ────────────────────────────────────────────────────────────

function StepHeader({
  topic,
  step,
  total,
}: {
  topic: string;
  step: number;
  total: number;
}) {
  return (
    <Box flexDirection="column" gap={0} marginBottom={1}>
      <Box gap={1}>
        <Text color={ACCENT} bold>❯</Text>
        <Text bold>Generating vault for</Text>
        <Text color={ACCENT} bold>{`"${topic}"`}</Text>
      </Box>
      <Box gap={1} marginLeft={2}>
        <Text dimColor>
          Step {step} of {total}{'  '}
          {'·'.repeat(step)}{'·'.repeat(total - step).replace(/·/g, '·')}
        </Text>
      </Box>
    </Box>
  );
}

// ── Completed step row ────────────────────────────────────────────────────────

function DoneRow({ label, value }: { label: string; value: string }) {
  return (
    <Box gap={2} marginBottom={0}>
      <Text color="green">✓</Text>
      <Text dimColor>{label}</Text>
      <Text color="white">{value}</Text>
    </Box>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type Step = 'model' | 'outputPath' | 'depth';

export function ConfigScreen({ topic, onComplete }: ConfigScreenProps) {
  const { stdout } = useStdout();
  const columns = stdout?.columns ?? 80;
  const boxWidth = Math.min(62, Math.max(40, columns - 6));

  const [step, setStep] = useState<Step>('model');
  const [model, setModel] = useState('');
  const [outputPath, setOutputPath] = useState('');

  const modelLabel =
    MODEL_OPTIONS.find(o => o.value === model)?.label.split('—')[0].trim() ?? model;

  function handleModelSelect(value: string) {
    setModel(value);
    setStep('outputPath');
  }

  function handleOutputPathSubmit(val: string) {
    const trimmed = val.trim() || './vault';
    setOutputPath(trimmed);
    setStep('depth');
  }

  function handleDepthSelect(value: string) {
    const depth = value as MeshConfig['depth'];
    onComplete({ model, outputPath: outputPath || './vault', depth });
  }

  return (
    <Box flexDirection="column" paddingTop={1} paddingX={2}>
      <StepHeader
        topic={topic}
        step={step === 'model' ? 1 : step === 'outputPath' ? 2 : 3}
        total={3}
      />

      {/* ── Completed steps ── */}
      {model && <DoneRow label="Model" value={modelLabel} />}
      {outputPath && <DoneRow label="Output" value={outputPath} />}

      {/* ── Active step ── */}
      <Box marginTop={1} flexDirection="column">
        {step === 'model' && (
          <>
            <Box marginBottom={1}>
              <Text bold>Choose a model</Text>
            </Box>
            <Select options={MODEL_OPTIONS} onChange={handleModelSelect} />
          </>
        )}

        {step === 'outputPath' && (
          <>
            <Box marginBottom={1}>
              <Text bold>Output path</Text>
              <Text dimColor>  (where the vault folder will be created)</Text>
            </Box>
            <Box borderStyle="round" borderColor="gray" paddingX={1} width={boxWidth}>
              <Text color={ACCENT} bold>{'❯ '}</Text>
              <TextInput
                placeholder="./vault"
                onSubmit={handleOutputPathSubmit}
              />
            </Box>
            <Box marginTop={1} height={1}>
              <Text dimColor>
                {'  '}Press <Text color="white" bold>Enter</Text> to confirm
                {'  ·  '}Leave blank to use{' '}
                <Text color="white">./vault</Text>
              </Text>
            </Box>
          </>
        )}

        {step === 'depth' && (
          <>
            <Box marginBottom={1}>
              <Text bold>Vault depth</Text>
            </Box>
            <Select options={DEPTH_OPTIONS} onChange={handleDepthSelect} />
          </>
        )}
      </Box>
    </Box>
  );
}
