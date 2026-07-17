#!/usr/bin/env node
import React, { useState } from 'react';
import { render, Box, Text, useApp } from 'ink';
import { StartScreen } from './screens/StartScreen.js';
import { ConfigScreen, type MeshConfig } from './screens/ConfigScreen.js';
import { CostEstimateScreen } from './screens/CostEstimateScreen.js';
import { ACCENT } from './components/Logo.js';

type Screen = 'start' | 'config' | 'estimate' | 'generate';

function App() {
  const { exit } = useApp();
  const [screen, setScreen]   = useState<Screen>('start');
  const [topic, setTopic]     = useState('');
  const [config, setConfig]   = useState<MeshConfig | null>(null);

  function handleTopicSubmit(submittedTopic: string) {
    setTopic(submittedTopic);
    setScreen('config');
  }

  function handleConfigComplete(submittedConfig: MeshConfig) {
    setConfig(submittedConfig);
    setScreen('estimate');
  }

  function handleConfirm() {
    setScreen('generate');
  }

  function handleCancel() {
    // Return to config so the user can adjust settings
    setConfig(null);
    setScreen('config');
  }

  if (screen === 'config') {
    return <ConfigScreen topic={topic} onComplete={handleConfigComplete} />;
  }

  if (screen === 'estimate' && config) {
    return (
      <CostEstimateScreen
        topic={topic}
        config={config}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
  }

  if (screen === 'generate') {
    // Generation screen — built in the next phase
    return (
      <Box flexDirection="column" paddingTop={1} paddingX={2} gap={1}>
        <Box gap={1}>
          <Text color={ACCENT} bold>✓</Text>
          <Text bold>Configuration confirmed.</Text>
        </Box>
        <Text dimColor>
          Generation screen coming next. Press{' '}
          <Text color="white" bold>Ctrl+C</Text> to exit.
        </Text>
      </Box>
    );
  }

  return <StartScreen onTopicSubmit={handleTopicSubmit} />;
}

render(<App />);
