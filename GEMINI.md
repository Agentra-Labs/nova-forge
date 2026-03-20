# Forge (Nova-Forge) Project Overview

Forge is a research-first AI workspace designed for product and engineering teams. It turns technical signals—such as research papers, benchmarks, and architecture trends—into actionable decisions and clear product directions.

## Architecture

The project is structured as a decoupled two-part system:
- **Frontend (`FE/`)**: A Nuxt 4 (Vue 3) application providing a rich research-focused chat interface.
- **Backend (`BE/`)**: A Python/FastAPI server powered by the **Agno/Agentica** framework and **Amazon Nova** (via AWS Bedrock).

### Core Features
- **Deep Research**: Focused investigation into specific questions, methods, and tradeoffs.
- **Wide Research**: Breadth-first landscape scanning across multiple papers and labs.
- **Paper Reader**: Specialized 3-pass reading methodology for technical papers.
- **Workflow Builder**: Generates and executes research plans based on complex prompts.
- **Ideate Pipeline**: An asynchronous 5-phase pipeline that transforms arXiv papers into product opportunities.
- **Context Sentinel**: Detects ambiguity and missing context in research prompts.
- **Evidence Auditor**: Verifies AI-generated claims against source documents.

## Technology Stack

### Backend (`BE/`)
- **Language**: Python 3.12+ (managed with `uv`)
- **Framework**: FastAPI, Agno/Agentica
- **Models**: Amazon Nova (Pro/Lite/Micro) via AWS Bedrock
- **Key Libraries**: `arxiv`, `pdfplumber`, `symbolica-agentica`, `fastapi`, `pydantic`

### Frontend (`FE/`)
- **Framework**: Nuxt 4, Vue 3 (Composition API)
- **Styling**: Tailwind CSS 4, daisyUI
- **Database**: Drizzle ORM with SQLite (using NuxtHub)
- **Authentication**: Clerk (`@clerk/nuxt`)
- **Icons**: Iconify (lucide, logos, simple-icons)
- **Charts**: Nuxt Charts
- **Package Manager**: `bun`
- **Runtime**: `bun`

## Repository Layout

```
nova-forge/
├── BE/                     # Python Research Backend
│   ├── agents/             # Agentic research implementations
│   ├── workflows/          # Multi-agent chained workflows
│   ├── ideate/             # arXiv-to-Product pipeline logic
│   ├── services/           # External service clients (arXiv, Bedrock, etc.)
│   ├── tools/              # Tools for agents (Kernel, OpenAlex, TinyFish)
│   └── main.py             # FastAPI entry point (Port 7777)
├── FE/                     # Nuxt Frontend
│   ├── app/                # Vue components and composables
│   ├── server/             # Nitro server routes and API
│   ├── shared/             # Shared types and utilities
│   └── nuxt.config.ts      # Nuxt configuration
└── AGENTS.md               # Additional agentic guidance
```

## Setup & Running

### Backend Setup
1. `cd BE`
2. `uv sync`
3. `cp .env.example .env` (Add `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`)
4. `mkdir -p tmp` (For sqlite database directory)
5. `uv run python main.py` (Server runs on port 7777)

### Frontend Setup
1. `cd FE`
2. `bun install`
3. `cp .env.example .env` (Add Clerk and NuxtHub credentials)
4. `bun run dev` (App runs on port 3000)

## Development Conventions

### General
- **Indentation**: 2-space (enforced by `.editorconfig`).
- **Secret Management**: Never commit `.env` files. Ensure `.gitignore` is respected.

### Backend (`BE/`)
- Use **Type Hints** for all Python code.
- Follow **Agentica/Agno** patterns for adding new agents or tools.
- Entry point for logic is `main.py`, but core logic should be in `agents/` or `workflows/`.

### Frontend (`FE/`)
- Use **TypeScript** (`.ts`) and `<script setup lang="ts">`.
- Components use **PascalCase** (e.g., `ResearchModeSwitch.vue`).
- Composables use **camelCase** with `use` prefix (e.g., `useResearch.ts`).
- Prefer **Tailwind CSS 4** utility classes and **daisyUI** components.
- Use **Drizzle ORM** for database interactions via `hub:db`.

## Verification Commands
- **Frontend Linting**: `cd FE && bun run lint`
- **Frontend Typecheck**: `cd FE && bun run typecheck`
- **Backend Running**: `cd BE && uv run python main.py`
