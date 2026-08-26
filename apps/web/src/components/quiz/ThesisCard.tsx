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
 * Eine These pro Karte mit FIXER Gesamthöhe: Textbereich wächst,
 * Bedienelemente bleiben immer an derselben Position.
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
    <div className="flex h-full flex-col gap-4 sm:gap-6">
      {/* These — flex-1 absorbiert Höhenunterschiede */}
      <div className="flex-1 space-y-3">
        <p className="kicker text-accent-600 dark:text-accent-400">
          These {index + 1} / {total}
        </p>
        <h2 className="font-display text-2xl font-bold leading-[1.15] tracking-tight sm:text-[1.75rem]">
          {thesis.text}
        </h2>
      </div>

      {/* Bedienelemente — mobil kompakt, an derselben Position von unten */}
      <div className="space-y-3 sm:space-y-4">
        <div className={skipped ? "opacity-40" : ""}>
          <StanceScale value={stance} onChange={(s) => onStance(s)} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <WeightSlider value={weight} onChange={onWeight} />
          <Button variant="ghost" size="sm" onClick={onSkip}>
            {skipped ? "Nicht überspringen" : "Überspringen"}
          </Button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button variant="secondary" onClick={onPrev} disabled={index === 0}>
            ← Zurück
          </Button>
          {isLast ? (
            <span className="text-xs text-ink-400">
              Letzte These — Auswertung unten.
            </span>
          ) : (
            <>
              <span className="hidden text-xs text-ink-400 sm:inline" aria-hidden>
                Tastatur: 1–5 · S · ← →
              </span>
              <Button onClick={onNext}>Weiter →</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
