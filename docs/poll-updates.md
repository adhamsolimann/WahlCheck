# Wahltrend-Aktualisierung (wöchentlich)

Der Koalitionsmodus basiert auf einem manuell gepflegten Snapshot:
`content/polls/berlin-2026.yaml`.

## Ablauf (jeweils freitags, letzte Aktualisierung: T-133 am 14.09.2026)

1. Werte der neuen Einzelumfragen eintragen (`polls:`-Array ergänzen;
   Quellen: dawum.de, politpro.eu/de/berlin, wahlrecht.de — URL pro Eintrag
   angeben).
2. `aggregate.trend` auf den neuen gewichteten Mittelwert setzen. Quelle für
   den Referenzwert: PolitPro-Wahltrend; eigene Neuberechnung nur mit
   dokumentierter Methode.
3. `aggregate.updatedAt` setzen.

## Validierung

```bash
pnpm --filter @wahlen/web exec tsx ../../scripts/gen-content.mts
pnpm test   # Engine-Anchortest prüft Sitzprojektion gegen veröffentlichte Werte
```

Schlägt der Anchortest fehl, weicht die eingetragene Trend-Kombination von der
veröffentlichten Sitzprojektion ab → Daten oder Projektionsreferenz prüfen,
bevor committet wird.

## Regeln

- Keine Institute erfinden; jeder Eintrag braucht eine erreichbare URL.
- „Sonstige“ bleibt eigener Key `sonstige` und erhält nie Sitze.
- Änderungen am Snapshot werden im Commit sichtbar (kein Überschreiben
  historischer Einträge im `polls`-Array).
