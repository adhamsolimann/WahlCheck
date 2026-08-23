# WAHLEN — WahlCheck Berlin

Interaktiver, parteiunabhängiger Wahlkompass für die **Abgeordnetenhauswahl Berlin am 20.09.2026**.

- Roadmap & Sprint-Plan: [`ROADMAP.md`](./ROADMAP.md)
- Architektur-Prinzipien: `ROADMAP.md` §4 (Client-side Scoring, Art. 9 DSGVO, AGPL-3.0 / CC BY-SA)

## Setup

```bash
corepack enable            # oder: corepack pnpm <cmd>
pnpm install
pnpm test                  # vitest in allen Packages (inkl. Content-Validierung)
pnpm lint                  # eslint
pnpm typecheck             # tsc über alle Packages
pnpm build                 # turbo → apps/web statischer Export
pnpm --filter @wahlen/web dev
```

## Struktur

```
apps/web           Next.js 15 Frontend (statischer Export)
packages/engine    Scoring-Engine (pure TS, framework-frei)
packages/schemas   Zod-Schemas + YAML-Content-Loader
content            parties/ · theses/ · positions/ (Git-versionierte Daten)
docs               Deviations, Methodik, ADRs
```

Regeln für Agents: ein Task = ein PR, Task-IDs aus `ROADMAP.md`, Content-PRs brauchen Schema-Validierung + Quellenangaben.
