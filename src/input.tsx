import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { TextInput } from '@inkjs/ui';
import { ACCENT } from './components/Logo.js';

function inputBoxWidth(columns: number): number {
  return Math.min(62, Math.max(30, columns - 6));
}

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  columns?: number;
}

export function TopicInput({ onSubmit, columns = 80 }: TopicInputProps) {
  const [error, setError] = useState('');
  const boxWidth = inputBoxWidth(columns);

  function handleSubmit(val: string) {
    const trimmed = val.trim();
    if (!trimmed) {
      setError('Please enter a topic name.');
      return;
    }
    setError('');
    onSubmit(trimmed);
  }

  return (
    <Box flexDirection="column" gap={0}>
      <Box marginBottom={1}>
        <Text bold>What topic should Mesh generate a vault for?</Text>
      </Box>

      <Box
        borderStyle="round"
        borderColor={error ? 'red' : 'gray'}
        paddingX={1}
        width={boxWidth}
      >
        <Text color={ACCENT} bold>{'❯ '}</Text>
        <TextInput
          placeholder="e.g. Machine Learning, Stoic Philosophy…"
          onChange={() => { if (error) setError(''); }}
          onSubmit={handleSubmit}
        />
      </Box>

      <Box marginTop={1} height={1}>
        {error ? (
          <Text color="red">{error}</Text>
        ) : (
          <Text dimColor>
            {'  '}Press <Text color="white" bold>Enter</Text> to generate
            {'  ·  '}
            <Text color="white" bold>Ctrl+C</Text> to exit
          </Text>
        )}
      </Box>
    </Box>
  );
}
