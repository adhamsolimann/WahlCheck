#!/bin/sh
# T-107 Akzeptanzkriterium „zero network during quiz“:
# Client-Pfade mit Antwortdaten dürfen keinerlei Netzwerkcode enthalten.
# (Echte Playwright-E2E-Prüfung ist auf Woche 4 verschoben, siehe docs/deviations.md)
set -e

HITS=$(grep -RnE "fetch\(|XMLHttpRequest|sendBeacon|WebSocket|axios|EventSource" \
  apps/web/src/app/quiz \
  apps/web/src/app/results \
  apps/web/src/components/quiz \
  apps/web/src/lib \
  2>/dev/null || true)

if [ -n "$HITS" ]; then
  echo "FAIL: Netzwerkcode im client-seitigen Antwortpfad gefunden:"
  echo "$HITS"
  exit 1
fi

echo "✓ quiz purity: keine Netzwerkaufrufe in Quiz-/Ergebnispfaden"
