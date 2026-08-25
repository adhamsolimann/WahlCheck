"use client";



import { useMemo, useRef, useState } from "react";
import { news, partiesById } from "@/lib/content";

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatShort(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
  });
}

type PartyFilter = string | null;

export default function NewsPage() {
  const [filter, setFilter] = useState<PartyFilter>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  /* Karussell: die fünf neuesten */
  const featured = filtered.slice(0, 5);

  /* Archiv: der Rest, nach Datum gruppiert */
  const archive = filtered.slice(5);
  const grouped = useMemo(() => {
    return archive.reduce<Record<string, typeof archive>>((acc, entry) => {
      (acc[entry.date] ??= []).push(entry);
      return acc;
    }, {});
  }, [archive]);

  const dates = useMemo(
    () => Object.keys(grouped).sort((a, b) => b.localeCompare(a)),
    [grouped],
  );

  function scrollCarousel(dir: -1 | 1) {
    carouselRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  return (
    <main className="mx-auto max-w-5xl space-y-10 px-6 py-12">
      <header className="space-y-2 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Nachrichten zur Wahl</h1>
        <p className="mx-auto max-w-lg text-sm leading-relaxed text-ink-500 dark:text-ink-400">
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
              ? "bg-accent-500 text-white"
              : "bg-ink-900/[0.06] text-ink-500 hover:bg-ink-900/10 dark:dark:bg-white/10 dark:text-ink-400 dark:text-ink-500 dark:hover:bg-white/20"
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
                  ? "bg-accent-500 text-white"
                  : "bg-ink-900/[0.06] text-ink-500 hover:bg-ink-900/10 dark:dark:bg-white/10 dark:text-ink-400 dark:text-ink-500 dark:hover:bg-white/20"
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

      {/* ---------- Karussell (Top 5) ---------- */}
      {featured.length > 0 && (
        <section aria-label="Aktuelle Meldungen" className="relative">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-ink-400">
              Aktuell
            </h2>
            <div className="flex gap-1.5">
              <button
                onClick={() => scrollCarousel(-1)}
                aria-label="Zurück"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-900/15 bg-white text-ink-500 transition-colors hover:border-accent-400 hover:text-accent-600 dark:border-white/15 dark:bg-white/[0.04] dark:text-ink-400 dark:text-ink-500"
              >
                ←
              </button>
              <button
                onClick={() => scrollCarousel(1)}
                aria-label="Weiter"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-900/15 bg-white text-ink-500 transition-colors hover:border-accent-400 hover:text-accent-600 dark:border-white/15 dark:bg-white/[0.04] dark:text-ink-400 dark:text-ink-500"
              >
                →
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {featured.map((entry, i) => {
              const party = entry.partyId ? partiesById.get(entry.partyId) : undefined;
              return (
                <article
                  key={entry.sourceUrl}
                  className={`animate-fade-up relative w-[280px] shrink-0 snap-start overflow-hidden rounded-xl border border-ink-900/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04] ${
                    i === 0 ? "border-l-4 border-l-accent-500" : ""
                  }`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Partei-Farbbalken oben */}
                  <div
                    aria-hidden
                    className="h-1 w-full"
                    style={{ backgroundColor: party?.colorHex ?? "#a1a1aa" }}
                  />
                  <div className="p-4">
                    <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">
                      {formatShort(entry.date)} · {entry.sourceLabel}
                    </p>
                    <h3 className="text-sm font-semibold leading-snug">{entry.title}</h3>
                    {entry.excerpt && (
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ink-500 dark:text-ink-400">
                        {entry.excerpt}
                      </p>
                    )}
                    <a
                      href={entry.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-[11px] underline decoration-dotted underline-offset-2 hover:text-accent-600"
                    >
                      Zum Artikel ↗
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ---------- Archiv ---------- */}
      {archive.length > 0 && (
        <section aria-labelledby="archive-heading" className="space-y-6">
          <h2 id="archive-heading" className="text-sm font-semibold uppercase tracking-widest text-ink-400">
            Archiv
          </h2>
          {dates.map((date) => (
            <div key={date} className="space-y-2">
              <h3 className="text-xs font-semibold text-ink-400 dark:text-ink-500">{formatDate(date)}</h3>
              {grouped[date].map((entry, i) => {
                const party = entry.partyId ? partiesById.get(entry.partyId) : undefined;
                return (
                  <article
                    key={`${date}-${i}`}
                    className="flex items-start gap-3 rounded-lg border border-zinc-100 bg-white px-4 py-3 transition-colors hover:border-ink-900/15 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-zinc-700"
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: party?.colorHex ?? "#a1a1aa" }}
                    />
                    <div className="min-w-0 flex-1">
                      <a
                        href={entry.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium leading-snug hover:text-accent-600"
                      >
                        {entry.title}
                      </a>
                      <p className="text-[11px] text-ink-400 dark:text-ink-500">
                        {entry.sourceLabel} · {formatDate(entry.date)}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          ))}
        </section>
      )}

      <footer className="border-t border-ink-900/10 pt-6 text-xs leading-relaxed text-ink-400 dark:border-white/10">
        Wir spiegeln keine Volltexte — jedes Item verweist auf die Original-
        quelle. Aufnahme entscheidet die Relevanz für die Berliner Wahl, nicht
        die Partei; Umfragen sind Momentaufnahmen.
      </footer>
    </main>
  );
}
