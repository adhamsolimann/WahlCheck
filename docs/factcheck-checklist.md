# Faktencheck-Checkliste (T-132)

> Generiert am 2026-08-23 durch `scripts/gen-factcheck.mts` — NICHT manuell editieren.
> Status wird ausschließlich in `content/positions/*.yaml` gepflegt (`verification: verified`),
> danach Skript erneut ausführen und beides zusammen committen.

## Gesamtstand

| Tier | Offen | 🤖 auto | ✅ verified |
|------|------:|-------:|----------:|
| gesamt | **35** | 46 | 0 |

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

### AfD — 5 offen · 1 🤖 maschinell · 0 ✅ menschlich

Programm: **kein Link hinterlegt**

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| ☐ | Die Grundsteuer in Berlin soll vollständig abgeschafft werd… | +2 | „Die AfD will die Grundsteuer abschaffen sowie Wohneigentum durch Steuerbefreiungen und Bü…“ | rbb24 Wohnungs-Check (08/2026) | |
| ☐ | Der Erwerb selbstgenutzten Wohneigentums soll durch Zuschüs… | +1 | „Wohneigentum will die AfD durch Steuerbefreiungen und Bürgschaften fördern; außerdem will…“ | rbb24 Wohnungs-Check (08/2026) | |
| ☐ | Berlin soll deutlich mehr Polizistinnen und Polizisten eins… | +2 | „Sicherheit ist neben Migration das dominante Programmfeld der AfD; sie schreibt fast so v…“ | Tagesspiegel – Sieben Wahlprogramme, 16… | |
| ☐ | Für die landeseigenen Wohnungsunternehmen soll ein Mietende… | -2 | „Grundsätzliche Abkehr von starker Mietregulierung; Neubau durch weniger Vorgaben beschleu…“ | rbb24 Wohnungs-Check (08/2026) | |
| 🤖 | Die Wohnungsbestände großer, renditeorientierter Wohnungsko… | -2 | „Die AfD fordert eine grundsätzliche Abkehr von starker Mietregulierung und lehnt Enteignu…“ | rbb24 Wohnungs-Check (08/2026) | |
| ☐ | Geförderter Wohnraum soll bevorzugt an Menschen vergeben we… | +2 | „Geförderter Wohnraum soll bevorzugt an Berliner vergeben werden, die hier geboren sind od…“ | rbb24 Wohnungs-Check (08/2026) | |

---

### CDU — 2 offen · 4 🤖 maschinell · 0 ✅ menschlich

Programm: **kein Link hinterlegt**

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| 🤖 | Der Erwerb selbstgenutzten Wohneigentums soll durch Zuschüs… | +1 | „Fördern will die CDU nicht nur den Bau von Sozialwohnungen, sondern auch selbstgenutztes …“ | rbb24 Wohnungs-Check (08/2026) | |
| ☐ | Berlin soll deutlich mehr Polizistinnen und Polizisten eins… | +2 | „Die CDU setzt Sicherheit gleich an die Spitze ihres Wahlprogramms: 18 Prozent des Texts d…“ | Tagesspiegel – Sieben Wahlprogramme, 16… | |
| 🤖 | Für die landeseigenen Wohnungsunternehmen soll ein Mietende… | -2 | „Ein dauerhaftes Privatisierungsverbot von Wohnungen lehnt die CDU ab, ebenso wie eine sta…“ | rbb24 Wohnungs-Check (08/2026) | |
| 🤖 | Ein dauerhaftes Privatisierungsverbot für landeseigene Wohn… | -2 | „Ein dauerhaftes Privatisierungsverbot von Wohnungen lehnt die CDU ab.“ | rbb24 Wohnungs-Check (08/2026) | |
| 🤖 | Die Randbereiche des Tempelhofer Feldes sollen mit Wohnunge… | +2 | „Bis 2031 sollen 100.000 neue Wohnungen entstehen, unter anderem auch durch die Randbebauu…“ | rbb24 Wohnungs-Check (08/2026) | |
| ☐ | Die Wohnungsbestände großer, renditeorientierter Wohnungsko… | -2 | „Die CDU lehnt die Vergesellschaftung von Wohnungen privater Konzerne ab und setzt stattde…“ | rbb24 Wohnungs-Check (08/2026) | |

---

### Die Linke — 2 offen · 9 🤖 maschinell · 0 ✅ menschlich

Programm: https://dielinke.berlin/fileadmin/download/2026/0106_Wahlprogramm_LVB_A5.pdf

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| 🤖 | Die Umlage von Modernisierungskosten auf die Mieterinnen un… | +2 | „Die Modernisierungsumlage wollen wir abschaffen.“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| ☐ | Die Videoüberwachung in öffentlichen Räumen (z. B. Bahnhöfe… | -1 | „Gefahrengebiete und Waffenverbotszonen sind mit zusätzlichen polizeilichen Befugnissen wi…“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| ☐ | Polizeiliche Eingriffsbefugnisse (z. B. Einsatz von Stanzer… | +1 | „Mit zusätzlichen polizeilichen Befugnissen wie Videoüberwachung oder anlasslosen Kontroll…“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| 🤖 | Die Vermietung von möbliertem Wohnraum auf Zeit soll rechtl… | +1 | „Abzocke mit möblierten Wohnungen beenden und die großen Immobilienkonzerne vergesellschaf…“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| 🤖 | Berlin soll zusätzliche Investitionen in Wohnen, Infrastruk… | +1 | „Wir wollen den Landeseigenen Wohnungsunternehmen jährlich bis zu 2 Milliarden Euro Eigenk…“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| 🤖 | Berlin soll einen Heizkostenfonds einrichten, aus dem einko… | +1 | „Mit einem Heizkostenfonds wollen wir Berliner*innen mit niedrigen Einkommen schnell und u…“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| 🤖 | Für die landeseigenen Wohnungsunternehmen soll ein Mietende… | +2 | „Innerhalb der ersten 100 Tage der neuen Regierung wollen wir auf Grundlage eines Senatsbe…“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| 🤖 | Ein dauerhaftes Privatisierungsverbot für landeseigene Wohn… | +2 | „Einzelnen Wohnungen der LWU schließen wir aus und setzen uns für ein dauerhaftes Privatis…“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| 🤖 | Bei großen privaten Bauprojekten soll die Hälfte der Wohnun… | +1 | „Private Wohnungsbauunternehmen bauen bislang nur dann und nur in geringem Ausmaß bezahlba…“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| 🤖 | Hohe Einkommen und Vermögen sollen in Berlin stärker besteu… | +1 | „Wir werden die Einnahmen des Landes erhöhen und alle Möglichkeiten zur Umverteilung von o…“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |
| 🤖 | Die Wohnungsbestände großer, renditeorientierter Wohnungsko… | +2 | „Dieses Votum bietet keinen Interpretationsspielraum: Berlin will vergesellschaften und 22…“ | Die Linke Berlin – Wahlprogramm AGH 2026 | |

<details><summary>„Keine Angabe“ mit Quellenvermerk (optional)</summary>

| These | Vermerk |
|-------|---------|
| Bauämter und Genehmigungsverfahren sollen konsequent digita… | Kritik am Schneller-Bauen-Gesetz/Bau-Turbo im Programm — exakte Stelle TODO(T-132) |
| Versorgungsangebote für queere und trans Personen (Gesundhe… | Tagesspiegel-Analyse ordnet Die Linke der zustimmenden Gruppe zu — Programmstelle TODO(T-… |

</details>

---

### GRÜNE — 3 offen · 5 🤖 maschinell · 0 ✅ menschlich

Programm: https://gruene.berlin/fileadmin/BE/lv_berlin/files/Wahlprogramm_2026_Online.pdf

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| 🤖 | Versorgungsangebote für queere und trans Personen (Gesundhe… | +1 | „Einig sind sich Grüne, SPD, Linke und FDP darin, queeren und trans Personen mehr und bess…“ | Tagesspiegel – Sieben Wahlprogramme, 16… | |
| 🤖 | Unbebaute, aber baureife Grundstücke sollen mit einer Grund… | +1 | „Dafür werden wir die Grundsteuer C sowie strenge Baugebote einführen, damit Spekulant*inn…“ | Bündnis 90/Die Grünen Berlin – Wahlprog… | |
| ☐ | Berlin soll verbindliche Hitzeschutzprogramme für obdachlos… | +1 | „Die Grünen setzen sich für Hitzeschutzmaßnahmen für obdachlose Menschen ein.“ | Tagesspiegel – Sieben Wahlprogramme, 16… | |
| 🤖 | Berlin soll sein Klimaneutralitätsziel spätestens 2045 erre… | +1 | „Berlin muss sich ein Vorbild an Hamburg nehmen, das nun schon 2040 klimaneutral sein will…“ | Bündnis 90/Die Grünen Berlin – Wahlprog… | |
| 🤖 | Für die landeseigenen Wohnungsunternehmen soll ein Mietende… | +1 | „Dazu gehören für uns vor allem die Ermöglichung eines Mietendeckels entweder durch eine L…“ | Bündnis 90/Die Grünen Berlin – Wahlprog… | |
| ☐ | Berliner Clubs und die Nachtwirtschaft sollen durch Spielst… | +1 | „Bei den Grünen und Linken ist die Rede von Schutz vor steigenden Gewerbemieten – auch für…“ | Tagesspiegel – Sieben Wahlprogramme, 16… | |
| 🤖 | Tempo 30 soll flächendeckend auch auf Hauptverkehrsstraßen … | +2 | „Wir schützen Leben mit so viel Tempo 30 wie möglich – insbesondere vor Kitas, Schulen, Sp…“ | Bündnis 90/Die Grünen Berlin – Wahlprog… | |
| ☐ | Die Wohnungsbestände großer, renditeorientierter Wohnungsko… | +1 | „Die Grünen unterstützen die Initiative „Deutsche Wohnen & Co. enteignen“, also die Verges…“ | rbb24 Wohnungs-Check (08/2026) | |

---

### SPD — 5 offen · 7 🤖 maschinell · 0 ✅ menschlich

Programm: https://spd.berlin/media/2026/06/SPD_Berlin_Wahlprogramm_20260521-v3-4.pdf

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| 🤖 | Versorgungsangebote für queere und trans Personen (Gesundhe… | +1 | „Einig sind sich Grüne, SPD, Linke und FDP darin, queeren und trans Personen mehr und bess…“ | Tagesspiegel – Sieben Wahlprogramme, 16… | |
| 🤖 | Der Sanierungsstau bei Schulen soll durch ein deutlich besc… | +1 | „Sanierung und Neubau von Schulen, Kitas und sozialer Infrastruktur in den Kiezen (→ siehe…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| ☐ | Notunterkünfte für Geflüchtete sollen abgeschafft und durch… | +1 | „Die Sozialdemokraten wollen Notunterkünfte für Geflüchtete abschaffen und sie durch dezen…“ | Tagesspiegel – Sieben Wahlprogramme, 16… | |
| ☐ | Bauämter und Genehmigungsverfahren sollen konsequent digita… | +1 | „Planungsrechtliche Genehmigungen sollen zügig erfolgen. Dazu treiben wir die KI-unterstüt…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| ☐ | Die Vermietung von möbliertem Wohnraum auf Zeit soll rechtl… | +1 | „Auch gegen die kurzzeitige Vermietung hotelartig möblierter Räume und gegen Überbelegung …“ | rbb24 Wohnungs-Check (08/2026) | |
| 🤖 | Unbebaute, aber baureife Grundstücke sollen mit einer Grund… | +1 | „Wir führen eine Grundsteuer C für unbebaute, aber baureife Grundstücke ein, um Anreize zu…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| 🤖 | Berlin soll zusätzliche Investitionen in Wohnen, Infrastruk… | +1 | „Wir halten Investitionen vor allem in sieben Schwerpunkten für notwendig. Das spiegelt si…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| 🤖 | Für die landeseigenen Wohnungsunternehmen soll ein Mietende… | +1 | „Dabei ist unser Ziel auch die Einführung eines rechtssicheren Mietendeckels über eine Län…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| 🤖 | Berlin soll Netto-Null bei der Neuversiegelung von Boden er… | +1 | „Dies dient auch unserem angestrebten Ziel der Netto-Null-Neuversiegelung.“ | SPD Berlin – Wahlprogramm 2026 (PDF, Ka… | |
| ☐ | Berliner Clubs und die Nachtwirtschaft sollen durch Spielst… | +1 | „Wir führen erstmals eine Spielstättenförderung und setzen Empfehlungen aus der Berliner S…“ | Tagesspiegel – Sieben Wahlprogramme, 16… | |
| 🤖 | Bei großen privaten Bauprojekten soll die Hälfte der Wohnun… | +1 | „Wir erhöhen diese Quote auf 50 Prozent und stärken das Modell als Kerninstrument für beza…“ | SPD Berlin – Wahlprogramm 2026 (PDF) | |
| ☐ | Die Wohnungsbestände großer, renditeorientierter Wohnungsko… | neutral | „“ | rbb24 Wohnungs-Check – „vermeidet … ein… | |

<details><summary>„Keine Angabe“ mit Quellenvermerk (optional)</summary>

| These | Vermerk |
|-------|---------|
| Berlin soll deutlich mehr Polizistinnen und Polizisten eins… | Kapitel behandelt Wachen-Sanierung/-Investitionen; Personalzahl nicht spezifiziert — TODO… |

</details>

---

### BSW — 3 offen · 1 🤖 maschinell · 0 ✅ menschlich

Programm: **kein Link hinterlegt**

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| ☐ | Die Umlage von Modernisierungskosten auf die Mieterinnen un… | +1 | „Überteuerte Modernisierungen sollen begrenzt werden.“ | rbb24 Wohnungs-Check (08/2026) | |
| 🤖 | Die Vermietung von möbliertem Wohnraum auf Zeit soll rechtl… | +1 | „Möbliertes Wohnen und Mikroapartments sollen eingeschränkt, Zweckentfremdung und Abriss v…“ | rbb24 Wohnungs-Check (08/2026) | |
| ☐ | Für die landeseigenen Wohnungsunternehmen soll ein Mietende… | +1 | „Das BSW unterstützt einen neuen Anlauf für einen Mietendeckel auf Landes- oder Bundeseben…“ | rbb24 Wohnungs-Check (08/2026) | |
| ☐ | Die Wohnungsbestände großer, renditeorientierter Wohnungsko… | +1 | „Das BSW unterstützt die Umsetzung des Volksentscheids „Deutsche Wohnen & Co. Enteignen“ z…“ | rbb24 Wohnungs-Check (08/2026) | |

<details><summary>„Keine Angabe“ mit Quellenvermerk (optional)</summary>

| These | Vermerk |
|-------|---------|
| Bei großen privaten Bauprojekten soll die Hälfte der Wohnun… | BSW fordert stattdessen mindestens 6.000 dauerhaft gebundene Sozialwohnungen pro Jahr (rb… |

</details>

---

### FDP — 2 offen · 4 🤖 maschinell · 0 ✅ menschlich

Programm: **kein Link hinterlegt**

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| 🤖 | Versorgungsangebote für queere und trans Personen (Gesundhe… | +1 | „Einig sind sich Grüne, SPD, Linke und FDP darin, queeren und trans Personen mehr und bess…“ | Tagesspiegel – Sieben Wahlprogramme, 16… | |
| 🤖 | Der Erwerb selbstgenutzten Wohneigentums soll durch Zuschüs… | +1 | „Wohneigentum will die FDP steuerlich stark begünstigen und Umwandlungen von Miet- in Eige…“ | rbb24 Wohnungs-Check (08/2026) | |
| ☐ | Für die landeseigenen Wohnungsunternehmen soll ein Mietende… | -2 | „Lehnt Mietendeckel ab; Wohnungsbau soll vor allem durch private Bauherren, Baugruppen, Ge…“ | rbb24 Wohnungs-Check (08/2026) | |
| ☐ | Die Randbereiche des Tempelhofer Feldes sollen mit Wohnunge… | +2 | „Forderung nach Nachverdichtung, Hochhäusern, Dachaufstockungen und Büro-Umwandlungen, ein…“ | rbb24 Wohnungs-Check (08/2026) | |
| 🤖 | Bei großen privaten Bauprojekten soll die Hälfte der Wohnun… | -1 | „Sozialpolitik soll über Wohngeld statt Quoten im Neubau erfolgen.“ | rbb24 Wohnungs-Check (08/2026) | |
| 🤖 | Die Wohnungsbestände großer, renditeorientierter Wohnungsko… | -2 | „Die FDP setzt auf den freien Wohnungsmarkt und lehnt Mietendeckel, Mietpreisbremse, Milie…“ | rbb24 Wohnungs-Check (08/2026) | |

---

### Tierschutzpartei — 3 offen · 0 🤖 maschinell · 0 ✅ menschlich

Programm: https://berlin.tierschutzpartei.de/wahlprogramm-berlin-2026.pdf

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| ☐ | Der Sanierungsstau bei Schulen soll durch ein deutlich besc… | +1 | „Plakatmotiv zur Berlin-Wahl 2026: „Bock auf sanierte Schulen?““ | Tierschutzpartei Berlin – Wahlplakat Sc… | |
| ☐ | Die Randbereiche des Tempelhofer Feldes sollen mit Wohnunge… | -2 | „Plakatmotiv zur Berlin-Wahl 2026: „Bock auf ein freies Tempelhofer Feld?““ | Tierschutzpartei Berlin – Wahlplakat Te… | |
| ☐ | Günstige Sozialtickets sollen ausgebaut und der öffentliche… | +2 | „Plakatmotiv zur Berlin-Wahl 2026: „Bock auf kostenlose Öffis?““ | Tierschutzpartei Berlin – Wahlplakat Öf… | |

<details><summary>„Keine Angabe“ mit Quellenvermerk (optional)</summary>

| These | Vermerk |
|-------|---------|
| Für die landeseigenen Wohnungsunternehmen soll ein Mietende… | Plakat „bezahlbare Mieten“ ohne konkreten Mechanismus — TODO(T-132) Programm S. Wohnen |
| Berlin soll sein Klimaneutralitätsziel spätestens 2045 erre… | Plakat „echter Klimaschutz“ ohne Zieljahr — TODO(T-132) Programm Kapitel Klima |

</details>

---

### Volt — 3 offen · 4 🤖 maschinell · 0 ✅ menschlich

Programm: https://voltdeutschland.org/storage/assets-berlin/pdf/policy-wahlprogramm-2026/wahlprogramm-edited-20-7.pdf

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| ☐ | Sprach-, Beratungs- und Integrationsangebote sollen deutlic… | +1 | „„Berlin verbindet“ macht Integration zum Standortvorteil: Englisch als zweiter Servicespr…“ | Volt Berlin – Programm 2026, Kapitel Be… | |
| 🤖 | Bauämter und Genehmigungsverfahren sollen konsequent digita… | +1 | „Mit der Genehmigungsfiktion gelten vollständige Anträge nach Fristablauf automatisch als …“ | Volt Berlin – Programm 2026, Kapitel Be… | |
| ☐ | Berlin soll verbindliche Hitzeschutzprogramme für obdachlos… | +1 | „Housing First als wirksames Mittel gegen Obdachlosigkeit; Schwammstadt gegen Hitze und St…“ | Volt Berlin – Programm 2026, Kapitel Be… | |
| 🤖 | Der Radverkehrsausbau (geschützte Radwege, Radvorrang) soll… | +1 | „Sichere Rad- und Gehwege und saubere Kieze.“ | Volt Berlin – Programm 2026, Kapitel Be… | |
| 🤖 | Behördengänge (Anträge, Bescheinigungen, Termine) sollen fl… | +1 | „Eine digitale Verwaltung, die an Ergebnissen gemessen wird; mit dem Once-Only-Prinzip geb…“ | Volt Berlin – Programm 2026, Kapitel Be… | |
| ☐ | Berliner Clubs und die Nachtwirtschaft sollen durch Spielst… | +1 | „Eine Kulturpolitik, die Clubs und freie Szene verlässlich absichert.“ | Volt Berlin – Programm 2026, Kapitel Be… | |
| 🤖 | Günstige Sozialtickets sollen ausgebaut und der öffentliche… | +1 | „Ein verlässlicher ÖPNV bis in die Außenbezirke.“ | Volt Berlin – Programm 2026, Kapitel Be… | |

---

### DKP — 3 offen · 4 🤖 maschinell · 0 ✅ menschlich

Programm: https://berlin.dkp.de/wp-content/uploads/sites/83/2026/04/Wahlprogramm.pdf

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| ☐ | Polizeiliche Eingriffsbefugnisse (z. B. Einsatz von Stanzer… | +1 | „Gegen den Ausbau des Polizeiapparates [und für den Widerstand dagegen].“ | Unsere Zeit (UZ) 24/2026 | |
| 🤖 | Der Sanierungsstau bei Schulen soll durch ein deutlich besc… | +1 | „Geld für Wohnungen, Schulen, Krankenhäuser und Kultur statt für Panzer, Drohnen und Muste…“ | DKP Berlin – Leitartikel zur Kandidatur | |
| 🤖 | Berlin soll zusätzliche Investitionen in Wohnen, Infrastruk… | +1 | „Unsere Stadt braucht Geld für Wohnungen, Schulen, Krankenhäuser und Kultur statt für Panz…“ | DKP Berlin – Leitartikel zur Kandidatur | |
| ☐ | Berlin soll deutlich mehr Polizistinnen und Polizisten eins… | -2 | „Die DKP richtet sich gegen … den Ausbau des Polizeiapparates.“ | Unsere Zeit (UZ) 24/2026 – Bericht zur … | |
| 🤖 | Ein dauerhaftes Privatisierungsverbot für landeseigene Wohn… | +1 | „Privaten Wohnungskonzernen muss der Zugriff auf Berliner Wohnungen verboten werden.“ | DKP Berlin – Wahlprogramm AGH 2026 (PDF) | |
| ☐ | Hohe Einkommen und Vermögen sollen in Berlin stärker besteu… | +1 | „Wir müssen den Griff der Banken, Konzerne und Superreichen auf Berlin brechen.“ | DKP Berlin – Leitartikel zur Kandidatur | |
| 🤖 | Die Wohnungsbestände großer, renditeorientierter Wohnungsko… | +2 | „Privaten Wohnungskonzernen muss der Zugriff auf Berliner Wohnungen verboten werden. Die F…“ | DKP Berlin – Wahlprogramm AGH 2026 (PDF) | |

---

### SGP — 4 offen · 7 🤖 maschinell · 0 ✅ menschlich

Programm: https://www.wsws.org/de/articles/2026/07/10/sgpb-j10.html

| Status | These | Haltung | Zitat (Auszug) | Quelle | Notiz |
|:--|-------|--------:|----------------|--------|-------|
| ☐ | Sprach-, Beratungs- und Integrationsangebote sollen deutlic… | +1 | „[Industrielle Kapazitäten] müssen genutzt werden, um … Flüchtlinge menschenwürdig aufzune…“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| 🤖 | Die Videoüberwachung in öffentlichen Räumen (z. B. Bahnhöfe… | -1 | „Die Überwachung wird ausgebaut … [das kritisieren wir ausdrücklich].“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| ☐ | Polizeiliche Eingriffsbefugnisse (z. B. Einsatz von Stanzer… | +1 | „Gegen das Aufrüsten von Polizei und Geheimdiensten und die Vorbereitung des Staatsapparat…“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| ☐ | Der Sanierungsstau bei Schulen soll durch ein deutlich besc… | +1 | „Wachsende Armut, explodierende Mieten, zerfallende Schulen und Krankenhäuser … [fordern d…“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| 🤖 | Abgelehnte Asylbewerberinnen und Asylbewerber sollen konseq… | -1 | „Die SGP tritt für die prinzipielle Verteidigung aller Flüchtlinge und eingewanderten Arbe…“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| 🤖 | Berlin soll zusätzliche Investitionen in Wohnen, Infrastruk… | +1 | „Die reichlich vorhandenen industriellen und technologischen Kapazitäten müssen genutzt we…“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| 🤖 | Berlin soll deutlich mehr Polizistinnen und Polizisten eins… | -2 | „Die Überwachung wird ausgebaut, Polizei und Geheimdienste werden aufgerüstet und der gesa…“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| 🤖 | Zur Sanierung des Haushalts soll das Personal in der Berlin… | -2 | „Die SGP kämpft für die Verteidigung jedes Arbeitsplatzes und gegen sämtliche Kürzungen be…“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| 🤖 | Günstige Sozialtickets sollen ausgebaut und der öffentliche… | +1 | „Er streicht mehr als 600 Millionen Euro im öffentlichen Nahverkehr … [diese Kürzungspolit…“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| ☐ | Hohe Einkommen und Vermögen sollen in Berlin stärker besteu… | +1 | „In den vergangenen 15 Jahren hat sich das Vermögen der 500 reichsten Personen in Deutschl…“ | SGP – Wahlerklärung Berlinwahl 2026 | |
| 🤖 | Die Wohnungsbestände großer, renditeorientierter Wohnungsko… | +2 | „Deshalb müssen die Banken, Konzerne und Milliardenvermögen enteignet, unter demokratische…“ | SGP – Wahlerklärung Berlinwahl 2026 (10… | |
