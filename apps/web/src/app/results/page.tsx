"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Party, Thesis } from "@wahlen/schemas";
import type { PartyResult } from "@wahlen/engine";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TierBadge } from "@/components/ui/TierBadge";
import { STANCE_LABELS } from "@/components/ui/StanceScale";
import { partiesById, thesesForMode } from "@/lib/content";
import { clearSession } from "@/lib/session";
import { useMatchResults } from "@/hooks/useMatchResults";
import { PoliticalMap } from "@/components/results/PoliticalMap";
import { ShareButton } from "@/components/results/ShareButton";

const TIER_LABELS: Record<Party["tier"], string> = {
  parliament: "Im Parlament erwartet",
  small: "Kleinparteien (teils unter der 5%-Hürde)",
  contextual: "Einordnung erforderlich",
};

export default function ResultsPage() {
  const { ready, session, scope, ranked, answeredCount } = useMatchResults();
  const [expanded, setExpanded] = useState<string | null>(null);

  const thesisById = useMemo(() => {
    const map = new Map<string, Thesis>();
    for (const t of thesesForMode(session?.mode ?? "quick")) map.set(t.id, t);
    return map;
  }, [session?.mode]);

  const userEntries = useMemo(() => {
    if (!session) return [];
    return session.stances
      ? Object.entries(session.stances)
          .filter(([id]) => !session.skips.includes(id) && scope.some((t) => t.id === id))
          .map(([thesisId, stance]) => ({
            thesisId,
            stance,
            weight:
              session.weights[thesisId] ??
              // Persona-Basisgewichtung wird hier bewusst nicht angewendet —
              // die Landkarte zeigt die ungewichtete inhaltliche Lage.
              1,
          }))
      : [];
  }, [session, scope]);

  const topMatches = useMemo(() => {
    return ranked
      .filter((r): r is PartyResult & { matchPercent: number } => r.matchPercent !== null)
      .slice(0, 3)
      .map((r) => ({ party: partiesById.get(r.partyId), percent: r.matchPercent }))
      .filter((m): m is { party: Party; percent: number } => m.party !== undefined);
  }, [ranked]);

  if (!ready) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-center text-sm text-zinc-500">Lade …</p>
      </main>
    );
  }

  if (answeredCount === 0) {
    return (
      <main className="mx-auto max-w-xl space-y-4 px-6 py-16 text-center">
        <h1 className="text-2xl font-bold">Noch keine Antworten</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Beantworte zuerst ein paar Thesen — alles bleibt auf deinem Gerät.
        </p>
        <Link href="/quiz/">
          <Button>Zum Matching</Button>
        </Link>
      </main>
    );
  }

  // Nach Tier gruppieren
  const tiers: Party["tier"][] = ["parliament", "small", "contextual"];

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-12">
      <header className="space-y-1 text-center">
        <h1 className="text-3xl font-bold">Deine Auswertung</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Basis: {answeredCount} von {scope.length} Thesen (
          {session?.mode === "quick" ? "Schnell-" : "Vollständiger"} Modus).
          Berechnung vollständig lokal in deinem Browser.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link href="/quiz/">
            <Button variant="secondary" size="sm">
              Antworten ändern
            </Button>
          </Link>
          <ShareButton topMatches={topMatches} />
          <button
            className="text-xs text-zinc-500 underline"
            onClick={() => {
              if (confirm("Alle Antworten löschen?")) {
                clearSession();
                location.href = "/";
              }
            }}
          >
            Alles zurücksetzen
          </button>
        </div>
      </header>

      {userEntries.length > 0 && (
        <section aria-labelledby="map-heading" className="space-y-3">
          <h2 id="map-heading" className="text-lg font-semibold">
            Deine Position auf der Landkarte
          </h2>
          <PoliticalMap userEntries={userEntries} />
        </section>
      )}

      {tiers.map((tier) => {
        const group = ranked.filter(
          (r) => partiesById.get(r.partyId)?.tier === tier,
        );
        if (group.length === 0) return null;
        return (
          <section key={tier} aria-labelledby={`tier-${tier}`} className="space-y-3">
            <h2 id={`tier-${tier}`} className="flex items-center gap-2 pt-2">
              <TierBadge tier={tier} />
              <span className="text-xs uppercase tracking-wide text-zinc-500">
                {TIER_LABELS[tier]}
              </span>
            </h2>

            {group.map((result) => (
              <ResultRow
                key={result.partyId}
                result={result}
                expanded={expanded === result.partyId}
                onToggle={() =>
                  setExpanded((e) => (e === result.partyId ? null : result.partyId))
                }
                thesisById={thesisById}
              />
            ))}
          </section>
        );
      })}

      <footer className="pt-4 text-center text-xs leading-relaxed text-zinc-500">
        Prozentwerte = gewichtete Übereinstimmung über beantwortete Thesen.
        „Keine Angabe" einer Partei fließt nicht in deren Wert ein. Kein
        Wahlempfehlungstool ersetzt das Lesen der Programme — Quellen findest du
        bei jeder These.
      </footer>
    </main>
  );
}

/* ------------------------------------------------------------------ */

function ResultRow({
  result,
  expanded,
  onToggle,
  thesisById,
}: {
  result: PartyResult;
  expanded: boolean;
  onToggle: () => void;
  thesisById: Map<string, Thesis>;
}) {
  const party = partiesById.get(result.partyId);
  if (!party) return null;

  const pct = result.matchPercent;

  return (
    <Card className="overflow-hidden p-0">
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <span
          aria-hidden
          className="h-8 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: party.colorHex }}
        />
        <span className="min-w-24 flex-1">
          <span className="block font-semibold">{party.shortName}</span>
          <span className="block truncate text-xs text-zinc-500">{party.name}</span>
        </span>
        <span className="hidden h-2 flex-[2] overflow-hidden rounded-full bg-zinc-200 sm:block dark:bg-zinc-800">
          <span
            className="block h-full rounded-full"
            style={{ width: `${pct ?? 0}%`, backgroundColor: party.colorHex }}
          />
        </span>
        <span className="min-w-14 text-right font-bold tabular-nums" style={{ color: party.colorHex }}>
          {pct !== null ? `${pct.toLocaleString("de-DE")}%` : "—"}
        </span>
      </button>

      {expanded && (
        <div className="space-y-3 border-t border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <p className="text-xs text-zinc-500">
            {result.applicableTheses} von {result.answeredTheses} Antworten
            verwertbar · Konfidenz:{" "}
            <strong className="capitalize">{result.confidence}</strong>
          </p>
          {result.breakdown.map((entry) => {
            const thesis = thesisById.get(entry.thesisId);
            if (!thesis || !entry.included) return null;
            const partyStanceText =
              entry.partyStatus === "neutral"
                ? "neutral"
                : entry.partyStance !== undefined
                  ? (STANCE_LABELS[entry.partyStance] ?? String(entry.partyStance))
                  : "?";
            return (
              <div
                key={entry.thesisId}
                className="rounded-lg bg-zinc-50 px-4 py-3 text-sm dark:bg-zinc-800/60"
              >
                <p className="mb-1 font-medium">{thesis.text}</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Du: <strong>{STANCE_LABELS[entry.userStance]}</strong> · Partei:{" "}
                  <strong>{partyStanceText}</strong> · Wichtung: {entry.weight}×
                </p>
                {entry.justificationQuote && (
                  <blockquote className="mt-2 border-l-2 border-zinc-300 pl-3 text-xs italic leading-relaxed text-zinc-600 dark:border-zinc-600 dark:text-zinc-400">
                    „{entry.justificationQuote}“{" "}
                    {entry.sourceUrl && (
                      <a
                        href={entry.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 not-italic underline hover:text-brand-600"
                      >
                        {entry.sourceLabel ? `(${entry.sourceLabel})` : "(Quelle)"}
                      </a>
                    )}
                  </blockquote>
                )}
              </div>
            );
          })}
          {result.breakdown.every((b) => !b.included) && (
            <p className="text-sm text-zinc-500">
              Für diese Partei liegen zu den beantworteten Thesen keine
              verwertbaren Angaben vor.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
