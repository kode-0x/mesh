#!/usr/bin/env node
import React, { useState } from 'react';
import { render, useApp } from 'ink';
import { StartScreen }        from './screens/StartScreen.js';
import { ApiKeyScreen }       from './screens/ApiKeyScreen.js';
import { ModelSelectScreen }  from './screens/ModelSelectScreen.js';
import { ConfigScreen, type MeshConfig } from './screens/ConfigScreen.js';
import { CostEstimateScreen } from './screens/CostEstimateScreen.js';
import { GenerationScreen }   from './screens/GenerationScreen.js';
import { IndexScreen }        from './screens/IndexScreen.js';
import { type OpenRouterModel } from './services/openrouter.js';

// ── Screen registry ───────────────────────────────────────────────────────────

type Screen =
  | 'start'
  | 'apikey'
  | 'modelSelect'
  | 'config'
  | 'estimate'
  | 'generate'
  | 'index';

// ── Root App ──────────────────────────────────────────────────────────────────

function App() {
  const { exit } = useApp();

  const [screen, setScreen] = useState<Screen>('start');
  const [topic,  setTopic]  = useState('');
  const [model,  setModel]  = useState<OpenRouterModel | null>(null);
  const [config, setConfig] = useState<MeshConfig | null>(null);

  // Carried from GenerationScreen → IndexScreen
  const [vaultPath,  setVaultPath]  = useState('');
  const [noteCount,  setNoteCount]  = useState(0);

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleTopicSubmit(t: string)         { setTopic(t);  setScreen('apikey');      }
  function handleApiKeySuccess()                 {               setScreen('modelSelect'); }
  function handleModelSelect(m: OpenRouterModel) { setModel(m);  setScreen('config');      }
  function handleConfigComplete(c: MeshConfig)   { setConfig(c); setScreen('estimate');    }
  function handleEstimateConfirm()               {               setScreen('generate');    }

  function handleEstimateCancel() {
    setModel(null);
    setConfig(null);
    setScreen('modelSelect');
  }

  function handleCreateIndex(path: string, count: number) {
    setVaultPath(path);
    setNoteCount(count);
    setScreen('index');
  }

  // After IndexScreen finishes, return to the generate done-screen so the
  // user can still open folder, start a new generation, or exit.
  function handleIndexDone() {
    setScreen('generate');
  }

  function handleRestart() {
    setTopic('');
    setModel(null);
    setConfig(null);
    setVaultPath('');
    setNoteCount(0);
    setScreen('start');
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (screen === 'apikey') {
    return <ApiKeyScreen onSuccess={handleApiKeySuccess} />;
  }

  if (screen === 'modelSelect') {
    return <ModelSelectScreen onSelect={handleModelSelect} />;
  }

  if (screen === 'config' && model) {
    return (
      <ConfigScreen
        topic={topic}
        model={model.id}
        onComplete={handleConfigComplete}
      />
    );
  }

  if (screen === 'estimate' && config) {
    return (
      <CostEstimateScreen
        topic={topic}
        config={config}
        onConfirm={handleEstimateConfirm}
        onCancel={handleEstimateCancel}
      />
    );
  }

  if (screen === 'generate' && model && config) {
    return (
      <GenerationScreen
        topic={topic}
        model={model}
        config={config}
        onCreateIndex={handleCreateIndex}
        onRestart={handleRestart}
        onExit={exit}
      />
    );
  }

  if (screen === 'index') {
    return (
      <IndexScreen
        topic={topic}
        vaultPath={vaultPath}
        noteCount={noteCount}
        onDone={handleIndexDone}
      />
    );
  }

  return <StartScreen onTopicSubmit={handleTopicSubmit} />;
}

// ── Entry point ───────────────────────────────────────────────────────────────

render(<App />);
