"use client";

import { WEIGHT_MAX, WEIGHT_MIN } from "@wahlen/schemas";

export interface WeightSliderProps {
  value: number;
  onChange: (weight: number) => void;
}

/**
 * Wichtigkeits-Gewichtung 1–5×. Ersetzt die starre Doppelgewichtung
 * des Wahl-O-Mat.
 */
export function WeightSlider({ value, onChange }: WeightSliderProps) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="weight-slider" className="text-sm font-medium text-ink-700 dark:text-ink-200">
        Wichtigkeit
      </label>
      <input
        id="weight-slider"
        type="range"
        min={WEIGHT_MIN}
        max={WEIGHT_MAX}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-36 cursor-pointer appearance-none rounded-full bg-ink-900/15 accent-[var(--color-accent-500)] dark:bg-white/15 sm:w-44"
      />
      <output
        htmlFor="weight-slider"
        aria-live="polite"
        className={`min-w-12 rounded-md px-2 py-1 text-center font-display text-sm font-bold transition-colors ${
          value > 1
            ? "bg-accent-500 text-white"
            : "bg-ink-900/[0.06] text-ink-700 dark:bg-white/10 dark:text-ink-200"
        }`}
      >
        {value}×
      </output>
    </div>
  );
}
