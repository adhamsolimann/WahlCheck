import raw from "@/generated/content.json";
import type { Party, Position, Thesis } from "@wahlen/schemas";

/**
 * Vom Build-Skript (scripts/gen-content.mts) erzeugtes, schema-validiertes
 * Content-Bundle. Wurde beim Generieren bereits vollständig validiert;
 * hier nur noch Typisierung.
 */
export interface ContentBundle {
  generatedAt: string;
  parties: Party[];
  theses: Thesis[];
  positions: Array<Position & { partyId: string }>;
}

export const content = raw as unknown as ContentBundle;

export const partiesById = new Map(content.parties.map((p) => [p.id, p]));

export function thesesForMode(mode: "quick" | "full"): Thesis[] {
  return mode === "quick" ? content.theses.filter((t) => t.quickMode) : content.theses;
}

/** Positionen, die sich auf genau den übergebenen Thesen-Scope beziehen
 *  (die Engine wirft absichtlich bei unbekannten Thesis-Referenzen). */
export function positionsFor(theses: Thesis[]): ContentBundle["positions"] {
  const ids = new Set(theses.map((t) => t.id));
  return content.positions.filter((p) => ids.has(p.thesisId));
}
