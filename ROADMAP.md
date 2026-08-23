# WAHLEN — Berlin Abgeordnetenhauswahl 2026 Edition

> **Target event:** Wahl zum 20. Abgeordnetenhaus von Berlin — **Sonntag, 20.09.2026**
> **Today:** Sun 23.08.2026 → **28 days to election.** Postal-vote documents have been shipping since 10.08. — every day of delay loses voters who have already voted.
>
> **Document purpose:** Master execution roadmap. Tasks (`T-xxx`) are written so autonomous coding agents can implement them one PR per task without further context. Post-election/federal vision in §10.
>
> **Working title:** `WahlCheck Berlin` (alternatives: KiezKompass, WahlLotse, MandatMatch — decision D-1, blocks branding only, not development)

---

## 1. Election Facts Box (single source of truth for all content agents)

| Item | Fact |
|---|---|
| Election | 20. Abgeordnetenhaus von Berlin |
| Date | So., 20.09.2026, 8–18 Uhr |
| Eligibility | German citizens, ≥16 years old, ≥30 days primary residence in Berlin |
| Votes cast | 2: Erststimme (Direktkandidat in 1 of 78 Wahlkreise), Zweitstimme (decides seat distribution). Same day: BVV elections in all 12 districts |
| Parliament | min. 130 seats, majority = 66 |
| Threshold | 5% of Zweitstimmen statewide (post-2020 law; verify Landeswahlgesetz nuance re: Direktmandate before shipping coalition math — see T-222) |
| Ballot parties (17, confirmed 24.07.2026 by Landeswahlausschuss) | **Landeslisten (12):** AfD, GRÜNE, BSW, DKP, Die Urbane. (HipHop-Partei), FDP, ÖDP, PdF (Partei des Fortschritts), Die PARTEI, Tierschutzpartei, SGP, Volt · **Bezirkslisten (5):** SPD, CDU, Die Linke (all berlinweit); B* (bergpartei) & Die Heimat (individual Bezirke only) |
| Failed qualification (do NOT include) | Piraten, Freie Wähler, dieBasis, MERA25 |
| Polls (weighted trend, ~22.08.2026, PolitPro/dawum) | Linke 19.9 · CDU 19.3 · AfD 17.6 · Grüne 16.6 · SPD 13.2 · BSW 3.1 · FDP 3.1 · Sonstige 7.2 |
| Projected parliament | Linke 30, CDU 29, AfD 26, Grüne 25, SPD 20 seats; incumbent CDU–SPD would lose majority; BSW & FDP below 5% |
| Top campaign issues (salience) | 1. Wohnen/Mieten (dominant), 2. Arbeit & Soziales, 3. Sicherheit, 4. Bildung, 5. Haushaltsnotlage/Finanzen, then Migration, Mobilität, Verwaltung, Klima/Hitzeschutz |
| Program sources | Official Wahlprogramme PDFs (SPD, Linke, CDU, Grüne, AfD, FDP, BSW …) + rbb24/tagesschau program comparisons + Tagesspiegel 16-topic AI analysis |

---

## 2. Why Users Switch From Wahl-O-Mat (differentiators — unchanged from research phase)

| # | Wahl-O-Mat weakness | Our answer |
|---|---|---|
| W1 | Hidden youth tool (under-26 editorial team; ~90% of users are 30+) | Salience-driven theses reflecting ALL age groups' priorities |
| W2 | Theses chosen for inter-party differentiation, not citizen relevance | Topic weights follow public salience surveys (Wohnen #1 gets proportional coverage) |
| W3 | Binary Ja/Nein/Neutral | 5-point Likert scale |
| W4 | Only 2× importance weighting | Continuous 1–5× slider |
| W5 | "Neutral" party stances distort scores | Neutral scores 0.5 credit; skipped theses fully excluded both sides |
| W6 | Manifesto promises only | Bilanz layer where applicable (post-election: roll-call data; pre-election: governing-record notes per party) |
| W7 | Single-issue micro-parties rank artificially high | Tiered result presentation + "keine Angabe" honesty handling |
| W8 | No extremism dimension | Democratic-context framing; sourced classification notes where legally safe |
| W9 | Zero personalization | Persona quick-starts (Mieter:in, Familie, Studierende, Senior:in, Selbstständige:r) |
| W10 | One-shot experience | Party library, comparison view, coalition realism, share cards |
| W11 | Editorial opacity | Published methodology + correction log from day 1 |

---

## 3. MVP Scope Decision (crunch-adjusted)

### In scope for 20.09.2026 (must-have)
1. Thesis matching engine — **~36 theses**, 5-point scale + skip + 1–5× weighting, 100% client-side
2. Results: % match ranking, tier groups, per-thesis drill-down (user ↔ party stance ↔ cited justification quote)
3. Party library: all 17 ballot parties (structured profiles; small parties may have reduced profiles — flagged honestly)
4. 2D political map (economic × socio-cultural)
5. Quick mode (~15 theses) / Full mode toggle
6. Persona quick-starts (preconfigured weight profiles, no personal questions required)
7. Share-image generator (client-side canvas)
8. Methodology, Datenschutz, Impressum, editorial statute (short form)
9. Simple coalition context ("Wer kann regieren?" — static analysis based on latest poll aggregate, updated weekly by script)
10. Donation page (external provider link only — zero custom payment code)

### Explicitly deferred (post-election backlog, §10)
Financial simulator, AI manifesto chat, roll-call integration, EN/multilingual UI, Wahlkreis/candidate finder, BVV guide, classroom mode, researcher API, Wahl-O-Mat import.

---

## 4. Architecture (unchanged constraints)

- **Art. 9 GDPR**: answers = political opinions → compute in browser, persist `localStorage` only, zero answer transmission (E2E test asserts no POST during quiz). Cookieless analytics (Plausible/Matomo self-host, aggregates only).
- **TTPW-VO**: no paid political ads ever; donations-only monetization pre-election.
- **Stack**: Next.js 15 App Router + TypeScript + Tailwind; static-export-first; scoring as framework-free TS lib `packages/engine`; content as Git-versioned YAML validated by Zod schemas (`packages/schemas`).
- **License**: AGPL-3.0 code, CC BY-SA 4.0 content.
```
/apps/web          frontend
/packages/engine   scoring (pure TS)
/packages/schemas  Zod schemas
/content           parties/*.yaml · theses/*.yaml · positions/*.yaml · glossary/
/docs              methodology, statute, decisions
```
Scoring formula: `match = Σ(w_i × agree_i) / Σ(w_i × maxAgree) ×100` over answered theses; skipped excluded both sides; party-neutral = 0.5 credit; results always show N answered + confidence band. Missing party position ("keine Angabe") excludes that thesis for that party only and is displayed transparently.

---

## 5. Content Pipeline — the critical path

Thesis pool (~36) ordered by citizen salience. Each thesis needs: neutral formulation, rationale, source refs, and per-party stances with verbatim justification quotes. Wording agents MUST cite program passages; rbb24/tagesschau program-comparison articles serve as secondary verification.

**Wohnen (9)** — Vergesellschaftung großer Wohnungskonzerne umsetzen · Mietendeckel für landeseigene Wohnungsunternehmen · Randbebauung Tempelhofer Feld · Grundsteuer C für baureife Brachen · kooperatives Baulandmodell mit 50%-Sozialwohnungsquote · Privatisierungsverbot landeseigener Wohnungen in der Verfassung · Förderung von Wohneigentum/Mietkauf · Vorrang „Einheimischer" bei gefördertem Wohnraum · kommunaler Neubau bis zu 2 Mrd. €/Jahr
**Haushalt & Finanzen (4)** — Investitionen über neue Schulden/Sondervermögen · Grundsteuer abschaffen · höhere Besteuerung hoher Einkommen im Land · Verwaltungsabbau zur Konsolidierung
**Arbeit & Soziales (4)** — Tarifbindung/Mindestlohn im Landesdienst stärken · Existenzsichernde Grundsicherung gegen Sanktionen · Kita gebührenfrei für alle · Hitzeschutzprogramme für obdachlose Menschen
**Bildung (3)** — Schulbauoffensive beschleunigen · bessere Bezahlung/Rekrutierung von Lehrkräften · ausgebauter Ganztag vs. gegliedertes Schulsystem
**Sicherheit (3)** — mehr Polizeipersonal · erweiterte Videoüberwachung/Befugnisse · Begrenzung polizeilicher Eingriffsbefugnisse
**Migration (3)** — Abschiebungen erleichtern · Notunterkünfte durch dezentralen Wohnraum ersetzen · Integrationsangebote ausbauen
**Mobilität (4)** — A100-Verlängerung stoppen · Tempo 30-Hauptverkehrsstraßen/Autoreduzierungen · ÖPNV-Ausbau & Tarifreform (z.B. Sozialticket) · Radverkehrsausbau priorisieren
**Klima (3)** — Klimaneutralität Berlin spätestens 2045 · Netto-Null-Neuversiegelung · verbindliche Hitzeschutz-/Klimaanpassungspläne
**Verwaltung & Digital (2)** — Ämter digitalisieren (Termin/Anträge online) · öffentliches Personal aufbauen statt abbauen
**Stadtgesellschaft (3)** — Club-/Nachtförderung als eigenes Ressort/Fonds · queere Gesundheitsversorgung ausbauen · Sauberkeit/Ordnungsämter verstärken
*(Total: 38 — agents trim to 36 during review; every thesis must differentiate ≥3 major parties)*

**Quick-mode set (15):** pick top-salience theses across Wohnen(4), Arbeit&Soziales(2), Sicherheit(2), Bildung(1), Haushalt(2), Mobilität(2), Klima(1), Migration(1).

---

## 6. Sprint Plan (day-level, agents implement one task per PR)

### Sprint 0 — today (Sun 23.08)
| ID | Task | Output |
|----|------|--------|
| T-000a | Repo init per §4 layout, CI skeleton (build+lint+test) | green CI |
| T-000b | Zod schemas + sample YAML fixtures | schema tests pass |
| T-000c | Scoring engine + golden tests (incl. adversarial: all-skip, all-neutral-user, single-thesis, missing-party-position cases) | ≥95% coverage |
| T-000d | Design tokens + core components (card, slider, button, layout) | Storybook renders |

### Week 1 (Mo 24. – So 30.08) — content + shell
| ID | Task | Acceptance criteria | Deps |
|----|------|--------------------|------|
| T-101 | Thesis YAML: 38 drafts w/ rationale + sources | schema-valid; differentiation check scripted | T-000b |
| T-102 | Major-party profiles: SPD, CDU, Grüne, Linke, AfD, FDP, BSW, Volt (full fields incl. funding summary, leadership, program PDF links) | every field source-linked | T-000b |
| T-103 | Minor-party profiles: ÖDP, PdF, Die PARTEI, Tierschutzpartei, DKP, SGP, Die Urbane., B*, Heimat (reduced profile allowed, flagged) | same | T-102 |
| T-104 | Positions extraction wave 1 (major parties × all theses) with quotes | 100% coverage major parties; quote ≤400 chars each | T-101, T-102 |
| T-105 | Positions wave 2 (minor parties; `null` = keine Angabe permitted) | coverage documented per party | T-104 |
| T-106 | Onboarding + mode select + persona picker UI | <30s to first thesis; keyboard operable | T-000d |
| T-107 | Quiz runner: swipe cards (mobile) + list mode (desktop); 5-point scale, skip, weight slider; localStorage persistence; zero network calls during quiz (E2E assert) | axe-core clean | T-106, T-000c |

### Week 2 (Mo 31.08 – So 06.09) — results + library + legal
| ID | Task | Acceptance criteria | Deps |
|----|------|--------------------|------|
| T-108 | Results view: ranked match, tier grouping (parliament-relevant/small/contextual), expandable per-thesis comparison | renders for all 17 parties incl. keine-Angabe states | T-107, T-104/105 |
| T-109 | Party library directory + detail pages | deep-linkable; program PDFs linked | T-102/103 |
| T-110 | Static pages: Methodik (thesis-selection criteria + formula + limitations), Datenschutz, Impressum, Redaktionsstatut, Über uns | legal checklist §7 drafted | T-000a |
| T-111 | 2D political map (axes derivation documented; parties + user plotted) | responsive; methodology doc | T-000c, T-104 |
| T-112 | Share-image generator (canvas, client-side only) | correct for arbitrary results; alt text | T-108 |

### Week 3 (Mo 07.09 – So 13.09) — depth + SOFT LAUNCH
| ID | Task | Acceptance criteria | Deps |
|----|------|--------------------|------|
| T-121 | Coalition context module: static page w/ latest poll aggregate (committed JSON, weekly refresh script), threshold math (5%), feasible coalitions list, "your realistic option" overlay linking results↔coalitions | math verified against 2021/2023 Berlin cases; Landeswahlgesetz nuance checked w/ counsel note | T-108 |
| T-122 | Deploy pipeline: EU static hosting, preview envs, Lighthouse gate (perf≥90, a11y≥95) | production URL live | T-107–112 |
| T-123 | Donations page (external provider: betterplace/OpenCollective link + transparency blurb) | zero custom payment code; GDPR-clean embed | T-110 |
| T-124 | Ethical analytics (Plausible/Matomo, cookieless, funnel events: start/quiz-half/finish/share) | no IP storage; events fire | T-122 |
| T-125 | **SOFT LAUNCH** Thu 10.09: friends/community circles, feedback widget, bug triage rota | ≥500 sessions; P0 bugs <48h fix SLA | T-122 |

### Week 4 (Mo 14.09 – So 20.09) — hardening + LAUNCH
| ID | Task | Acceptance criteria | Deps |
|----|------|--------------------|------|
| T-131 | A11y + perf pass (fix audit findings; BITV quick-test) | Lighthouse a11y≥95 sustained | all |
| T-132 | Content fact-check freeze: independent reviewer verifies all quotes against program PDFs | sign-off recorded in `/docs/review-log` | T-104/105 |
| T-133 | Poll-refresh final coalition update (Mon 14.09) | data JSON updated + changelog entry | T-121 |
| T-134 | Press kit + social assets + outreach (rbb, Tagesspiegel, taz, student orgs, Mieterverein newsletters) | kit published; 20 contacts pitched | T-125 |
| T-135 | Load test + status page + incident playbook | handles 50k sessions/day burst | T-131 |
| T-136 | **PUBLIC LAUNCH Mo 15.09** + daily maintenance through election night; Wahlabend live page (static, results link-out) | uptime; hotfix rota staffed | T-134 |

Post-election (from 21.09): survey users, publish corrections/transparency report, begin §10 build-out.

---

## 7. Legal Minimum Gates (blocking, compressed)
- [ ] Impressum + Datenschutzerklärung live before public launch (§5 DDG; Art. 13/14 GDPR; TOM doc)
- [ ] No cookies/trackers requiring consent (cookieless stack verified)
- [ ] Editorial statute (short form): neutrality commitments, thesis criteria, correction policy — published
- [ ] Counsel review of contextual labels for anti-system parties (Die Heimat is Verfassungsschutz-relevant; DKP/SGP framing care) before tier copy ships
- [ ] Financial disclaimers n/a (simulator deferred); coalition page carries polling-source disclaimer
- [ ] Name/trademark quick-clear (D-1)

## 8. Monetization (crunch version → full model post-election)
**Now (Week 3, T-123):** single donation page via external provider (betterplace.org/OpenCollective), transparency blurb, no receipts infrastructure yet. Post-result supporter prompt (non-intrusive, dismissible).
**After election (see §10):** e.V./gGmbH route for Zuwendungsbestätigungen, foundation grants (Prototype Fund, Mercator…), white-label licensing — target mix 50/35/10/5 (donations/grants/B2B/merch). Never: political ads (TTPW-VO), party money, data sales, paywalling results.

## 9. KPIs (pilot targets)
≥150k sessions by 19.09. · quiz completion ≥60% · median theses answered ≥22 (full mode) · neutrality perception ≥85% (exit survey) · donor conversion ≥0.3% · zero upheld position-misrepresentation complaints.

## 10. Post-Election Roadmap (toward Bundestagswahl 2029 — condensed)
1. **Oct–Dec 2026:** retro + corrections report; refactor content pipeline into multi-election config; add roll-call ingestion (bundestag.de open data) → Bilanz layer; financial simulator engine (validated vs. BMF calculators).
2. **2027:** pilot at Landtagswahlen; RAG manifesto assistant (cited, refusal path); EN + TR/AR/RU/PL i18n; Wahlkreis finder; BVV/local editions; classroom mode; researcher API; donations infra w/ receipts (e.V. established).
3. **2028:** federal content build-out (29+ parties expected), load testing, partnerships (universities, media), grant-funded fact-check sprints.
4. **Feb/Mar 2029:** Bundestagswahl GA — full feature set from original vision (nuanced matching + finance + bilanz + coalition realism + cited AI + multilingual).

## 11. Open Decisions (non-blocking except where noted)
| ID | Decision | Owner | Deadline |
|----|----------|-------|----------|
| D-1 | Name/domain (blocks branding only) | PO | 26.08 |
| D-2 | Hosting provider (EU static) | eng | 29.08 |
| D-3 | Anti-system party labeling approach (blocks T-108 copy) | PO+counsel | 05.09 |
| D-4 | Donation provider choice | PO | 05.09 |
| D-5 | Analytics tool (Plausible vs. Matomo self-host) | eng | 29.08 |

---
*Agents: start at T-000a. §4 constraints are immutable without an ADR in `/docs/adr/`. Every content PR requires schema validation + source links. Quote accuracy beats completeness — "keine Angabe" is always acceptable.*
