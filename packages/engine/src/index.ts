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
  /** Belege aus der Parteiposition (auch bei neutral/none, soweit vorhanden) */
  justificationQuote?: string;
  sourceLabel?: string;
  sourceUrl?: string;
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
        justificationQuote: position?.justificationQuote,
        sourceLabel: position?.sourceLabel,
        sourceUrl: position?.sourceUrl,
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

/* ------------------------------------------------------------------ */
/* Political compass projection                                        */
/* ------------------------------------------------------------------ */

/** Eine These mit redaktionell festgelegter Achsen-Richtung. */
export interface DirectedThesis {
  thesisId: string;
  /**
   * +1: positive Stance (+2) bedeutet positiven Achsenwert (z. B. progressiv)
   * −1: positive Stance bedeutet negativen Achsenwert
   * Dokumentationspflicht: jede Zuweisung muss in der Methodik-Seite
   * begründet sein.
   */
  direction: 1 | -1;
}

export interface AxisProjection {
  /** Position auf der Achse in [-100..100]; null wenn keine Überschneidung */
  x: number | null;
  /** Anzahl verwertbarer Thesen im Scope */
  n: number;
}

interface AxisEntry {
  thesisId: string;
  stance: number; // -2..+2
  weight: number; // >= 0
}

/**
 * Projiziert Stance-Einträge gewichtet auf eine Achse:
 *
 *   x = Σ(w_i × direction_i × stance_i) / Σ(w_i × 2) × 100
 *
 * Einträge zu Thesen außerhalb des Achsen-Scopes werden ignoriert,
 * ebenso weight <= 0. Ergebnis null bei leerer Schnittmenge — Aufrufer
 * entscheiden, wie sie damit umgehen (z. B. Partei ausblenden).
 */
export function projectOnAxis(
  entries: AxisEntry[],
  directed: DirectedThesis[],
): AxisProjection {
  const byThesis = new Map(directed.map((d) => [d.thesisId, d.direction]));
  let sum = 0;
  let weightSum = 0;

  for (const entry of entries) {
    if (entry.weight <= 0) continue;
    const direction = byThesis.get(entry.thesisId);
    if (direction === undefined) continue;
    sum += entry.weight * direction * entry.stance;
    weightSum += entry.weight * 2; // Normierung auf [-1..1] pro These
  }

  return {
    x: weightSum > 0 ? Math.round((sum / weightSum) * 1000) / 10 : null,
    n: entries.filter((e) => e.weight > 0 && byThesis.has(e.thesisId)).length,
  };
}

/* ------------------------------------------------------------------ */
/* Seats & coalitions                                                  */
/* ------------------------------------------------------------------ */

export interface SeatShare {
  partyId: string;
  /** Prozentwert der Zweitstimme (0–100) */
  percent: number;
}

export type SeatAllocation = Record<string, number>;

/**
 * Sitzverteilung nach Sainte-Laguë (Höchstzahlverfahren mit Divisoren
 * 1, 3, 5, …). Vereinfachtes Modell: reine Zweitstimmen-Verteilung auf
 * `totalSeats` — Überhang-/Pauschsitze (Berlin) sind ohne Wahlkreis-
 * prognosen vor der Wahl nicht modellierbar und bleiben bewusst außen vor.
 *
 * Parteien unter `opts.threshold` Prozent werden vollständig ausgeschlossen.
 */
export function sainteLague(
  shares: SeatShare[],
  totalSeats: number,
  opts?: { threshold?: number },
): SeatAllocation {
  const threshold = opts?.threshold ?? 0;
  const passing = shares.filter((s) => s.percent >= threshold);
  const seats: SeatAllocation = {};
  for (const s of passing) seats[s.partyId] = 0;

  for (let seat = 0; seat < totalSeats; seat++) {
    let bestId: string | null = null;
    let bestQuotient = -1;
    for (const s of passing) {
      const quotient = s.percent / (2 * seats[s.partyId] + 1);
      if (quotient > bestQuotient) {
        bestQuotient = quotient;
        bestId = s.partyId;
      }
    }
    if (bestId !== null) seats[bestId] += 1;
  }

  return seats;
}

export interface CoalitionOption {
  members: string[];
  totalSeats: number;
}

/**
 * Enumeriert alle Koalitionen (1 bis maxMembers Parteien), die gemeinsam
 * mindestens `majority` Sitze erreichen. Sortierung: Sitze absteigend,
 * dann Mitgliederzahl aufsteigend.
 */
export function feasibleCoalitions(
  seats: SeatAllocation,
  majority: number,
  maxMembers = 4,
): CoalitionOption[] {
  const ids = Object.keys(seats).filter((id) => seats[id] > 0);
  const options: CoalitionOption[] = [];
  const n = ids.length;

  for (let mask = 1; mask < 1 << n; mask++) {
    const members: string[] = [];
    let total = 0;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        members.push(ids[i]);
        total += seats[ids[i]];
      }
    }
    if (members.length <= maxMembers && total >= majority) {
      options.push({ members, totalSeats: total });
    }
  }

  return options.sort(
    (a, b) =>
      b.totalSeats - a.totalSeats ||
      a.members.length - b.members.length ||
      a.members.join(",").localeCompare(b.members.join(",")),
  );
}
