# mesh

**AI-powered knowledge vault generator for Obsidian**

Mesh transforms any topic into a complete, interconnected knowledge system — structured notes, hierarchies, links, glossaries, and learning paths, all generated automatically and ready to open in Obsidian.

---

## What is Mesh?

Most AI tools answer questions. Mesh builds knowledge.

Give Mesh a topic and it produces an entire vault: a navigable collection of Markdown notes organized into folders, linked to each other, and enriched with metadata, diagrams, and study aids. The result isn't a single document — it's a second brain, ready to explore and expand.

---

## What it generates

A single topic like *Machine Learning* becomes a structured vault:

```
Machine Learning/
├── index.md
├── MOC.md                  — Map of Content
├── Glossary.md
├── Learning Path.md
│
├── Mathematics/
│   ├── Linear Algebra.md
│   ├── Calculus.md
│   └── Probability.md
│
├── Supervised Learning/
│   ├── Regression.md
│   └── Classification.md
│
└── Neural Networks/
    └── Neural Networks.md
```

Every note is interlinked, tagged, and formatted natively for Obsidian.

---

## Key capabilities

**Recursive generation** — Mesh breaks a topic into a full hierarchy and generates a dedicated note for every concept, no matter how deep.

**Flexible depth** — Choose how thorough the vault should be, from a concise overview to an exhaustive reference.

**Multiple writing styles** — Notes can be written as detailed explanations, beginner guides, technical documentation, academic references, interview prep, flashcards, Cornell notes, or cheat sheets. Custom styles are supported.

**Obsidian-native output** — Every note includes frontmatter, wiki links, backlinks, tags, aliases, and Dataview-compatible metadata out of the box.

**Vault intelligence files** — Mesh automatically creates a Map of Content, Glossary, and Learning Path for the entire vault.

**Cost estimation** — Before anything is generated, Mesh shows an estimated note count, token usage, and cost so there are no surprises.

**Resumable generation** — Large vaults can take time. If generation is interrupted for any reason, Mesh picks up exactly where it left off.

**Automatic linking** — After generation, Mesh runs a second pass to detect relationships between notes and add cross-references where they are missing.

**Diagram support** — Relevant notes include Mermaid diagrams: flowcharts, mind maps, dependency graphs, and more.

**Export options** — Finished vaults can be exported as a ZIP archive, HTML, PDF, or JSON.

---

## AI providers

Mesh routes generation through [OpenRouter](https://openrouter.ai), giving access to models from Anthropic, OpenAI, Google, DeepSeek, and others from a single API key. Support for direct provider connections and local models is on the roadmap.

---

## Roadmap

- Local model support (Ollama, LM Studio)
- Web research and Wikipedia enrichment
- Automatic citations and references
- Anki synchronization and quiz generation
- Image generation for visual notes
- Web dashboard and desktop application
- Cloud vault synchronization

---

## Contributing

Contributions are welcome. The most valuable areas to contribute are prompt improvements, new writing style templates, additional export formats, and provider integrations. Please open an issue before starting any large change.

---

## License

MIT

---

*Mesh — Generate Knowledge. Build Connections. Learn Anything.*
