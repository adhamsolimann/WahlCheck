import type { Party, Position, Thesis, UserAnswer } from "@wahlen/schemas";

/* ------------------------------------------------------------------ */
/* Public result types                                                 */
/* ------------------------------------------------------------------ */

export type ConfidenceBand = "high" | "medium" | "low" | "insufficient";

export interface ThesisBreakdownEntry {
  thesisId: string;
  /** User stance on the -2..+2 Likert scale (null entries are skipped upstream) */
  userStance: number;
  weight: number;
  /** false = für diese Partei nicht verwertbar ("keine Angabe") */
  included: boolean;
  partyStatus: Position["status"];
  partyStance?: number;
  /** agreement ∈ [0..1]; nur gesetzt wenn included */
  agreement?: number;
  /** weight × (1 − agreement); nur gesetzt wenn included */
  weightedDisagreement?: number;
}

export interface PartyResult {
  partyId: string;
  /** 0–100 mit einer Nachkommastelle; null wenn keine verwertbare These */
  matchPercent: number | null;
  /** Anzahl vom Nutzer beantworteter (nicht übersprungener) Thesen gesamt */
  answeredTheses: number;
  /** davon für diese Partei verwertbare Thesen */
  applicableTheses: number;
  coverage: number;
  confidence: ConfidenceBand;
  breakdown: ThesisBreakdownEntry[];
}

/* ------------------------------------------------------------------ */
/* Scoring                                                             */
/* ------------------------------------------------------------------ */

const MAX_STANCE_DISTANCE = 4; // Abstand zwischen -2 und +2

/**
 * Übereinstimmung einer Nutzerposition mit einer klaren Parteiposition.
 * 1.0 = identisch, 0.0 = maximale Gegensätzlichkeit.
 */
function clearAgreement(userStance: number, partyStance: number): number {
  return 1 - Math.abs(userStance - partyStance) / MAX_STANCE_DISTANCE;
}

export interface ComputeInput {
  answers: UserAnswer[];
  theses: Thesis[];
  /**
   * Parteipositionen inkl. Partei-Bezug. Im Content-Modell sind Positionen
   * je Partei gruppiert (positions/{partyId}.yaml) — Loader/Caller flatten
   * diese zu ScopedPosition.
   */
  positions: ScopedPosition[];
}

export type ScopedPosition = Position & { partyId: string };

/**
 * Berechnet das Matching-Ergebnis je Partei.
 *
 * Formel (dokumentiert in /docs/methodology):
 *   match = Σ(w_i × agree_i) / Σ(w_i) × 100   über alle beantworteten Thesen,
 *
 * - übersprungene Thesen (stance === null) fließen nirgendwo ein
 * - Parteiposition "neutral" erhält unabhängig von der Nutzerposition 0.5 Kredit
 * - Parteiposition "none"/fehlend: These wird nur für diese Partei excluded
 *   (Zähler UND Nenner)
 *
 * Ergebnisse sind bewusst NICHT sortiert — Präsentation über `rankResults`.
 */
export function computeResults({ answers, theses, positions }: ComputeInput): PartyResult[] {
  const knownTheses = new Set(theses.map((t) => t.id));

  // letzte Antwort pro These gewinnt
  const byThesisUser = new Map<string, UserAnswer>();
  for (const answer of answers) {
    if (!knownTheses.has(answer.thesisId)) {
      throw new Error(`answer references unknown thesis ${answer.thesisId}`);
    }
    byThesisUser.set(answer.thesisId, answer);
  }

  const answered = [...byThesisUser.values()].filter((a) => a.stance !== null);

  const positionsByParty = new Map<string, Map<string, ScopedPosition>>();
  for (const position of positions) {
    if (!knownTheses.has(position.thesisId)) {
      throw new Error(`position references unknown thesis ${position.thesisId}`);
    }
    let inner = positionsByParty.get(position.partyId);
    if (!inner) {
      inner = new Map();
      positionsByParty.set(position.partyId, inner);
    }
    inner.set(position.thesisId, position);
  }

  const results: PartyResult[] = [];

  for (const [partyId, inner] of positionsByParty.entries()) {
    let numerator = 0;
    let denominator = 0;
    const breakdown: ThesisBreakdownEntry[] = [];

    for (const answer of answered) {
      const stance = answer.stance as number; // durch Filter oben != null
      const position = inner.get(answer.thesisId);
      const status: Position["status"] = position ? position.status : "none";
      const entry: ThesisBreakdownEntry = {
        thesisId: answer.thesisId,
        userStance: stance,
        weight: answer.weight,
        included: status !== "none" && position !== undefined,
        partyStatus: status,
      };

      if (position && status !== "none") {
        const agreement =
          status === "neutral" || position.stance === null
            ? 0.5
            : clearAgreement(stance, position.stance);
        numerator += answer.weight * agreement;
        denominator += answer.weight;
        entry.agreement = agreement;
        entry.weightedDisagreement = answer.weight * (1 - agreement);
        if (position.stance !== null) entry.partyStance = position.stance;
      }

      breakdown.push(entry);
    }

    const applicableTheses = breakdown.filter((b) => b.included).length;
    const matchPercent =
      denominator > 0 ? Math.round((numerator / denominator) * 1000) / 10 : null;
    const coverage = answered.length > 0 ? applicableTheses / answered.length : 0;

    results.push({
      partyId,
      matchPercent,
      answeredTheses: answered.length,
      applicableTheses,
      coverage,
      confidence:
        denominator === 0
          ? "insufficient"
          : coverage >= 0.8
            ? "high"
            : coverage >= 0.5
              ? "medium"
              : "low",
      breakdown,
    });
  }

  return results;
}

/* ------------------------------------------------------------------ */
/* Presentation helpers                                                */
/* ------------------------------------------------------------------ */

const TIER_ORDER: Party["tier"][] = ["parliament", "small", "contextual"];

/**
 * Sortiert Ergebnisse für die Anzeige:
 * erst nach Tier (parlamentrelevant → klein → kontextualisiert),
 * innerhalb des Tiers nach matchPercent absteigend (null/insufficient zuletzt),
 * Gleichstand alphabetisch nach shortName.
 */
export function rankResults(results: PartyResult[], parties: Party[]): PartyResult[] {
  const byId = new Map(parties.map((p) => [p.id, p]));
  return [...results].sort((a, b) => {
    const tierA = TIER_ORDER.indexOf(byId.get(a.partyId)?.tier ?? "contextual");
    const tierB = TIER_ORDER.indexOf(byId.get(b.partyId)?.tier ?? "contextual");
    if (tierA !== tierB) return tierA - tierB;

    const pctA = a.matchPercent ?? -1;
    const pctB = b.matchPercent ?? -1;
    if (pctA !== pctB) return pctB - pctA;

    const nameA = byId.get(a.partyId)?.shortName ?? a.partyId;
    const nameB = byId.get(b.partyId)?.shortName ?? b.partyId;
    return nameA.localeCompare(nameB, "de");
  });
}
