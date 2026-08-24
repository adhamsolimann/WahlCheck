# Faktencheck-Checkliste (T-132)

> Generiert am 2026-08-24 durch `scripts/gen-factcheck.mts` — NICHT manuell editieren.
> Status wird ausschließlich in `content/positions/*.yaml` gepflegt (`verification: verified`),
> danach Skript erneut ausführen und beides zusammen committen.

## Gesamtstand

| Tier | Offen | 🤖 auto | ✅ verified |
|------|------:|-------:|----------:|
| gesamt | **91** | 77 | 0 |

**Freigabe-Regel (Freeze-Gate):** Bei allen Positionen der Tier-Stufen `parliament` und `small` darf nach dem Freeze kein `pending` mehr übrig sein. `auto` genügt (maschineller Wortgleichheits-Nachweis); eine stichprobenartige menschliche Kontrolle von ~20 % der auto-Treffer wird empfohlen.

## Arbeitsablauf je Position

1. Programm-PDF öffnen (Link in der Parteisektion).
2. Passage suchen und prüfen: (a) Zitat wortgleich? (b) trifft unsere
   Haltungs-Skala (−2…+2) den Sinn? (c) Quellenangabe korrekt?
3. Ergebnis umsetzen:
   - ✅ passt → in der YAML `verification: verified` setzen
   - ✏️ Zitat ungenau → Zitat/S. korrigieren, dann verified setzen
   - ⬇️ nicht belegbar → Status auf `none`, stance `null`, Grund in Notiz
4. Nach jeder Partei: Skript ausführen + `pnpm test` (Cross-Ref-Integrität),
   committen (`content` + `docs/factcheck-checklist.md` gemeinsam).

## Werkzeuge

```bash
pipx install pypdf          # oder: brew install poppler (pdftotext)
python3 - <<'EOF'
from pypdf import PdfReader
r = PdfReader("programm.pdf")
print("\n".join(p.extract_text() for p in r.pages[:3]))
EOF
```

---

### AfD — 11 offen · 6 🤖 maschinell · 0 ✅ menschlich

Programm: **kein Link hinterlegt**

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| 🤖 | Die Grundsteuer in Berlin soll vollständig abgeschafft werd… | +2 | „Sie will die Grundsteuer abschaffen sowie Wohneigentum durch Steuerbefreiungen und Bürgsc…“ | rbb24 Wohnungs-Check (08/2026) | |
| ☐ | Der Personalschlüssel in Berliner Kitas soll verbessert und… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Notunterkünfte für Geflüchtete sollen abgeschafft und durch… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Bauämter und Genehmigungsverfahren sollen konsequent digita… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Abgelehnte Asylbewerberinnen und Asylbewerber sollen konseq… | +2 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| 🤖 | Der Erwerb selbstgenutzten Wohneigentums soll durch Zuschüs… | +1 | „Sie will die Grundsteuer abschaffen sowie Wohneigentum durch Steuerbefreiungen und Bürgsc…“ | rbb24 Wohnungs-Check (08/2026) | |
| ☐ | Berlin soll schrittweise zur Gemeinschaftsschule übergehen,… | -1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Berlin soll zusätzliche Investitionen in Wohnen, Infrastruk… | -1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Berlin soll sein Klimaneutralitätsziel spätestens 2045 erre… | -2 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Die zwölf Berliner Bezirke sollen mehr Entscheidungskompete… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| 🤖 | Berlin soll deutlich mehr Polizistinnen und Polizisten eins… | +2 | „Nur die AfD schrieb fast genauso viel darüber [wie die CDU].“ | Tagesspiegel – Sieben Wahlprogramme, 16… | |
| 🤖 | Für die landeseigenen Wohnungsunternehmen soll ein Mietende… | -2 | „Die AfD fordert eine grundsätzliche Abkehr von starker Mietregulierung und lehnt Enteignu…“ | rbb24 Wohnungs-Check (08/2026) | |
| ☐ | Zur Sanierung des Haushalts soll das Personal in der Berlin… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Günstige Sozialtickets sollen ausgebaut und der öffentliche… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Bei großen privaten Bauprojekten soll die Hälfte der Wohnun… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| 🤖 | Die Wohnungsbestände großer, renditeorientierter Wohnungsko… | -2 | „Die AfD fordert eine grundsätzliche Abkehr von starker Mietregulierung und lehnt Enteignu…“ | rbb24 Wohnungs-Check (08/2026) | |
| 🤖 | Geförderter Wohnraum soll bevorzugt an Menschen vergeben we… | +2 | „Geförderter Wohnraum soll bevorzugt an Berliner vergeben werden, die hier geboren sind od…“ | rbb24 Wohnungs-Check (08/2026) | |

---

### CDU — 21 offen · 5 🤖 maschinell · 0 ✅ menschlich

Programm: **kein Link hinterlegt**

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| ☐ | Die Videoüberwachung in öffentlichen Räumen (z. B. Bahnhöfe… | +2 | „An bekannten Kriminalitaetsschwerpunkten kommen nun verstaerkt Videoueberwachung und Waff…“ | CDU Berlin – Regierungsprogramm 2026-20… | |
| ☐ | Polizeiliche Eingriffsbefugnisse (z. B. Einsatz von Stanzer… | -1 | „Aufweichen des Polizeigesetzes und weniger Befugnisse fuer die Polizei [wird abgelehnt].“ | CDU Berlin – Regierungsprogramm 2026-20… | |
| ☐ | Der Personalschlüssel in Berliner Kitas soll verbessert und… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Bauämter und Genehmigungsverfahren sollen konsequent digita… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Abgelehnte Asylbewerberinnen und Asylbewerber sollen konseq… | +2 | „Die bestehenden Instrumente des Ausreisegewahrsams und der Abschiebungshaft sind staerker…“ | CDU Berlin – Regierungsprogramm 2026-20… | |
| 🤖 | Der Erwerb selbstgenutzten Wohneigentums soll durch Zuschüs… | +1 | „Fördern will die CDU nicht nur den Bau von Sozialwohnungen, sondern auch selbstgenutztes …“ | rbb24 Wohnungs-Check (08/2026) | |
| ☐ | Berlin soll schrittweise zur Gemeinschaftsschule übergehen,… | -1 | „Zum bewaehrten gegliederten Schulsystem Berlins. Die Vielfalt der Schulformen ermoeglicht…“ | CDU Berlin – Regierungsprogramm 2026-20… | |
| ☐ | Unbebaute, aber baureife Grundstücke sollen mit einer Grund… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Berlin soll zusätzliche Investitionen in Wohnen, Infrastruk… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Berlin soll einen Heizkostenfonds einrichten, aus dem einko… | -1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Berlin soll sein Klimaneutralitätsziel spätestens 2045 erre… | +1 | „Die Dekarbonisierung der Fernwaerme ist zugleich ein entscheidender Schluessel fuer die K…“ | CDU Berlin – Regierungsprogramm 2026-20… | |
| ☐ | Die zwölf Berliner Bezirke sollen mehr Entscheidungskompete… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Berlin soll deutlich mehr Polizistinnen und Polizisten eins… | +1 | „Polizistinnen und Polizisten konsequent von Buerokratie entlasten, damit sie sich wieder …“ | CDU Berlin – Regierungsprogramm 2026-20… | |
| 🤖 | Für die landeseigenen Wohnungsunternehmen soll ein Mietende… | -2 | „Ein dauerhaftes Privatisierungsverbot von Wohnungen lehnt die CDU ab, ebenso wie eine sta…“ | rbb24 Wohnungs-Check (08/2026) | |
| ☐ | Zur Sanierung des Haushalts soll das Personal in der Berlin… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Der Radverkehrsausbau (geschützte Radwege, Radvorrang) soll… | +1 | „Radwege sicher und zuverlaessig nutzbar machen. Wir werden den Berliner Radverkehrsplan u…“ | CDU Berlin – Regierungsprogramm 2026-20… | |
| 🤖 | Ein dauerhaftes Privatisierungsverbot für landeseigene Wohn… | -2 | „Ein dauerhaftes Privatisierungsverbot von Wohnungen lehnt die CDU ab.“ | rbb24 Wohnungs-Check (08/2026) | |
| 🤖 | Die Randbereiche des Tempelhofer Feldes sollen mit Wohnunge… | +2 | „Bis 2031 sollen 100.000 neue Wohnungen entstehen, unter anderem auch durch die Randbebauu…“ | rbb24 Wohnungs-Check (08/2026) | |
| ☐ | Behördengänge (Anträge, Bescheinigungen, Termine) sollen fl… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Berliner Clubs und die Nachtwirtschaft sollen durch Spielst… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Günstige Sozialtickets sollen ausgebaut und der öffentliche… | +1 | „Unser Anspruch ist ein zuverlaessiger, leistungsfaehiger und attraktiver OEPNV. Wir unter…“ | CDU Berlin – Regierungsprogramm 2026-20… | |
| ☐ | Bei großen privaten Bauprojekten soll die Hälfte der Wohnun… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Vergabe öffentlicher Aufträge und Fördermittel soll an Tari… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Tempo 30 soll flächendeckend auch auf Hauptverkehrsstraßen … | -2 | „[Wir lehnen] Kulturkampf gegen das Auto, Flaechendeckendes Tempo 30, Verkehrspolitik zula…“ | CDU Berlin – Regierungsprogramm 2026-20… | |
| 🤖 | Die Wohnungsbestände großer, renditeorientierter Wohnungsko… | -2 | „Die CDU lehnt die Vergesellschaftung von Wohnungen privater Konzerne ab und setzt stattde…“ | rbb24 Wohnungs-Check (08/2026) | |
| ☐ | Geförderter Wohnraum soll bevorzugt an Menschen vergeben we… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |

---

### Die Linke — 16 offen · 9 🤖 maschinell · 0 ✅ menschlich

Programm: https://dielinke.berlin/fileadmin/download/2026/0106_Wahlprogramm_LVB_A5.pdf

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| 🤖 | Die Umlage von Modernisierungskosten auf die Mieterinnen un… | +2 | „Die Modernisierungsumlage wollen wir abschaffen.“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| ☐ | Der Personalschlüssel in Berliner Kitas soll verbessert und… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Bauämter und Genehmigungsverfahren sollen konsequent digita… | -1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| 🤖 | Die Vermietung von möbliertem Wohnraum auf Zeit soll rechtl… | +1 | „Abzocke mit möblierten Wohnungen beenden und die großen Immobilienkonzerne vergesellschaf…“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| ☐ | Abgelehnte Asylbewerberinnen und Asylbewerber sollen konseq… | -2 | „https://dielinke.berlin/partei/wahlen/abgeordnetenhauswahlen-2026/“ | … denn jede Abschiebung ist eine Abschi… | |
| ☐ | Berlin soll schrittweise zur Gemeinschaftsschule übergehen,… | +2 | „https://dielinke.berlin/partei/wahlen/abgeordnetenhauswahlen-2026/“ | Eine Schule für alle: Mehr Gemeinschaft… | |
| 🤖 | Berlin soll zusätzliche Investitionen in Wohnen, Infrastruk… | +1 | „Wir wollen den Landeseigenen Wohnungsunternehmen jährlich bis zu 2 Milliarden Euro Eigenk…“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| 🤖 | Berlin soll einen Heizkostenfonds einrichten, aus dem einko… | +1 | „Mit einem Heizkostenfonds wollen wir Berliner*innen mit niedrigen Einkommen schnell und u…“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| ☐ | Berlin soll sein Klimaneutralitätsziel spätestens 2045 erre… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Die zwölf Berliner Bezirke sollen mehr Entscheidungskompete… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Berlin soll deutlich mehr Polizistinnen und Polizisten eins… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| 🤖 | Für die landeseigenen Wohnungsunternehmen soll ein Mietende… | +2 | „Innerhalb der ersten 100 Tage der neuen Regierung wollen wir auf Grundlage eines Senatsbe…“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| ☐ | Zur Sanierung des Haushalts soll das Personal in der Berlin… | -1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| 🤖 | Ein dauerhaftes Privatisierungsverbot für landeseigene Wohn… | +2 | „Einzelnen Wohnungen der LWU schließen wir aus und setzen uns für ein dauerhaftes Privatis…“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| ☐ | Die Randbereiche des Tempelhofer Feldes sollen mit Wohnunge… | -1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Behördengänge (Anträge, Bescheinigungen, Termine) sollen fl… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Berliner Clubs und die Nachtwirtschaft sollen durch Spielst… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Günstige Sozialtickets sollen ausgebaut und der öffentliche… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| 🤖 | Bei großen privaten Bauprojekten soll die Hälfte der Wohnun… | +1 | „Private Wohnungsbauunternehmen bauen bislang nur dann und nur in geringem Ausmaß bezahlba…“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| 🤖 | Hohe Einkommen und Vermögen sollen in Berlin stärker besteu… | +1 | „Wir werden die Einnahmen des Landes erhöhen und alle Möglichkeiten zur Umverteilung von o…“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| ☐ | Der Weiterbau/Ausbau der A100 soll gestoppt werden. | +2 | „https://dielinke.berlin/partei/wahlen/abgeordnetenhauswahlen-2026/“ | Wir fordern, dass die A100 qualifiziert… | |
| ☐ | Vergabe öffentlicher Aufträge und Fördermittel soll an Tari… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Tempo 30 soll flächendeckend auch auf Hauptverkehrsstraßen … | +2 | „https://dielinke.berlin/partei/wahlen/abgeordnetenhauswahlen-2026/“ | Wir setzen uns im Bund für Tempo 30 als… | |
| 🤖 | Die Wohnungsbestände großer, renditeorientierter Wohnungsko… | +2 | „Dieses Votum bietet keinen Interpretationsspielraum: Berlin will vergesellschaften und 22…“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| ☐ | Geförderter Wohnraum soll bevorzugt an Menschen vergeben we… | -1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |

<details><summary>„Keine Angabe“ mit Quellenvermerk (optional)</summary>

| These | Vermerk |
|-------|---------|
| Die Videoüberwachung in öffentlichen Räumen (z. B. Bahnhöfe… | Endfassung des Berlin-Programms enthält die Passage nicht |
| Polizeiliche Eingriffsbefugnisse (z. B. Einsatz von Stanzer… | Endfassung des Berlin-Programms enthält die Passage nicht |
| Versorgungsangebote für queere und trans Personen (Gesundhe… | Tagesspiegel-Analyse ordnet Die Linke der zustimmenden Gruppe zu — Programmstelle TODO(T-… |

</details>

---

### GRÜNE — 20 offen · 8 🤖 maschinell · 0 ✅ menschlich

Programm: https://gruene.berlin/fileadmin/BE/lv_berlin/files/Wahlprogramm_2026_Online.pdf

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| ☐ | Sprach-, Beratungs- und Integrationsangebote sollen deutlic… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| 🤖 | Versorgungsangebote für queere und trans Personen (Gesundhe… | +1 | „Einig sind sich Grüne, SPD, Linke und FDP darin, queeren und trans Personen mehr und bess…“ | Tagesspiegel – Sieben Wahlprogramme, 16… | |
| ☐ | Polizeiliche Eingriffsbefugnisse (z. B. Einsatz von Stanzer… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Der Personalschlüssel in Berliner Kitas soll verbessert und… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Bauämter und Genehmigungsverfahren sollen konsequent digita… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Abgelehnte Asylbewerberinnen und Asylbewerber sollen konseq… | -2 | „https://gruene.berlin/fileadmin/BE/lv_berlin/files/Wahlprogramm_2026_Online.pdf“ | Rechte wahrzunehmen und Rechtsverfahren… | |
| ☐ | Berlin soll schrittweise zur Gemeinschaftsschule übergehen,… | +1 | „https://gruene.berlin/fileadmin/BE/lv_berlin/files/Wahlprogramm_2026_Online.pdf“ | Gemeinschaftsschulen werden alleingelas… | |
| 🤖 | Unbebaute, aber baureife Grundstücke sollen mit einer Grund… | +1 | „Dafür werden wir die Grundsteuer C sowie strenge Baugebote einführen, damit Spekulant*inn…“ | Bündnis 90/Die Grünen Berlin – Wahlprog… | |
| ☐ | Berlin soll zusätzliche Investitionen in Wohnen, Infrastruk… | +1 | „https://gruene.berlin/fileadmin/BE/lv_berlin/files/Wahlprogramm_2026_Online.pdf“ | Wir nutzen die Kreditaufnahme voll aus … | |
| 🤖 | Berlin soll verbindliche Hitzeschutzprogramme für obdachlos… | +1 | „Mit kurzfristig wirksamen Hitzeschutzmaßnahmen werden wir Grüne besonders betroffene Quar…“ | Bündnis 90/Die Grünen Berlin – Wahlprog… | |
| 🤖 | Berlin soll sein Klimaneutralitätsziel spätestens 2045 erre… | +1 | „Berlin muss sich ein Vorbild an Hamburg nehmen, das nun schon 2040 klimaneutral sein will…“ | Bündnis 90/Die Grünen Berlin – Wahlprog… | |
| ☐ | Die zwölf Berliner Bezirke sollen mehr Entscheidungskompete… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Berlin soll deutlich mehr Polizistinnen und Polizisten eins… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Die Sauberkeit in Parks, U-Bahnhöfen und Straßen soll durch… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| 🤖 | Für die landeseigenen Wohnungsunternehmen soll ein Mietende… | +1 | „Auch deshalb haben wir Grüne uns dafür eingesetzt, dass der erfolgreiche Volksentscheid „…“ | Bündnis 90/Die Grünen Berlin – Wahlprog… | |
| ☐ | Berlin soll Netto-Null bei der Neuversiegelung von Boden er… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Zur Sanierung des Haushalts soll das Personal in der Berlin… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Ein dauerhaftes Privatisierungsverbot für landeseigene Wohn… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Die Randbereiche des Tempelhofer Feldes sollen mit Wohnunge… | -1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Behördengänge (Anträge, Bescheinigungen, Termine) sollen fl… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| 🤖 | Berliner Clubs und die Nachtwirtschaft sollen durch Spielst… | +1 | „Immer wieder geraten Clubs und Musikspielstätten aufgrund steigender Kosten und Mieten, N…“ | Bündnis 90/Die Grünen Berlin – Wahlprog… | |
| ☐ | Günstige Sozialtickets sollen ausgebaut und der öffentliche… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Bei großen privaten Bauprojekten soll die Hälfte der Wohnun… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Der Weiterbau/Ausbau der A100 soll gestoppt werden. | +1 | „https://gruene.berlin/fileadmin/BE/lv_berlin/files/Wahlprogramm_2026_Online.pdf“ | Bedrohen die Pläne des Bundes und des S… | |
| ☐ | Vergabe öffentlicher Aufträge und Fördermittel soll an Tari… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| 🤖 | Tempo 30 soll flächendeckend auch auf Hauptverkehrsstraßen … | +2 | „Wir schützen Leben mit so viel Tempo 30 wie möglich – insbesondere vor Kitas, Schulen, Sp…“ | Bündnis 90/Die Grünen Berlin – Wahlprog… | |
| 🤖 | Die Wohnungsbestände großer, renditeorientierter Wohnungsko… | +1 | „Auch deshalb haben wir Grüne uns dafür eingesetzt, dass der erfolgreiche Volksentscheid „…“ | Bündnis 90/Die Grünen Berlin – Wahlprog… | |
| ☐ | Geförderter Wohnraum soll bevorzugt an Menschen vergeben we… | -1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |

---

### SPD — 13 offen · 21 🤖 maschinell · 0 ✅ menschlich

Programm: https://spd.berlin/media/2026/06/SPD_Berlin_Wahlprogramm_20260521-v3-4.pdf

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| ☐ | Die Grundsteuer in Berlin soll vollständig abgeschafft werd… | -1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| 🤖 | Die Umlage von Modernisierungskosten auf die Mieterinnen un… | -1 | „Wir setzen uns zudem dafür ein, dass auf Bundesebene die Modernisierungsumlage gesenkt un…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| 🤖 | Sprach-, Beratungs- und Integrationsangebote sollen deutlic… | +1 | „Integrationskitas stärken wir durch eine Erhöhung des Personalzuschlages. Kita-Sozialarbe…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| 🤖 | Versorgungsangebote für queere und trans Personen (Gesundhe… | +1 | „Einig sind sich Grüne, SPD, Linke und FDP darin, queeren und trans Personen mehr und bess…“ | Tagesspiegel – Sieben Wahlprogramme, 16… | |
| 🤖 | Der Sanierungsstau bei Schulen soll durch ein deutlich besc… | +1 | „Sanierung und Neubau von Schulen, Kitas und sozialer Infrastruktur in den Kiezen (→ siehe…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| ☐ | Der Personalschlüssel in Berliner Kitas soll verbessert und… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| 🤖 | Notunterkünfte für Geflüchtete sollen abgeschafft und durch… | -1 | „Zusätzlich schaffen wir mehr Schutzwohnungen und Notunterkünfte.“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| 🤖 | Bauämter und Genehmigungsverfahren sollen konsequent digita… | +1 | „Dazu treiben wir die die KI unterstützte Digitalisierung in den Bauämtern voran.“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| 🤖 | Die Vermietung von möbliertem Wohnraum auf Zeit soll rechtl… | +1 | „Auch gegen die kurzzeitige Vermietung hotelartig möblierter Räume und gegen Überbelegung …“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| ☐ | Abgelehnte Asylbewerberinnen und Asylbewerber sollen konseq… | +1 | „https://spd.berlin/media/2026/06/SPD_Berlin_Wahlprogramm_20260521-v3-4.pdf“ | Wir priorisieren Rückführungen bei schw… | |
| 🤖 | Der Erwerb selbstgenutzten Wohneigentums soll durch Zuschüs… | +1 | „Selbstgenutztes Wohneigentum unterstützen wir trotzdem gezielt – besonders für Familien m…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| ☐ | Berlin soll schrittweise zur Gemeinschaftsschule übergehen,… | -1 | „https://spd.berlin/media/2026/06/SPD_Berlin_Wahlprogramm_20260521-v3-4.pdf“ | Egal ob Gymnasium, Integrierte Sekundar… | |
| 🤖 | Unbebaute, aber baureife Grundstücke sollen mit einer Grund… | +1 | „Wir führen eine Grundsteuer C für unbebaute, aber baureife Grundstücke ein, um Anreize zu…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| 🤖 | Berlin soll zusätzliche Investitionen in Wohnen, Infrastruk… | +1 | „Wir halten Investitionen vor allem in sieben Schwerpunkten für notwendig. Das spiegelt si…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| 🤖 | Berlin soll verbindliche Hitzeschutzprogramme für obdachlos… | +1 | „Wir können die Obdachlosigkeit besiegen und mit einer entschlossenen Verkehrspolitik die …“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| ☐ | Berlin soll sein Klimaneutralitätsziel spätestens 2045 erre… | +1 | „https://spd.berlin/media/2026/06/SPD_Berlin_Wahlprogramm_20260521-v3-4.pdf“ | Unser Ziel ist klar: Berlin wird bis mö… | |
| ☐ | Die zwölf Berliner Bezirke sollen mehr Entscheidungskompete… | 0 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| ☐ | Berlin soll deutlich mehr Polizistinnen und Polizisten eins… | +1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| 🤖 | Die Sauberkeit in Parks, U-Bahnhöfen und Straßen soll durch… | +1 | „Wir arbeiten daran, dass die Berliner Stadtreinigung (BSR) die Reinigung aller Spielplätz…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| 🤖 | Für die landeseigenen Wohnungsunternehmen soll ein Mietende… | +1 | „Dabei ist unser Ziel auch die Einführung eines rechtssicheren Mietendeckels über eine Län…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| 🤖 | Berlin soll Netto-Null bei der Neuversiegelung von Boden er… | +1 | „Dies dient auch unserem angestrebten Ziel der Netto-Null-Neuversiegelung.“ | SPD Berlin – Wahlprogramm 2026 (PDF, Ka… | |
| ☐ | Zur Sanierung des Haushalts soll das Personal in der Berlin… | -1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |
| 🤖 | Der Radverkehrsausbau (geschützte Radwege, Radvorrang) soll… | +1 | „Für ein lückenloses und sicheres Netz setzen wir den Radverkehrsplan konsequent um und pr…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| 🤖 | Die Randbereiche des Tempelhofer Feldes sollen mit Wohnunge… | -1 | „Das Tempelhofer Feld ist ein besonderer Ort für Klima, Bewegung und soziales Miteinander.…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| ☐ | Behördengänge (Anträge, Bescheinigungen, Termine) sollen fl… | +1 | „Der technologische Wandel erfordert Investitionen in die Digitalisierung. Schon seit Jahr…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| 🤖 | Berliner Clubs und die Nachtwirtschaft sollen durch Spielst… | +1 | „Für die Clubwirtschaft initiieren wir erstmals eine Spielstättenförderung und setzen Empf…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| ☐ | Günstige Sozialtickets sollen ausgebaut und der öffentliche… | +1 | „https://spd.berlin/media/2026/06/SPD_Berlin_Wahlprogramm_20260521-v3-4.pdf“ | Das Deutschlandticket zählt zu den erfo… | |
| 🤖 | Bei großen privaten Bauprojekten soll die Hälfte der Wohnun… | +1 | „Wir erhöhen diese Quote auf 50 Prozent und stärken das Modell als Kerninstrument für beza…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| 🤖 | Hohe Einkommen und Vermögen sollen in Berlin stärker besteu… | +1 | „… die große Vermögen stärker heranzieht, sowie die Wiedereinführung einer Vermögenssteuer…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| ☐ | Der Weiterbau/Ausbau der A100 soll gestoppt werden. | +1 | „https://spd.berlin/media/2026/06/SPD_Berlin_Wahlprogramm_20260521-v3-4.pdf“ | Statt die A100 weiterzubauen, setzen wi… | |
| 🤖 | Vergabe öffentlicher Aufträge und Fördermittel soll an Tari… | +1 | „Wir verschärfen die Durchsetzung von Tariftreue und Vergabemindestlohn, um Lohndumping zu…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| ☐ | Tempo 30 soll flächendeckend auch auf Hauptverkehrsstraßen … | +1 | „https://spd.berlin/media/2026/06/SPD_Berlin_Wahlprogramm_20260521-v3-4.pdf“ | Tempo 50 auf bisherigen Tempo-30-Streck… | |
| 🤖 | Die Wohnungsbestände großer, renditeorientierter Wohnungsko… | +1 | „Die Zustimmung zur Initiative des Volksentscheids „Deutsche Wohnen und Co. Enteignen“ zei…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| ☐ | Geförderter Wohnraum soll bevorzugt an Menschen vergeben we… | -1 | „“ | Redaktionelle Einschätzung auf Basis Wa… | |

---

### BSW — 2 offen · 2 🤖 maschinell · 0 ✅ menschlich

Programm: **kein Link hinterlegt**

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| 🤖 | Die Umlage von Modernisierungskosten auf die Mieterinnen un… | +1 | „Bei Leerstand sollen Treuhänder eingesetzt, überteuerte Modernisierungen begrenzt und Woh…“ | rbb24 Wohnungs-Check (08/2026) | |
| 🤖 | Die Vermietung von möbliertem Wohnraum auf Zeit soll rechtl… | +1 | „Enteignen&quot; zur Vergesellschaftung von Wohnungsbeständen großer Konzerne und einen ne…“ | rbb24 Wohnungs-Check (08/2026) | |
| ☐ | Für die landeseigenen Wohnungsunternehmen soll ein Mietende… | +1 | „Das BSW unterstützt einen neuen Anlauf für einen Mietendeckel auf Landes- oder Bundeseben…“ | rbb24 Wohnungs-Check (08/2026) | |
| ☐ | Die Wohnungsbestände großer, renditeorientierter Wohnungsko… | +1 | „Das BSW unterstützt die Umsetzung des Volksentscheids „Deutsche Wohnen & Co enteignen“ zu…“ | rbb24 Wohnungs-Check (08/2026) | |

<details><summary>„Keine Angabe“ mit Quellenvermerk (optional)</summary>

| These | Vermerk |
|-------|---------|
| Bei großen privaten Bauprojekten soll die Hälfte der Wohnun… | BSW fordert stattdessen mindestens 6.000 dauerhaft gebundene Sozialwohnungen pro Jahr (rb… |

</details>

---

### FDP — 0 offen · 6 🤖 maschinell · 0 ✅ menschlich

Programm: **kein Link hinterlegt**

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| 🤖 | Versorgungsangebote für queere und trans Personen (Gesundhe… | +1 | „Einig sind sich Grüne, SPD, Linke und FDP darin, queeren und trans Personen mehr und bess…“ | Tagesspiegel – Sieben Wahlprogramme, 16… | |
| 🤖 | Der Erwerb selbstgenutzten Wohneigentums soll durch Zuschüs… | +1 | „Wohneigentum will die FDP steuerlich stark begünstigen und Umwandlungen von Miet- in Eige…“ | rbb24 Wohnungs-Check (08/2026) | |
| 🤖 | Für die landeseigenen Wohnungsunternehmen soll ein Mietende… | -2 | „Wohnungsbau soll vor allem durch private Bauherren, Baugruppen, Genossenschaften und klei…“ | rbb24 Wohnungs-Check (08/2026) | |
| 🤖 | Die Randbereiche des Tempelhofer Feldes sollen mit Wohnunge… | +2 | „Die FDP fordert Nachverdichtung, Hochhäuser, Dachaufstockungen und die Umwandlung von Bür…“ | rbb24 Wohnungs-Check (08/2026) | |
| 🤖 | Bei großen privaten Bauprojekten soll die Hälfte der Wohnun… | -1 | „Sozialpolitik soll über Wohngeld statt Quoten im Neubau erfolgen.“ | rbb24 Wohnungs-Check (08/2026) | |
| 🤖 | Die Wohnungsbestände großer, renditeorientierter Wohnungsko… | -2 | „Die FDP setzt auf den freien Wohnungsmarkt und lehnt Mietendeckel, Mietpreisbremse, Milie…“ | rbb24 Wohnungs-Check (08/2026) | |

---

### Tierschutzpartei — 3 offen · 0 🤖 maschinell · 0 ✅ menschlich

Programm: https://berlin.tierschutzpartei.de/wahlprogramm-berlin-2026.pdf

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| ☐ | Der Sanierungsstau bei Schulen soll durch ein deutlich besc… | +1 | „Plakatmotiv zur Berlin-Wahl 2026: „Bock auf sanierte Schulen?““ | Tierschutzpartei Berlin – Wahlplakat Sc… | |
| ☐ | Die Randbereiche des Tempelhofer Feldes sollen mit Wohnunge… | -2 | „Plakatmotiv zur Berlin-Wahl 2026: „Bock auf ein freies Tempelhofer Feld?““ | Tierschutzpartei Berlin – Wahlplakate (… | |
| ☐ | Günstige Sozialtickets sollen ausgebaut und der öffentliche… | +2 | „Plakatmotiv zur Berlin-Wahl 2026: „Bock auf kostenlose Öffis?““ | Tierschutzpartei Berlin – Wahlplakat Öf… | |

<details><summary>„Keine Angabe“ mit Quellenvermerk (optional)</summary>

| These | Vermerk |
|-------|---------|
| Für die landeseigenen Wohnungsunternehmen soll ein Mietende… | Plakat „bezahlbare Mieten“ ohne konkreten Mechanismus — TODO(T-132) Programm S. Wohnen |
| Berlin soll sein Klimaneutralitätsziel spätestens 2045 erre… | Plakat „echter Klimaschutz“ ohne Zieljahr — TODO(T-132) Programm Kapitel Klima |

</details>

---

### Volt — 2 offen · 5 🤖 maschinell · 0 ✅ menschlich

Programm: https://voltdeutschland.org/storage/assets-berlin/pdf/policy-wahlprogramm-2026/wahlprogramm-edited-20-7.pdf

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| ☐ | Sprach-, Beratungs- und Integrationsangebote sollen deutlic… | +1 | „„Berlin verbindet“ macht Integration zum Standortvorteil: Englisch als zweiter Servicespr…“ | Volt Berlin – Programm 2026, Kapitel Be… | |
| 🤖 | Bauämter und Genehmigungsverfahren sollen konsequent digita… | +1 | „Mit der Genehmigungsfiktion gelten vollständige Anträge nach Fristablauf automatisch als …“ | Volt Berlin – Programm 2026, Kapitel Be… | |
| ☐ | Berlin soll verbindliche Hitzeschutzprogramme für obdachlos… | +1 | „Housing First als wirksames Mittel gegen Obdachlosigkeit; Schwammstadt gegen Hitze und St…“ | Volt Berlin – Programm 2026, Kapitel Be… | |
| 🤖 | Der Radverkehrsausbau (geschützte Radwege, Radvorrang) soll… | +1 | „Sichere Rad- und Gehwege und saubere Kieze.“ | Volt Berlin – Programm 2026, Kapitel Be… | |
| 🤖 | Behördengänge (Anträge, Bescheinigungen, Termine) sollen fl… | +1 | „Eine digitale Verwaltung, die an Ergebnissen gemessen wird; mit dem Once-Only-Prinzip geb…“ | Volt Berlin – Programm 2026, Kapitel Be… | |
| 🤖 | Berliner Clubs und die Nachtwirtschaft sollen durch Spielst… | +1 | „berlin verbindet (menschen, europa und die welt) macht europa im alltag erlebbar: mit int…“ | Volt Berlin – Programm 2026, Kapitel Be… | |
| 🤖 | Günstige Sozialtickets sollen ausgebaut und der öffentliche… | +1 | „Ein verlässlicher ÖPNV bis in die Außenbezirke.“ | Volt Berlin – Programm 2026, Kapitel Be… | |

---

### DKP — 2 offen · 5 🤖 maschinell · 0 ✅ menschlich

Programm: https://berlin.dkp.de/wp-content/uploads/sites/83/2026/04/Wahlprogramm.pdf

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| ☐ | Polizeiliche Eingriffsbefugnisse (z. B. Einsatz von Stanzer… | +1 | „Gegen den Ausbau des Polizeiapparates [und für den Widerstand dagegen].“ | Unsere Zeit (UZ) 24/2026 | |
| 🤖 | Der Sanierungsstau bei Schulen soll durch ein deutlich besc… | +1 | „Geld für Wohnungen, Schulen, Krankenhäuser und Kultur statt für Panzer, Drohnen und Muste…“ | DKP Berlin – Leitartikel zur Kandidatur | |
| 🤖 | Berlin soll zusätzliche Investitionen in Wohnen, Infrastruk… | +1 | „Unsere Stadt braucht Geld für Wohnungen, Schulen, Krankenhäuser und Kultur statt für Panz…“ | DKP Berlin – Leitartikel zur Kandidatur | |
| ☐ | Berlin soll deutlich mehr Polizistinnen und Polizisten eins… | -2 | „Die DKP richtet sich gegen … den Ausbau des Polizeiapparates.“ | Unsere Zeit (UZ) 24/2026 – Bericht zur … | |
| 🤖 | Ein dauerhaftes Privatisierungsverbot für landeseigene Wohn… | +1 | „Privaten Wohnungskonzernen muss der Zugriff auf Berliner Wohnungen verboten werden.“ | DKP Berlin – Wahlprogramm AGH 2026 (PDF) | |
| 🤖 | Hohe Einkommen und Vermögen sollen in Berlin stärker besteu… | +1 | „für uns ist klar: um die lähmende krise in der stadt zu überwinden, müssen wir den griff …“ | DKP Berlin – Leitartikel zur Kandidatur | |
| 🤖 | Die Wohnungsbestände großer, renditeorientierter Wohnungsko… | +2 | „Privaten Wohnungskonzernen muss der Zugriff auf Berliner Wohnungen verboten werden. Die F…“ | DKP Berlin – Wahlprogramm AGH 2026 (PDF) | |

---

### SGP — 1 offen · 10 🤖 maschinell · 0 ✅ menschlich

Programm: https://www.wsws.org/de/articles/2026/07/10/sgpb-j10.html

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| 🤖 | Sprach-, Beratungs- und Integrationsangebote sollen deutlic… | +1 | „[Industrielle Kapazitäten] müssen genutzt werden, um … Flüchtlinge menschenwürdig aufzune…“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| 🤖 | Die Videoüberwachung in öffentlichen Räumen (z. B. Bahnhöfe… | -1 | „Die Überwachung wird ausgebaut … [das kritisieren wir ausdrücklich].“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| ☐ | Polizeiliche Eingriffsbefugnisse (z. B. Einsatz von Stanzer… | +1 | „Gegen das Aufrüsten von Polizei und Geheimdiensten und die Vorbereitung des Staatsapparat…“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| 🤖 | Der Sanierungsstau bei Schulen soll durch ein deutlich besc… | +1 | „Wachsende Armut, explodierende Mieten, zerfallende Schulen und Krankenhäuser … [fordern d…“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| 🤖 | Abgelehnte Asylbewerberinnen und Asylbewerber sollen konseq… | -1 | „Die SGP tritt für die prinzipielle Verteidigung aller Flüchtlinge und eingewanderten Arbe…“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| 🤖 | Berlin soll zusätzliche Investitionen in Wohnen, Infrastruk… | +1 | „Die reichlich vorhandenen industriellen und technologischen Kapazitäten müssen genutzt we…“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| 🤖 | Berlin soll deutlich mehr Polizistinnen und Polizisten eins… | -2 | „Die Überwachung wird ausgebaut, Polizei und Geheimdienste werden aufgerüstet und der gesa…“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| 🤖 | Zur Sanierung des Haushalts soll das Personal in der Berlin… | -2 | „Die SGP kämpft für die Verteidigung jedes Arbeitsplatzes und gegen sämtliche Kürzungen be…“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| 🤖 | Günstige Sozialtickets sollen ausgebaut und der öffentliche… | +1 | „Er streicht mehr als 600 Millionen Euro im öffentlichen Nahverkehr … [diese Kürzungspolit…“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| 🤖 | Hohe Einkommen und Vermögen sollen in Berlin stärker besteu… | +1 | „In den vergangenen 15 Jahren hat sich das Vermögen der 500 reichsten Personen in Deutschl…“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| 🤖 | Die Wohnungsbestände großer, renditeorientierter Wohnungsko… | +2 | „Deshalb müssen die Banken, Konzerne und Milliardenvermögen enteignet, unter demokratische…“ | SGP – Wahlerklärung Berlinwahl 2026 (10… | |
