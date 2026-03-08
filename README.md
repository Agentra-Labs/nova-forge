# Forge

Forge is a research-first AI workspace built to turn papers, benchmarks, and technical signals into decisions a product or engineering team can act on.

The current app lives in [`chat-app/`](./chat-app) and is structured around two research modes:

- `Deep Research`: follow a focused question through methods, evidence, tradeoffs, and the strongest available answer.
- `Wide Research`: scan the landscape quickly across papers, labs, and solution families before deciding where to go deeper.

## Product Shape

The public landing page frames Forge as a research agent for engineering and product teams.

The app workspace is built around:

- a dashboard for starting new research threads
- a threaded chat interface for continuing investigation
- file upload and model selection inside the composer
- deep/wide mode switching directly inside the input workflow

## Repository Layout

- [`chat-app/`](./chat-app): Nuxt application for the Forge landing page and research workspace
- [`LICENSE`](./LICENSE): repository license

## Local Development

From the `chat-app` directory:

```bash
cd chat-app
bun install
bun run dev
```

Useful commands:

```bash
bun run typecheck
bun run lint
bun run build
```

## Positioning

Forge is designed for questions like:

- Which planning architecture is holding up best for browser agents?
- What do recent papers say about hallucination reduction strategies?
- Which benchmark results actually matter for this implementation decision?
- What is the strongest recommendation once evidence and tradeoffs are compared?

The goal is not just to summarize research. The goal is to turn research into clear direction.
