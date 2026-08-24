"use client";

import type { Thesis } from "@wahlen/schemas";
import { StanceScale } from "@/components/ui/StanceScale";
import { WeightSlider } from "@/components/ui/WeightSlider";
import { Button } from "@/components/ui/Button";

export interface ThesisCardProps {
  thesis: Thesis;
  index: number;
  total: number;
  stance: number | null;
  skipped: boolean;
  weight: number;
  onStance: (stance: number) => void;
  onSkip: () => void;
  onWeight: (weight: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

/**
 * Eine These pro Karte. Bedienbar per Touch, Maus und Tastatur
 * (1–5 = Skala, S = überspringen, ←/→ = Navigation).
 * Auf der letzten Frage gibt es bewusst keinen „Weiter“-Button —
 * der Weg führt über die Auswertungs-CTA darunter.
 */
export function ThesisCard({
  thesis,
  index,
  total,
  stance,
  skipped,
  weight,
  onStance,
  onSkip,
  onWeight,
  onPrev,
  onNext,
}: ThesisCardProps) {
  const isLast = index === total - 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          These {index + 1} von {total}
        </p>
        {/* min-height verhindert Layout-Springen bei unterschiedlichen Textlängen */}
        <h2 className="min-h-[5rem] text-xl font-semibold leading-snug sm:min-h-[4.5rem] sm:text-2xl">
          {thesis.text}
        </h2>
      </div>

      <div className={skipped ? "opacity-40" : ""}>
        <StanceScale
          value={stance}
          onChange={(s) => {
            onStance(s);
          }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <WeightSlider value={weight} onChange={onWeight} />
        <Button variant="ghost" size="sm" onClick={onSkip}>
          {skipped ? "Nicht überspringen" : "Überspringen"}
        </Button>
      </div>

      <div className="flex min-h-[2.75rem] items-center justify-between gap-3">
        <Button variant="secondary" onClick={onPrev} disabled={index === 0}>
          ← Zurück
        </Button>
        {isLast ? (
          <span className="text-xs text-zinc-500">
            Letzte These — weiter geht es unten mit der Auswertung.
          </span>
        ) : (
          <>
            <span className="hidden text-xs text-zinc-500 sm:inline" aria-hidden>
              Tastatur: 1–5 · S · ← →
            </span>
            <Button onClick={onNext}>Weiter →</Button>
          </>
        )}
      </div>
    </div>
  );
}
