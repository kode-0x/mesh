import React, { useState } from 'react';
import { Box, Text, useStdout } from 'ink';
import { PasswordInput } from '@inkjs/ui';
import { setApiKey } from '../session.js';
import { ACCENT } from '../components/Logo.js';

const OR_KEY_RE = /^sk-or-v1-[0-9a-f]{64}$/i;

function validateKey(key: string): string | null {
  if (!key.trim()) return 'API key cannot be empty.';
  if (!OR_KEY_RE.test(key.trim())) return 'Invalid format. Expected: sk-or-v1-<64 hex chars>';
  return null;
}

interface ApiKeyScreenProps {
  onSuccess: () => void;
}

export function ApiKeyScreen({ onSuccess }: ApiKeyScreenProps) {
  const { stdout } = useStdout();
  const columns  = stdout?.columns ?? 80;
  const boxWidth = Math.min(62, Math.max(40, columns - 6));

  const [error, setError] = useState('');

  function handleSubmit(value: string) {
    const validationError = validateKey(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    setApiKey(value.trim());
    onSuccess();
  }

  return (
    <Box flexDirection="column" paddingTop={1} paddingX={2} gap={1}>

      {/* Header */}
      <Box flexDirection="column" gap={0}>
        <Box gap={1}>
          <Text color={ACCENT} bold>❯</Text>
          <Text bold>OpenRouter API key</Text>
        </Box>
        <Box marginLeft={2}>
          <Text dimColor>
            Your Key Is Held In Memory Only And Deleted When This Session Ends.
          </Text>
        </Box>
      </Box>

      <Box flexDirection="column" gap={0}>
        <Box
          borderStyle="round"
          borderColor={error ? 'red' : 'gray'}
          paddingX={1}
          width={boxWidth}
        >
          <Text color={ACCENT} bold>{'❯ '}</Text>
          <PasswordInput
            placeholder="sk-or-v1-···"
            onSubmit={handleSubmit}
          />
        </Box>

        <Box marginTop={1} height={1}>
          {error ? (
            <Text color="red">{error}</Text>
          ) : (
            <Text dimColor>
              {'  '}Get Your Key At{' '}
              <Text color="white">openrouter.ai/keys</Text>
              {'  ·  '}
              Press <Text color="white" bold>Enter</Text> to continue
            </Text>
          )}
        </Box>
      </Box>

      <Box
        borderStyle="round"
        borderColor="gray"
        paddingX={2}
        paddingY={1}
        marginTop={1}
      >
        <Box flexDirection="column" gap={0}>
          <Text dimColor bold>Session Security</Text>
          <Text dimColor>· Never Written To Disk, Config Files, or Logs</Text>
          <Text dimColor>· Wiped From Memory On Exit, Ctrl+c, or Any Crash</Text>
          <Text dimColor>· Not Stored Between Runs — You Will Be Asked Each Time</Text>
        </Box>
      </Box>

    </Box>
  );
}
