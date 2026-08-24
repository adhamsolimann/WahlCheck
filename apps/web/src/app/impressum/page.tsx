import { SITE_CONFIG } from "@/lib/site-config";

export const metadata = { title: "Impressum – WahlCheck" };

export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-8 px-6 py-12">
      <h1 className="text-3xl font-bold">Impressum</h1>

      <div className="space-y-6 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        <section>
          <h2 className="font-semibold">Angaben gemäß § 5 DDG (Diensteanbieter)</h2>
          <p className="mt-1">
            Adham Soliman (privat)
            <br />
            Böckhstraße 50
            <br />
            10967 Berlin
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Kontakt</h2>
          <p className="mt-1">
            GitHub:{" "}
            <a
              href={SITE_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-brand-600"
            >
              github.com/adhamsolimann
            </a>{" "}
            (Issues für Korrekturen und Feedback)
            <br />
            E-Mail: [wird ergänzt]
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Redaktionell verantwortlich</h2>
          <p className="mt-1">Adham Soliman (§ 18 Abs. 2 MStV)</p>
        </section>

        <section>
          <h2 className="font-semibold">Charakter des Angebots</h2>
          <p className="mt-1">
            Privates, nicht-kommerzielles Demokratie-Bildungsprojekt. Keine
            Werbung, keine Parteifinanzierung, keine Datengeschäfte — siehe{" "}
            <a href="/statut" className="underline">
              Redaktionsstatut
            </a>{" "}
            und{" "}
            <a href="/spenden" className="underline">
              Unterstützungsseite
            </a>
            . Das Tool gibt keine Wahlempfehlung.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Haftung für Inhalte</h2>
          <p className="mt-1">
            Alle Parteipositionen werden mit Quellenbeleg dargestellt; trotz
            sorgfältiger Prüfung sind Fehler nie ausgeschlossen. Korrekturen
            nehmen wir bevorzugt über GitHub-Issues entgegen und dokumentieren
            sie transparent im Änderungsverlauf des öffentlichen Repositories.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">Streitschlichtung</h2>
          <p className="mt-1">
            Wir sind nicht verpflichtet und nicht bereit, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </section>
      </div>
    </main>
  );
}
