import type { UserAnswer } from "@wahlen/schemas";
import { thesesForMode } from "./content";
import { getPersona, NO_PERSONA } from "./personas";

/**
 * Lokale Session — bewusst NUR im localStorage (Art. 9 DSGVO: politische
 * Meinungsdaten verlassen das Gerät nicht; es gibt keinen Serverpfad dafür).
 */

export const SESSION_KEY = "wahlcheck.session.v1";

export type Mode = "quick" | "full";

export interface Session {
  v: 1;
  mode: Mode;
  personaId: string;
  /** thesisId → Stance (-2..+2) */
  stances: Record<string, number>;
  /** explizit übersprungene Thesen */
  skips: string[];
  /** nutzerübersteuerte Gewichtung pro These */
  weights: Record<string, number>;
}

const EMPTY: Session = { v: 1, mode: "quick", personaId: NO_PERSONA, stances: {}, skips: [], weights: {} };

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (parsed.v !== 1 || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function newSession(mode: Mode, personaId: string): Session {
  return { ...EMPTY, mode, personaId };
}

/** Startgewichtung einer These: Persona-Preset oder 1 */
export function baseWeight(session: Session, topicId: string): number {
  const persona = getPersona(session.personaId);
  return persona.topicWeights[topicId as keyof typeof persona.topicWeights] ?? 1;
}

/** Effektive Nutzerantworten für die Engine (nicht übersprungene Thesen). */
export function toEngineAnswers(
  session: Session,
  mode: Mode = session.mode,
): UserAnswer[] {
  const skipSet = new Set(session.skips);
  return thesesForMode(mode)
    .filter((t) => session.stances[t.id] !== undefined && !skipSet.has(t.id))
    .map((t) => ({
      thesisId: t.id,
      stance: session.stances[t.id],
      weight: session.weights[t.id] ?? baseWeight(session, t.topicId),
    }));
}
