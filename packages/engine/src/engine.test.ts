import type { Party, Position, Thesis, UserAnswer } from "@wahlen/schemas";
import { describe, expect, it } from "vitest";
import {
  computeResults,
  rankResults,
  type PartyResult,
  type ScopedPosition,
} from "./index.js";

function thesis(id: string): Thesis {
  return {
    id,
    topicId: "wohnen",
    text: `${id} soll umgesetzt werden.`,
    rationale: "Test-Fixture",
    quickMode: false,
    sources: [{ label: "fixture", url: "https://example.com" }],
  };
}

function pos(
  partyId: string,
  thesisId: string,
  stance: number | null,
  status: Position["status"] = "clear",
): ScopedPosition {
  return { partyId, thesisId, stance, status, verification: "pending" };
}

const THESES = ["t1", "t2", "t3", "t4"].map(thesis);

/** Nutzer: t1:+2(w2) · t2:-1(w1) · t3 übersprungen · t4:0(w5) */
function answers(): UserAnswer[] {
  return [
    { thesisId: "t1", stance: 2, weight: 2 },
    { thesisId: "t2", stance: -1, weight: 1 },
    { thesisId: "t3", stance: null, weight: 3 },
    { thesisId: "t4", stance: 0, weight: 5 },
  ];
}

describe("computeResults — golden cases", () => {
  it("computes hand-verified percentages, coverage and confidence", () => {
    const positions: ScopedPosition[] = [
      // Partei A: volle Übereinstimmung auf allen verwertbaren Thesen
      pos("a", "t1", 2),
      pos("a", "t2", -1),
      pos("a", "t4", 0),
      // Partei B: maximale Distanz bei t1 (→0), halbe Distanz sonst
      pos("b", "t1", -2), // agree 0
      pos("b", "t2", 1), // |−1−1|=2 → 0.5
      pos("b", "t4", 2), // |0−2|=2 → 0.5
      // Partei C: t1 neutral (0.5 Kredit), t2 fehlt (excluded)
      pos("c", "t1", null, "neutral"),
      pos("c", "t4", 2),
    ];

    const results = computeResults({ answers: answers(), theses: THESES, positions });
    const byParty = Object.fromEntries(results.map((r) => [r.partyId, r]));

    // A: num = 2·1 + 1·1 + 5·1 = 8, den = 8 → 100 %
    expect(byParty.a.matchPercent).toBe(100);
    expect(byParty.a.applicableTheses).toBe(3);
    expect(byParty.a.coverage).toBe(1);
    expect(byParty.a.confidence).toBe("high");

    // B: num = 0 + 0.5 + 2.5 = 3, den = 8 → 37.5 %
    expect(byParty.b.matchPercent).toBe(37.5);
    expect(byParty.b.confidence).toBe("high");

    // C: t2 excluded; num = 2·0.5 + 5·0.5 = 3.5, den = 7 → 50 %
    expect(byParty.c.matchPercent).toBe(50);
    expect(byParty.c.applicableTheses).toBe(2);
    expect(byParty.c.coverage).toBeCloseTo(2 / 3);
    expect(byParty.c.confidence).toBe("medium");
  });

  it("excludes a missing position only for that party, not globally", () => {
    const results = computeResults({
      answers: answers(),
      theses: THESES,
      positions: [
        pos("with-all", "t1", 2),
        pos("with-all", "t2", -1),
        pos("with-all", "t4", 0),
        // 'partial' hat t2 nicht → nur für diese Partei excluded
        pos("partial", "t1", 2),
        pos("partial", "t4", 0),
      ],
    });
    const byParty = Object.fromEntries(results.map((r) => [r.partyId, r]));
    expect(byParty["with-all"].matchPercent).toBe(100);
    expect(byParty.partial.matchPercent).toBe(100); // beide verbleibenden identisch
    expect(byParty.partial.applicableTheses).toBe(2);
    expect(byParty.partial.confidence).toBe("medium");
  });

  it("gives neutral party stances exactly 0.5 credit regardless of user stance", () => {
    const mk = (userStance: number): UserAnswer[] => [
      { thesisId: "t1", stance: userStance, weight: 1 },
    ];
    const positions = [pos("p", "t1", null, "neutral")];

    const extremeYes = computeResults({
      answers: mk(2),
      theses: [thesis("t1")],
      positions,
    })[0];
    const extremeNo = computeResults({
      answers: mk(-2),
      theses: [thesis("t1")],
      positions,
    })[0];

    expect(extremeYes.matchPercent).toBe(50);
    expect(extremeNo.matchPercent).toBe(50);
  });

  it("lets higher weights flip the ranking between two parties", () => {
    const base = [
      { thesisId: "t1", stance: -2, weight: 1 },
      { thesisId: "t2", stance: 2, weight: 1 },
    ];
    const boosted = [{ ...base[0], weight: 5 }, base[1]];
    const positions = [pos("left", "t1", -2), pos("left", "t2", -2), pos("right", "t1", 2), pos("right", "t2", 2)];

    const evenRanks = computeResults({
      answers: base,
      theses: THESES.slice(0, 2),
      positions,
    });
    const byEven = Object.fromEntries(evenRanks.map((r) => [r.partyId, r]));
    expect(byEven.left.matchPercent).toBe(byEven.right.matchPercent);

    const weighted = computeResults({
      answers: boosted,
      theses: THESES.slice(0, 2),
      positions,
    });
    expect(weighted[0].partyId).toBe("left"); // w5×agree1 vs w1×agree0 schlägt um
  });

  it("handles all-skipped users with insufficient band and null percent", () => {
    const results = computeResults({
      answers: [{ thesisId: "t1", stance: null, weight: 2 }],
      theses: THESES,
      positions: [pos("a", "t1", 2)],
    });
    expect(results).toHaveLength(1);
    expect(results[0].matchPercent).toBeNull();
    expect(results[0].confidence).toBe("insufficient");
    expect(results[0].breakdown).toHaveLength(0);
  });

  it("reports low confidence below 50% coverage", () => {
    const results = computeResults({
      answers: answers(),
      theses: THESES,
      positions: [pos("a", "t1", 2)], // 1 von 3 beantworteten Thesen
    });
    expect(results[0].confidence).toBe("low");
  });

  it("throws on references to unknown theses", () => {
    expect(() =>
      computeResults({
        answers: [{ thesisId: "ghost", stance: 1, weight: 1 }],
        theses: THESES,
        positions: [],
      }),
    ).toThrowError(/unknown thesis/);
    expect(() =>
      computeResults({
        answers: [],
        theses: THESES,
        positions: [pos("a", "ghost", 1)],
      }),
    ).toThrowError(/unknown thesis/);
  });

  it("uses the last answer when a thesis is answered twice", () => {
    const results = computeResults({
      answers: [
        { thesisId: "t1", stance: -2, weight: 1 },
        { thesisId: "t1", stance: 2, weight: 1 },
      ],
      theses: THESES,
      positions: [pos("a", "t1", 2)],
    });
    expect(results[0].matchPercent).toBe(100);
    expect(results[0].answeredTheses).toBe(1);
  });
});

describe("rankResults", () => {
  function party(id: string, tier: Party["tier"], shortName = id) {
    return {
      id,
      name: id,
      shortName,
      tier,
      listType: "landesliste" as const,
      bezirke: [] as string[],
      colorHex: "#000000",
      summary: "x".repeat(40),
      leadership: [],
      profileComplete: true,
    };
  }

  const parties = [party("small1", "small"), party("ctx", "contextual"), party("parl-b", "parliament"), party("parl-a", "parliament")];

  const results: PartyResult[] = [
    { partyId: "ctx", matchPercent: 90, answeredTheses: 3, applicableTheses: 3, coverage: 1, confidence: "high", breakdown: [] },
    { partyId: "parl-b", matchPercent: 80, answeredTheses: 3, applicableTheses: 3, coverage: 1, confidence: "high", breakdown: [] },
    { partyId: "parl-a", matchPercent: null, answeredTheses: 3, applicableTheses: 0, coverage: 0, confidence: "insufficient", breakdown: [] },
    { partyId: "small1", matchPercent: 99, answeredTheses: 3, applicableTheses: 3, coverage: 1, confidence: "high", breakdown: [] },
  ];

  it("orders by tier first, then percent desc, insufficient last within tier", () => {
    const ranked = rankResults(results, parties);
    expect(ranked.map((r) => r.partyId)).toEqual(["parl-b", "parl-a", "small1", "ctx"]);
  });
});
