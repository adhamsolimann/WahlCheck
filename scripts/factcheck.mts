/**
 * T-132 automatisierte Vorprüfung ("Factcheck").
 *
 * Was die Maschine tut:
 *   1. Programmdokumente laden (Cache unter .factcheck-cache/, gitignored)
 *   2. Text extrahieren (PDF via unpdf, HTML tag-stripped)
 *   3. Jedes justificationQuote normalisiert im Dokument suchen
 *      (Fragmente an „…"/[...] getrennt; eckige Klammern = redaktionelle
 *       Einfügungen werden vor dem Match entfernt)
 *
 * Was sie NICHT tut: bewerten, ob unsere Stance-Skala den Sinn trifft.
 * Deshalb schreibt das Skript standardmäßig NICHTS zurück — erst mit
 * `--apply` werden Volltreffer auf `verification: "auto"` gesetzt.
 * Fuzzy-Treffer und Fehlschläge bleiben `pending` (Mensch entscheidet).
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadContent } from "../packages/schemas/src/node.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cacheDir = join(repoRoot, ".factcheck-cache");
const APPLY = process.argv.includes("--apply");

/* ---------------- Normalisierung & Fragmente ---------------- */

function normalize(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\u00AD\u2010\u2011]/g, "") // weiche/gebundene Trennstriche
    .replace(/[‐-―]/g, "-")
    .replace(/[„“‚‘'‹›«»]/g, '"')
    .replace(/…/g, "…")
    .replace(/\s+/g, " ")
    .trim();
}

const squeeze = (s: string) => s.replace(/\s+/g, "");
/** Buchstaben/Ziffern-only: überbrückt Umbruch- und Trennstrich-Artefakte der PDF-Extraktion */
const alpha = (s: string) => squeeze(s).replace(/[^a-z0-9äöüß]/g, "");

/** Zitat → prüfbare Fragmente (ohne redaktionelle [Einfügungen], ohne Kürzungen). */
function fragmentsOf(quote: string): string[] {
  return normalize(
    quote
      .replace(/\[[^\]]*\]/g, " ") // redaktionelle Einfügungen entfernen
      .replace(/\.\.\./g, "…"),
  )
    .split("…")
    .map((f) => f.replace(/^["'\s]+|["'\s.,;:]+$/g, ""))
    .filter((f) => f.length >= 12);
}

/* ---------------- Dokument-Beschaffung ---------------- */

interface Doc {
  text: string;
  squeezed: string;
  alpha: string;
}

const docs = new Map<string, Doc | null>(); // null = Beschaffung fehlgeschlagen

async function fetchBuffer(url: string): Promise<Buffer | null> {
  const hash = createHash("sha256").update(url).digest("hex").slice(0, 16);
  const cacheFile = join(cacheDir, hash);
  if (existsSync(cacheFile)) return readFileSync(cacheFile);

  const ua =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
  try {
    const res = await fetch(url, {
      headers: {
        "user-agent": ua,
        accept: "text/html,application/xhtml+xml,application/pdf,*/*;q=0.8",
        "accept-language": "de-DE,de;q=0.9,en;q=0.8",
      },
      signal: AbortSignal.timeout(30_000),
      redirect: "follow",
    });
    if (!res.ok) {
      console.warn(
        `  ! HTTP ${res.status} ${url}\n    manuell: Datei herunterladen und als ${cacheFile} speichern, dann erneut laufen lassen`,
      );
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    mkdirSync(cacheDir, { recursive: true });
    writeFileSync(cacheFile, buf);
    return buf;
  } catch (err) {
    console.warn(`  ! FETCH-Fehler ${url}: ${String(err).slice(0, 80)}`);
    return null;
  }
}

async function loadDoc(url: string): Promise<Doc | null> {
  if (docs.has(url)) return docs.get(url) ?? null;

  const buf = await fetchBuffer(url);
  let doc: Doc | null = null;
  if (buf) {
    const head = buf.subarray(0, 5).toString("latin1");
    if (head.startsWith("%PDF")) {
      try {
        const { extractText, getDocumentProxy } = await import("unpdf");
        const pdf = await getDocumentProxy(new Uint8Array(buf));
        const { text } = await extractText(pdf, { mergePages: true });
        doc = { text: normalize(text), squeezed: squeeze(normalize(text)), alpha: alpha(normalize(text)) };
      } catch (err) {
        console.warn(`  ! PDF-Extraktion fehlgeschlagen ${url}: ${String(err).slice(0, 60)}`);
      }
    } else {
      // HTML → Tags entfernen
      const html = buf.toString("utf8");
      const body = html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ");
      doc = { text: normalize(body), squeezed: squeeze(normalize(body)), alpha: alpha(normalize(body)) };
    }
  }

  docs.set(url, doc);
  return doc;
}

/* ---------------- Matching ---------------- */

interface Outcome {
  status: "match" | "fuzzy" | "miss" | "no-source" | "unreachable";
  detail?: string;
}

function matchQuote(doc: Doc | null, quote: string | undefined): Outcome {
  if (!quote) return { status: "miss", detail: "kein Zitat hinterlegt" };
  const frags = fragmentsOf(quote);
  if (frags.length === 0)
    return { status: "miss", detail: "Zitat nur aus redaktionellen Einfügungen" };
  if (!doc) return { status: "unreachable" };

  const missing = frags.filter((f) => !doc.text.includes(f));
  if (missing.length === 0) return { status: "match" };

  const missingSq = frags.filter((f) => !doc.squeezed.includes(squeeze(f)));
  if (missingSq.length === 0) return { status: "fuzzy", detail: "whitespace-frei gefunden" };

  const missingAlpha = missingSq.filter((f) => !doc.alpha.includes(alpha(f)));
  if (missingAlpha.length === 0) return { status: "match", detail: "alpha-pass (Trennstriche/Interpunktion ignoriert)" };

  return {
    status: "miss",
    detail: `${missingAlpha.length}/${frags.length} Fragment(e) nicht gefunden, z. B. „${missingAlpha[0].slice(0, 60)}“`,
  };
}

/* ---------------- Hauptlauf ---------------- */

const bundle = loadContent(join(repoRoot, "content"));
const rows: Array<{
  party: string;
  thesisId: string;
  outcome: Outcome;
}> = [];

console.log(`Lade Programmdokumente …`);
for (const [partyId, positions] of bundle.positions) {
  for (const pos of positions) {
    if (pos.verification !== "pending") continue;
    if (!pos.justificationQuote) continue; // ohne Zitat gibt es nichts Maschinenprüfbares
    const url =
      pos.sourceUrl ??
      parties_sourceFallback(bundle.parties.find((p) => p.id === partyId)?.programUrl);
    if (!url) {
      rows.push({ party: partyId, thesisId: pos.thesisId, outcome: { status: "no-source" } });
      continue;
    }
    const doc = await loadDoc(url);
    const outcome = matchQuote(doc, pos.justificationQuote);
    rows.push({ party: partyId, thesisId: pos.thesisId, outcome });
  }
}

// Sekundärquelle rückfallebene: Parteiprogramm-URL der Partei
function parties_sourceFallback(programUrl?: string): string | undefined {
  return programUrl;
}

/* ---------------- Bericht + optionales Apply ---------------- */

const counts = { match: 0, fuzzy: 0, miss: 0, "no-source": 0, unreachable: 0 } as Record<string, number>;
for (const r of rows) counts[r.outcome.status] += 1;

console.log(`\nErgebnis: ${counts.match} match · ${counts.fuzzy} fuzzy · ${counts.miss} miss · ${counts.unreachable} unreachable · ${counts["no-source"]} no-source\n`);

let applied = 0;
if (APPLY && counts.match > 0) {
  for (const partyId of new Set(rows.filter((r) => r.outcome.status === "match").map((r) => r.party))) {
    const file = join(repoRoot, "content/positions", `${partyId}.yaml`);
    let text = readFileSync(file, "utf8");
    const ids = rows.filter((r) => r.party === partyId && r.outcome.status === "match").map((r) => r.thesisId);
    for (const id of ids) {
      // Gezielt innerhalb des Eintragsblocks den verification-Token tauschen
      const blockRe = new RegExp(`(thesisId:\\s*${id}\\b[\\s\\S]*?verification:\\s*)pending`, "");
      if (blockRe.test(text)) {
        text = text.replace(blockRe, `$1"auto"`);
        applied += 1;
      } else if (new RegExp(`thesisId:\\s*${id}\\b`).test(text)) {
        // Eintrag hat kein verification-Feld (Default pending) → Feld ergänzen
        text = text.replace(
          new RegExp(`(thesisId:\\s*${id}\\b[\\s\\S]*?)(\\n\\s*- thesisId|\\n*$)`),
          `$1    verification: auto$2`,
        );
        applied += 1;
      }
    }
    writeFileSync(file, text, "utf8");
  }
  console.log(`--apply: ${applied} Position(en) auf verification: auto gesetzt.`);
} else if (!APPLY) {
  console.log("Hinweis: mit --apply werden Volltreffer als 'auto' markiert.");
}

// Maschinenlesbarer Bericht für die manuelle Nacharbeit
const reportLines = rows
  .filter((r) => r.outcome.status !== "match")
  .map((r) => `- [${r.party}] ${r.thesisId}: ${r.outcome.status}${r.outcome.detail ? ` — ${r.outcome.detail}` : ""}`);
writeFileSync(
  join(repoRoot, ".factcheck-cache", "report.md"),
  reportLines.join("\n") + "\n",
  "utf8",
);
console.log(`Bericht: .factcheck-cache/report.md (${reportLines.length} Nacharbeiten)`);
