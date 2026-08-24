import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Koalitionsrechner Berlin – Wer kann regieren? | WahlCheck",
  description:
    "Alle rechnerisch möglichen Koalitionen für die Abgeordnetenhauswahl Berlin 2026: Sitzprojektion, Mehrheiten und wie gut jede Koalition zu dir passt.",
};

export default function KoalitionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
