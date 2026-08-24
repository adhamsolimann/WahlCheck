# Deployment

Der Build erzeugt einen vollständig statischen Export in `apps/web/out` —
jeder statische Host funktioniert. Kein Server, keine Datenbank, keine
Umgebungsvariablen.

## Vorbereitung (einmalig)

```bash
pnpm install
pnpm build          # erzeugt apps/web/out
pnpm e2e            # Smoke-Tests gegen den Produktions-Build
```

## Option A — Vercel

1. Repo auf GitHub pushen.
2. vercel.com → *Add New Project* → Repo importieren.
3. Framework Preset: **Next.js** (Vercel erkennt `output: "export"` automatisch).
4. Deploy. Fertig.

## Option B — Netlify

`netlify.toml` liegt im Repo:

1. Repo pushen.
2. app.netlify.com → *Add new site* → *Import an existing project*.
3. Deploy. Fertig.

## Option C — Cloudflare

### C1: Workers mit Static Assets (empfohlen, Konfiguration liegt im Repo)

`wrangler.jsonc` ist committet (Assets-only, kein Worker-Script).

**Per Dashboard (Git-Integration):**
- Build command: `pnpm install --frozen-lockfile && pnpm build`
- **Root directory: leer lassen** (Repo-Wurzel!) — der Fehler
  „application detection … root of a workspace" entsteht nur, wenn
  Cloudflare ohne `wrangler.jsonc` raten muss oder das Root-Verzeichnis
  auf `apps/web` gesetzt wird, wo pnpm-Workspace-Auflösung scheitert.
- Deploy command: `npx wrangler deploy`

**Per CLI lokal:**
```bash
pnpm build && npx wrangler deploy
```

### C2: Cloudflare Pages (klassisch)

- Framework preset: **None** (wichtig — „Next.js" löst die Monorepo-
  Erkennung aus, die den Fehler wirft)
- Build command: `pnpm install --frozen-lockfile && pnpm build`
- Output directory: `apps/web/out`

## Wichtig für alle Anbieter (Monorepo)

Niemals das Root-/Quellverzeichnis auf `apps/web` stellen — dort kann
pnpm die Workspace-Pakete (`@wahlen/engine`, `@wahlen/schemas`) nicht
auflösen. Immer Repo-Wurzel + explizite Build/Output-Pfade.

## Option D — Eigener Host / Objekt-Storage

```bash
pnpm build
rsync -avz --delete apps/web/out/ user@host:/var/www/wahlcheck/
```

Der Inhalt ist selbstversorgend (`trailingSlash: true`, relative Assets) —
nginx, Caddy oder ein S3-Bucket mit Static-Hosting genügen.

## Nach dem Deploy prüfen

- [ ] `/quiz/`, `/results/`, `/koalition/`, `/aenderungen/` erreichbar (Clean-URLs)
- [ ] Ko-Fi-Overlay lädt auf der Startseite
- [ ] Quiz durchspielen → Reload → Antworten persistiert (localStorage)
- [ ] Impressum: vollständige Anschrift ergänzt (Rechtsvoraussetzung)
