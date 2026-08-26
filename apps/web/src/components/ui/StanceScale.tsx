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
 * 5-Punkt-Likert-Skala (-2 … +2) als zusammenhängendes Segmentband —
 * die Position auf dem Band IST die Aussage. Kern-Differenzierungsmerkmal
 * zum binären Wahl-O-Mat-Format.
 */
export function StanceScale({ value, onChange }: StanceScaleProps) {
  const options: number[] = [];
  for (let s = STANCE_MIN; s <= STANCE_MAX; s++) options.push(s);
  const selectedIndex = value !== null ? options.indexOf(value) : -1;

  return (
    <div className="space-y-2">
      <div
        role="radiogroup"
        aria-label="Deine Position"
        className="grid grid-cols-5 gap-1.5"
      >
        {options.map((option) => {
          const selected = value === option;
          const adjacent =
            selectedIndex >= 0 && Math.abs(options.indexOf(option) - selectedIndex) === 1;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option)}
              className={`rounded-lg border px-1 py-2.5 font-display transition-all duration-150 sm:py-3 ${
                selected
                  ? "border-accent-600 bg-accent-500 text-white shadow-[0_4px_14px_-4px] shadow-accent-500/50"
                  : `border-ink-900/10 text-ink-700 hover:border-accent-400 hover:text-ink-900 dark:border-white/10 dark:text-ink-200 dark:hover:border-accent-400/60 ${
                      adjacent ? "bg-accent-500/10 dark:bg-accent-500/10" : "bg-white dark:bg-white/[0.04]"
                    }`
              }`}
            >
              <span aria-hidden className="mb-0.5 block text-base font-bold">
                {option > 0 ? `+${option}` : option}
              </span>
              <span className="block text-[11px] font-medium leading-tight sm:text-xs">
                {STANCE_LABELS[option]}
              </span>
            </button>
          );
        })}
      </div>
      {/* Band-Achse */}
      <div aria-hidden className="flex items-center justify-between px-1 text-[10px] font-medium uppercase tracking-widest text-ink-400 dark:text-ink-500">
        <span>Ablehnung</span>
        <span>Zustimmung</span>
      </div>
    </div>
  );
}
