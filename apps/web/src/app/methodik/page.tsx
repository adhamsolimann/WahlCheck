import Link from "next/link";
import {
  CULTURAL_AXIS,
  CULTURAL_DIRECTED,
  ECONOMIC_AXIS,
  ECONOMIC_DIRECTED,
} from "@/lib/compass-config";
import { CORRECTION_URL } from "@/lib/site-config";
import { content } from "@/lib/content";

export const metadata = {
  title: "Methodik – WahlCheck Berlin",
};

function AxisTable({
  title,
  meta,
  directed,
}: {
  title: string;
  meta: typeof ECONOMIC_AXIS;
  directed: typeof ECONOMIC_DIRECTED;
}) {
  const thesisById = new Map(content.theses.map((t) => [t.id, t]));
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">
        {title}: „{meta.negativeLabel}“ ↔ „{meta.positiveLabel}“
      </h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{meta.description}</p>
      <ul className="space-y-1 text-sm">
        {directed.map((d) => {
          const thesis = thesisById.get(d.thesisId);
          return (
            <li key={d.thesisId} className="flex gap-2">
              <span
                className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-xs font-semibold ${
                  d.direction === 1
                    ? "bg-blue-50 text-blue-700 dark:bg-zinc-800"
                    : "bg-red-50 text-red-700 dark:bg-zinc-800"
                }`}
              >
                {d.direction === 1 ? `Zustimmung → ${meta.positiveLabel}` : `Zustimmung → ${meta.negativeLabel}`}
              </span>
              <span className="text-zinc-700 dark:text-zinc-300">
                {thesis?.text ?? d.thesisId}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function MethodikPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-10 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Methodik</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Dieses Tool gibt keine Wahlempfehlung. Es macht sichtbar, wie nahe
          Parteipositionen an deinen Antworten liegen — nachvollziehbar bis auf
          die letzte Formel.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1. Thesenauswahl</h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          Anders als der Wahl-O-Mat wählen wir Thesen nicht primär danach aus,
          wo sich Parteien am stärksten unterscheiden, sondern zuerst danach, welche
          Themen Berlinerinnen und Berlinern wichtig sind (Wählersalienz).
          Wohnen bekommt entsprechend seiner Dominanz in Umfragen den größten
          Block. Jede These braucht eine Begründung und mindestens eine Quelle.
          Zusätzlich gilt ein Differenzierungs-Kriterium: Eine These bleibt nur
          im Set, wenn mindestens drei Parteien klare, unterschiedliche Positionen
          dazu haben — der laufende Stand wird automatisch geprüft und ist
          Teil unserer CI.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">2. Parteipositionen</h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          Positionen werden aus den offiziellen Wahlprogrammen extrahiert und mit
          wörtlichen Zitat-Auszügen belegt. Sekundäre Auswertungen (u. a. rbb24,
          tagesschau, Tagesspiegel) dienen als zweite Quelle. Jede Position hat
          einen Verifikationsstatus: „pending“ bedeutet, dass das Zitat noch
          gegen das Original-PDF gegengelesen wird (Fixpunkt: Faktencheck-Freeze
          vor dem Launch). Kann einer Partei zu einer These keine klare Position
          zugeordnet werden, steht sie bei uns ehrlich auf „keine Angabe“ — diese
          These fließt dann <em>nur für diese Partei</em> nicht in den
          Prozentwert ein. Das verhindert künstlich hohe Übereinstimmungen von
          Ein-Themen-Parteien.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">3. Berechnung</h2>
        <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-4 text-xs text-zinc-100">
{`Übereinstimmung = Σ(Gewicht × Übereinstimmung_i)
                 / Σ(Gewicht_i) × 100

Übereinstimmung_i ∈ [0..1]:
  identische Position = 1.0
  maximale Gegensätzlichkeit = 0.0
  Partei „neutral“ = immer 0.5

Gewicht: deine Wichtigkeit 1–5× (statt fixer Doppelgewichtung)
Übersprungene Thesen zählen nirgends.`}
        </pre>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Konfidenzbänder: hoch ≥ 80 % der Antworten verwertbar, mittel ≥ 50 %,
          niedrig darunter. Die vollständige Implementierung ist Open Source
          (AGPL) unter <code>packages/engine</code>.
        </p>
      </section>

      <section id="kompass" className="space-y-4 scroll-mt-8">
        <h2 className="text-xl font-semibold">4. Die Landkarte (Kompass)</h2>
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          Partei- und Nutzerpositionen werden nicht manuell platziert, sondern
          aus denselben Positionsdaten berechnet wie das Matching. Dazu erhält
          jede Achsen-These eine dokumentierte Richtung: bedeutet Zustimmung
          eher mehr Staat/Umverteilung bzw. konservativ-traditionell (−), oder
          mehr Markt/Eigenverantwortung bzw. progressiv-weltoffen (+)?
          Der Achsenwert ist das gewichtete Mittel aller richtungskorrigierten
          Positionen, skaliert auf −100…+100. Bei Nutzerinnen und Nutzern
          zählt eine manuell eingestellte Wichtigkeit (Slider), nicht die
          automatischen Persona-Voreinstellungen — die Landkarte zeigt, was du
          denkst, nicht wie wichtig dir ein Thema beim Matching war.
          Parteien mit zu wenigen klaren Angaben im Achsen-Scope werden gar
          nicht erst platziert statt an einer erfundenen Koordinate.
        </p>
        <AxisTable title="Wirtschaftsachse" meta={ECONOMIC_AXIS} directed={ECONOMIC_DIRECTED} />
        <AxisTable title="Soziokulturelle Achse" meta={CULTURAL_AXIS} directed={CULTURAL_DIRECTED} />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">5. Grenzen des Tools</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          <li>Thesen vereinfachen Politik; Programme haben Kontext, den ein Satz verliert.</li>
          <li>Regierungsbilanz und Abstimmungsverhalten fließen derzeit nicht ein (geplant).</li>
          <li>Umfragewerte sind Momentaufnahmen mit Unsicherheit, keine Vorhersagen.</li>
          <li>Koalitionsaussagen sind Modellrechnungen, keine Prognosen.</li>
          <li>
            Kleine Parteien ohne veröffentlichte Programme stehen teilweise
            durchgängig auf „keine Angabe“ — wir erfinden keine Positionen.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">6. Fehler gefunden?</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Korrekturen sind willkommen und werden transparent im{" "}
          <a href="/aenderungen" className="underline">
            öffentlichen Änderungslog
          </a>{" "}
          dokumentiert. Meldungen bevorzugt über{" "}
          <a
            className="underline"
            href={CORRECTION_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Issues im Projekt-Repository
          </a>
          .
        </p>
        <p className="text-sm">
          <Link href="/quiz" className="text-brand-600 underline">
            ← Zurück zum Matching
          </Link>
        </p>
      </section>
    </main>
  );
}
