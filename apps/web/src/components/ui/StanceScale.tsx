"use client";

import { STANCE_MAX, STANCE_MIN } from "@wahlen/schemas";

export const STANCE_LABELS: Record<number, string> = {
  [-2]: "Lehne ich ab",
  [-1]: "Eher ab",
  [0]: "Teils, teils",
  [1]: "Eher ja",
  [2]: "Ja",
};

export interface StanceScaleProps {
  value: number | null;
  onChange: (stance: number) => void;
}

/**
 * 5-Punkt-Likert-Skala (-2 … +2). Kern-Differenzierungsmerkmal zum
 * binären Wahl-O-Mat-Format.
 */
export function StanceScale({ value, onChange }: StanceScaleProps) {
  const options: number[] = [];
  for (let s = STANCE_MIN; s <= STANCE_MAX; s++) options.push(s);

  return (
    <div role="radiogroup" aria-label="Deine Position" className="grid grid-cols-5 gap-2">
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            className={`rounded-lg border px-1 py-3 text-xs font-medium transition-colors sm:text-sm ${
              selected
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:border-brand-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
            }`}
          >
            <span aria-hidden className="mb-1 block text-base font-bold">
              {option > 0 ? `+${option}` : option}
            </span>
            {STANCE_LABELS[option]}
          </button>
        );
      })}
    </div>
  );
}
