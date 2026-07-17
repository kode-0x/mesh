import React, { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { Spinner, StatusMessage, Select } from '@inkjs/ui';
import {
  createVaultIndex,
  missingIndexFiles,
  type IndexCreateResult,
  type IndexFilename,
} from '../services/vault.js';
import { ACCENT } from '../components/Logo.js';

// ── Types ─────────────────────────────────────────────────────────────────────

type IndexState = 'running' | 'complete' | 'error';

interface IndexScreenProps {
  topic:       string;
  vaultPath:   string;
  noteCount:   number;
  onDone:      () => void;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FileRow({
  filename,
  status,
  detail,
}: {
  filename: string;
  status:   'writing' | 'done' | 'skipped' | 'error';
  detail?:  string;
}) {
  const icon  = status === 'done'    ? <Text color="green">✓</Text>
              : status === 'skipped' ? <Text color="gray">–</Text>
              : status === 'error'   ? <Text color="red">✖</Text>
              : <Spinner />;

  const nameColor = status === 'done'    ? 'white'
                  : status === 'skipped' ? 'gray'
                  : status === 'error'   ? 'red'
                  : 'white';

  return (
    <Box gap={2}>
      <Box width={2}>{icon}</Box>
      <Text color={nameColor}>{filename}</Text>
      {detail && <Text dimColor>{detail}</Text>}
    </Box>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function IndexScreen({ topic, vaultPath, noteCount, onDone }: IndexScreenProps) {
  const [indexState, setIndexState] = useState<IndexState>('running');
  const [result,     setResult]     = useState<IndexCreateResult | null>(null);
  const [missing,    setMissing]    = useState<IndexFilename[]>([]);

  useEffect(() => {
    // Collect which files are actually missing before we start — used to
    // show the correct "writing" status for each row while work is in progress.
    const toWrite = missingIndexFiles(vaultPath);
    setMissing(toWrite);

    // createVaultIndex is synchronous and fast (pure file writes, no AI calls).
    // We defer it one tick so the spinner has a chance to render first.
    const t = setTimeout(() => {
      try {
        const r = createVaultIndex(vaultPath, topic, noteCount);
        setResult(r);
        setIndexState(r.ok ? 'complete' : 'error');
      } catch (err) {
        setResult({
          ok:      false,
          files:   [],
          skipped: [],
          errors:  [
            {
              filename: 'index.md',
              error:    err instanceof Error ? err.message : String(err),
            },
          ],
        });
        setIndexState('error');
      }
    }, 80);

    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Running ────────────────────────────────────────────────────────────────

  if (indexState === 'running') {
    return (
      <Box flexDirection="column" paddingTop={1} paddingX={2} gap={1}>
        <Box gap={1}>
          <Text color={ACCENT} bold>❯</Text>
          <Text bold>Creating vault index</Text>
        </Box>

        <Box flexDirection="column" gap={0} marginLeft={2}>
          {(['index.md', 'MOC.md', 'Learning Path.md'] as IndexFilename[]).map(name => (
            <FileRow
              key={name}
              filename={name}
              status={missing.includes(name) ? 'writing' : 'skipped'}
              detail={missing.includes(name) ? undefined : 'already exists'}
            />
          ))}
        </Box>

        <Box gap={2} marginTop={1}>
          <Spinner />
          <Text dimColor>Writing index files…</Text>
        </Box>
      </Box>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────

  if (indexState === 'error' && result) {
    return (
      <Box flexDirection="column" paddingTop={1} paddingX={2} gap={1}>
        <StatusMessage variant="error">Index creation failed</StatusMessage>

        {/* Per-file status */}
        <Box flexDirection="column" gap={0} marginLeft={2}>
          {(['index.md', 'MOC.md', 'Learning Path.md'] as IndexFilename[]).map(name => {
            const err     = result.errors.find(e => e.filename === name);
            const skipped = result.skipped.includes(name);
            const written = result.files.some(f => f.filename === name);
            const status  = err ? 'error' : skipped ? 'skipped' : written ? 'done' : 'error';
            return (
              <FileRow
                key={name}
                filename={name}
                status={status}
                detail={err?.error ?? (skipped ? 'already exists' : undefined)}
              />
            );
          })}
        </Box>

        {/* Error detail */}
        {result.errors.map((e, i) => (
          <Box key={i} marginLeft={2}>
            <Text color="red" dimColor>{e.filename}: {e.error}</Text>
          </Box>
        ))}

        <Box marginTop={1}>
          <Select
            options={[{ label: 'Back to vault', value: 'back' }]}
            onChange={onDone}
          />
        </Box>
      </Box>
    );
  }

  // ── Complete ───────────────────────────────────────────────────────────────

  if (indexState === 'complete' && result) {
    const allSkipped = result.files.length === 0 && result.skipped.length > 0;

    return (
      <Box flexDirection="column" paddingTop={1} paddingX={2} gap={1}>
        {allSkipped ? (
          <StatusMessage variant="warning">
            Index already exists — no files were changed
          </StatusMessage>
        ) : (
          <StatusMessage variant="success">
            {`Index created — ${result.files.length} file${result.files.length !== 1 ? 's' : ''} written`}
          </StatusMessage>
        )}

        {/* Per-file breakdown */}
        <Box flexDirection="column" gap={0} marginLeft={2}>
          {(['index.md', 'MOC.md', 'Learning Path.md'] as IndexFilename[]).map(name => {
            const skipped = result.skipped.includes(name);
            const written = result.files.some(f => f.filename === name);
            const err     = result.errors.find(e => e.filename === name);
            const status  = err ? 'error' : skipped ? 'skipped' : written ? 'done' : 'error';
            return (
              <FileRow
                key={name}
                filename={name}
                status={status}
                detail={
                  err     ? err.error       :
                  skipped ? 'already exists' :
                  written ? 'written'        : undefined
                }
              />
            );
          })}
        </Box>

        {/* Location */}
        <Box marginLeft={2} gap={1}>
          <Text dimColor>Location</Text>
          <Text color="white">{vaultPath}</Text>
        </Box>

        <Box marginTop={1}>
          <Select
            options={[{ label: 'Back to vault', value: 'back' }]}
            onChange={onDone}
          />
        </Box>
      </Box>
    );
  }

  return null;
}
