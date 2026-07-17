import React from 'react';
import { Box, Text } from 'ink';

export const ACCENT = '#ff4d6d';
const ACCENT_MID    = '#ff758f';
const ACCENT_DIM    = '#ff8fa3';
const ACCENT_FADE   = '#ffb3c1';

const LOGO_ROWS: Array<{ line: string; color: string }> = [
  { line: '   ▄▄▄▄███▄▄▄▄      ▄████████    ▄████████    ▄█    █▄    ', color: ACCENT },
  { line: ' ▄██▀▀▀███▀▀▀██▄   ███    ███   ███    ███   ███    ███   ', color: ACCENT },
  { line: ' ███   ███   ███   ███    █▀    ███    █▀    ███    ███   ', color: ACCENT_MID },
  { line: ' ███   ███   ███  ▄███▄▄▄       ███         ▄███▄▄▄▄███▄▄ ', color: ACCENT_MID },
  { line: ' ███   ███   ███ ▀▀███▀▀▀     ▀███████████ ▀▀███▀▀▀▀███▀  ', color: ACCENT_DIM },
  { line: ' ███   ███   ███   ███    █▄           ███   ███    ███   ', color: ACCENT_DIM },
  { line: ' ███   ███   ███   ███    ███    ▄█    ███   ███    ███   ', color: ACCENT_FADE },
  { line: '  ▀█   ███   █▀    ██████████  ▄████████▀    ███    █▀    ', color: ACCENT_FADE },
];

const LOGO_COMPACT = '◈ mesh';

interface LogoProps {
  columns?: number;
}

export function Logo({ columns = 80 }: LogoProps) {
  const isNarrow = columns < 50;

  return (
    <Box flexDirection="column" gap={0}>
      {isNarrow ? (
        <Box>
          <Text color={ACCENT} bold>{LOGO_COMPACT}</Text>
        </Box>
      ) : (
        <Box flexDirection="column">
          {LOGO_ROWS.map(({ line, color }, i) => (
            <Text key={i} color={color}>{line}</Text>
          ))}
        </Box>
      )}

      <Box marginTop={1}>
        <Text dimColor italic>AI-powered recursive knowledge vault generator</Text>
      </Box>

      <Box gap={1}>
        <Text color="gray">v1.0.0</Text>
        <Text dimColor>·</Text>
        <Text color="gray">OpenRouter</Text>
      </Box>
    </Box>
  );
}
