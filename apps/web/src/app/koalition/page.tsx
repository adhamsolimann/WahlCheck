"use client";



import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { feasibleCoalitions, sainteLague, type CoalitionOption } from "@wahlen/engine";
import { Card, CardBody } from "@/components/ui/Card";
import { Hemicycle } from "@/components/koalition/Hemicycle";
import { electionPolls, partiesById } from "@/lib/content";
import { useMatchResults } from "@/hooks/useMatchResults";

interface ScoredEntry {
  option: CoalitionOption;
  mean: number | null;
  complete: boolean;
}

type SortMode = "seats-desc" | "seats-asc" | "fit";

function sortedOptions(
  list: CoalitionOption[],
  mode: SortMode,
  scored: ScoredEntry[] | null,
): CoalitionOption[] {
  if (mode === "fit" && scored) {
    const meanOf = new Map<CoalitionOption, number | null>(
      scored.map((s) => [s.option, s.mean]),
    );
    return [...list].sort((a, b) => {
      const ma = meanOf.get(a) ?? -1;
      const mb = meanOf.get(b) ?? -1;
      return mb - ma || b.totalSeats - a.totalSeats;
    });
  }
  const dir = mode === "seats-asc" ? 1 : -1;
  return [...list].sort(
    (a, b) =>
      dir * (a.totalSeats - b.totalSeats) ||
      a.members.length - b.members.length ||
      a.members.join(",").localeCompare(b.members.join(",")),
  );
}

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function KoalitionPage() {
  const { ready, answeredCount, percentByParty } = useMatchResults();
  const polls = electionPolls();
  const [sortMode, setSortMode] = useState<"seats-desc" | "seats-asc" | "fit">("seats-desc");
  const [showAfd, setShowAfd] = useState(false); // Brandmauer: Standard = ausgeblendet
  const [hoveredParty, setHoveredParty] = useState<string | null>(null);

  const { seats, belowThreshold, options } = useMemo(() => {
    const shares = Object.entries(polls.aggregate.trend)
      .filter(([id]) => id !== "sonstige")
      .map(([partyId, percent]) => ({ partyId, percent }));

    const seats = sainteLague(shares, polls.parliamentSeats, {
      threshold: polls.thresholdPercent,
    });

    const seatIds = new Set(Object.keys(seats));
    const belowThreshold = shares
      .filter((s) => !seatIds.has(s.partyId))
      .map((s) => s.partyId);

    return {
      seats,
      belowThreshold,
      // Alle arithmetisch möglichen Koalitionen inkl. großer Bündnisse —
      // wir bewerten nicht, welche „realistisch“ ist.
      options: feasibleCoalitions(seats, polls.majoritySeats, Object.keys(seats).length),
    };
  }, [polls]);

  const visibleOptions = useMemo(() => {
    if (showAfd) return options;
    return options.filter((o) => !(o.members.includes("afd") && o.members.length > 1));
  }, [options, showAfd]);

  /** Persönliche Bewertung je Koalition: Mittel der Mitglieds-Übereinstimmung */
  const scored = useMemo(() => {
    if (!ready || answeredCount === 0) return null;
    return options.map((option) => {
      const percents = option.members.map((m) => percentByParty.get(m));
      const complete = percents.every((p) => p !== undefined && p !== null);
      const mean = complete
        ? Math.round(
            (percents.reduce<number>((sum, p) => sum + (p as number), 0) /
              percents.length) *
              10,
          ) / 10
        : null;
      return { option, mean, complete };
    });
  }, [ready, answeredCount, options, percentByParty]);

  const bestPersonal =
    scored?.filter((s) => s.complete).sort((a, b) => (b.mean ?? 0) - (a.mean ?? 0))[0] ?? null;

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-12">
      <header className="space-y-2 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Wer kann regieren?</h1>
        <p className="mx-auto max-w-xl text-sm text-ink-500 dark:text-ink-400">
          Modellrechnung auf Basis des aktuellen Wahltrends — keine Prognose.
          Sie zeigt, welche Koalitionen rechnerisch möglich sind und wie gut
          diese zu <em>deinen</em> Antworten passen.
        </p>
      </header>

      {/* ---------- Aktuelle Lage ---------- */}
      <Card>
        <CardBody>
          <h2 className="mb-3 font-semibold">Aktuelle Lage</h2>
          <div className="mb-4">
            <Hemicycle
              allocation={seats}
              partiesById={partiesById}
              hovered={hoveredParty}
              onHover={setHoveredParty}
            />
            <p className="mt-1 text-center text-[11px] text-ink-400 dark:text-ink-500">
              {polls.parliamentSeats} Sitze · {polls.majoritySeats} für die Mehrheit ·
              zum Hover: Partei hervorheben
            </p>
          </div>
          <div className="space-y-2">
            {Object.entries(polls.aggregate.trend)
              .sort(([, a], [, b]) => b - a)
              .map(([partyId, percent]) => {
                const party = partiesById.get(partyId);
                const inParliament = partyId in seats;
                return (
                  <div
                    key={partyId}
                    onMouseEnter={() => inParliament && setHoveredParty(partyId)}
                    onMouseLeave={() => setHoveredParty(null)}
                    className={`flex items-center gap-3 rounded-md px-1 py-0.5 transition-colors ${
                      hoveredParty && hoveredParty !== partyId ? "opacity-40" : ""
                    }`}
                  >
                    <span
                      aria-hidden
                      className="h-4 w-2 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: party?.colorHex ?? "#a1a1aa",
                        opacity: inParliament ? 1 : 0.35,
                      }}
                    />
                    <span
                      className={`w-28 shrink-0 text-sm ${
                        inParliament ? "" : "text-ink-400 dark:text-ink-500"
                      }`}
                    >
                      {party?.shortName ?? partyId}
                    </span>
                    <span className="hidden h-2 flex-1 overflow-hidden rounded-full bg-ink-900/[0.06] sm:block dark:dark:bg-white/10">
                      <span
                        className="block h-full rounded-full"
                        style={{
                          width: `${(percent / 25) * 100}%`,
                          backgroundColor: party?.colorHex ?? "#a1a1aa",
                          opacity: inParliament ? 1 : 0.35,
                        }}
                      />
                    </span>
                    <span className="ml-auto w-14 whitespace-nowrap text-right text-sm tabular-nums sm:ml-0">
                      {percent.toLocaleString("de-DE")} %
                    </span>
                    <span className="w-20 whitespace-nowrap text-right text-xs text-ink-400 tabular-nums">
                      {inParliament
                        ? `${seats[partyId]} Sitze`
                        : `unter ${polls.thresholdPercent.toLocaleString("de-DE")} %`}
                    </span>
                  </div>
                );
              })}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-400">
            Gewichtetes Institutsmittel, Stand {formatDate(polls.aggregate.updatedAt)} ·{" "}
            {polls.aggregate.methodNote} Sitzprojektion: Sainte-Laguë auf{" "}
            {polls.parliamentSeats} Sitze (vereinfacht, ohne Überhang-/Pauschsitze).
          </p>
          <div className="mt-2 text-xs leading-relaxed text-ink-400">
            <span className="font-medium">Einzelumfragen:</span>
            <ul className="mt-1 list-inside list-disc">
              {polls.polls.map((poll) => (
                <li key={`${poll.institute}-${poll.date}`}>
                  <a href={poll.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent-600">
                    {poll.institute}, {formatDate(poll.date)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </CardBody>
      </Card>

      {/* ---------- Mögliche Koalitionen ---------- */}
      <section aria-labelledby="coalitions-heading" className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="coalitions-heading" className="text-lg font-semibold">
            Rechnerisch mögliche Mehrheiten ({visibleOptions.length})
          </h2>
          <label
            className="flex cursor-pointer items-center gap-2 text-xs font-medium text-ink-500 dark:text-ink-400"
            title="Alle übrigen Parteien haben Koalitionen mit der AfD ausgeschlossen. Ein-/Ausblenden ist rein rechnerisch."
          >
            <input
              type="checkbox"
              checked={showAfd}
              onChange={(e) => setShowAfd(e.target.checked)}
              className="h-4 w-4 rounded border-ink-900/15 accent-[var(--color-accent-500)]"
            />
            Koalitionen mit AfD-Beteiligung anzeigen
          </label>
          <label className="flex items-center gap-2 text-xs text-ink-400">
            Sortieren:
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as typeof sortMode)}
              className="rounded-md border border-ink-900/15 bg-white px-2 py-1 text-xs dark:border-white/15 dark:bg-white/[0.04]"
            >
              <option value="seats-desc">Sitze (absteigend)</option>
              <option value="seats-asc">Sitze (aufsteigend)</option>
              {answeredCount > 0 && <option value="fit">Passung zu dir</option>}
            </select>
          </label>
        </div>
        <p className="text-xs text-ink-400">
          Alle Kombinationen mit mindestens {polls.majoritySeats} der{" "}
          {polls.parliamentSeats} Sitze — rein arithmetisch, ohne politische
          Bewertung.
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {sortedOptions(visibleOptions, sortMode, scored).map((option) => (
            <li key={option.members.join("+")}>
              <Card className="flex items-center justify-between gap-x-3 gap-y-1 flex-wrap py-3">
                {/* Flache Struktur: Trenner + Chip sind ein unverrennbares
                    Inline-Paar (whitespace-nowrap), Umbruch nur zwischen
                    Einheiten — keine verwaisten „+“ mehr. */}
                <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
                  {option.members.map((id, i) => (
                    <Fragment key={id}>
                      {i > 0 && (
                        <span aria-hidden className="text-xs text-ink-400 dark:text-ink-500">
                          +
                        </span>
                      )}
                      <span
                        className="whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-semibold leading-relaxed"
                        style={{ color: partiesById.get(id)?.colorHex }}
                      >
                        {partiesById.get(id)?.shortName ?? id}
                      </span>
                    </Fragment>
                  ))}
                </div>
                <div className="ml-auto flex shrink-0 items-center gap-2">
                  {option.members.includes("cdu") && option.members.includes("spd") && (
                    <span className="whitespace-nowrap rounded bg-ink-900/[0.06] px-1.5 py-0.5 text-[11px] text-ink-400 dark:dark:bg-white/10">
                      mit beiden Regierungsparteien
                    </span>
                  )}
                  <strong className="tabular-nums">{option.totalSeats}</strong>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Persönliche Option ---------- */}
      <section aria-labelledby="personal-heading" className="space-y-3">
        <h2 id="personal-heading" className="text-lg font-semibold">
          Deine beste rechnerische Option
        </h2>
        {!ready ? null : answeredCount === 0 ? (
          <Card>
            <CardBody>
              Beantworte zuerst ein paar Thesen — dann zeigen wir dir, welche
              rechnerisch mögliche Koalition deinen Positionen am nächsten steht.
              <div className="pt-3">
                <Link href="/quiz/" className="text-accent-600 underline">
                  Zum Matching →
                </Link>
              </div>
            </CardBody>
          </Card>
        ) : bestPersonal ? (
          <Card>
            <CardBody>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-lg font-bold">
                  {bestPersonal.option.members
                    .map((id) => partiesById.get(id)?.shortName ?? id)
                    .join(" + ")}
                </p>
                <p
                  className="text-2xl font-black tabular-nums"
                  style={{ color: "var(--color-accent-500)" }}
                >
                  Ø {(bestPersonal.mean as number).toLocaleString("de-DE")} %
                </p>
              </div>
              <p className="mt-1 text-xs text-ink-400">
                Durchschnittliche Übereinstimmung mit den beteiligten Parteien ·{" "}
                {bestPersonal.option.totalSeats} Sitze · Rangfolge aller Optionen
                folgt derselben Rechnung wie die Auswertungsliste.
              </p>
            </CardBody>
          </Card>
        ) : (
          <p className="text-sm text-ink-400">
            Für deine Antworten liegen zu den Koalitionsparteien noch nicht genug
            verwertbare Daten vor.
          </p>
        )}
      </section>

      <footer className="text-xs leading-relaxed text-ink-400">
        <strong>Hinweise:</strong> Umfragen schwanken; kleine Änderungen können
        über die Fünf-Prozent-Hürde große Auswirkungen haben
        {belowThreshold.length > 0 &&
          ` (aktuell darunter: ${belowThreshold
            .map((id) => partiesById.get(id)?.shortName ?? id)
            .join(", ")})`}
        . Regierungsfähigkeit ist mehr als Arithmetik — diese Seite zeigt nur
        die Mathematik. Details:{" "}
        <a href="/methodik/" className="underline">
          Methodik
        </a>
        .
      </footer>
    </main>
  );
}
