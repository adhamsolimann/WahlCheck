/**
 * Füllt fehlende Positionen durch Keyword-Suche in den gecachten
 * Programmtexten. Generiert nur Kandidaten — Stance-Zuordnung erfolgt
 * über linguistische Kontext-Analyse (pro/kontra Indikatoren).
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { loadContent } from "../packages/schemas/src/node.ts";

const root = new URL("..", import.meta.url).pathname;
const bundle = loadContent(join(root, "content"));
const cacheDir = join(root, ".factcheck-cache");
const APPLY = process.argv.includes("--apply");

// ---- Programtexte laden ----
const PROGRAM_FILES: Record<string, string> = {
  spd: "spd.txt", gruene: "gruene.txt", linke: "linke",
  cdu: "cdu.txt", afd: "afd.txt",
};

const docs = new Map<string, string>();
for (const [pid, fn] of Object.entries(PROGRAM_FILES)) {
  const p = join(cacheDir, fn);
  if (!existsSync(p)) continue;
  const buf = readFileSync(p);
  if (buf.subarray(0,5).toString("latin1").startsWith("%PDF")) continue; // PDF braucht unpdf
  docs.set(pid, buf.toString("utf8").replace(/\s+/g, " "));
}
// Auch manuelle Dateien laden
for (const pid of ["gruene", "linke", "tierschutzpartei", "volt"]) {
  const p = join(cacheDir, pid);
  if (existsSync(p)) {
    const buf = readFileSync(p);
    if (buf.subarray(0,5).toString("latin1").startsWith("%PDF")) continue;
    docs.set(pid, buf.toString("utf8").replace(/\s+/g, " "));
  }
}

// Für PDF-Dateien: via tsx-extrahierte .txt-Dateien prüfen
for (const [pid, txtFile] of [["gruene","gruene.txt"],["linke","linke-berlin.txt"],["spd","spd.txt"]] as const) {
  const p = join(cacheDir, txtFile);
  if (existsSync(p)) {
    docs.set(pid, readFileSync(p, "utf8").replace(/\s+/g, " "));
  }
}

function norm(t:string) { return t.replace(/\s+/g," ").trim(); }
function alpha(t:string) { return t.toLowerCase().replace(/[^a-zäöüß0-9]/g,""); }
function tokens(t:string) { return new Set(norm(t).match(/[a-zäöüß]{4,}/g) ?? []); }

function findBestWindow(doc: string, keywords: string[], minLen = 60): string | null {
  const sentences = doc.split(/(?<=[.!?])\s+/);
  let best = { score: 0, text: "" };
  for (const s of sentences) {
    const lower = s.toLowerCase();
    let hits = 0;
    for (const kw of keywords) if (lower.includes(kw.toLowerCase())) hits++;
    if (hits > best.score) best = { score: hits, text: s.trim() };
  }
  return best.score >= 2 ? best.text : null;
}

function detectStance(sentence: string, posWords: string[], negWords: string[]): number | null {
  const lower = sentence.toLowerCase();
  let pos = 0, neg = 0;
  for (const w of posWords) if (lower.includes(w)) pos++;
  for (const w of negWords) if (lower.includes(w)) neg++;
  if (pos > neg) return 1;
  if (neg > pos) return -1;
  if (pos === 0 && neg === 0) return null;
  return 0; // gemischt
}

// ---- These-spezifische Suchkonfiguration ----
interface GapDef {
  thesisId: string;
  keywords: string[];
  /** Wörter die auf Zustimmung hindeuten */
  proSignals: string[];
  /** Wörter die auf Ablehnung hindeuten */
  contraSignals: string[];
  /** Parteien die diese These NICHT adressieren (erwartbar) */
  skipParties?: string[];
}

const GAPS: GapDef[] = [
  { thesisId: "ausbau-videoueberwachung-oeffentlicher-raeume",
    keywords: ["Videoüberwachung", "Kameras öffentlich"],
    proSignals: ["ausbauen", "mehr", "verstärken", "flächendeckend"],
    contraSignals: ["abschaffen", "gegen", "stoppen", "ablehnen"],
    skipParties: ["gruene"] },
  { thesisId: "begrenzung-polizeilicher-befugnisse",
    keywords: ["Befugnisse begrenzen", "polizeiliche Befugnisse einschränken", "Gefahrengebiete abschaffen"],
    proSignals: ["begrenzen", "einschränken", "reduzieren", "abschaffen"],
    contraSignals: ["ausbauen", "erweitern", "mehr Befugnisse"],
    skipParties: [] },
  { thesisId: "erleichterte-abschiebungen",
    keywords: ["Abschiebung beschleunigen", "Rückführungen priorisieren", "Ausreisepflichtige abschieben"],
    proSignals: ["beschleunigen", "priorisieren", "forcieren", "konsequent"],
    contraSignals: ["stoppen", "gegen", "keine Abschiebung"],
    skipParties: [] },
  { thesisId: "gemeinschaftsschule-fuer-alle",
    keywords: ["Gemeinschaftsschule einführen", "Gemeinschaftsschulen ausbauen", "Schule für alle"],
    proSignals: ["einführen", "schrittweise", "ausbauen", "für"],
    contraSignals: ["beibehalten", "gegliedert", "Gymnasium stärken"],
    skipParties: [] },
  { thesisId: "haushaltsnotlage-investitionen-ueber-neue-kredite",
    keywords: ["Sondervermögen Investitionen", "Kredite für Investitionen", "mehr Geld für Berlin"],
    proSignals: ["nutzen", "erhöhen", "investieren", "einführen"],
    contraSignals: [""],
    skipParties: [] },
  { thesisId: "klimaneutralitaet-bis-2045",
    keywords: ["klimaneutral 2045", "Klimaneutralität 2045", "klimaneutral werden"],
    proSignals: ["2045", "spätestens", "ziel", "verbindlich"],
    contraSignals: ["ideologisch", "unrealistisch", "gefährdet Versorgung"],
    skipParties: [] },
  { thesisId: "mehr-polizeipersonal",
    keywords: ["mehr Polizisten", "Polizei personal aufstocken", "Einstellung von Polizisten"],
    proSignals: ["mehr", "deutlich", "aufstocken", "einstellen"],
    contraSignals: ["abbauen", "reduzieren", "dagegen"],
    skipParties: [] },
  { thesisId: "personalabbau-in-der-verwaltung",
    keywords: ["Personalabbau Verwaltung", "schlanker Staat", "Bürokratie abbauen"],
    proSignals: ["abbauen", "schlanker", "verschlanken", "reduzieren"],
    contraSignals: ["aufbauen", "stärken", "personalmehr"],
    skipParties: [] },
  { thesisId: "staerkere-besteurung-hoher-einkommen",
    keywords: ["Reiche besteuern", "Vermögenssteuer", "höhere Besteuerung", "Millionäre besteuern"],
    proSignals: ["besteuern", "erhöhen", "einführen", "Umverteilung"],
    contraSignals: ["ablehnen", "gegen", "senken"],
    skipParties: [] },
  { thesisId: "stopp-der-a100-verlaengerung",
    keywords: ["A100 stoppen", "A100 beenden", "nicht weiterbauen", "Weiterbau stoppen"],
    proSignals: ["stoppen", "beenden", "stopp"],
    contraSignals: ["unterstützen", "weiterbauen", "Realisierung"],
    skipParties: [] },
  { thesisId: "tempo30-auf-hauptverkehrsstrassen",
    keywords: ["Tempo 30 Hauptverkehrsstraßen", "flächendeckend Tempo 30"],
    proSignals: ["flächendeckend", "überall", "einführen"],
    contraSignals: ["ablehnen", "nicht", "gegen"],
    skipParties: [] },
];

// ---- Ausführen ----
let filled = 0, skipped = 0;
const yamlUpdates: Array<{file: string; entry: string}> = [];

for (const gap of GAPS) {
  for (const pid of Object.keys(PROGRAM_FILES)) {
    if (gap.skipParties?.includes(pid)) continue;

    // Check ob bereits eine klare Position existiert
    const posFile = join(root, "content/positions", `${pid}.yaml`);
    if (!existsSync(posFile)) continue;
    const yamlText = readFileSync(posFile, "utf8");
    const blockPat = new RegExp(`thesisId:\\s*${gap.thesisId}\\b[\\s\\S]*?verification:\\s*"auto"`);
    if (blockPat.test(yamlText)) continue; // bereits auto-verified

    // Bereits pending mit Quote? Skip auch.
    const pendPat = new RegExp(`thesisId:\\s*${gap.thesisId}\\b[\\s\\S]*?status:\\s*"clear"`);
    if (pendPat.test(yamlText)) continue; // hat schon eine klare Position

    // Im Dokument suchen
    const doc = docs.get(pid);
    if (!doc) { skipped++; continue; }

    let found = false;
    for (const kw of gap.keywords) {
      const idx = doc.toLowerCase().indexOf(kw.toLowerCase());
      if (idx >= 0) {
        const s = Math.max(0, idx - 80);
        const e = Math.min(doc.length, idx + 250);
        const snippet = doc.slice(s, e).trim();

        // Stance bestimmen aus Kontext
        const lowerSnippet = snippet.toLowerCase();
        let stance = 0;
        let posHits = 0, negHits = 0;
        for (const pw of gap.proSignals) if (lowerSnippet.includes(pw)) posHits++;
        for (const cw of gap.contraSignals) if (lowerSnippet.includes(cw)) negHits++;

        if (posHits > negHits) stance = 1;
        else if (negHits > posHits) stance = -1;
        else stance = 0;

        if (stance === 0) { skipped++; break; }

        const entry = `  - thesisId: ${gap.thesisId}\n` +
          `    stance: ${stance}\n    status: clear\n` +
          `    justificationQuote: >-\n      ${snippet.slice(0, 200)}\n` +
          `    sourceLabel: "${pid.toUpperCase()} Wahlprogramm"\n` +
          `    verification: pending\n`;
        yamlUpdates.push({ file: posFile, entry });
        filled++;
        console.log(`FILL [${pid}] ${gap.thesisId} → stance:${stance}`);
        console.log(`  …${snippet.slice(0,120)}…\n`);
        found = true;
        break;
      }
    }
    if (!found) { skipped++; }
  }
}

console.log(`\n=== Ergebnis: ${filled} füllbar, ${skipped} keine Belege ===`);

if (APPLY && yamlUpdates.length > 0) {
  // Nach Partei gruppieren und in Dateien schreiben
  const byFile = new Map<string, string[]>();
  for (const u of yamlUpdates) {
    if (!byFile.has(u.file)) byFile.set(u.file, []);
    byFile.get(u.file)!.push(u.entry);
  }
  for (const [file, entries] of byFile) {
    let s = readFileSync(file, "utf8");
    // An letzte Position anhängen (vor dem Ende)
    const insertPos = s.lastIndexOf("\n");
    s = s.slice(0, insertPos) + "\n" + entries.join("\n") + "\n" + s.slice(insertPos);
    writeFileSync(file, s, "utf8");
    console.log(`✓ ${file} aktualisiert (+${entries.length})`);
  }
}
