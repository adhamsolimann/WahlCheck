import raw from "@/generated/content.json";
import type { ChangelogEntry, ElectionPolls, NewsEntry, Party, Position, Thesis } from "@wahlen/schemas";

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
  polls: ElectionPolls[];
  changelog: ChangelogEntry[];
  news: NewsEntry[];
}

export const content = raw as unknown as ContentBundle;

export const partiesById = new Map(content.parties.map((p) => [p.id, p]));

/** Öffentliches Änderungslog — neueste Einträge zuerst (Build sortiert). */
export const changelog = content.changelog;

/** Presse-Spiegel — neueste zuerst (Build sortiert). */
export const news = content.news;

/** Wahl-Trend-Snapshot dieser Edition (genau einer pro Wahl). */
export function electionPolls(): ElectionPolls {
  if (content.polls.length === 0) {
    throw new Error("kein Wahltrend-Snapshot im Content-Bundle");
  }
  return content.polls[0];
}

export function thesesForMode(mode: "quick" | "full"): Thesis[] {
  return mode === "quick" ? content.theses.filter((t) => t.quickMode) : content.theses;
}

/** Positionen, die sich auf genau den übergebenen Thesen-Scope beziehen
 *  (die Engine wirft absichtlich bei unbekannten Thesis-Referenzen). */
export function positionsFor(theses: Thesis[]): ContentBundle["positions"] {
  const ids = new Set(theses.map((t) => t.id));
  return content.positions.filter((p) => ids.has(p.thesisId));
}
