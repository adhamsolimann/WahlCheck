export const metadata = { title: "Impressum – WahlCheck Berlin" };

export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-8 px-6 py-12">
      <h1 className="text-3xl font-bold">Impressum</h1>

      <div className="space-y-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {/* TODO(T-110-legal): Vor dem öffentlichen Launch durch den Projektträger
            ausfüllen (§5 DDG). Platzhalter sind bewusst gekennzeichnet. */}
        <section>
          <h2 className="font-semibold">Angaben gemäß § 5 DDG</h2>
          <p className="mt-1">
            <strong>[Projektträger — vor Launch eintragen]</strong>
            <br />
            [Rechtsform]
            <br />
            [Straße und Hausnummer]
            <br />
            [PLZ, Ort]
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Vertreten durch / Kontakt</h2>
          <p className="mt-1">
            [Verantwortliche Person]
            <br />
            E-Mail: [Kontakt]
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Redaktionell verantwortlich</h2>
          <p className="mt-1">[Person, Adresse — § 18 Abs. 2 MStV]</p>
        </section>

        <section>
          <h2 className="font-semibold">Haftung für Inhalte</h2>
          <p className="mt-1">
            Dieses Tool stellt Parteipositionen mit Quellenangaben dar; es gibt
            keine Wahlempfehlung. Trotz sorgfältiger Prüfung können Fehler nicht
            ausgeschlossen werden — Korrekturen nehmen wir über die im
            Redaktionsstatut beschriebenen Wege entgegen.
          </p>
        </section>
      </div>
    </main>
  );
}
