import { describe, expect, it } from "vitest";
import {
  PartySchema,
  PositionSchema,
  ThesisSchema,
  UserAnswerSchema,
} from "./index.js";

describe("PartySchema", () => {
  const valid = {
    id: "spd",
    name: "Sozialdemokratische Partei Deutschlands",
    shortName: "SPD",
    tier: "parliament",
    listType: "bezirksliste",
    colorHex: "#E2001A",
    summary: "Sozialdemokratische Partei; stellt den Regierenden Bürgermeister.",
    profileComplete: false,
  };

  it("accepts a valid party and applies defaults", () => {
    const parsed = PartySchema.parse(valid);
    expect(parsed.leadership).toEqual([]);
    expect(parsed.bezirke).toEqual([]);
  });

  it("rejects invalid hex color", () => {
    expect(() =>
      PartySchema.parse({ ...valid, colorHex: "red" }),
    ).toThrowError();
  });

  it("rejects unknown extra keys (typos)", () => {
    expect(() =>
      PartySchema.parse({ ...valid, colourHex: "#E2001A" }),
    ).toThrowError();
  });

  it("rejects ids that are not kebab-case", () => {
    expect(() => PartySchema.parse({ ...valid, id: "Die Linke" })).toThrowError();
  });
});

describe("ThesisSchema", () => {
  const valid = {
    id: "mietendeckel-landeseigene",
    topicId: "wohnen",
    text: "Für die landeseigenen Wohnungsunternehmen soll ein Mietendeckel eingeführt werden.",
    rationale:
      "Zentrale Differenzlinie im Wahlkampf und Thema mit höchster Wählersalienz.",
    sources: [{ label: "rbb24 Wohnungs-Check", url: "https://example.com" }],
    quickMode: true,
  };

  it("accepts a valid thesis", () => {
    expect(() => ThesisSchema.parse(valid)).not.toThrowError();
  });

  it("rejects unknown topic ids", () => {
    expect(() =>
      ThesisSchema.parse({ ...valid, topicId: "außenpolitik" }),
    ).toThrowError();
  });

  it("requires at least one source", () => {
    expect(() => ThesisSchema.parse({ ...valid, sources: [] })).toThrowError();
  });
});

describe("PositionSchema", () => {
  it("requires a stance when status is 'clear'", () => {
    expect(() =>
      PositionSchema.parse({
        thesisId: "mietendeckel-landeseigene",
        stance: null,
        status: "clear",
      }),
    ).toThrowError();

    expect(
      PositionSchema.parse({ thesisId: "t", stance: -1, status: "clear" }).stance,
    ).toBe(-1);
  });

  it("forbids stances for 'neutral' and 'none'", () => {
    expect(() =>
      PositionSchema.parse({
        thesisId: "t",
        stance: 2,
        status: "neutral",
      }),
    ).toThrowError();
    expect(() =>
      PositionSchema.parse({ thesisId: "t", stance: 0, status: "none" }),
    ).toThrowError();
  });

  it("defaults verification to 'pending'", () => {
    const parsed = PositionSchema.parse({
      thesisId: "t",
      stance: 2,
      status: "clear",
    });
    expect(parsed.verification).toBe("pending");
  });

  it("rejects out-of-range stances", () => {
    expect(() =>
      PositionSchema.parse({ thesisId: "t", stance: 3, status: "clear" }),
    ).toThrowError();
  });
});

describe("UserAnswerSchema", () => {
  it("allows skipped answers (stance null)", () => {
    const parsed = UserAnswerSchema.parse({ thesisId: "t", stance: null });
    expect(parsed.weight).toBe(1);
  });

  it("rejects weights outside 1..5", () => {
    expect(() =>
      UserAnswerSchema.parse({ thesisId: "t", stance: 1, weight: 6 }),
    ).toThrowError();
  });
});
