import Link from "next/link";
import { Button } from "@/components/ui/Button";

const ELECTION_DATE = new Date("2026-09-20T08:00:00+02:00");

function daysUntilElection(): number {
  return Math.max(
    0,
    Math.ceil((ELECTION_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  );
}

const FEATURES = [
  {
    index: "01",
    title: "5 Punkte statt Ja/Nein",
    body: "Zustimmung ist nicht binär. Eine fünfstufige Skala mit persönlicher Wichtigkeit (1–5×) bildet ab, was der Wahl-O-Mat verschweigt.",
  },
  {
    index: "02",
    title: "Jede Position wörtlich belegt",
    body: "Zu jeder These das Zitat aus dem offiziellen Wahlprogramm — nachprüfbar, mit Quellenangabe. Ehrliches „keine Angabe“ statt Vermutung.",
  },
  {
    index: "03",
    title: "Koalitionsrealität inklusive",
    body: "Sitzprojektion, 5-%-Hürde und realistische Koalitionen: Dein Ergebnis wird in den Kontext dessen gesetzt, was regieren kann.",
  },
];

const TRUST = [
  { label: "100 % im Browser", detail: "Antworten verlassen dein Gerät nie" },
  { label: "Keine Werbung", detail: "Finanziert durch Spenden, nicht Parteien" },
  { label: "Offene Methodik", detail: "Formel und Auswahlkriterien publiziert" },
];

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
      description:
        "Parteiunabhängiger Wahlkompass für die Abgeordnetenhauswahl Berlin 2026.",
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
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---------------- Hero ---------------- */}
      <section className="dot-grid relative overflow-hidden border-b border-ink-900/10 text-ink-900 dark:border-white/10 dark:text-white">
        <div className="mx-auto max-w-5xl px-6 pb-16 pt-14 sm:pt-20">
          <p className="kicker animate-fade-up flex items-center gap-3 text-accent-600 dark:text-accent-400">
            <span aria-hidden className="inline-block h-[2px] w-8 bg-accent-500" />
            Berlin · Abgeordnetenhauswahl · 20.09.2026
          </p>

          <h1 className="animate-fade-up mt-6 max-w-4xl font-display text-5xl font-bold leading-[0.98] tracking-tight [animation-delay:80ms] sm:text-7xl lg:text-8xl">
            Welche Partei
            <br />
            passt zu{" "}
            <span className="relative inline-block text-accent-500">
              dir?
              <svg
                aria-hidden
                viewBox="0 0 120 12"
                className="absolute -bottom-1 left-0 w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9 C 30 2, 90 2, 118 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity="0.45"
                />
              </svg>
            </span>
          </h1>

          <p className="animate-fade-up mt-6 max-w-xl text-lg leading-relaxed text-ink-600 dark:text-ink-300 [animation-delay:160ms]">
            Differenzierte Antworten statt Ja/Nein. Wörtlich belegte
            Parteipositionen statt Plakate. Und die Gewissheit, dass dein
            Meinungsbild dein Gerät nie verlässt.
          </p>

          <div className="animate-fade-up mt-9 flex flex-wrap items-center gap-4 [animation-delay:240ms]">
            <Link href="/quiz/">
              <Button size="lg">Matching starten</Button>
            </Link>
            <Link href="/koalition/">
              <Button variant="secondary" size="lg">
                Wer kann regieren?
              </Button>
            </Link>
            <span className="ml-1 inline-flex items-center gap-2 rounded-full border border-accent-500/40 bg-accent-500/[0.07] px-4 py-2 font-display text-sm font-semibold text-accent-700 dark:text-accent-300">
              <span aria-hidden className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
              </span>
              Noch {daysUntilElection()} Tage bis zur Wahl
            </span>
          </div>
        </div>
      </section>

      {/* ---------------- Features ---------------- */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-3 md:gap-6">
          {FEATURES.map(({ index, title, body }, i) => (
            <article
              key={index}
              className="animate-fade-up border-t-2 border-ink-900 pt-5 dark:border-white/80 [&:nth-child(2)]:[animation-delay:120ms] [&:nth-child(3)]:[animation-delay:240ms]"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <p aria-hidden className="font-display text-sm font-bold text-accent-500">
                {index}
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold tracking-tight">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                {body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- Vertrauen ---------------- */}
      <section className="border-y border-ink-900/10 bg-white dark:border-white/10 dark:bg-ink-900/40">
        <dl className="mx-auto grid max-w-5xl gap-x-8 gap-y-6 px-6 py-12 sm:grid-cols-3">
          {TRUST.map(({ label, detail }) => (
            <div key={label} className="flex items-start gap-3">
              <svg
                aria-hidden
                width="22"
                height="22"
                viewBox="0 0 64 64"
                className="mt-0.5 shrink-0"
              >
                <rect width="64" height="64" rx="12" fill="currentColor" className="text-ink-950 dark:text-white" />
                <rect x="14" y="10" width="36" height="44" rx="4" fill="#f7f6f3" />
                <path d="M23 33.5 30.5 41 43 24" fill="none" stroke="#e85d3b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div>
                <dt className="font-display text-sm font-bold uppercase tracking-wide">
                  {label}
                </dt>
                <dd className="text-sm text-ink-600 dark:text-ink-300">{detail}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------------- SEO-Block ---------------- */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Der Wahlkompass für die Abgeordnetenhauswahl Berlin 2026
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-600 dark:text-ink-300">
          <p>
            Am 20. September 2026 wählt Berlin ein neues Abgeordnetenhaus. 17
            Parteien treten mit Landes- oder Bezirkslisten an — von SPD, CDU,
            Grünen und Linken über AfD und FDP bis zu BSW, Volt,
            Tierschutzpartei und DKP. Wer bei so vielen Optionen den Überblick
            behalten will, braucht mehr als Plakate und Wahlsprüche.
          </p>
          <p>
            WahlCheck ist eine Alternative zum klassischen Wahl-O-Mat: Statt 38
            Ja/Nein-Fragen bekommst du eine 5-Punkte-Skala mit persönlicher
            Wichtigkeit, wörtlich belegte Parteipositionen aus den offiziellen
            Wahlprogrammen, einen Koalitionsrechner mit Sitzprojektion und die
            Sicherheit, dass deine Antworten dein Gerät nie verlassen.
          </p>
        </div>
        <p className="rule mt-8 pt-4 text-xs leading-relaxed text-ink-400">
          Quellen der Inhalte: Wahlprogramme der Parteien sowie
          Programm-Auswertungen von rbb24 und Tagesspiegel. Alle Zitate wurden
          gegen die Original-PDFs verifiziert.
        </p>
      </section>
    </main>
  );
}
