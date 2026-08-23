import Link from "next/link";
import { Card, CardBody, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata = { title: "Unterstützen – WahlCheck Berlin" };

const USES = [
  {
    title: "Infrastruktur",
    body: "Statisches Hosting in der EU, Domäne — aktuell unter 50 € im Monat. Bewusst sparsam gebaut.",
  },
  {
    title: "Faktencheck-Sprints",
    body: "Vor jedem Wahltermin werden alle Zitate gegen die Original-Programme gegengelesen. Das kostet Zeit von Ehrenamtlichen — Spenden ermöglichen Konzentration statt Nebentätigkeit.",
  },
  {
    title: "Unabhängigkeit",
    body: "Keine Partei-, Werbe- oder Daten-Gelder. Jeder Euro von Nutzerinnen und Nutzern ist ein Euro ohne Bedingungen.",
  },
];

export default function SpendenPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-8 px-6 py-12">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">WahlCheck bleibt frei</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Keine Werbung, keine Parteigelder, keine Datengeschäfte. Wenn dir das
          Werkzeug hilft, trägst du mit einem Beitrag dazu bei, dass es allen
          offensteht.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {USES.map((u) => (
          <Card key={u.title}>
            <CardTitle>{u.title}</CardTitle>
            <CardBody>{u.body}</CardBody>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Spenden</h2>
        {SITE_CONFIG.donateUrl ? (
          <div className="rounded-xl border border-brand-200 bg-white p-5 text-sm dark:border-zinc-700 dark:bg-zinc-900">
            <p className="font-medium">Einmalig oder monatlich unterstützen:</p>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              Der Dienst verarbeitet die Zahlung (eigene Datenschutzhinweise
              gelten); wir erhalten weder Adresse noch Kontodaten — nur
              Betrag und optionale Nachricht.
            </p>
            <a href={SITE_CONFIG.donateUrl} target="_blank" rel="noopener noreferrer">
              <Button className="mt-3">Zur Spenden-Seite →</Button>
            </a>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-brand-400 bg-brand-50 p-5 text-sm dark:bg-zinc-900">
            <p className="font-medium">Zahlungsdienst wird gerade angeschlossen.</p>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              Bis dahin gilt das Versprechen aus dem{" "}
              <Link href="/statut" className="underline">
                Redaktionsstatut
              </Link>
              : Wir nehmen erst dann Geld an, wenn Empfänger, Verwendung und
              Berichterstattung transparent dokumentiert sind.{" "}
              <span className="text-zinc-500">
                [T-123/D-4: Provider-Anbindung vor Soft-Launch]
              </span>
            </p>
          </div>
        )}
      </section>

      <section className="space-y-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        <h2 className="text-xl font-semibold">Andere helfen</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Teile dein Ergebnis-Bild mit Freundinnen, Familie und Kolleginnen —
            unser wirksamster Kanal ist Mundpropaganda.
          </li>
          <li>
            Fehler gefunden? Korrekturhinweise machen das Tool besser für alle
            (Kontakt siehe Methodik-Seite).
          </li>
          <li>
            Lehrkraft oder in einer Organisation? Schreib uns für die geplante
            Klassenzimmer-Version.
          </li>
        </ul>
      </section>

      <footer className="border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-zinc-800">
        Empfehlungen für Beträge sparen wir uns bewusst — auch beim Spenden
        machen wir keine Vorschläge, das ist Sache unserer Nutzerinnen und
        Nutzer.
      </footer>
    </main>
  );
}
