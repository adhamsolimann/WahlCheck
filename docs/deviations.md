# Deviations from ROADMAP.md

Log of deliberate deviations so future agents don't "fix" them back.

| Date | Deviation | Reason | Related task |
|------|-----------|--------|--------------|
| 2026-08-23 | Storybook replaced by a `/design` showcase route in the app | Faster CI, fewer deps during 28-day crunch; primitives still visually verifiable | T-000d |
| 2026-08-23 | Lint runs at repo root via shared flat config instead of per-package `lint` scripts | Simpler; one config, same guarantee | T-000a |
| 2026-08-23 | Party colors are provisional placeholders | Official brand colors must be verified in content wave T-102 before launch | T-102 |
| 2026-08-23 | All seeded positions carry `verification: pending` | Quotes come from secondary sources (rbb24/tagesschau program checks); independent verification against official program PDFs is T-132's fact-check freeze | T-104/T-132 |
| 2026-08-23 | `B*` and `Die Heimat` Bezirkslisten districts not yet filled (`bezirke: []`) | District-level ballot details need verification from berlin.de Wahlvorschläge page | T-103 |
