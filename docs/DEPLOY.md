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

## Option C — Cloudflare Pages

1. Repo pushen.
2. pages.cloudflare.com → Projekt anlegen:
   - Build command: `pnpm build`
   - Build output directory: `apps/web/out`
3. Deploy. Fertig.

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
