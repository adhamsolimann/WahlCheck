import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardTitle } from "@/components/ui/Card";
import { KofiWidget } from "@/components/KofiWidget";

const ELECTION_DATE = new Date("2026-09-20T08:00:00+02:00");

function daysUntilElection(): number {
  return Math.max(
    0,
    Math.ceil((ELECTION_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 px-6 py-16">
      {/* Ko-Fi-Tipp-Button (lazy geladen, nur Startseite) */}
      <KofiWidget />
      <header className="space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400">
          Berlin · Abgeordnetenhauswahl
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          WahlCheck Berlin
        </h1>
        <p className="mx-auto max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Finde die Partei, die wirklich zu dir passt — mit differenzierten
          Antworten statt Ja/Nein. Deine Antworten bleiben in deinem Browser.
        </p>
        <p className="inline-block rounded-full bg-brand-50 px-4 py-1.5 text-sm font-semibold text-brand-700 dark:bg-zinc-900 dark:text-brand-300">
          Sonntag, 20. September 2026 · noch {daysUntilElection()} Tage
        </p>
      </header>

      <div
        role="status"
        className="rounded-xl border border-accent-500/30 bg-accent-500/5 p-4 text-center text-sm"
      >
        <strong>Baukasten-Status:</strong> Sprint 0 abgeschlossen — Engine,
        Schemata und Design-System stehen. Der Quiz-Flow folgt in Sprint-Woche 1
        (Tasks T-101 ff., siehe ROADMAP.md).
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
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

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/quiz/">
          <Button size="lg">Matching starten</Button>
        </Link>
        <Link href="/design/">
          <Button variant="secondary" size="lg">
            Design-System ansehen
          </Button>
        </Link>
      </div>

      <footer className="pt-8 text-center text-xs text-zinc-500">
        Quellen der Seed-Inhalte: Wahlprogramme der Parteien sowie
        Programm-Auswertungen von rbb24 und Tagesspiegel. Alle Zitate werden bis
        zum Launch gegen Original-PDFs verifiziert.
      </footer>
    </main>
  );
}
