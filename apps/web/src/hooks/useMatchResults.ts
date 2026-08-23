"use client";

import { useEffect, useMemo, useState } from "react";
import { computeResults, rankResults, type PartyResult } from "@wahlen/engine";
import type { Thesis } from "@wahlen/schemas";
import { content, positionsFor, thesesForMode } from "@/lib/content";
import { loadSession, toEngineAnswers } from "@/lib/session";

/**
 * Geteilte Auswertungs-Logik für /results und /koalition.
 * Lädt die Session client-seitig (hydration-safe) und berechnet das
 * Matching vollständig lokal.
 */
export function useMatchResults() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const session = useMemo(() => (ready ? loadSession() : null), [ready]);

  const scope = useMemo(
    () => thesesForMode(session?.mode ?? "quick"),
    [session?.mode],
  );

  const results = useMemo(() => {
    if (!session) return [];
    return computeResults({
      answers: toEngineAnswers(session),
      theses: scope,
      positions: positionsFor(scope),
    });
  }, [session, scope]);

  const ranked = useMemo(
    () => rankResults(results, content.parties),
    [results],
  );

  /** partyId → matchPercent (null = nicht verwertbar) */
  const percentByParty = useMemo(() => {
    const map = new Map<string, number | null>();
    for (const r of results as PartyResult[]) map.set(r.partyId, r.matchPercent);
    return map;
  }, [results]);

  const answeredCount = session ? Object.keys(session.stances).length : 0;

  return { ready, session, scope: scope satisfies Thesis[], results, ranked, percentByParty, answeredCount };
}
