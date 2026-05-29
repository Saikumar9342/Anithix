# Graviton AI — Product Overview

**A personal AI workspace with a newspaper soul.**  
Graviton is a full-stack AI chat platform built for people who want power, privacy, and beauty in one place. It runs local models via Ollama, connects to any cloud provider, and wraps everything in a deeply customisable editorial interface.

---

## What It Does

Graviton lets you chat with AI models — local or cloud — from a single, polished interface. Every conversation is saved, searchable, and organised. The interface adapts to your taste with 8 theme presets, 27+ appearance controls, and a live news dashboard that greets you every time you open a new thread.

---

## Core Features

### Multi-Provider AI
Run any model, anywhere:
- **Local models** via Ollama (Llama 3, Mistral, DeepSeek Coder, Phi-3, Qwen, and any Ollama-compatible model)
- **Cloud providers** — NVIDIA NIM, Groq, OpenRouter, Together AI, Fireworks AI, LM Studio, or any OpenAI-compatible API
- **Vision models** — attach images and ask questions about them
- **Image generation** — generate images directly in the chat via Fireworks AI, Together AI, or FLUX

Switch between models mid-session from the input bar. Add cloud provider API keys once in Settings — they stay server-side and are never exposed to the browser.

### Chat Modes
Three built-in conversation modes selectable from the input bar:
- **Chat** — general-purpose assistant
- **Dev** — code-optimised, concise, production-quality answers
- **Research** — analytical, structured, citation-aware responses

### File Attachments & Web Search
- Upload text files or images and ask questions about them
- Toggle web search (DuckDuckGo) to ground responses in live information
- Attachments are injected into the model context automatically

### Streaming Responses
Responses stream token-by-token in real time. Token counts and latency are tracked per message and visible in the Session Info panel.

### Persistent Chat History
All conversations are saved to a PostgreSQL database. The sidebar shows your full history grouped by date (Today, Yesterday, Last 7 days, etc.) with:
- **Projects** — group chats into colour-coded folders
- **Pinning** — pin important threads to the top
- **Rename & delete** — full chat management
- **Search** — find any conversation by title

### Auto-Generated Titles
After the first exchange in a new chat, Graviton automatically generates a descriptive title using the AI model.

---

## The Daily Brief Dashboard

When no chat is open, Graviton shows a live personalised dashboard instead of a blank screen.

**Editorial themes** render it as a newspaper — *The Daily Brief* — with a masthead, dateline, and 3-column news layout.  
**Other themes** render it as a modern card-based layout.

Dashboard content:
- **Live news** from RSS feeds across 10 topic categories: World, Technology, Sports, Science, Entertainment, Music, Gaming, Finance, Health, Politics — with subtopics per category (BBC, Reuters, AP, Hacker News, The Verge, Wired, Billboard, IGN, and more)
- **Live weather** — current conditions and 3-day forecast for your saved city
- **Clock** — live local time
- **Open threads** — quick resume links to recent conversations
- **Quick prompts** — curated conversation starters
- **Workspace stats** — thread count, token usage, streak

Topics and subtopics are fully configurable per user in Settings → Dashboard.

---

## Appearance & Theming

Graviton has one of the most extensive UI customisation systems of any AI chat app.

### 8 Theme Presets
One click applies a complete look — colours, fonts, spacing, effects:

| Preset | Personality |
|--------|-------------|
| Editorial Dark | Warm amber paper, sharp borders, newspaper aesthetic |
| Editorial Light | Cream paper, high contrast ink, minimal chrome |
| Midnight Violet | Deep charcoal with vivid violet glow effects |
| Ocean Glass | Deep blue-slate with frosted glass surfaces |
| Forest Mono | Near-black green tint, full monospace terminal feel |
| Rose Dawn | Warm white with soft rose highlights, generous curves |
| Amber Tech | Retro terminal amber on near-black, dot grid |
| Sky Clean | Clean white with blue, airy productivity feel |

### 27+ Appearance Controls
Fine-tune beyond presets:
- **Typography** — font family (Inter, JetBrains Mono, Fraunces), size, weight, letter spacing, line height
- **Colours** — accent colour (7 presets + custom), glass tint, saturation
- **Visual effects** — glow intensity/radius, glass blur/opacity, noise texture, background patterns (grid, dots, mesh)
- **Layout** — sidebar width/position, chat max width, message spacing, UI density (Compact / Comfort / Spacious)
- **Borders** — radius, width, style (solid / dashed / dotted)
- **Chat bubbles** — Modern / Glass / Minimal styles

All settings are saved to the database and restored on every load.

---

## Settings & Personalisation

Settings are organised into sections:

- **Themes** — preset picker with live mini-previews of each theme
- **Appearance** — full visual customisation (fonts, colours, layout, effects)
- **Chat Settings** — default model, system prompt, compact mode, animations, sound effects, content width, UI density, chat/message sizing
- **Dashboard** — city for weather, topic/subtopic selection, show/hide dashboard toggle
- **Local Models** — pull new Ollama models, see installed models, delete models
- **Model Lab** — register cloud providers, add API keys, activate/deactivate models, set model type (text / vision / image-generation)
- **Session Info** — live stats: model, message counts, token usage, response latency, stream speed
- **Database** (admin) — connection test, migration status
- **System Admin** — pin-protected admin panel

---

## Technical Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React, TypeScript, Tailwind CSS v4 |
| UI Components | Shadcn/ui, Radix UI primitives |
| Fonts | Inter, JetBrains Mono, Fraunces (Google Fonts) |
| Backend | FastAPI (Python 3.11), SQLAlchemy, Alembic |
| Database | PostgreSQL (Supabase) |
| Local AI | Ollama |
| Cloud AI | OpenAI-compatible REST API (any provider) |
| Image Gen | Fireworks AI / Together AI / FLUX |
| Web Search | DuckDuckGo |
| News | RSS feeds (BBC, Reuters, AP, HN, and more) |
| Weather | wttr.in |
| Frontend Host | Netlify |
| Backend Host | Back4App Containers |
| Auth | None (single-user, personal workspace) |

---

## Who It's For

Graviton is built for developers, researchers, and power users who:
- Want to run AI locally without sending data to third parties
- Need to switch between multiple models and providers in one place
- Care about the quality and aesthetics of their tools
- Want their AI workspace to feel like a crafted product, not a prototype

---

## Project Status

**Version**: 1.0 (Phase 1)  
**Status**: Live at [graviton.anithix.com](https://graviton.anithix.com)  
**Built by**: Saikumar  
**Repo**: [github.com/Saikumar9342/graviton](https://github.com/Saikumar9342/graviton)

---

*Graviton — Think in print. Ship in code.*
