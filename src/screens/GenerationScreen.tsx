import React, { useEffect, useRef, useState } from 'react';
import { Box, Text, useInput, useStdout } from 'ink';
import { ProgressBar, Spinner, StatusMessage, Badge, Select } from '@inkjs/ui';
import { execSync } from 'node:child_process';
import { type MeshConfig } from './ConfigScreen.js';
import { type OpenRouterModel } from '../services/openrouter.js';
import {
  runGeneration,
  createHandle,
  type GenerationEvent,
  type HandleWithEmitter,
} from '../services/generator.js';
import { ACCENT } from '../components/Logo.js';

// ── Types ─────────────────────────────────────────────────────────────────────

type RunState = 'running' | 'paused' | 'cancelled' | 'complete' | 'error';

interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
}

interface GenerationScreenProps {
  topic:     string;
  model:     OpenRouterModel;
  config:    MeshConfig;
  onRestart: () => void;
  onExit:    () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function formatElapsed(startMs: number): string {
  return formatDuration(Date.now() - startMs);
}

function estimateRemaining(startMs: number, done: number, total: number): string {
  if (done === 0) return '—';
  const elapsed  = Date.now() - startMs;
  const perNote  = elapsed / done;
  const remaining = perNote * (total - done);
  return formatDuration(remaining);
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
}

const LOG_MAX = 80; // max log entries kept in memory

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: string }) {
  return (
    <Box marginBottom={1}>
      <Text color={ACCENT} bold>{children}</Text>
    </Box>
  );
}

function MetaRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Box gap={0}>
      <Box width={12}><Text dimColor>{label}</Text></Box>
      <Text color={color ?? 'white'}>{value}</Text>
    </Box>
  );
}

function LogLine({ entry }: { entry: LogEntry }) {
  const color = entry.level === 'error' ? 'red'
              : entry.level === 'warn'  ? 'yellow'
              : 'gray';
  const prefix = entry.level === 'error' ? '✖'
               : entry.level === 'warn'  ? '⚠'
               : '·';
  return (
    <Box gap={1}>
      <Text color={color}>{prefix}</Text>
      <Text color={color}>{entry.message}</Text>
    </Box>
  );
}

// ── Done screen sub-component ─────────────────────────────────────────────────
// Extracted so it can call hooks (useEffect for index detection) independently
// of the parent component's render cycle.

interface DoneScreenProps {
  topic:        string;
  finalPath:    string;
  finalNotes:   number;
  finalTokens:  number;
  finalElapsed: number;
  onRestart:    () => void;
  onExit:       () => void;
}

function DoneScreen({
  topic,
  finalPath,
  finalNotes,
  finalTokens,
  finalElapsed,
  onRestart,
  onExit,
}: DoneScreenProps) {
  const options = [
    { label: 'Open output folder in file explorer', value: 'open-folder' },
    { label: 'Start a new generation',              value: 'new'         },
    { label: 'Exit',                                value: 'exit'        },
  ];

  function handleAction(value: string) {
    if (value === 'open-folder') {
      try {
        const cmd = process.platform === 'win32'  ? `explorer "${finalPath}"`
                  : process.platform === 'darwin' ? `open "${finalPath}"`
                  : `xdg-open "${finalPath}"`;
        execSync(cmd);
      } catch { /* folder may not exist in simulation mode */ }
      return;
    }
    if (value === 'new')  { onRestart(); return; }
    if (value === 'exit') { onExit();    return; }
  }

  return (
    <Box flexDirection="column" paddingTop={1} paddingX={2} gap={1}>

      <Box gap={1}>
        <Text color="green" bold>✓</Text>
        <Text bold>Vault generated successfully</Text>
      </Box>

      {/* Final stats */}
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="green"
        paddingX={2}
        paddingY={1}
        gap={0}
      >
        <MetaRow label="Topic"  value={topic}                         color={ACCENT} />
        <MetaRow label="Notes"  value={`${finalNotes} files written`} />
        <MetaRow label="Tokens" value={formatTokens(finalTokens)} />
        <MetaRow label="Time"   value={formatDuration(finalElapsed)} />
        <MetaRow label="Output" value={finalPath} />
      </Box>

      {/* Actions */}
      <Box flexDirection="column" gap={0}>
        <Box marginBottom={1}>
          <Text bold>What would you like to do?</Text>
        </Box>
        <Select options={options} onChange={handleAction} />
      </Box>

    </Box>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function GenerationScreen({
  topic,
  model,
  config,
  onRestart,
  onExit,
}: GenerationScreenProps) {
  const { stdout } = useStdout();
  const columns  = stdout?.columns ?? 80;
  // How many log lines fit given terminal height (rough heuristic)
  const logLines = Math.max(4, Math.min(10, (stdout as any)?.rows ? (stdout as any).rows - 22 : 6));

  // ── State ──────────────────────────────────────────────────────────────────
  const [runState, setRunState]       = useState<RunState>('running');
  const [total, setTotal]             = useState(0);
  const [done, setDone]               = useState(0);
  const [currentNote, setCurrentNote] = useState('');
  const [log, setLog]                 = useState<LogEntry[]>([]);
  const [totalTokens, setTotalTokens] = useState(0);
  const [startMs]                     = useState(() => Date.now());
  const [ticker, setTicker]           = useState(0); // drives elapsed re-render

  // Resolved vault path (updated once vault-ready fires)
  const [resolvedPath, setResolvedPath] = useState(config.outputPath);

  // Completion stats
  const [finalNotes,   setFinalNotes]   = useState(0);
  const [finalTokens,  setFinalTokens]  = useState(0);
  const [finalElapsed, setFinalElapsed] = useState(0);
  const [finalPath,    setFinalPath]    = useState(config.outputPath);

  const handleRef = useRef<HandleWithEmitter>(createHandle());

  // ── Elapsed ticker ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (runState !== 'running') return;
    const t = setInterval(() => setTicker(n => n + 1), 1000);
    return () => clearInterval(t);
  }, [runState]);

  // ── Push a log entry (capped at LOG_MAX) ───────────────────────────────────
  function pushLog(level: LogEntry['level'], message: string) {
    setLog(prev => {
      const next = [...prev, { level, message }];
      return next.length > LOG_MAX ? next.slice(next.length - LOG_MAX) : next;
    });
  }

  // ── Run the generator ──────────────────────────────────────────────────────
  useEffect(() => {
    const handle = handleRef.current;
    let   active = true;

    async function run() {
      try {
        for await (const event of runGeneration(topic, config, handle)) {
          if (!active) break;
          handleEvent(event);
        }
      } catch (err) {
        if (!active) return;
        pushLog('error', err instanceof Error ? err.message : String(err));
        setRunState('error');
      }
    }

    run();
    return () => { active = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleEvent(event: GenerationEvent) {
    switch (event.type) {
      case 'start':
        setTotal(event.total);
        break;
      case 'vault-ready':
        setResolvedPath(event.resolvedPath);
        break;
      case 'note-start':
        setCurrentNote(event.title);
        break;
      case 'note-done':
        setDone(event.index + 1);
        setTotalTokens(t => t + event.tokensUsed);
        break;
      case 'log':
        pushLog(event.level, event.message);
        break;
      case 'paused':
        setRunState('paused');
        break;
      case 'resumed':
        setRunState('running');
        break;
      case 'cancelled':
        setRunState('cancelled');
        break;
      case 'complete':
        setFinalNotes(event.notesWritten);
        setFinalTokens(event.totalTokens);
        setFinalElapsed(event.elapsedMs);
        setFinalPath(event.resolvedPath);
        setRunState('complete');
        break;
    }
  }

  // ── Keyboard controls (only active while running/paused) ──────────────────
  useInput((input, key) => {
    if (runState === 'complete' || runState === 'cancelled' || runState === 'error') return;

    const ch = input.toLowerCase();
    if (ch === 'p' && runState === 'running') {
      handleRef.current.pause();
    } else if (ch === 'r' && runState === 'paused') {
      handleRef.current.resume();
    } else if (ch === 'c' || (key.ctrl && input === 'c')) {
      handleRef.current.cancel();
    }
  });

  // ── Derived display values ─────────────────────────────────────────────────
  const pct      = total > 0 ? Math.round((done / total) * 100) : 0;
  const elapsed  = formatElapsed(startMs);
  const remaining = estimateRemaining(startMs, done, total);
  const visibleLog = log.slice(-logLines);

  // ── Status badge ──────────────────────────────────────────────────────────
  const statusColor = runState === 'running'   ? 'green'
                    : runState === 'paused'     ? 'yellow'
                    : runState === 'complete'   ? 'green'
                    : runState === 'cancelled'  ? 'gray'
                    : 'red';

  const statusLabel = runState === 'running'   ? 'generating'
                    : runState === 'paused'     ? 'paused'
                    : runState === 'complete'   ? 'complete'
                    : runState === 'cancelled'  ? 'cancelled'
                    : 'error';

  // ── Done screen ────────────────────────────────────────────────────────────
  if (runState === 'complete') {
    return (
      <DoneScreen
        topic={topic}
        finalPath={finalPath}
        finalNotes={finalNotes}
        finalTokens={finalTokens}
        finalElapsed={finalElapsed}
        onRestart={onRestart}
        onExit={onExit}
      />
    );
  }

  // ── Cancelled / Error screen ───────────────────────────────────────────────
  if (runState === 'cancelled' || runState === 'error') {
    return (
      <Box flexDirection="column" paddingTop={1} paddingX={2} gap={1}>

        <StatusMessage variant={runState === 'error' ? 'error' : 'warning'}>
          {runState === 'error' ? 'Generation failed' : 'Generation cancelled'}
        </StatusMessage>

        <Box flexDirection="column" gap={0}>
          <MetaRow label="Notes done" value={`${done} / ${total}`} />
          <MetaRow label="Tokens"     value={formatTokens(totalTokens)} />
          <MetaRow label="Elapsed"    value={elapsed} />
        </Box>

        {/* Last log entries */}
        {log.length > 0 && (
          <Box flexDirection="column" gap={0}>
            {log.slice(-4).map((e, i) => <LogLine key={i} entry={e} />)}
          </Box>
        )}

        <Box marginTop={1}>
          <Select
            options={[
              { label: 'Try again',  value: 'retry' },
              { label: 'Exit',       value: 'exit'  },
            ]}
            onChange={v => { if (v === 'retry') onRestart(); else onExit(); }}
          />
        </Box>

      </Box>
    );
  }

  // ── Active generation screen ───────────────────────────────────────────────
  return (
    <Box flexDirection="column" paddingTop={1} paddingX={2} gap={0}>

      {/* ── Header row ── */}
      <Box gap={2} marginBottom={1}>
        <Box gap={1}>
          {runState === 'running' ? <Spinner /> : <Text color="yellow">⏸</Text>}
          <Text bold>Generating vault</Text>
          <Text color={ACCENT} bold>{`"${topic}"`}</Text>
        </Box>
        <Badge color={statusColor}>{statusLabel}</Badge>
      </Box>

      {/* ── Config summary ── */}
      <Box
        flexDirection={columns >= 80 ? 'row' : 'column'}
        gap={3}
        marginBottom={1}
      >
        <MetaRow label="Model"  value={model.id.split('/')[1] ?? model.id} />
        <MetaRow label="Depth"  value={config.depth} />
        <MetaRow label="Output" value={resolvedPath} />
      </Box>

      {/* ── Progress bar ── */}
      <Box flexDirection="column" gap={0} marginBottom={1}>
        <Box gap={2} marginBottom={1}>
          <Text bold color={pct === 100 ? 'green' : 'white'}>
            {String(pct).padStart(3)}%
          </Text>
          <Text dimColor>{done} / {total} notes</Text>
          <Text dimColor>·</Text>
          <Text dimColor>elapsed {elapsed}</Text>
          <Text dimColor>·</Text>
          <Text dimColor>~{remaining} remaining</Text>
          <Text dimColor>·</Text>
          <Text dimColor>{formatTokens(totalTokens)} tokens</Text>
        </Box>
        <ProgressBar value={pct} />
      </Box>

      {/* ── Current note ── */}
      <Box marginBottom={1} height={1}>
        {currentNote ? (
          <Box gap={1}>
            <Text dimColor>Writing</Text>
            <Text color="white">{currentNote}</Text>
          </Box>
        ) : (
          <Text dimColor>Preparing…</Text>
        )}
      </Box>

      {/* ── Log panel ── */}
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="gray"
        paddingX={1}
        paddingY={0}
        marginBottom={1}
        gap={0}
      >
        <Box marginBottom={0}>
          <Text dimColor bold> log </Text>
        </Box>
        {visibleLog.length === 0 ? (
          <Box paddingX={1}><Text dimColor>No output yet…</Text></Box>
        ) : (
          visibleLog.map((e, i) => (
            <Box key={i} paddingX={1}><LogLine entry={e} /></Box>
          ))
        )}
      </Box>

      {/* ── Controls ── */}
      <Box gap={3}>
        {runState === 'running' && (
          <Box gap={1}>
            <Text dimColor>[</Text>
            <Text color="yellow" bold>P</Text>
            <Text dimColor>] pause</Text>
          </Box>
        )}
        {runState === 'paused' && (
          <Box gap={1}>
            <Text dimColor>[</Text>
            <Text color="green" bold>R</Text>
            <Text dimColor>] resume</Text>
          </Box>
        )}
        <Box gap={1}>
          <Text dimColor>[</Text>
          <Text color="red" bold>C</Text>
          <Text dimColor>] cancel</Text>
        </Box>
      </Box>

    </Box>
  );
}
