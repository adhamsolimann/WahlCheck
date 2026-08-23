import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WahlCheck Berlin – Abgeordnetenhauswahl am 20.09.2026",
  description:
    "Parteiunabhängiger Wahlkompass für die Berliner Abgeordnetenhauswahl: nuanced matching statt Ja/Nein. Deine Antworten bleiben im Browser.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>
        {children}
        <footer className="mt-16 border-t border-zinc-200 px-6 py-8 text-center text-xs text-zinc-500 dark:border-zinc-800">
          <nav aria-label="Fußzeile" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <a href="/quiz/" className="hover:underline">Matching</a>
            <a href="/koalition/" className="hover:underline">Koalitionen</a>
            <a href="/methodik/" className="hover:underline">Methodik</a>
            <a href="/statut/" className="hover:underline">Redaktionsstatut</a>
            <a href="/datenschutz/" className="hover:underline">Datenschutz</a>
            <a href="/impressum/" className="hover:underline">Impressum</a>
            <a href="/spenden/" className="hover:underline">Unterstützen</a>
          </nav>
          <p className="mt-3">
            Quellen der Positionen: offizielle Wahlprogramme; Auswertungen von
            rbb24, tagesschau und Tagesspiegel. Keine Wahlempfehlung.
          </p>
        </footer>
      </body>
    </html>
  );
}
