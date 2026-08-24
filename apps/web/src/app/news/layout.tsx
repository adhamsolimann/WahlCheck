import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wahl-Nachrichten Berlin – Presse-Spiegel | WahlCheck",
  description:
    "Aktuelle Nachrichten zur Abgeordnetenhauswahl Berlin 2026: Umfragen, Kandidaten, Wahlprogramme — kuratiert und mit Quellen-Links.",
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
