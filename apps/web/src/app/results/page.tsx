"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Party, Thesis } from "@wahlen/schemas";
import type { PartyResult } from "@wahlen/engine";
import { Button } from "@/components/ui/Button";
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

  /** Ausgewählte Partei für das Detail (Desktop-Panel / Mobile-Sheet). */
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

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

  /** Höchstplatzierte Partei mit verwertbarem Ergebnis — Default-Auswahl. */
  const bestPartyId = useMemo(() => {
    return ranked.find((r) => r.matchPercent !== null)?.partyId ?? null;
  }, [ranked]);

  const activeId = selectedId ?? bestPartyId;
  const activeResult = ranked.find((r) => r.partyId === activeId) ?? null;

  // Escape schließt das Mobile-Sheet
  useEffect(() => {
    if (!sheetOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

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
  let rankCounter = 0;

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-6 pb-12 pt-12">
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

      {/* ---------------- Master–Detail: Liste + Detail ---------------- */}
      <section aria-labelledby="ranking-heading" className="space-y-3">
        <h2 id="ranking-heading" className="font-display text-xl font-semibold tracking-tight">
          Alle Parteien im Vergleich
        </h2>
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Partei antippen für die Begründung mit Zitat — auf großen Screens
          rechts neben der Liste, auf dem Handy als Panel von unten.
        </p>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(300px,360px)_1fr]">
          {/* Liste */}
          <div className="space-y-6">
            {tiers.map((tier) => {
              const group = ranked.filter(
                (r) => partiesById.get(r.partyId)?.tier === tier,
              );
              if (group.length === 0) return null;
              return (
                <div key={tier} className="space-y-1.5">
                  <h3 className="flex items-center gap-2 pb-1">
                    <TierBadge tier={tier} />
                    <span className="text-xs text-ink-400">{TIER_LABELS[tier]}</span>
                  </h3>
                  {group.map((result) => {
                    rankCounter += 1;
                    const rank = rankCounter;
                    return (
                      <RankRow
                        key={result.partyId}
                        result={result}
                        rank={rank}
                        isBest={result.partyId === bestPartyId}
                        selected={result.partyId === activeId}
                        onSelect={() => {
                          setSelectedId(result.partyId);
                          setSheetOpen(true);
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Detail — Desktop: sticky Panel */}
          <div className="hidden lg:sticky lg:top-24 lg:block">
            {activeResult ? (
              <PartyDetail result={activeResult} thesisById={thesisById} />
            ) : (
              <div className="rounded-xl border border-dashed border-ink-900/15 p-8 text-center text-sm text-ink-400 dark:border-white/15">
                Partei aus der Liste wählen.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Detail — Mobile: Bottom-Sheet */}
      {sheetOpen && activeResult && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Partei-Details">
          <button
            aria-label="Details schließen"
            className="absolute inset-0 bg-ink-950/45 backdrop-blur-[2px]"
            onClick={() => setSheetOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[82vh] overflow-hidden rounded-t-2xl border-t border-ink-900/10 bg-white shadow-2xl dark:border-white/10 dark:bg-ink-900">
            <div className="flex justify-center pt-2.5">
              <span aria-hidden className="h-1 w-10 rounded-full bg-ink-900/20 dark:bg-white/20" />
            </div>
            <div className="max-h-[calc(82vh-2rem)] overflow-y-auto px-5 pb-8 pt-3">
              <PartyDetail result={activeResult} thesisById={thesisById} />
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 w-full"
                onClick={() => setSheetOpen(false)}
              >
                Schließen
              </Button>
            </div>
          </div>
        </div>
      )}

      <footer className="pt-4 text-center text-xs leading-relaxed text-ink-400">
        Prozentwerte = gewichtete Übereinstimmung über beantwortete Thesen.
        „Keine Angabe“ einer Partei fließt nicht in deren Wert ein. Kein
        Wahlempfehlungstool ersetzt das Lesen der Programme — Quellen findest du
        bei jeder These.
      </footer>
    </main>
  );
}

/* ------------------------------------------------------------------ */

/** Kompakte Zeile: Rang, Farbchip, Name, Prozent — klickbar. */
function RankRow({
  result,
  rank,
  isBest,
  selected,
  onSelect,
}: {
  result: PartyResult;
  rank: number;
  isBest: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const party = partiesById.get(result.partyId);
  if (!party) return null;
  const pct = result.matchPercent;

  return (
    <button
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors duration-150 ${
        selected
          ? "border-accent-500 bg-accent-500/[0.06]"
          : "border-transparent hover:border-ink-900/15 hover:bg-ink-900/[0.03] dark:hover:border-white/15 dark:hover:bg-white/[0.05]"
      }`}
    >
      <span
        aria-hidden
        className={`w-5 shrink-0 text-right font-display text-xs font-bold tabular-nums ${
          rank <= 3 ? "text-accent-500" : "text-ink-400 dark:text-ink-500"
        }`}
      >
        {rank}
      </span>
      <span
        aria-hidden
        className="h-7 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: party.colorHex }}
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-display text-sm font-semibold tracking-tight">
            {party.shortName}
          </span>
          {isBest && (
            <span aria-label="Bestes Match" title="Bestes Match" className="text-[11px] text-accent-500">
              ★
            </span>
          )}
        </span>
        <span aria-hidden className="mt-1 block h-[3px] overflow-hidden rounded-full bg-ink-900/10 dark:bg-white/10">
          <span
            className="block h-full rounded-full"
            style={{ width: `${pct ?? 0}%`, backgroundColor: party.colorHex }}
          />
        </span>
      </span>
      <span
        className="min-w-12 text-right font-display text-base font-bold tabular-nums"
        style={{ color: party.colorHex }}
      >
        {pct !== null ? `${pct.toLocaleString("de-DE")}%` : "—"}
      </span>
    </button>
  );
}

/** Detail-Panel: Konfidenz + These-für-These-Vergleich mit Zitat. */
function PartyDetail({
  result,
  thesisById,
}: {
  result: PartyResult;
  thesisById: Map<string, Thesis>;
}) {
  const party = partiesById.get(result.partyId);
  if (!party) return null;
  const pct = result.matchPercent;

  return (
    <article className="rounded-xl border border-ink-900/10 bg-white dark:border-white/10 dark:bg-ink-900/60">
      {/* Kopf */}
      <header className="flex items-center gap-4 border-b border-ink-900/10 p-5 dark:border-white/10">
        <span
          aria-hidden
          className="h-12 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: party.colorHex }}
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl font-bold tracking-tight">{party.shortName}</h3>
          <p className="truncate text-xs text-ink-400">{party.name}</p>
        </div>
        <p
          className="font-display text-3xl font-bold tabular-nums"
          style={{ color: party.colorHex }}
        >
          {pct !== null ? `${pct.toLocaleString("de-DE")}%` : "—"}
        </p>
      </header>

      <div className="space-y-3 p-5">
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
          const agreement = entry.partyStance !== undefined && entry.partyStance * entry.userStance > 0;
          return (
            <div
              key={entry.thesisId}
              className="rounded-lg bg-paper px-4 py-3 text-sm dark:bg-white/[0.04]"
            >
              <p className="mb-1 flex items-start justify-between gap-3 font-medium">
                <span>{thesis.text}</span>
                <span
                  aria-hidden
                  title={agreement ? "Übereinstimmung" : "Differenz"}
                  className={`mt-0.5 shrink-0 font-display text-xs font-bold ${
                    agreement ? "text-emerald-600 dark:text-emerald-400" : "text-accent-600 dark:text-accent-400"
                  }`}
                >
                  {agreement ? "✓" : "✕"}
                </span>
              </p>
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
    </article>
  );
}
