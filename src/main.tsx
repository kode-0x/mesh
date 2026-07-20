#!/usr/bin/env node
import React, { useState } from 'react';
import { render, useApp } from 'ink';
import { StartScreen }        from './screens/StartScreen.js';
import { ApiKeyScreen }       from './screens/ApiKeyScreen.js';
import { ModelSelectScreen }  from './screens/ModelSelectScreen.js';
import { ConfigScreen, type MeshConfig } from './screens/ConfigScreen.js';
import { CostEstimateScreen } from './screens/CostEstimateScreen.js';
import { GenerationScreen }   from './screens/GenerationScreen.js';
import { type OpenRouterModel } from './services/openrouter.js';

// ── Screen registry ───────────────────────────────────────────────────────────

type Screen =
  | 'start'
  | 'apikey'
  | 'modelSelect'
  | 'config'
  | 'estimate'
  | 'generate';

// ── Root App ──────────────────────────────────────────────────────────────────

function App() {
  const { exit } = useApp();

  const [screen, setScreen] = useState<Screen>('start');
  const [topic,  setTopic]  = useState('');
  const [model,  setModel]  = useState<OpenRouterModel | null>(null);
  const [config, setConfig] = useState<MeshConfig | null>(null);

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

  function handleRestart() {
    setTopic('');
    setModel(null);
    setConfig(null);
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
        onRestart={handleRestart}
        onExit={exit}
      />
    );
  }

  return <StartScreen onTopicSubmit={handleTopicSubmit} />;
}

// ── Entry point ───────────────────────────────────────────────────────────────

render(<App />);
