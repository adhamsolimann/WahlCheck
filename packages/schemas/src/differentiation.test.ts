import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { describe, it } from "vitest";
import { loadPositions, loadTheses } from "./node.js";

const contentRoot = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../content",
);

/**
 * ADVISORY — schlägt nie fehl, meldet aber Thesen mit unzureichender
 * Differenzierung (Akzeptanzkriterium aus T-101). Sobald der Content
 * vollständig ist (T-104/T-105), sollte daraus ein harter CI-Check werden:
 * dann `expect(warnings).toEqual([])`.
 *
 * Kriterien je These:
 *  - mind. 3 Parteien mit klarer Position (status 'clear')
 *  - mind. 2 verschiedene Stance-Werte unter diesen Positionen
 */
describe("thesis differentiation report", () => {
  it("reports theses with insufficient party differentiation", () => {
    const theses = loadTheses(contentRoot);
    const positions = loadPositions(contentRoot);

    const byThesis = new Map<string, Array<{ stance: number | null; status: string }>>();
    for (const [, list] of positions) {
      for (const pos of list) {
        const arr = byThesis.get(pos.thesisId) ?? [];
        arr.push({ stance: pos.stance, status: pos.status });
        byThesis.set(pos.thesisId, arr);
      }
    }

    const warnings: string[] = [];
    for (const thesis of theses) {
      const clear = (byThesis.get(thesis.id) ?? []).filter((p) => p.status === "clear");
      const distinct = new Set(clear.map((p) => p.stance)).size;
      if (clear.length < 3 || distinct < 2) {
        warnings.push(
          `${thesis.id}: ${clear.length} klare Positionen, ${distinct} verschiedene Werte`,
        );
      }
    }

    if (warnings.length > 0) {
      console.warn(
        `[differentiation] ${warnings.length}/${theses.length} Thesen brauchen mehr Quellen/Positionen:\n` +
          warnings.map((w) => `  - ${w}`).join("\n"),
      );
    }

    // Struktur-Sanity bleibt hart geprüft:
    const unknown = [...byThesis.keys()].filter(
      (id) => !theses.some((t) => t.id === id),
    );
    if (unknown.length > 0) throw new Error(`unknown thesis ids: ${unknown.join(", ")}`);
  });
});
