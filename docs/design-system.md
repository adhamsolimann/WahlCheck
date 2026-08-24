# Design System — WahlCheck

Lebende Referenz für visuelle Sprache, Zustände und Bewegung.
Demonstration einiger Primitive: `/design` in der laufenden App.

---

## 1. Prinzipien

1. **Inhalt zuerst.** Bewegung und Farbe unterstützen das Lesen, sie
   erzählen nie selbst die Hauptgeschichte.
2. **Bewegung sparsam und bedeutungsvoll.** Etwas bewegt sich, weil es
   erscheint, sich verändert oder Aufmerksamkeit lenken soll — nie als
   Deko-Schleife.
3. **`prefers-reduced-motion` wird immer respektiert.** Alle Animationen
   sind in `@media (prefers-reduced-motion: no-preference)` gekapselt;
   reduzierte Nutzer sehen sofortige Endzustände.
4. **Keine Layout-Shifts durch Animation.** Es animieren nur
   `opacity` und `transform` (plus `width` bei Fortschrittsbalken mit
   reserviertem Platz).
5. **Privat by design sichtbar machen.** Vertrauensbildende Aussagen
   („bleibt im Browser") sind Bestandteil der Oberfläche, nicht des
   Kleingedruckten.

---

## 2. Tokens

### Farben

| Token | Wert | Verwendung |
|---|---|---|
| `brand-50…900` | Indigo-Blau (#eef2ff → #1d2477) | Primäraktionen, aktive Nav, Fokus |
| `accent-400/500/600` | Koralle #f2826a / #e85d3b / #cc4728 | Unterstützen, Status-Banner, Nutzer-Marker auf Grafiken |
| `tier-parliament/small/contextual` | Blau / Amber / Rose | Ergebnis-Gruppierung |
| Neutral | Tailwind `zinc` | Flächen, Textabstufungen |

**Diagramm-Palette:** Die Landkarte nutzt eine dedizierte Kontrast-Palette
(`MAP_COLORS`, 17 Einträge) statt Markenfarben — Schwarz für CDU, Magenta
für Linke, Tieforange für BSW usw. Ziel ist paarweise Unterscheidbarkeit
auf hellem Grund; Markenfarben bleiben an anderer Stelle unberührt.

### Typografie & Raum

- Systemsans-Stack (`--font-sans`), keine Webfont-Abhängigkeit
- Größen über Tailwind-Skala (`text-xs` … `text-5xl`); Titel
  `tracking-tight`, Labels oben drüber `uppercase tracking-widest text-xs`
- Abstände in Vielfachen von 4 px; Sektionsrhythmus `space-y-8`

### Radius & Schatten

- Karten/Inputs: `rounded-xl`; Chips/Badges: `rounded-full`
- Ruhe: `shadow-sm` · Hover: `shadow-md` · Spotlight: `ring-1 ring-brand-300`

### Marke / Favicon

`apps/web/src/app/icon.svg` (Next-Dateikonvention → `/icon.svg`):
abgerundetes Quadrat, Grund `#1a1a1a`, rechte Hälfte `#3547ec`,
weißer Haken — bewusst grob formuliert, damit es ab 16 px lesbar bleibt.
Browser-Titelleisten-Farbe via `viewport.themeColor` (hell/dunkel).

---

## 3. Bewegung

### Keyframes (definiert in `globals.css`)

| Klasse | Keyframe | Dauer/Easing | Einsatz |
|---|---|---|---|
| `.animate-fade-up` | `wc-fade-up` (Opazität + 10px Y) | 550 ms `cubic-bezier(.16,1,.3,1)` | Sektionseintritte, Quizkarten |
| `.animate-fade` | `wc-fade` | 350 ms ease-out | Hemicycle-Sitze, Fragenwechsel |
| `.animate-bar-x` | `wc-bar` (`scaleX(0→1)`, origin-left) | 800 ms | Prozent-Balken in Ergebnissen |

Stagger: `animation-delay` inline in 40–80 ms Schritten
(z. B. `[animation-delay:120ms]`, Hemicycle `i*6ms`, gedeckelt bei 600 ms).

### Do / Don't

- ✅ Eintritt, Zustandswechsel, Fortschritt, Hover-Tiefe
- ❌ Endlosschleifen außer dem Puls des Nutzer-Markers,
  Parallax, alles was Lesetext bewegt

---

## 4. Komponenten & Zustände

### Button
`transition duration-150` + Hover `-translate-y-px`, Active `scale-[0.97]`.
Varianten: primary (brand), secondary (Outline), ghost; Größen sm/md/lg.

### Card
Ruhe: `border-zinc-200 shadow-sm`. Hover: `-translate-y-0.5`,
`border-zinc-300 shadow-md` (200 ms). Spotlight-Variante (Bestes Match):
`border-2 border-brand-600 ring-1 ring-brand-300` + Eckbadge.

### StanceScale / WeightSlider
Auswahl = gefüllter Brand-Chip; Skala per Tastatur 1–5 bedienbar;
Slider-Ausgabe zeigt „n×" live.

### Grafik-Interaktionsmuster
- **Nähe statt Zonen**: Hover wird über den nächstgelegenen Datenpunkt
  berechnet (Hemicycle & Landkarte) — keine toten Winkel, kein Flackern.
- **Info unter der Grafik**, nicht darüber schwebend: reservierte Zeile
  (`aria-live="polite"`) mit Farb-Punkt + Name; nichts kann abgeschnitten
  werden.
- **Bidirektionales Dimming**: Liste ↔ Grafik heben sich gegenseitig
  hervor (Opacity 0.25–0.4 für Nicht-betroffene).

---

## 5. Neue Utility-Klassen (Kurzreferenz)

```
animate-fade-up   Sektions-/Karteneintritt (staggerbar via [animation-delay:…])
animate-fade       sanfter Wechsel (Fragenwechsel, Sitzpunkte)
animate-bar-x      Balken füllt sich von links (Ergebnisse)
```

Alle drei respektieren `prefers-reduced-motion`.

---

## 6. Offene Punkte

- Dunkelmodell-Kontraste der Diagramm-Palette prüfen (Karten-Hintergrund
  bleibt hell; Punkte sind dort gut lesbar)
- Leichte-Sprache-Variante der Landingpage
- Evtl. Scroll-Schatten am Header (nur bei `scrollY > 0`)
