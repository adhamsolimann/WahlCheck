export const metadata = { title: "Datenschutz – WahlCheck Berlin" };

export default function DatenschutzPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-8 px-6 py-12">
      <h1 className="text-3xl font-bold">Datenschutz</h1>

      <div className="space-y-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        <section>
          <h2 className="font-semibold">Das Wichtigste zuerst</h2>
          <p className="mt-1">
            Deine Antworten auf unsere Thesen sind politische Meinungen und damit
            besonders geschützte Daten (Art. 9 DSGVO). Unsere Architektur macht
            deren Übermittlung technisch unmöglich: Das Matching läuft
            ausschließlich in deinem Browser. Für Antworten existiert kein
            Server-Endpunkt — ein Absenden ist im Code nicht vorgesehen, das
            prüfen wir automatisch in jeder Änderung.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Speicherung auf deinem Gerät</h2>
          <p className="mt-1">
            Deine Antworten, Gewichtungen und Einstellungen speichern wir
            ausschließlich im lokalen Speicher deines Browsers (localStorage,
            Schlüssel <code>wahlcheck.session.v1</code>). Du kannst sie jederzeit
            über „Zurücksetzen“ in der App oder durch Löschen der Website-Daten
            entfernen. Wir haben keinen Zugriff darauf.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Keine Cookies, keine Tracker</h2>
          <p className="mt-1">
            Wir setzen keine Cookies, keine Werbe- oder Social-Media-Pixel und
            laden keine Dritt-Skripte. Ein consent-Banner ist daher nicht
            erforderlich. Sollte später eine reichweitenmessung eingeführt
            werden, ausschließlich cookielos und aggregiert; diese Seite wird
            dann aktualisiert.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Server-Logfiles / Hosting</h2>
          <p className="mt-1">
            Beim Aufruf verarbeitet unser Hoster technische Zugriffsdaten
            (u. a. IP-Adresse, Zeitpunkt) auf Grundlage von Art. 6 Abs. 1 lit. f
            DSGVO zur Auslieferung und Sicherheit. [Hosting-Anbieter und
            Löschfristen vor Launch ergänzen.] Die Inhalte dieser Website sind
            statisch ausgeliefert; es findet keine Profiling statt.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Deine Rechte</h2>
          <p className="mt-1">
            Da wir keine personenbezogenen Antwortdaten speichern, gibt es dazu
            keine Auskunftsbestände. Für alles Weitere gelten deine Rechte nach
            Art. 15–21 DSGVO gegenüber dem im Impressum genannten Verantwortlichen.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Stand</h2>
          <p className="mt-1">August 2026 · Änderungen dokumentieren wir hier.</p>
        </section>
      </div>
    </main>
  );
}
