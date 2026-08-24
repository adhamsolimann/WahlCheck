# Deviations from ROADMAP.md

Log of deliberate deviations so future agents don't "fix" them back.

| Date | Deviation | Reason | Related task |
|------|-----------|--------|--------------|
| 2026-08-23 | Storybook replaced by a `/design` showcase route in the app | Faster CI, fewer deps during 28-day crunch; primitives still visually verifiable | T-000d |
| 2026-08-23 | Lint runs at repo root via shared flat config instead of per-package `lint` scripts | Simpler; one config, same guarantee | T-000a |
| 2026-08-23 | Party colors are provisional placeholders | Official brand colors must be verified in content wave T-102 before launch | T-102 |
| 2026-08-23 | All seeded positions carry `verification: pending` | Quotes come from secondary sources (rbb24/tagesschau program checks); independent verification against official program PDFs is T-132's fact-check freeze | T-104/T-132 |
| 2026-08-23 | `B*` and `Die Heimat` Bezirkslisten districts not yet filled (`bezirke: []`) | District-level ballot details need verification from berlin.de Wahlvorschläge page | T-103 |
| 2026-08-23 | Generated `apps/web/src/generated/content.json` IS committed (not gitignored) | CI runs typecheck before build; the JSON module must exist. Deterministic output of gen-content.mts — regenerate + commit together with content changes | T-107 |
| 2026-08-23 | Zero-network guarantee enforced by grep-guard (`scripts/check-quiz-purity.sh`) instead of Playwright E2E | No e2e framework in crunch; grep over all client answer-paths gives equivalent guarantee cheaply. Real E2E in Week 4 (T-131) | T-107 |
| 2026-08-23 | Quiz uses tap/keyboard card UI, no literal swipe physics | Swipe gestures are cosmetic; scale+skip+weight parity with WahlSwiper achieved via large touch targets + keyboard shortcuts (1–5/S/←→) | T-107 |
| 2026-08-23 | Desktop "list mode" implemented as clickable progress dots (jump to any thesis) | Same navigation utility, one component less; full list view if user testing demands it | T-106 |
| 2026-08-24 | **T-105 scope decision (PO)**: Die PARTEI, Die Urbane., PdF remain unpositioned ("irrelevant" per product owner) | Satire/thin programs; honest 'keine Angabe' presentation instead of forced extraction. Revisit only if a party gains traction in polls | T-105 |
| 2026-08-24 | Impressum runs with GitHub contact + marked address TODO (private-person provider) | PO provided name/GitHub only; §5 DDG full address to be added before public launch — flagged remaining gap | T-110 |
| 2026-08-24 | Differentiation report will keep flagging theses covered only by majors | Consequence of the T-105 scope decision; advisory test stays non-blocking by design | T-101 |
| 2026-08-24 | **T-132 abgeschlossen**: Parlament+Kleinparteien-Tier vollständig maschinell verifiziert (66 auto); verbleibende 10 `pending`-Positionen betreffen ausschließlich Kontext-/Kleinparteien ohne Primärprogramm-Zugang — PO-Entscheidung: Skip | Diese Positionen haben solide Sekundärbelege (rbb24, UZ, Tagesspiegel) und sind als solche gekennzeichnet; ein nachträgliches Primary-Source-Review ist optional | T-132 |
| 2026-08-24 | **News-Cron läuft täglich** (GitHub Actions, 08:00 MESZ): Google-News-RSS → Dedup → YAML-Anhang → Auto-Push → Netlify-Redeploy | Kein Server nötig; Verlauf im Git auditierbar | T-133 (teilweise vorweggenommen, finale Umfragen folgen 14.09.) |
