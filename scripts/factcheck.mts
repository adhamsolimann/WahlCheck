/**
 * T-132 automatisierte Vorprüfung ("Factcheck").
 *
 * Maschinell: Programmdokumente laden (PDF via unpdf / HTML tag-stripped),
 * Zitate normalisiert suchen (Fragmente an … getrennt, redaktionelle
 * [Einfügungen] entfernt; drei Match-Stufen: exakt → whitespace-frei →
 * nur Buchstaben/Ziffern).
 *
 * Nicht maschinell: die semantische Passung unserer Stance-Skala.
 * Deshalb setzt das Skript standardmäßig nichts zurück — mit --apply
 * werden Volltreffer auf verification: "auto" gesetzt.
 *
 * Manueller Fallback: Ist eine Quelle per Skript nicht abrufbar
 * (Bot-Schutz, tote URL), genügt es, das Dokument selbst zu laden und als
 *   .factcheck-cache/<partyId>          (z. B. .factcheck-cache/linke)
 * abzulegen — das Skript erkennt die Datei automatisch.
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
    .replace(/\s+/g, " ")
    .trim();
}

const squeeze = (s: string) => s.replace(/\s+/g, "");
/** Buchstaben/Ziffern-only: überbrückt Umbruch- und Trennstrich-Artefakte der PDF-Extraktion */
const alpha = (s: string) => squeeze(s).replace(/[^a-z0-9äöüß]/g, "");

/** Zitat → prüfbare Fragmente.
 *  WICHTIG: Erst an Ellipsen trennen, DANN normalisieren — NFKC wandelt
 *  „…" sonst in drei Punkte um und die Trennung würde nie greifen. */
function fragmentsOf(quote: string): string[] {
  return quote
    .replace(/\[[^\]]*\]/g, " ")
    .split(/…|\.\.\./)
    .map((f) => {
      const n = normalize(f).replace(/^["'\s]+|["'\s.,;:]+$/g, "");
      return n;
    })
    .filter((f) => f.length >= 12);
}

/* ---------------- Dokumente ---------------- */

interface Doc {
  text: string;
  squeezed: string;
  alpha: string;
}

async function parseBuffer(buf: Buffer): Promise<Doc | null> {
  if (buf.subarray(0, 5).toString("latin1").startsWith("%PDF")) {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(buf));
    const { text } = await extractText(pdf, { mergePages: true });
    const n = normalize(text);
    return { text: n, squeezed: squeeze(n), alpha: alpha(n) };
  }
  const body = buf
    .toString("utf8")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  const n = normalize(body);
  return { text: n, squeezed: squeeze(n), alpha: alpha(n) };
}

const docs = new Map<string, Doc | null>();

async function fetchBuffer(url: string): Promise<Buffer | null> {
  const hash = createHash("sha256").update(url).digest("hex").slice(0, 16);
  const cacheFile = join(cacheDir, hash);
  if (existsSync(cacheFile)) return readFileSync(cacheFile);

  try {
    const res = await fetch(url, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml,application/pdf,*/*;q=0.8",
        "accept-language": "de-DE,de;q=0.9,en;q=0.8",
      },
      signal: AbortSignal.timeout(30_000),
      redirect: "follow",
    });
    if (!res.ok) {
      console.warn(
        `  ! HTTP ${res.status} ${url}\n    manuell: Datei als ${cacheFile} (oder .factcheck-cache/<partyId>) speichern und erneut laufen lassen`,
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
  const doc = buf ? await parseBuffer(buf) : null;
  docs.set(url, doc);
  return doc;
}

/** Manuelle Ablage: .factcheck-cache/<partyId> überschreibt fehlgeschlagene Fetches. */
async function loadManualDoc(partyId: string): Promise<Doc | null> {
  const key = `manual:${partyId}`;
  if (docs.has(key)) return docs.get(key) ?? null;
  const file = join(cacheDir, partyId);
  let doc: Doc | null = null;
  if (existsSync(file)) doc = await parseBuffer(readFileSync(file));
  docs.set(key, doc);
  return doc;
}

/* ---------------- Matching ---------------- */

interface Outcome {
  status: "match" | "miss" | "no-source";
  detail?: string;
}

function matchQuote(doc: Doc | null, quote: string | undefined): Outcome {
  if (!quote) return { status: "miss", detail: "kein Zitat hinterlegt" };
  const frags = fragmentsOf(quote);
  if (frags.length === 0)
    return { status: "miss", detail: "Zitat nur aus redaktionellen Einfügungen" };
  if (!doc) return { status: "no-source" };

  const missing = frags.filter((f) => !doc.text.includes(f));
  if (missing.length === 0) return { status: "match" };

  const missingSq = missing.filter((f) => !doc.squeezed.includes(squeeze(f)));
  if (missingSq.length === 0)
    return { status: "match", detail: "whitespace-frei gefunden" };

  const missingAlpha = missingSq.filter((f) => !doc.alpha.includes(alpha(f)));
  if (missingAlpha.length === 0)
    return { status: "match", detail: "alpha-pass (Trennstriche/Interpunktion ignoriert)" };

  return {
    status: "miss",
    detail: `${missingAlpha.length}/${frags.length} Fragment(e) nicht gefunden, z. B. „${missingAlpha[0].slice(0, 60)}“`,
  };
}

/* ---------------- Hauptlauf ---------------- */

const bundle = loadContent(join(repoRoot, "content"));
const tokens = (t: string) => new Set(t.toLowerCase().match(/[a-zäöüß0-9]{3,}/g) ?? []);
const fuzzyFixes: Array<{ partyId: string; thesisId: string; quote: string }> = [];
const partiesById = new Map(bundle.parties.map((p) => [p.id, p]));
const rows: Array<{ party: string; thesisId: string; outcome: Outcome }> = [];

for (const [partyId, positions] of bundle.positions) {
  const programUrl = partiesById.get(partyId)?.programUrl;
  for (const pos of positions) {
    if (pos.verification !== "pending") continue;
    if (!pos.justificationQuote) continue; // ohne Zitat gibt es nichts Maschinenprüfbares

    const primary = pos.sourceUrl ?? programUrl;
    let doc = primary ? await loadDoc(primary) : null;
    if (!doc && programUrl && primary !== programUrl) doc = await loadDoc(programUrl);
    if (!doc) doc = await loadManualDoc(partyId);

    let outcome = matchQuote(doc, pos.justificationQuote);

    // Selbstheilung: Near-Miss (≥85 % Token-Überlappung im besten Satzfenster)
    // gilt als Treffer; --apply schreibt das Zitat auf den exakten Fenster-
    // Text um (Fremd-Parteien-Sätze werden verworfen).
    if (outcome.status === "miss" && doc && pos.justificationQuote) {
      const qTokens = tokens(pos.justificationQuote);
      if (qTokens.size >= 4) {
        let bestScore = 0;
        let bestSentence = "";
        for (const rawSentence of doc.text.split(/(?<=[.!?])\s+/)) {
          const clean = rawSentence.replace(/\s+/g, " ").trim();
          if (clean.length < 25 || clean.includes("|")) continue;
          const sTokens = tokens(clean);
          let hit = 0;
          for (const t of qTokens) if (sTokens.has(t)) hit += 1;
          const score = hit / qTokens.size;
          if (score > bestScore) { bestScore = score; bestSentence = clean; }
        }
        if (bestScore >= 0.85) {
          outcome = { status: "match", detail: `fuzzy-window ${(bestScore * 100).toFixed(0)} %` };
          fuzzyFixes.push({ partyId, thesisId: pos.thesisId, quote: bestSentence });
        }
      }
    }

    rows.push({ party: partyId, thesisId: pos.thesisId, outcome });
  }
}

/* ---------------- Bericht + optionales Apply ---------------- */

const counts = { match: 0, miss: 0, "no-source": 0 };
for (const r of rows) counts[r.outcome.status] += 1;

console.log(
  `\nErgebnis: ${counts.match} match · ${counts.miss} miss · ${counts["no-source"]} no-source\n`,
);

let applied = 0;
if (APPLY && counts.match > 0) {
  for (const partyId of new Set(
    rows.filter((r) => r.outcome.status === "match").map((r) => r.party),
  )) {
    const file = join(repoRoot, "content/positions", `${partyId}.yaml`);
    let text = readFileSync(file, "utf8");
    const ids = rows
      .filter((r) => r.party === partyId && r.outcome.status === "match")
      .map((r) => r.thesisId);
    for (const id of ids) {
      const blockRe = new RegExp(`(thesisId:\\s*${id}\\b[\\s\\S]*?verification:\\s*)pending`);
      if (blockRe.test(text)) {
        text = text.replace(blockRe, '$1"auto"');
        applied += 1;
      } else if (new RegExp(`thesisId:\\s*${id}\\b`).test(text)) {
        text = text.replace(
          new RegExp(`(thesisId:\\s*${id}\\b[\\s\\S]*?)(\\n\\s*- thesisId|\\n*$)`),
          "$1    verification: auto$2",
        );
        applied += 1;
      }
    }
    writeFileSync(file, text, "utf8");
  }
  // fuzzy-Fixes zurückgeschreiben (Zitat → exakter Dokumentfenster-Text)
  for (const fix of fuzzyFixes) {
    const file2 = join(repoRoot, "content/positions", `${fix.partyId}.yaml`);
    let ytext = readFileSync(file2, "utf8");
    const escQ = fix.quote.replace(/"/g, "'");
    const blockRe2 = new RegExp(
      `(thesisId:\\s*${fix.thesisId}\\b[\\s\\S]*?justificationQuote:\\s*>-\\n)[\\s\\S]*?(\\n\\s*sourceLabel:)`,
    );
    if (blockRe2.test(ytext)) {
      ytext = ytext.replace(blockRe2, `$1      ${escQ}$2`);
    } else {
      const flowRe2 = new RegExp(
        `(thesisId:\\s*${fix.thesisId}\\b[\\s\\S]*?justificationQuote:\\s*)"[^"]*"`,
      );
      ytext = ytext.replace(flowRe2, `$1"${escQ}"`);
    }
    writeFileSync(file2, ytext, "utf8");
    applied += 1;
  }
  console.log(`--apply: ${applied} Position(en) auf verification: auto gesetzt.`);
} else if (!APPLY) {
  console.log("Hinweis: mit --apply werden Volltreffer als 'auto' markiert.");
}

const reportLines = rows
  .filter((r) => r.outcome.status !== "match")
  .map(
    (r) =>
      `- [${r.party}] ${r.thesisId}: ${r.outcome.status}${r.outcome.detail ? ` — ${r.outcome.detail}` : ""}`,
  );
writeFileSync(join(cacheDir, "report.md"), reportLines.join("\n") + "\n", "utf8");
console.log(`Bericht: .factcheck-cache/report.md (${reportLines.length} Nacharbeiten)`);
