# WahlCheck

**Parteiunabhängiger Wahlkompass** — aktuell für die [Berliner Abgeordnetenhauswahl am 20. September 2026](https://www.berlin.de/wahlen/).

> Der Wahl-O-Mat sagt dir, welche Partei am lautesten zustimmt.
> WahlCheck zeigt dir, wen du wirklich wählst — inklusive dem, was es dich kostet und was die Partei tatsächlich getan hat.

## Warum anders als der Wahl-O-Mat?

- **5-Punkt-Skala** statt Ja/Nein + persönliche Wichtigkeit **1–5×** statt fixer Doppelgewichtung
- **Thesen nach Wählersalienz**, nicht nach Parteien-Differenzierung (Wohnen bekommt den Raum, den die Stadt ihm gibt)
- **Jede Position mit wörtlichem Zitat** aus dem Wahlprogramm — inklusive ehrlichem „Keine Angabe“
- **Koalitionsrealität**: Welche Mehrheiten sind rechnerisch möglich — und wie gut passen sie zu dir?
- **Privat by design**: Antworten werden ausschließlich im Browser berechnet (Art. 9 DSGVO), es gibt keinen Serverpfad dafür

17 zugelassene Parteien · 38 Thesen · 10 Berliner Themen · [Methodik](docs/) offen dokumentiert.

## Entwicklung

```bash
corepack enable && pnpm install
pnpm dev            # http://localhost:3000
pnpm test           # Unit + Content-Integrität
pnpm build          # statischer Export → apps/web/out
pnpm e2e            # Playwright gegen den Produktions-Build
```

Struktur & Architektur: [`ROADMAP.md`](ROADMAP.md) · Deployment: [`docs/DEPLOY.md`](docs/DEPLOY.md) ·
Redaktionsregeln: Statut-Seite der App (`/statut`).

## Lizenz

Code: [AGPL-3.0](LICENSE) · Inhalte (`content/`): CC BY-SA 4.0
