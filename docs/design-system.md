# Design System — WahlCheck

Lebende Referenz für visuelle Sprache, Zustände und Bewegung.

**Designidee: „Amtlicher Stimmzettel trifft Berliner Redaktion."** Die
Oberfläche wirkt wie ein offizielles, gedrucktes Dokument — warmes Papier,
Tinten-Schwarz, Haarlinien — kombiniert mit moderner redaktioneller
Typografie. Die Signal-Farbe Koralle markiert ausschließlich das, was der
Nutzer selbst setzt (Antworten, Hervorhebungen, CTA).

---

## 1. Prinzipien

1. **Inhalt zuerst.** Bewegung und Farbe unterstützen das Lesen.
2. **Typografie trägt die Identität.** Space Grotesk (Display) + Inter
   (UI/Text) — self-hosted via `next/font`, keine Runtime-Abhängigkeit.
3. **`prefers-reduced-motion` wird immer respektiert.**
4. **Keine Layout-Shifts durch Animation.** Nur `opacity`/`transform`.
5. **Privat by design sichtbar machen.** Vertrauensaussagen stehen in der
   Fläche, nicht im Kleingedruckten.

---

## 2. Tokens

### Farben

| Token | Rolle |
|---|---|
| `ink-50…950` | Tinten-Grau-Skala: Text, Flächen, **primäre Buttons** (hell: `ink-900`, dunkel: invertiert weiß) |
| `accent-50…700` | Koralle: Nutzer-Marker, aktive Nav, Hervorhebungen, der eine CTA |
| `bg-paper` | Warmes Papier `#f7f6f3` als Seitenhintergrund (hell) |
| `tier-parliament/small/contextual` | Blau / Amber / Rose — Ergebnis-Gruppierung (unverändert) |

**Nicht verwenden:** Parteinahme über Farbe. Koralle ist bewusst keine
Parteifarbe im Berliner Stimmzettel-Spektrum.

### Typografie

| Klasse | Einsatz |
|---|---|
| `font-display` | Space Grotesk — Headlines, Buttons, Zahlen, Wortmarke |
| `kicker` | Versalien-Mikrolabel über Abschnitten (`11px · 0.18em tracking`) |
| Body | Inter über `--font-sans` (Tailwind-Default) |

Titel: `tracking-tight`, Zeilenführung 0.98–1.15 bei Display-Größen.
Prozentwerte/Zahlen: `tabular-nums`.

### Form & Fläche

- Radien: `rounded-lg` (Controls), `rounded-xl` (Karten) — scharf, nicht bubbly
- **Hairlines statt Schatten:** `border-ink-900/10` bzw. `dark:border-white/10`
- Karten sind flach; Hover-Hebung nur per `hoverable`-Prop (Interaktion erwartet)
- `dot-grid`-Utility: Punktraster-Textur für Hero/Footer-Flächen (dekorativ)
- Fokus: globaler Korallen-Outline (`:focus-visible` in globals.css)

### Marke / Favicon

`apps/web/src/app/icon.svg`: Tinten-Quadrat, weißer Stimmzettel, korallener
Haken. Die Wortmarke (SiteHeader `Wordmark`) kombiniert das Zeichen mit
Space-Grotesk-Schriftzug; „Check" immer Koralle. Header trägt einen
3-px-Korallen-Streifen als Wiedererkennungsmerkmal oben.

---

## 3. Bewegung

Unverändert: `animate-fade-up`, `animate-fade`, `animate-bar-x` — alle in
`@media (prefers-reduced-motion: no-preference)` gekapselt, Stagger via
`animation-delay` (40–120 ms).

---

## 4. Komponenten & Zustände

### Button
Varianten: `primary` (Tinte, im Dark Mode invertiert), `accent` (Koralle —
nur für die entscheidende Aktion), `secondary` (Outline), `ghost`.
Active: `scale-[0.98]`.

### Card
Flache Hairline-Fläche. `CardTitle` optional mit `index`-Prop für
nummerierte Kicker („01").

### StanceScale
Segmentband aus 5 Chips: gewählte Option voll Koralle mit Schatten,
Nachbarn leicht getönt, Achsen-Label darunter („Ablehnung ↔ Zustimmung").
Tastatur 1–5 weiter bedienbar.

### WeightSlider
Dünner Track, Ausgabe-Chip wird bei Wichtigkeit > 1× korall.

### Grafik-Interaktion
Unverändert: Nähe-basiertes Hover, Info-Zeile unter der Grafik,
bidirektionales Dimming.

---

## 5. Offene Punkte

- Share-Card-Generator (T-112) auf neue Marke umstellen
- OG-Image im neuen Look erzeugen
- Evtl. Scroll-Schatten am Header bei `scrollY > 0`
