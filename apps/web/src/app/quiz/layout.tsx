import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matching – Finde deine Partei | WahlCheck",
  description:
    "Beantworte 38 Thesen mit 5-Punkt-Skala und persönlicher Wichtigkeit. Alle Parteipositionen wörtlich belegt aus den Wahlprogrammen.",
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
