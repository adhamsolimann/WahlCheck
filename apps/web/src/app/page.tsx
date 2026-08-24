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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "WahlCheck",
      url: "https://wahl-check.com/",
      email: "support@wahl-check.com",
      foundingDate: "2026",
    },
    {
      "@type": "WebSite",
      name: "WahlCheck",
      url: "https://wahl-check.com/",
      inLanguage: "de-DE",
      description: "Parteiunabhängiger Wahlkompass für die Abgeordnetenhauswahl Berlin 2026.",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Was ist WahlCheck und wie unterscheidet es sich vom Wahl-O-Mat?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "WahlCheck nutzt eine 5-Punkt-Skala statt Ja/Nein, persoenliche Wichtigkeit 1-5x, belegte Zitate aus den Wahlprogrammen und einen Koalitionsrechner. Alle Positionen sind woertlich belegt - ehrliches Keine Angabe statt Vermutungen.",
          },
        },
        {
          "@type": "Question",
          name: "Werden meine Antworten gespeichert?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nein. Das Matching läuft ausschließlich in Ihrem Browser. Es gibt keinen Serverpfad für Antwortdaten — politische Meinungsdaten verlassen das Gerät nicht (Art. 9 DSGVO).",
          },
        },
        {
          "@type": "Question",
          name: "Ist WahlCheck parteiunabhängig?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Ja. Alle 17 zugelassenen Parteien werden nach denselben Regeln dargestellt. Jede Position trägt ein wörtliches Zitat aus dem offiziellen Wahlprogramm. Keine Parteigelder, keine Werbung, keine Wahlempfehlung.",
          },
        },
        {
          "@type": "Question",
          name: "Welche Parteien treten zur Berliner Abgeordnetenhauswahl 2026 an?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "17 Parteien mit Landes- oder Bezirkslisten, u.a. SPD, CDU, Grüne, Linke, AfD, FDP, BSW, Volt, ÖDP, Tierschutzpartei, DKP, Die PARTEI und weitere.",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <main className="relative mx-auto max-w-3xl space-y-8 overflow-hidden px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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


      {/* SEO-Textblock — für Crawler zusätzliche inhaltliche Tiefe */}
      <section className="animate-fade-up relative space-y-4 rounded-xl border border-zinc-100 bg-zinc-50 p-6 text-sm leading-relaxed text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 [animation-delay:300ms]">
        <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
          Der Wahlkompass für die Abgeordnetenhauswahl Berlin 2026
        </h2>
        <p>
          Am 20. September 2026 wählt Berlin ein neues Abgeordnetenhaus.
          17 Parteien treten mit Landes- oder Bezirkslisten an — von SPD, CDU,
          Grünen und Linken über AfD und FDP bis zu BSW, Volt, Tierschutzpartei
          und DKP. Wer bei so vielen Optionen den Überblick behalten will,
          braucht mehr als Plakate und Wahlsprüche.
        </p>
        <p>
          WahlCheck ist eine Alternative zum klassischen Wahl-O-Mat: Statt 38
          Ja/Nein-Fragen bekommst du eine 5-Punkte-Skala mit persönlicher
          Wichtigkeit, wörtlich belegte Parteipositionen aus den offiziellen
          Wahlprogrammen, einen Koalitionsrechner mit Sitzprojektion und die
          Sicherheit, dass deine Antworten dein Gerät nie verlassen.
        </p>
      </section>

      <footer className="relative pt-8 text-center text-xs text-zinc-500">
        Quellen der Seed-Inhalte: Wahlprogramme der Parteien sowie
        Programm-Auswertungen von rbb24 und Tagesspiegel. Alle Zitate werden bis
        zum Launch gegen Original-PDFs verifiziert.
      </footer>
    </main>
  );
}
