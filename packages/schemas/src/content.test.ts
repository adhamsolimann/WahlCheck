import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadContent, loadPositions, loadParties, loadTheses } from "./node.js";

const contentRoot = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../../content",
);

const EXPECTED_PARTY_IDS = [
  "afd",
  "gruene",
  "bsw",
  "dkp",
  "die-urbane",
  "fdp",
  "oedp",
  "pdf",
  "die-partei",
  "tierschutzpartei",
  "sgp",
  "volt",
  "spd",
  "cdu",
  "linke",
  "bergpartei",
  "heimat",
];

describe("Berlin 2026 content bundle", () => {
  const { parties, theses, positions } = loadContent(contentRoot);

  it("contains all 17 ballot parties with unique ids", () => {
    expect(parties).toHaveLength(17);
    const ids = parties.map((p) => p.id);
    expect(new Set(ids).size).toBe(parties.length);
    for (const expected of EXPECTED_PARTY_IDS) {
      expect(ids, `missing party ${expected}`).toContain(expected);
    }
  });

  it("marks the five projected parliamentary parties as tier 'parliament'", () => {
    const parliament = parties.filter((p) => p.tier === "parliament").map((p) => p.id);
    expect(parliament.sort()).toEqual(["afd", "cdu", "gruene", "linke", "spd"].sort());
  });

  it("has unique thesis ids and at least the seed set", () => {
    expect(theses.length).toBeGreaterThanOrEqual(5);
    const ids = theses.map((t) => t.id);
    expect(new Set(ids).size).toBe(theses.length);
  });

  it("quick-mode theses stay within budget once content grows", () => {
    const quick = theses.filter((t) => t.quickMode);
    expect(quick.length).toBeLessThanOrEqual(15);
  });

  it("every position references an existing party and thesis", () => {
    const partyIds = new Set(parties.map((p) => p.id));
    const thesisIds = new Set(theses.map((t) => t.id));
    for (const [partyId, list] of loadPositions(contentRoot)) {
      expect(partyIds.has(partyId), `positions file for unknown party ${partyId}`).toBe(true);
      for (const pos of list) {
        expect(thesisIds.has(pos.thesisId), `${partyId}: unknown thesis ${pos.thesisId}`).toBe(true);
      }
    }
    // every seeded position file belongs to a ballot party
    for (const partyId of positions.keys()) {
      expect(partyIds.has(partyId)).toBe(true);
    }
  });

  it("clear positions carry a justification quote or source label", () => {
    for (const [, list] of positions) {
      for (const pos of list) {
        if (pos.status === "clear") {
          expect(
            pos.justificationQuote ?? pos.sourceLabel ?? pos.sourceUrl,
            `no provenance for ${pos.thesisId}`,
          ).toBeDefined();
        }
      }
    }
  });
});

describe("loader robustness", () => {
  it("throws ContentValidationError listing problems for broken content", () => {
    expect(() => loadTheses(join(contentRoot, "_does-not-exist"))).toThrowError(
      /Missing content directory/,
    );
  });
});

// silence unused warnings for re-exported helpers used by other packages' docs
void loadParties;
void loadContent;
