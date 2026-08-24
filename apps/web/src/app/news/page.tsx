"use client";

import { useMemo, useState } from "react";
import { news, partiesById } from "@/lib/content";

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

type PartyFilter = string | null; // null = alle

export default function NewsPage() {
  const [filter, setFilter] = useState<PartyFilter>(null);

  const partiesInFeed = useMemo(() => {
    const ids = new Set(news.map((n) => n.partyId).filter(Boolean) as string[]);
    return [...ids].sort((a, b) => {
      const na = partiesById.get(a)?.shortName ?? a;
      const nb = partiesById.get(b)?.shortName ?? b;
      return na.localeCompare(nb, "de");
    });
  }, []);

  const filtered = useMemo(
    () => (filter ? news.filter((n) => n.partyId === filter) : news),
    [news, filter],
  );

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, typeof filtered>>((acc, entry) => {
      (acc[entry.date] ??= []).push(entry);
      return acc;
    }, {});
  }, [filtered]);

  const dates = useMemo(
    () => Object.keys(grouped).sort((a, b) => b.localeCompare(a)),
    [grouped],
  );

  return (
    <main className="mx-auto max-w-2xl space-y-8 px-6 py-12">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Nachrichten zur Wahl</h1>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Redaktionell kuratierter Spiegel der Wahlberichterstattung — kein
          automatischer Feed, jede Quelle von Hand geprüft und verlinkt.
        </p>
      </header>

      {/* Filter */}
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          onClick={() => setFilter(null)}
          aria-pressed={filter === null}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            filter === null
              ? "bg-brand-600 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          }`}
        >
          Alle
        </button>
        {partiesInFeed.map((id) => {
          const party = partiesById.get(id);
          const active = filter === id;
          return (
            <button
              key={id}
              onClick={() => setFilter(active ? null : id)}
              aria-pressed={active}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                active
                  ? "bg-brand-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              <span
                aria-hidden
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: party?.colorHex ?? "#a1a1aa" }}
              />
              {party?.shortName ?? id}
            </button>
          );
        })}
      </div>

      {/* Einträge */}
      <div className="space-y-8">
        {dates.length === 0 && (
          <p className="text-center text-sm text-zinc-500">
            Keine Einträge für diesen Filter.
          </p>
        )}
        {dates.map((date) => (
          <section key={date} aria-label={formatDate(date)} className="space-y-3">
            <h2 className="text-sm font-semibold text-zinc-500">{formatDate(date)}</h2>
            {grouped[date].map((entry, i) => {
              const party = entry.partyId ? partiesById.get(entry.partyId) : undefined;
              return (
                <article
                  key={`${date}-${i}`}
                  className="rounded-xl border border-zinc-200 bg-white p-5 transition-[box-shadow,border-color] duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    {party && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold dark:bg-zinc-800">
                        <span
                          aria-hidden
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: party.colorHex }}
                        />
                        {party.shortName}
                      </span>
                    )}
                    <h3 className="font-semibold leading-snug">{entry.title}</h3>
                  </div>
                  {entry.excerpt && (
                    <p className="mb-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {entry.excerpt}
                    </p>
                  )}
                  <a
                    href={entry.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline decoration-dotted underline-offset-2 hover:text-brand-600"
                  >
                    Quelle: {entry.sourceLabel} ↗
                  </a>
                </article>
              );
            })}
          </section>
        ))}
      </div>

      <footer className="border-t border-zinc-200 pt-6 text-xs leading-relaxed text-zinc-500 dark:border-zinc-800">
        Wir spiegeln keine Volltexte — jedes Item verweist auf die Original-
        quelle. Aufnahme entscheidet die Relevanz für die Berliner Wahl, nicht
        die Partei; Umfragen sind Momentaufnahmen.
      </footer>
    </main>
  );
}
