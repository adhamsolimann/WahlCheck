/**
 * Build-time content pipeline: lädt /content (YAML), validiert alles gegen die
 * Zod-Schemas und schreibt ein flaches JSON-Bundle für die Web-App.
 *
 * Ausführen: pnpm --filter @wahlen/web exec tsx ../../scripts/gen-content.mts
 * (wird automatisch von predev/prebuild der App aufgerufen)
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
// Relativer TS-Import (nicht Paketname): das Skript liegt außerhalb der
// Workspace-Packages und hat keinen eigenen node_modules-Link.
import { loadContent, loadPolls } from "../packages/schemas/src/node.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(repoRoot, "content");
const outFile = join(
  repoRoot,
  "apps/web/src/generated/content.json",
);

const bundle = loadContent(contentRoot);
const polls = loadPolls(contentRoot);

// Positions für die Engine flatten (ScopedPosition: partyId an jeder Position)
const flatPositions = [...bundle.positions.entries()].flatMap(([partyId, list]) =>
  list.map((position) => ({ partyId, ...position })),
);

// Stabiles Feld-Layout für den Client
const out = {
  generatedAt: new Date().toISOString(),
  parties: bundle.parties,
  theses: bundle.theses,
  positions: flatPositions,
  polls,
};

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, `${JSON.stringify(out, null, 2)}\n`, "utf8");

const clearCount = flatPositions.filter((p) => p.status === "clear").length;
console.log(
  `✓ content.json: ${bundle.parties.length} Parteien, ${bundle.theses.length} Thesen, ` +
    `${flatPositions.length} Positionen (${clearCount} klar, ${flatPositions.length - clearCount} neutral/ohne Angabe), ` +
    `${polls.length} Wahl-Trend-Snapshot(s)`,
);
