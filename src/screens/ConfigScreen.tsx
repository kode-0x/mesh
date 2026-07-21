import React, { useState } from 'react';
import { Box, Text, useStdout } from 'ink';
import { Select, TextInput } from '@inkjs/ui';
import { ACCENT } from '../components/Logo.js';
import { readInstructions } from '../services/vault.js';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MeshConfig {
  model:         string;
  outputPath:    string;
  depth:         'concise' | 'standard' | 'deep';
  customPrompt?: string; // optional user-supplied instructions appended to every note prompt
}

interface ConfigScreenProps {
  topic:      string;
  model:      string;
  onComplete: (config: MeshConfig) => void;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const DEPTH_OPTIONS = [
  { label: 'Concise   — ~30 notes   · quick overview',   value: 'concise'  as const },
  { label: 'Standard  — ~80 notes   · solid coverage',   value: 'standard' as const },
  { label: 'Deep      — ~150 notes  · exhaustive vault', value: 'deep'     as const },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function StepHeader({ topic, step, total }: { topic: string; step: number; total: number }) {
  return (
    <Box flexDirection="column" gap={0} marginBottom={1}>
      <Box gap={1}>
        <Text color={ACCENT} bold>❯</Text>
        <Text bold>Configuring vault for</Text>
        <Text color={ACCENT} bold>{`"${topic}"`}</Text>
      </Box>
      <Box marginLeft={2}>
        <Text dimColor>Step {step} of {total}</Text>
      </Box>
    </Box>
  );
}

function DoneRow({ label, value }: { label: string; value: string }) {
  return (
    <Box gap={2}>
      <Text color="green">✓</Text>
      <Text dimColor>{label}</Text>
      <Text color="white">{value}</Text>
    </Box>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type Step = 'outputPath' | 'depth' | 'customPrompt' | 'customPromptInput';

export function ConfigScreen({ topic, model, onComplete }: ConfigScreenProps) {
  const { stdout } = useStdout();
  const columns  = stdout?.columns ?? 80;
  const boxWidth = Math.min(62, Math.max(40, columns - 6));

  const [step,       setStep]       = useState<Step>('outputPath');
  const [outputPath, setOutputPath] = useState('');
  const [depth,      setDepth]      = useState<MeshConfig['depth']>('standard');

  // Resolved once outputPath is confirmed — used to check for INSTRUCTIONS.md
  const [instructionsContent, setInstructionsContent] = useState<string | null>(null);

  function handleOutputPathSubmit(val: string) {
    const trimmed = val.trim() || './vault';
    setOutputPath(trimmed);
    setStep('depth');
  }

  function handleDepthSelect(value: string) {
    const chosen      = value as MeshConfig['depth'];
    const instructions = readInstructions(outputPath || './vault');

    setDepth(chosen);
    setInstructionsContent(instructions);

    if (instructions !== null) {
      // INSTRUCTIONS.md found — use it automatically, skip the prompt step
      onComplete({
        model,
        outputPath:   outputPath || './vault',
        depth:        chosen,
        customPrompt: instructions,
      });
    } else {
      setStep('customPrompt');
    }
  }

  function handleCustomPromptChoice(value: string) {
    if (value === 'enter') {
      setStep('customPromptInput');
      return;
    }
    // 'skip' — no custom prompt
    finish(undefined);
  }

  function handleCustomPromptInput(val: string) {
    const trimmed = val.trim();
    finish(trimmed.length > 0 ? trimmed : undefined);
  }

  function finish(prompt: string | undefined) {
    onComplete({
      model,
      outputPath:   outputPath || './vault',
      depth,
      customPrompt: prompt,
    });
  }

  // Options when no INSTRUCTIONS.md was found
  const customPromptOptions = [
    { label: 'Enter a custom prompt', value: 'enter' },
    { label: 'Skip — use defaults',   value: 'skip'  },
  ];

  const stepNumber = step === 'outputPath' ? 1
                   : step === 'depth'      ? 2
                   : 3;

  return (
    <Box flexDirection="column" paddingTop={1} paddingX={2}>
      <StepHeader topic={topic} step={stepNumber} total={3} />

      {/* Completed steps */}
      {outputPath && <DoneRow label="Output" value={outputPath} />}
      {(step === 'customPrompt' || step === 'customPromptInput') && (
        <DoneRow label="Depth" value={depth} />
      )}

      {/* Active step */}
      <Box marginTop={1} flexDirection="column">

        {step === 'outputPath' && (
          <>
            <Box marginBottom={1}>
              <Text bold>Output path</Text>
              <Text dimColor>  (where the vault folder will be created)</Text>
            </Box>
            <Box borderStyle="round" borderColor="gray" paddingX={1} width={boxWidth}>
              <Text color={ACCENT} bold>{'❯ '}</Text>
              <TextInput placeholder="./vault" onSubmit={handleOutputPathSubmit} />
            </Box>
            <Box marginTop={1} height={1}>
              <Text dimColor>
                {'  '}Press <Text color="white" bold>Enter</Text> to confirm
                {'  ·  '}Leave blank to use <Text color="white">./vault</Text>
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

        {step === 'customPrompt' && (
          <>
            <Box flexDirection="column" gap={0} marginBottom={1}>
              <Text bold>Custom instructions</Text>
              <Box marginTop={1} marginLeft={2}>
                <Text dimColor>
                  Extra instructions appended to every note generation prompt.
                </Text>
              </Box>
            </Box>
            <Select options={customPromptOptions} onChange={handleCustomPromptChoice} />
          </>
        )}

        {step === 'customPromptInput' && (
          <>
            <Box marginBottom={1} flexDirection="column" gap={0}>
              <Text bold>Enter custom instructions</Text>
              <Box marginTop={1} marginLeft={2}>
                <Text dimColor>
                  These will be appended to every note prompt. Press <Text color="white" bold>Enter</Text> to confirm.
                </Text>
              </Box>
            </Box>
            <Box borderStyle="round" borderColor="gray" paddingX={1} width={boxWidth}>
              <Text color={ACCENT} bold>{'❯ '}</Text>
              <TextInput
                placeholder="e.g. Focus on practical applications. Use Python examples."
                onSubmit={handleCustomPromptInput}
              />
            </Box>
            <Box marginTop={1} height={1}>
              <Text dimColor>
                {'  '}Leave blank to skip custom instructions.
              </Text>
            </Box>
          </>
        )}

      </Box>
    </Box>
  );
}
