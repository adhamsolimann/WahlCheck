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
      <label htmlFor="weight-slider" className="text-sm font-medium">
        Wie wichtig ist dir das?
      </label>
      <input
        id="weight-slider"
        type="range"
        min={WEIGHT_MIN}
        max={WEIGHT_MAX}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-40 cursor-pointer appearance-none rounded-lg bg-zinc-300 accent-[var(--color-brand-600)] dark:bg-zinc-700"
      />
      <output
        htmlFor="weight-slider"
        className="min-w-12 rounded-md bg-brand-50 px-2 py-1 text-center text-sm font-semibold text-brand-700 dark:bg-zinc-800 dark:text-brand-300"
      >
        {value}×
      </output>
    </div>
  );
}
