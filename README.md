<div align="center">

```
   ▄▄▄▄███▄▄▄▄      ▄████████    ▄████████    ▄█    █▄    
 ▄██▀▀▀███▀▀▀██▄   ███    ███   ███    ███   ███    ███   
 ███   ███   ███   ███    █▀    ███    █▀    ███    ███   
 ███   ███   ███  ▄███▄▄▄       ███         ▄███▄▄▄▄███▄▄ 
 ███   ███   ███ ▀▀███▀▀▀     ▀███████████ ▀▀███▀▀▀▀███▀  
 ███   ███   ███   ███    █▄           ███   ███    ███   
 ███   ███   ███   ███    ███    ▄█    ███   ███    ███   
  ▀█   ███   █▀    ██████████  ▄████████▀    ███    █▀    
```

**AI-powered knowledge vault generator for Obsidian**

[![License: MIT](https://img.shields.io/badge/License-MIT-a855f7.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-a855f7.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-a855f7.svg)](https://www.typescriptlang.org)
[![Powered by OpenRouter](https://img.shields.io/badge/Powered%20by-OpenRouter-a855f7.svg)](https://openrouter.ai)

*Give Mesh a topic. Get back a second brain.*

</div>

---

## Overview

Most AI tools answer questions. Mesh builds knowledge.

Give Mesh a topic and it generates an entire Obsidian vault — a structured collection of Markdown notes organized into folders, interlinked with wiki-links, and enriched with metadata, diagrams, and navigation aids. The result isn't a single document. It's a complete knowledge system, ready to explore and expand.

A topic like **Machine Learning** becomes a navigable vault with dedicated notes on every sub-concept: Linear Algebra, Probability, Supervised Learning, Neural Networks, Regression, Classification — each note cross-referenced with the others, tagged, and formatted natively for Obsidian.

---

## Features

**Recursive generation** — Mesh breaks a topic into a full concept hierarchy and generates a dedicated note for every node, no matter how deep.

**Flexible depth** — Choose between three tiers to match your goal:

| Depth | Notes | Best for |
|---|---|---|
| Concise | ~30 | Quick overview or topic primer |
| Standard | ~80 | Solid, well-rounded coverage |
| Deep | ~150 | Exhaustive reference vault |

**Any AI model** — Mesh routes through [OpenRouter](https://openrouter.ai), giving you access to Claude, GPT-4, Gemini, DeepSeek, and hundreds of other models from a single API key. Pick the model that fits your budget and quality bar.

**Cost estimation** — Before a single token is generated, Mesh shows you the projected note count, token usage, and estimated cost. No surprises.

**Custom instructions** — Append your own instructions to every note prompt. Focus on practical examples, a specific language, a teaching style, or any other constraint. Mesh also picks up an `INSTRUCTIONS.md` file from an existing vault automatically.

**Obsidian-native output** — Every note ships with frontmatter, wiki-links, tags, aliases, and Dataview-compatible metadata out of the box.

**Vault navigation files** — Mesh auto-generates a Map of Content, Glossary, and Learning Path for the entire vault.

**Resumable generation** — If generation is interrupted, Mesh picks up exactly where it left off on the next run.

**Mermaid diagrams** — Relevant notes include diagrams: flowcharts, mind maps, dependency graphs, and more.

---

## Requirements

- [Node.js](https://nodejs.org) 18 or later
- An [OpenRouter](https://openrouter.ai) API key
- [Obsidian](https://obsidian.md) (to open and explore the generated vault)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mesh.git
cd mesh

# Install dependencies
npm install

# Build
npm run build

# Link globally (optional — lets you run `mesh` from anywhere)
npm link
```

---

## Quick Start

```bash
mesh
```

Mesh walks you through setup in a single interactive session:

1. **Enter a topic** — anything from *Quantum Computing* to *Renaissance Art*
2. **Paste your OpenRouter API key** — stored only in memory for the session
3. **Pick a model** — browse the full OpenRouter catalog with live pricing
4. **Configure the vault** — set an output path, choose depth, and optionally add custom instructions
5. **Review the cost estimate** — confirm before any generation begins
6. **Watch it build** — Mesh generates your vault note by note with a live progress display

When it finishes, open the output folder as a vault in Obsidian.

---

## Usage

### Basic run

```bash
mesh
```

### Development mode (no build step)

```bash
npm run dev
```

### Running the built output directly

```bash
node dist/main.js
```

---

## Configuration

Mesh is configured interactively — there are no config files to edit before you start. Every setting is prompted during the session:

| Setting | Description | Default |
|---|---|---|
| Output path | Directory where the vault folder will be created | `./vault` |
| Depth | How many notes to generate (`concise` / `standard` / `deep`) | `standard` |
| Custom instructions | Extra instructions appended to every note prompt | none |

### `INSTRUCTIONS.md`

If an `INSTRUCTIONS.md` file exists inside the target vault folder, Mesh detects it automatically and uses its contents as custom instructions — no prompt needed. This is useful for re-running generation on an existing vault with a consistent style.

---

## Supported Models

Mesh connects to the full [OpenRouter](https://openrouter.ai/models) model catalog. Any text generation model available on OpenRouter can be used. A few well-suited choices:

| Model | Price (blended) | Notes |
|---|---|---|
| `deepseek/deepseek-r1` | ~$0.70 / 1M tokens | Best value for large vaults |
| `anthropic/claude-sonnet-4-5` | ~$4.50 / 1M tokens | Strong quality / cost balance |
| `openai/gpt-4.1` | ~$4.00 / 1M tokens | Reliable and consistent |
| `google/gemini-2.5-pro` | ~$5.00 / 1M tokens | Long context, detailed notes |
| `anthropic/claude-opus-4` | ~$22.50 / 1M tokens | Highest quality output |

Prices are estimates. See [OpenRouter pricing](https://openrouter.ai/models) for current rates.

---

## Roadmap

- Local model support (Ollama, LM Studio)
- Web research and Wikipedia enrichment
- Automatic citations and references
- Anki sync and quiz generation
- Image generation for visual notes
- Export as ZIP, HTML, PDF, or JSON
- Web dashboard and desktop application
- Cloud vault synchronization

---

## Contributing

Contributions are welcome. The highest-value areas to contribute are:

- **Prompt improvements** — better note structure, richer content, improved diagrams
- **Writing style templates** — new styles beyond the built-in set
- **Export formats** — ZIP, HTML, PDF, JSON, and beyond
- **Provider integrations** — direct connections to Anthropic, OpenAI, Ollama, etc.

Please open an issue before starting any large change so we can discuss the approach first.

```bash
# Fork and clone
git clone https://github.com/your-username/mesh.git

# Install and build
npm install && npm run build

# Run in dev mode (no build step needed)
npm run dev
```

---

## License

[MIT](LICENSE) — free to use, modify, and distribute.

---

<div align="center">

*Mesh — Generate Knowledge. Build Connections. Learn Anything.*

</div>
