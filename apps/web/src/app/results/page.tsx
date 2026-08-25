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

const CONFIDENCE_DE: Record<string, string> = {
  high: "hoch",
  medium: "mittel",
  low: "niedrig",
  insufficient: "unzureichend",
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

  /** Höchstplatzierte Partei mit verwertbarem Ergebnis — wird visuell hervorgehoben. */
  const bestPartyId = useMemo(() => {
    return ranked.find((r) => r.matchPercent !== null)?.partyId ?? null;
  }, [ranked]);

  if (!ready) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-center text-sm text-ink-400">Lade …</p>
      </main>
    );
  }

  if (answeredCount === 0) {
    return (
      <main className="mx-auto max-w-xl space-y-4 px-6 py-16 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight">Noch keine Antworten</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">
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
    <main className="mx-auto max-w-3xl space-y-10 px-6 pb-12 pt-12">
      <header className="space-y-3">
        <p className="kicker text-accent-600 dark:text-accent-400">Deine Auswertung</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Deine Auswertung
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/quiz/">
              <Button variant="secondary" size="sm">
                Antworten ändern
              </Button>
            </Link>
            <ShareButton topMatches={topMatches} />
          </div>
        </div>
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Basis: {answeredCount} von {scope.length} Thesen (
          {session?.mode === "quick" ? "Schnell-" : "Vollständiger"} Modus).
          Berechnung vollständig lokal in deinem Browser.{" "}
          <button
            className="underline underline-offset-2 hover:text-accent-600"
            onClick={() => {
              if (confirm("Alle Antworten löschen?")) {
                clearSession();
                location.href = "/";
              }
            }}
          >
            Alles zurücksetzen
          </button>
        </p>
      </header>

      {/* Top-3-Podest */}
      {topMatches.length > 0 && (
        <section aria-label="Deine Top-Treffer" className="grid gap-3 sm:grid-cols-3">
          {topMatches.map(({ party, percent }, i) => (
            <div
              key={party.id}
              className={`animate-fade-up relative overflow-hidden rounded-xl border p-4 ${
                i === 0
                  ? "border-accent-500 bg-accent-500/[0.06]"
                  : "border-ink-900/10 bg-white dark:border-white/10 dark:bg-ink-900/60"
              }`}
              style={{ animationDelay: `${i * 90}ms` }}
            >
              {i === 0 && (
                <span className="absolute right-3 top-3 font-display text-[10px] font-bold uppercase tracking-widest text-accent-600 dark:text-accent-400">
                  ★ Bestes Match
                </span>
              )}
              <span
                aria-hidden
                className="mb-3 block h-1.5 w-8 rounded-full"
                style={{ backgroundColor: party.colorHex }}
              />
              <p
                className="font-display text-4xl font-bold tabular-nums tracking-tight"
                style={{ color: party.colorHex }}
              >
                {percent !== null ? percent.toLocaleString("de-DE") : "—"}
                <span className="text-lg">%</span>
              </p>
              <p className="mt-1 font-display text-base font-semibold">{party.shortName}</p>
              <p className="truncate text-xs text-ink-400">{party.name}</p>
            </div>
          ))}
        </section>
      )}

      {userEntries.length > 0 && (
        <section aria-labelledby="map-heading" className="space-y-3">
          <h2 id="map-heading" className="font-display text-xl font-semibold tracking-tight">
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
              <span className="text-xs uppercase tracking-wide text-ink-400">
                {TIER_LABELS[tier]}
              </span>
            </h2>

            {group.map((result) => (
              <ResultRow
                key={result.partyId}
                result={result}
                isBest={result.partyId === bestPartyId}
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

      <footer className="pt-4 text-center text-xs leading-relaxed text-ink-400">
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
  isBest,
  expanded,
  onToggle,
  thesisById,
}: {
  result: PartyResult;
  isBest: boolean;
  expanded: boolean;
  onToggle: () => void;
  thesisById: Map<string, Thesis>;
}) {
  const party = partiesById.get(result.partyId);
  if (!party) return null;

  const pct = result.matchPercent;

  return (
    <Card
      className={`relative overflow-hidden p-0 ${
        isBest ? "border-accent-500 ring-1 ring-accent-500" : ""
      }`}
    >
      {isBest && (
        <span className="absolute right-0 top-0 rounded-bl-lg bg-accent-500 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wide text-white">
          ★ Bestes Match
        </span>
      )}
      <button
        onClick={onToggle}
        aria-expanded={expanded}
        className={`flex w-full items-center gap-4 px-5 text-left ${isBest ? "pb-4 pt-7" : "py-4"}`}
      >
        <span
          aria-hidden
          className="h-9 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: party.colorHex }}
        />
        <span className="min-w-24 flex-1">
          <span className={`block font-display font-semibold tracking-tight ${isBest ? "text-lg" : ""}`}>
            {party.shortName}
          </span>
          <span className="block truncate text-xs text-ink-400">{party.name}</span>
        </span>
        <span className="hidden h-[3px] flex-[2] overflow-hidden rounded-full bg-ink-900/10 sm:block dark:bg-white/10">
          <span
            className="animate-bar-x block h-full rounded-full"
            style={{ width: `${pct ?? 0}%`, backgroundColor: party.colorHex }}
          />
        </span>
        <span
          className="min-w-14 text-right font-display text-xl font-bold tabular-nums"
          style={{ color: party.colorHex }}
        >
          {pct !== null ? `${pct.toLocaleString("de-DE")}%` : "—"}
        </span>
      </button>

      {expanded && (
        <div className="space-y-3 border-t border-ink-900/10 px-5 py-4 dark:border-white/10">
          <p className="text-xs text-ink-400">
            {result.applicableTheses} von {result.answeredTheses} Antworten
            verwertbar · Konfidenz:{" "}
            <strong
              title="Anteil deiner Antworten, die für diese Partei verwertbar waren (≥80 % hoch, ≥50 % mittel, darunter niedrig)"
              className="capitalize text-ink-600 dark:text-ink-300"
            >
              {CONFIDENCE_DE[result.confidence]}
            </strong>
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
                className="rounded-lg bg-paper px-4 py-3 text-sm dark:bg-white/[0.04]"
              >
                <p className="mb-1 font-medium">{thesis.text}</p>
                <p className="text-xs text-ink-600 dark:text-ink-300">
                  Du: <strong>{STANCE_LABELS[entry.userStance]}</strong> · Partei:{" "}
                  <strong>{partyStanceText}</strong> · Wichtung: {entry.weight}×
                </p>
                {entry.justificationQuote && (
                  <blockquote className="mt-2 border-l-2 border-accent-500 pl-3 text-xs italic leading-relaxed text-ink-500 dark:text-ink-400">
                    „{entry.justificationQuote}“{" "}
                    {entry.sourceUrl && (
                      <a
                        href={entry.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 not-italic underline hover:text-accent-600"
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
            <p className="text-sm text-ink-400">
              Für diese Partei liegen zu den beantworteten Thesen keine
              verwertbaren Angaben vor.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
