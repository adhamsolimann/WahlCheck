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
      <body>{children}</body>
    </html>
  );
}
