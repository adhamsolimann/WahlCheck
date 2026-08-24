import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardTitle } from "@/components/ui/Card";

const ELECTION_DATE = new Date("2026-09-20T08:00:00+02:00");

function daysUntilElection(): number {
  return Math.max(
    0,
    Math.ceil((ELECTION_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  );
}

export default function Home() {
  return (
    <main className="relative mx-auto max-w-3xl space-y-8 overflow-hidden px-6 py-16">
      {/* dezenter Hintergrund-Schein */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[42rem] max-w-none -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-900/30"
      />

      <header className="animate-fade-up relative space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          Berlin · Abgeordnetenhauswahl
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="text-zinc-900 dark:text-white">Wahl</span>
          <span className="text-brand-600 dark:text-brand-400">Check</span>
        </h1>
        <p className="mx-auto max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Finde die Partei, die wirklich zu dir passt — mit differenzierten
          Antworten statt Ja/Nein. Deine Antworten bleiben in deinem Browser.
        </p>
        <p className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700 dark:bg-zinc-900 dark:text-brand-300">
          Sonntag, 20. September 2026 · noch {daysUntilElection()} Tage
        </p>
      </header>

      <section className="animate-fade-up relative grid gap-4 sm:grid-cols-2 [animation-delay:160ms]">
        <Card>
          <CardTitle>17 Parteien auf dem Stimmzettel</CardTitle>
          <CardBody>
            Von SPD und CDU bis Volt und Die Urbane. — alle zugelassenen
            Landes- und Bezirkslisten der Abgeordnetenhauswahl 2026, inklusive
            ehrlicher „keine Angabe"-Kennzeichnung.
          </CardBody>
        </Card>
        <Card>
          <CardTitle>Privat by design</CardTitle>
          <CardBody>
            Politische Meinungen sind besonders geschützte Daten. Deshalb wird
            dein Matching komplett im Browser berechnet — es geht nichts an den
            Server.
          </CardBody>
        </Card>
      </section>

      <div className="flex justify-center [animation-delay:240ms]">
        <Link href="/quiz/">
          <Button size="lg">Matching starten</Button>
        </Link>
      </div>

      <footer className="relative pt-8 text-center text-xs text-zinc-500">
        Quellen der Seed-Inhalte: Wahlprogramme der Parteien sowie
        Programm-Auswertungen von rbb24 und Tagesspiegel. Alle Zitate werden bis
        zum Launch gegen Original-PDFs verifiziert.
      </footer>
    </main>
  );
}
