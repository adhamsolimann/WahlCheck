import type { ChangelogCategory } from "@wahlen/schemas";
import { changelog } from "@/lib/content";

export const metadata = { title: "Änderungslog – WahlCheck" };

const CATEGORY_LABELS: Record<ChangelogCategory, string> = {
  korrektur: "Korrektur",
  inhalt: "Inhalt",
  funktion: "Funktion",
  organisation: "Organisation",
};

const CATEGORY_CLASSES: Record<ChangelogCategory, string> = {
  korrektur: "bg-[var(--color-tier-contextual)]/10 text-[var(--color-tier-contextual)]",
  inhalt: "bg-brand-50 text-brand-700 dark:bg-zinc-800 dark:text-brand-300",
  funktion: "bg-emerald-50 text-emerald-700 dark:bg-zinc-800 dark:text-emerald-300",
  organisation: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function AenderungenPage() {
  // Gruppieren nach Datum (Build liefert neueste zuerst)
  const groups = changelog.reduce<Record<string, typeof changelog>>((acc, entry) => {
    (acc[entry.date] ??= []).push(entry);
    return acc;
  }, {});
  const dates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

  return (
    <main className="mx-auto max-w-2xl space-y-10 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Änderungslog</h1>
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Transparenz ist bei uns kein Versprechen, sondern ein Protokoll: Jede
          inhaltliche Korrektur, jede neue Position und jede funktionale Änderung
          wird hier mit Datum dokumentiert. Technischer Verlauf zusätzlich
          einsehbar im{" "}
          <a
            href="https://github.com/adhamsolimann"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-brand-600"
          >
            öffentlichen Repository
          </a>
          .
        </p>
      </header>

      <div className="space-y-8">
        {dates.map((date) => (
          <section key={date} aria-label={formatDate(date)} className="space-y-3">
            <h2 className="text-sm font-semibold text-zinc-500">
              {formatDate(date)}
            </h2>
            {groups[date].map((entry, i) => (
              <article
                key={`${date}-${i}`}
                className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${CATEGORY_CLASSES[entry.category]}`}
                  >
                    {CATEGORY_LABELS[entry.category]}
                  </span>
                  <h3 className="font-semibold">{entry.title}</h3>
                </div>
                {entry.details && (
                  <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {entry.details}
                  </p>
                )}
                {entry.ref && (
                  <p className="mt-2 font-mono text-[11px] text-zinc-400">ref: {entry.ref}</p>
                )}
              </article>
            ))}
          </section>
        ))}
      </div>

      <footer className="border-t border-zinc-200 pt-6 text-xs leading-relaxed text-zinc-500 dark:border-zinc-800">
        Dieser Log umfasst redaktionell relevante Änderungen ab Projektstart.
        Der Anspruch aus dem{" "}
        <a href="/statut" className="underline">
          Redaktionsstatut
        </a>
        : Korrekturen werden nie stillschweigend vorgenommen.
      </footer>
    </main>
  );
}
