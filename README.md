Mesh

<p align="center"> <b>AI-powered recursive knowledge vault generator for Obsidian</b> </p>

<p align="center"> Transform any topic into a complete, interconnected knowledge system with AI-generated Markdown notes, structured hierarchies, metadata, links, diagrams, and learning paths. </p>

<p align="center">





</p>
Overview

Mesh is an open-source command-line application that automatically generates complete Obsidian knowledge vaults from a single topic using AI.

Unlike traditional AI document generators that produce one large file, Mesh creates an entire recursive knowledge graph:

    Topic hierarchy

    Individual Markdown notes

    Folder organization

    Wiki links

    Backlinks

    Metadata

    Learning paths

    Glossaries

    Mermaid diagrams

    Cross-references

    Structured study material

Give Mesh a topic:

Machine Learning

and receive a complete knowledge vault:

Machine Learning/

├── index.md
├── README.md
├── MOC.md
├── Glossary.md
├── Learning Path.md
│
├── Mathematics/
│   ├── Mathematics.md
│   ├── Linear Algebra.md
│   ├── Calculus.md
│   └── Probability.md
│
├── Supervised Learning/
│   ├── Supervised Learning.md
│   ├── Regression.md
│   └── Classification.md
│
└── Neural Networks/
    └── Neural Networks.md

Mesh turns a subject into a navigable, expandable second brain.
Why Mesh?

Most AI tools generate isolated answers.

Knowledge requires structure.

Mesh focuses on building:

    Connections instead of documents

    Hierarchy instead of flat text

    Understanding instead of summaries

    Long-term knowledge systems instead of temporary outputs

It combines:

    AI generation

    Obsidian's knowledge graph model

    Markdown portability

    Configurable workflows

    Plugin-based extensibility

Features
Recursive Knowledge Generation

Generate complete knowledge trees from a single topic.

Example:

Artificial Intelligence

├── Foundations
│   ├── Mathematics
│   ├── Statistics
│   └── Optimization
│
├── Machine Learning
│   ├── Supervised Learning
│   ├── Unsupervised Learning
│   └── Reinforcement Learning
│
└── Deep Learning
    ├── Neural Networks
    ├── CNNs
    └── Transformers

Each node becomes its own Markdown note.
AI-Powered Index Generation

Mesh can generate an initial topic outline automatically.

Example:

# Machine Learning

## Introduction

## Mathematics

### Linear Algebra

### Calculus

### Probability

## Supervised Learning

### Regression

### Classification

The generated index becomes the blueprint for the entire vault.
Existing Index Support

Already have an outline?

Mesh can parse:

    Markdown headings

    Nested headings

    Bullet lists

    Ordered lists

    Mixed structures

Example:

# Programming

- Languages
  - Python
  - Rust

- Concepts

## Software Design

### Architecture

The structure is converted into a generation tree.
Obsidian Native Output

Every generated note includes:
YAML Frontmatter

---
title: Linear Algebra
parent: Mathematics
topic: Machine Learning
tags:
  - machine-learning
  - mathematics
aliases:
  - ML Linear Algebra
created:
updated:
---

Obsidian Features

Generated notes support:

    Wiki links

[[Neural Networks]]

    Backlinks

    Tags

    Aliases

    Dataview metadata

    Breadcrumb navigation

    Related topics

Flexible Note Styles

Choose how Mesh writes your notes.

Available templates:
Style	Purpose
Detailed Notes	Complete explanations
Beginner Friendly	Learning from zero
Technical Documentation	Engineering reference
Academic	Research-oriented
Interview Preparation	Job preparation
Cheat Sheet	Quick reference
Flashcards	Active recall
Cornell Notes	Study workflow
Mind Map	Visual organization
Custom	User-defined

Templates are stored separately:

prompts/

├── beginner.md
├── technical.md
├── academic.md
├── flashcards.md
├── cheatsheet.md
├── cornell.md
└── mindmap.md

Create unlimited custom templates without modifying code.
Custom Instructions

Need a specific writing style?

Create:

Instructions.md

or:

instructions.md

Mesh injects the instructions into every AI request.

Examples:

    Medical textbook style

    University lecture notes

    Company documentation

    Certification preparation

    Personal study format

Prompt Variables

Templates support dynamic variables:

{{topic}}

{{parent}}

{{main_topic}}

{{children}}

{{path}}

{{depth}}

{{related_topics}}

{{vault_name}}

AI Provider Architecture

Mesh uses a provider abstraction layer.

Current support:

    OpenRouter

Planned:

    OpenAI

    Anthropic

    Google Gemini

    Azure OpenAI

    Ollama

    LM Studio

    Hugging Face

    Custom OpenAI-compatible APIs

Secure API Handling

API keys are loaded only from environment variables.

Supported:

OPENROUTER_API_KEY=your_key_here

Mesh never stores secrets in:

    Configuration files

    Cache

    Logs

    State files

Generation Control

Configure:

    Model selection

    Temperature

    Maximum tokens

    Top-p

    Frequency penalty

    Presence penalty

    Reasoning effort

    Context window

    Streaming

Resumeable Generation

Large vaults can take hours.

Mesh automatically tracks progress.

Supported interruptions:

    CTRL+C

    Network failures

    API limits

    Power loss

State:

generation-state.json

Completed notes are preserved.

Resume:

mesh resume

Incremental Updates

Control regeneration behavior:

mesh generate --mode missing

Options:

    Generate missing notes

    Regenerate outdated notes

    Overwrite existing notes

    Skip existing notes

Parallel Generation

Generate multiple notes simultaneously.

Example:

threads: 5

Includes:

    Concurrency control

    Retry handling

    Exponential backoff

    Rate-limit awareness

Cost Estimation

Before generation begins Mesh estimates:

    Number of AI requests

    Token usage

    Estimated cost

    Generation duration

Example:

Generation Estimate

Notes:        128
Requests:     128
Tokens:       ~850k
Estimated:    $4.20
Duration:     ~35 minutes

Continue? [Y/n]

Rich Progress UI

During generation:

Generating Knowledge Vault

██████████████░░░░░░░

42 / 128 notes

Current:
Regression.md

Elapsed:
18m 32s

Remaining:
24m

Cost:
$1.84

Automatic Knowledge Linking

After generation, Mesh performs a second pass.

It can:

    Detect related notes

    Add wiki links

    Create backlinks

    Generate "See Also" sections

    Improve graph connectivity

Mermaid Diagram Support

Mesh generates diagrams where useful:

Supported:

    Flowcharts

    Mind maps

    Sequence diagrams

    Class diagrams

    Dependency graphs

Example:

graph TD
A[Data] --> B[Model]
B --> C[Prediction]

Examples:

    Medical textbook style

    University lecture notes

    Company documentation

    Certification preparation

    Personal study format

Prompt Variables

Templates support dynamic variables:

{{topic}}

{{parent}}

{{main_topic}}

{{children}}

{{path}}

{{depth}}

{{related_topics}}

{{vault_name}}

AI Provider Architecture

Mesh uses a provider abstraction layer.

Current support:

    OpenRouter

Planned:

    OpenAI

    Anthropic

    Google Gemini

    Azure OpenAI

    Ollama

    LM Studio

    Hugging Face

    Custom OpenAI-compatible APIs

Secure API Handling

API keys are loaded only from environment variables.

Supported:

OPENROUTER_API_KEY=your_key_here

Mesh never stores secrets in:

    Configuration files

    Cache

    Logs

    State files

Generation Control

Configure:

    Model selection

    Temperature

    Maximum tokens

    Top-p

    Frequency penalty

    Presence penalty

    Reasoning effort

    Context window

    Streaming

Resumeable Generation

Large vaults can take hours.

Mesh automatically tracks progress.

Supported interruptions:

    CTRL+C

    Network failures

    API limits

    Power loss

State:

generation-state.json

Completed notes are preserved.

Resume:

mesh resume

Incremental Updates

Control regeneration behavior:

mesh generate --mode missing

Options:

    Generate missing notes

    Regenerate outdated notes

    Overwrite existing notes

    Skip existing notes

Parallel Generation

Generate multiple notes simultaneously.

Example:

threads: 5

Includes:

    Concurrency control

    Retry handling

    Exponential backoff

    Rate-limit awareness

Cost Estimation

Before generation begins Mesh estimates:

    Number of AI requests

    Token usage

    Estimated cost

    Generation duration

Example:

Generation Estimate

Notes:        128
Requests:     128
Tokens:       ~850k
Estimated:    $4.20
Duration:     ~35 minutes

Continue? [Y/n]

Rich Progress UI

During generation:

Generating Knowledge Vault

██████████████░░░░░░░

42 / 128 notes

Current:
Regression.md

Elapsed:
18m 32s

Remaining:
24m

Cost:
$1.84

Automatic Knowledge Linking

After generation, Mesh performs a second pass.

It can:

    Detect related notes

    Add wiki links

    Create backlinks

    Generate "See Also" sections

    Improve graph connectivity

Mermaid Diagram Support

Mesh generates diagrams where useful:

Supported:

    Flowcharts

    Mind maps

    Sequence diagrams

    Class diagrams

    Dependency graphs

Example:

graph TD
A[Data] --> B[Model]
B --> C[Prediction]

Rich Markdown Output

Generated notes support:

    Tables

    Code blocks

    Callouts

    Admonitions

    Task lists

    Footnotes

    KaTeX equations

    Collapsible sections

    Blockquotes

Vault Intelligence Files

Mesh automatically creates:

README.md
MOC.md
Glossary.md
Resources.md
Learning Path.md

MOC

A Map of Content that connects the entire vault.
Glossary

A searchable terminology reference.
Learning Path

A recommended study sequence.
Export Options

Export your vault as:

    Markdown

    ZIP archive

    HTML

    PDF

    JSON metadata

Plugin System

Mesh is designed for extensions.

Example:

plugins/

├── anki/
├── quiz/
├── youtube/
├── wikipedia/
├── images/
└── citations/

Plugins can add:

    Flashcards

    External references

    Images

    Videos

    Citations

    Additional enrichment

Installation
Requirements

    Node.js >= 20

    npm / pnpm

    AI provider API key

Clone:

git clone https://github.com/your-org/mesh.git

cd mesh

Install:

npm install

Build:

npm run build

Configure:

cp .env.example .env

Add:

OPENROUTER_API_KEY=your_key_here

Usage

Initialize:

mesh init

Generate:

mesh generate

Resume:

mesh resume

Validate:

mesh validate

Regenerate:

mesh regenerate Regression

Update links:

mesh update-links

Export:

mesh export

Diagnostics:

mesh doctor

Configuration

Mesh supports YAML and JSON configuration.

Example:

provider: openrouter

model: anthropic/claude-sonnet

threads: 5

temperature: 0.3

prompt: technical

output: ./vault

CLI arguments override configuration values.
Architecture

src/

├── cli/
├── commands/
├── config/
├── generator/
├── providers/
├── prompts/
├── parser/
├── templates/
├── cache/
├── exporters/
├── plugins/
├── logging/
└── utils/

Technology Stack

Built with:

    TypeScript

    Node.js

    Commander.js / Oclif

    Inquirer

    Zod

    Chalk

    Ora

    Pino

    dotenv

    Markdown parsers

    SQLite

    Vitest

    ESLint

    Prettier

    GitHub Actions

Development

Install dependencies:

npm install

Run development mode:

npm run dev

Run tests:

npm test

Lint:

npm run lint

Format:

npm run format

Roadmap
Knowledge Expansion

    Automatic citations

    Wikipedia enrichment

    Web research plugins

    Image generation

    Video integration

Learning Tools

    Anki synchronization

    Quiz generation

    Spaced repetition

    Progress tracking

AI Providers

    Local LLM support

    Multi-provider routing

    Automatic model selection

Interfaces

    Web dashboard

    Desktop application

    Cloud synchronization

Contributing

Contributions are welcome.

You can help by:

    Reporting bugs

    Improving prompts

    Adding providers

    Creating plugins

    Improving documentation

    Adding exporters

Please open an issue before large architectural changes.
License

MIT License
Philosophy

Knowledge is not a collection of documents.

Knowledge is a connected system.

Mesh helps transform information into a structured, searchable, and continuously growing personal knowledge graph.

Build your second brain.

<p align="center"> <b>Mesh — Generate knowledge. Build connections. Learn anything.</b> </p>