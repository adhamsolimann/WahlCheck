import type { Metadata } from "next";
import "./globals.css";
import { KofiWidget } from "@/components/KofiWidget";
import { SiteHeader } from "@/components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "WahlCheck – Abgeordnetenhauswahl Berlin am 20.09.2026",
  description:
    "Parteiunabhängiger Wahlkompass für die Berliner Abgeordnetenhauswahl: nuanced matching statt Ja/Nein. Deine Antworten bleiben im Browser.",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

/** Vor dem ersten Paint gesetzt → kein Flash bei gespeicherter Wahl. */
const THEME_INIT = `(function(){try{var k="wahlcheck.theme";var t=localStorage.getItem(k);if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}if(t==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <SiteHeader />
        {/* Ko-Fi-Tipp-Button sitewide (lazy geladen; siehe Datenschutzerklärung) */}
        <KofiWidget />
        {children}
        <footer className="mt-16 border-t border-zinc-200 px-6 py-8 text-center text-xs text-zinc-500 dark:border-zinc-800">
          <nav aria-label="Fußzeile" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            <a href="/quiz/" className="hover:underline">Matching</a>
            <a href="/koalition/" className="hover:underline">Koalitionen</a>
            <a href="/methodik/" className="hover:underline">Methodik</a>
            <a href="/aenderungen/" className="hover:underline">Änderungslog</a>
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
