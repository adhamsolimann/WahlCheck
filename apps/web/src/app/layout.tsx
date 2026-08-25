import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { KofiWidget } from "@/components/KofiWidget";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SITE_CONFIG } from "@/lib/site-config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: "WahlCheck – Abgeordnetenhauswahl Berlin 2026",
    template: "%s | WahlCheck",
  },
  description:
    "Parteiunabhängiger Wahlkompass für die Abgeordnetenhauswahl Berlin 2026: Differenziertes Matching statt Ja/Nein, Koalitionsrechner, Parlaments-Halbrund und belegte Parteipositionen. Deine Antworten bleiben im Browser.",
  keywords: [
    "Abgeordnetenhauswahl Berlin 2026",
    "Wahl-O-Mat Alternative",
    "Welche Partei wählen Berlin",
    "Wahlkompass Berlin",
    "Parteienvergleich",
    "Koalitionsrechner Berlin",
    "Berliner Wahl 2026",
    "Parteipositionen vergleichen",
  ],
  authors: [{ name: "Adham Soliman" }],
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "WahlCheck",
    title: "WahlCheck – Abgeordnetenhauswahl Berlin 2026",
    description:
      "Finde die Partei, die wirklich zu dir passt — mit differenzierten Antworten, Koalitionsrechner und wörtlich belegten Parteipositionen.",
    url: SITE_CONFIG.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "WahlCheck – Abgeordnetenhauswahl Berlin 2026",
    description:
      "Differenziertes Matching, Koalitionsrechner und belegte Parteipositionen — privat berechnet im Browser.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e12" },
  ],
};

/** Vor dem ersten Paint gesetzt → kein Flash bei gespeicherter Wahl. */
const THEME_INIT = `(function(){try{var k="wahlcheck.theme";var t=localStorage.getItem(k);if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}if(t==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`;

const FOOTER_NAV = [
  { href: "/quiz/", label: "Matching" },
  { href: "/koalition/", label: "Koalitionen" },
  { href: "/news/", label: "News" },
  { href: "/methodik/", label: "Methodik" },
  { href: "/aenderungen/", label: "Änderungslog" },
  { href: "/statut/", label: "Redaktionsstatut" },
  { href: "/datenschutz/", label: "Datenschutz" },
  { href: "/impressum/", label: "Impressum" },
  { href: "/spenden/", label: "Unterstützen" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" suppressHydrationWarning className={`${inter.variable} ${grotesk.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body>
        <SiteHeader />
        {/* Ko-Fi-Tipp-Button sitewide (lazy geladen; siehe Datenschutzerklärung) */}
        <KofiWidget />
        {children}
        <footer className="mt-20 bg-ink-950 text-ink-100">
          {/* Riesiges Wortmarken-Banner */}
          <div aria-hidden className="dot-grid select-none px-6 pt-10 text-ink-100">
            <p className="mx-auto max-w-5xl font-display text-[13vw] font-bold leading-none tracking-tight text-white/95 sm:text-7xl lg:text-8xl">
              Wahl<span className="text-accent-400">Check</span>
            </p>
          </div>
          <div className="mx-auto max-w-5xl px-6 pb-10 pt-8">
            <nav
              aria-label="Fußzeile"
              className="grid grid-cols-2 gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm sm:grid-cols-3 md:grid-cols-5"
            >
              {FOOTER_NAV.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="text-ink-300 transition-colors hover:text-accent-400"
                >
                  {label}
                </a>
              ))}
            </nav>
            <p className="mt-8 max-w-2xl text-xs leading-relaxed text-ink-400">
              Quellen der Positionen: offizielle Wahlprogramme; Auswertungen von
              rbb24, tagesschau und Tagesspiegel. Keine Wahlempfehlung. Das
              Matching läuft vollständig in deinem Browser — wir speichern keine
              Antworten.
            </p>
            <p className="mt-4 font-display text-xs uppercase tracking-widest text-ink-500">
              Berlin · Abgeordnetenhauswahl · 20.09.2026
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
