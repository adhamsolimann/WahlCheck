"use client";

import type { Thesis } from "@wahlen/schemas";
import { StanceScale } from "@/components/ui/StanceScale";
import { WeightSlider } from "@/components/ui/WeightSlider";
import { Button } from "@/components/ui/Button";

export interface ThesisCardProps {
  thesis: Thesis;
  index: number;
  total: number;
  stance: number | null; // null = noch nicht beantwortet
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
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          These {index + 1} von {total}
        </p>
        <h2 className="text-xl font-semibold leading-snug sm:text-2xl">
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

      <div className="flex items-center justify-between gap-3">
        <Button variant="secondary" onClick={onPrev} disabled={index === 0}>
          ← Zurück
        </Button>
        <span className="text-xs text-zinc-500" aria-hidden>
          Tastatur: 1–5 · S · ← →
        </span>
        <Button onClick={onNext} disabled={index === total - 1 && stance === null && !skipped}>
          Weiter →
        </Button>
      </div>
    </div>
  );
}
