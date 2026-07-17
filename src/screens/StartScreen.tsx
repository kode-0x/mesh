import React from 'react';
import { Box, Text, useStdout } from 'ink';
import { Logo } from '../components/Logo.js';
import { TopicInput } from '../input.js';

interface StartScreenProps {
  onTopicSubmit: (topic: string) => void;
}

export function StartScreen({ onTopicSubmit }: StartScreenProps) {
  const { stdout } = useStdout();
  const columns = stdout?.columns ?? 80;
  const dividerWidth = Math.min(62, Math.max(30, columns - 6));

  return (
    <Box flexDirection="column" paddingTop={1} paddingX={2} gap={0}>
      <Logo columns={columns} />

      <Box marginTop={1} marginBottom={1}>
        <Text dimColor>{'─'.repeat(dividerWidth)}</Text>
      </Box>

      <TopicInput onSubmit={onTopicSubmit} columns={columns} />
    </Box>
  );
}
