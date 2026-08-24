/**
 * Repariert Paraphrase-Zitate gegen die tatsächlich abrufbare Quelle:
 * sucht im Dokument das Satzfenster mit der höchsten Token-Übereinstimmung
 * zum aktuellen Zitat und ersetzt das Zitat durch diesen wörtlichen Satz.
 *
 * Nur mit --apply werden YAML-Dateien verändert. Alles unter
 * Token-Abdeckung 0.55 bleibt unberührt (manuelle Nacharbeit).
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadContent } from "../packages/schemas/src/node.ts";

const APPLY = process.argv.includes("--apply");
const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const ONLY = onlyArg ? onlyArg.split("=")[1].split(",") : null;
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cacheDir = join(repoRoot, ".factcheck-cache");

const norm = (t: string) =>
  t.normalize("NFKC").toLowerCase().replace(/[\u00AD]/g, "").replace(/\s+/g, " ").trim();
const tokens = (t: string) => norm(t).match(/[a-zäöüß0-9]{3,}/g) ?? [];

function sentences(doc: string): string[] {
  return doc.split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter((x) => x.length > 25);
}

async function docFor(url: string): Promise<string | null> {
  const hash = createHash("sha256").update(url).digest("hex").slice(0, 16);
  for (const f of [join(cacheDir, hash), join(cacheDir, hash)]) {
    if (existsSync(f)) {
      const buf = readFileSync(f);
      if (buf.subarray(0, 5).toString("latin1").startsWith("%PDF")) {
        try {
          const { extractText, getDocumentProxy } = await import("unpdf");
          const pdf = await getDocumentProxy(new Uint8Array(buf));
          const { text } = await extractText(pdf, { mergePages: true });
          return text;
        } catch {
          return null;
        }
      }
      return buf.toString("utf8")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ");
    }
  }
  // fetchen
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/126 Safari/537.36" },
      signal: AbortSignal.timeout(30_000),
      redirect: "follow",
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    mkdirSync(cacheDir, { recursive: true });
    writeFileSync(join(cacheDir, hash), buf);
    if (buf.subarray(0, 5).toString("latin1").startsWith("%PDF")) {
      const { extractText, getDocumentProxy } = await import("unpdf");
      const pdf = await getDocumentProxy(new Uint8Array(buf));
      const { text } = await extractText(pdf, { mergePages: true });
      return text.replace(/\s+/g, " ");
    }
    return buf.toString("utf8")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ");
  } catch {
    return null;
  }
}
import { mkdirSync } from "node:fs";

const FOREIGN_PARTY = /\b(SPD|CDU|CSU|Grünen|Linke|AfD|FDP|BSW|Volt|ÖDP|DKP|SGP)\b/i;

function bestSentence(
  doc: string | null,
  quote: string,
  ownPartyShort: string,
): { sentence: string; score: number } | null {
  if (!doc) return null;
  const q = new Set(tokens(quote));
  if (q.size < 4) return null;
  let best: { sentence: string; score: number } | null = null;
  for (const raw of sentences(doc)) {
    const s = raw.replace(/\s+/g, " ").trim();
    if (s.includes("|")) continue; // Navigations-/Tabellenmüll
    const other = s.match(FOREIGN_PARTY);
    if (other && !s.toLowerCase().includes(ownPartyShort.toLowerCase())) continue; // über andere Partei
    const st = new Set(tokens(s));
    let hit = 0;
    for (const tok of q) if (st.has(tok)) hit += 1;
    const score = hit / q.size;
    if (!best || score > best.score) best = { sentence: s, score };
  }
  return best && best.score >= 0.55 ? best : null;
}

/* ---------------- Lauf ---------------- */

const bundle = loadContent(join(repoRoot, "content"));
let applied = 0;
let skipped = 0;
const log: string[] = [];

for (const [partyId, positions] of bundle.positions) {
  if (ONLY && !ONLY.includes(partyId)) continue;
  if (positions.every((p) => p.verification !== "pending")) continue;
  const file = join(repoRoot, "content/positions", `${partyId}.yaml`);
  let yamlText = APPLY ? readFileSync(file, "utf8") : "";

  for (const pos of positions) {
    if (pos.verification !== "pending") continue;
    if (!pos.justificationQuote || pos.status !== "clear") continue;
    if (partyId === "tierschutzpartei") continue; // Plakat-Zitate: visuelle Prüfung

    const url = pos.sourceUrl ?? bundle.parties.find((p) => p.id === partyId)?.programUrl;

    let doc: string | null = null;
    const manualFile = join(cacheDir, partyId);
    if (existsSync(manualFile)) {
      const buf = readFileSync(manualFile);
      if (buf.subarray(0, 5).toString("latin1").startsWith("%PDF")) {
        try {
          const { extractText, getDocumentProxy } = await import("unpdf");
          const pdf = await getDocumentProxy(new Uint8Array(buf));
          const { text } = await extractText(pdf, { mergePages: true });
          doc = text.replace(/\s+/g, " ");
        } catch {
          doc = null;
        }
      } else {
        doc = buf.toString("utf8")
          .replace(/<script[\s\S]*?<\/script>/gi, " ")
          .replace(/<style[\s\S]*?<\/style>/gi, " ")
          .replace(/<[^>]+>/g, " ");
      }
    }
    if (!doc && url) {
      doc = await docFor(url);
    }
    if (!doc) continue;
    const ownShort =
      bundle.parties.find((p) => p.id === partyId)?.shortName ?? partyId;
    const best = bestSentence(doc, pos.justificationQuote, ownShort);
    if (!best || best.score < 0.55) {
      skipped += 1;
      log.push(`SKIP [${partyId}] ${pos.thesisId}: beste Abdeckung ${best ? (best.score * 100).toFixed(0) + " %" : "–"}`);
      continue;
    }

    log.push(`FIX  [${partyId}] ${pos.thesisId}: ${(best.score * 100).toFixed(0)} % → „${best.sentence.slice(0, 70)}…“`);
    if (APPLY) {
      const esc = best.sentence.replace(/\\/g, "").replace(/"/g, "'");
      const blockRe = new RegExp(
        `(thesisId:\\s*${pos.thesisId}\\b[\\s\\S]*?justificationQuote:\\s*)"[^"]*"`,
      );
      if (blockRe.test(yamlText)) {
        yamlText = yamlText.replace(blockRe, `$1"${esc}"`);
        applied += 1;
      }
    }
  }

  if (APPLY) writeFileSync(file, yamlText, "utf8");
}

console.log(log.join("\n"));
console.log(`\n${APPLY ? "angewendet" : "Vorschlag"}: ${applied}  ·  übersprungen: ${skipped}`);
