import React, { useState } from 'react';
import { Box, Text, useStdout } from 'ink';
import { Select, TextInput, ConfirmInput } from '@inkjs/ui';
import { ACCENT } from '../components/Logo.js';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MeshConfig {
  model:       string;
  outputPath:  string;
  depth:       'concise' | 'standard' | 'deep';
  createIndex: boolean;
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

type Step = 'outputPath' | 'depth' | 'createIndex';

export function ConfigScreen({ topic, model, onComplete }: ConfigScreenProps) {
  const { stdout } = useStdout();
  const columns  = stdout?.columns ?? 80;
  const boxWidth = Math.min(62, Math.max(40, columns - 6));

  const [step,       setStep]       = useState<Step>('outputPath');
  const [outputPath, setOutputPath] = useState('');
  const [depth,      setDepth]      = useState<MeshConfig['depth']>('standard');

  function handleOutputPathSubmit(val: string) {
    const trimmed = val.trim() || './vault';
    setOutputPath(trimmed);
    setStep('depth');
  }

  function handleDepthSelect(value: string) {
    setDepth(value as MeshConfig['depth']);
    setStep('createIndex');
  }

  function handleIndexConfirm() {
    onComplete({ model, outputPath: outputPath || './vault', depth, createIndex: true });
  }

  function handleIndexCancel() {
    onComplete({ model, outputPath: outputPath || './vault', depth, createIndex: false });
  }

  const stepNumber = step === 'outputPath' ? 1 : step === 'depth' ? 2 : 3;

  return (
    <Box flexDirection="column" paddingTop={1} paddingX={2}>
      <StepHeader topic={topic} step={stepNumber} total={3} />

      {/* Completed steps */}
      {outputPath && <DoneRow label="Output" value={outputPath} />}
      {step === 'createIndex' && <DoneRow label="Depth"  value={depth} />}

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

        {step === 'createIndex' && (
          <>
            <Box flexDirection="column" gap={0} marginBottom={1}>
              <Text bold>Create index now?</Text>
              <Box marginTop={1} marginLeft={2} flexDirection="column" gap={0}>
                <Text dimColor>
                  The index is a set of navigation files added to your vault:
                </Text>
                <Text dimColor>  · <Text color="white">index.md</Text>    — root entry point with links to every note</Text>
                <Text dimColor>  · <Text color="white">MOC.md</Text>       — Map of Content, organised by topic</Text>
                <Text dimColor>  · <Text color="white">Learning Path.md</Text> — recommended study sequence</Text>
              </Box>
              <Box marginTop={1}>
                <Text dimColor>
                  You can also create it later from the vault done screen.
                </Text>
              </Box>
            </Box>

            <Box gap={1}>
              <Text bold>Create index?  </Text>
              <ConfirmInput
                defaultChoice="confirm"
                onConfirm={handleIndexConfirm}
                onCancel={handleIndexCancel}
              />
            </Box>
          </>
        )}

      </Box>
    </Box>
  );
}
