import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Opt-in: subtile Hover-Hebung (nur wo Interaktion erwartet wird). */
  hoverable?: boolean;
}

/** Editorial-Fläche: Hairline-Border, kein Schatten, klare Kante. */
export function Card({
  children,
  className = "",
  hoverable = false,
  ...rest
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-ink-900/10 bg-white p-6 dark:border-white/10 dark:bg-ink-900/60 ${
        hoverable
          ? "transition duration-200 hover:-translate-y-0.5 hover:border-accent-400/60 dark:hover:border-accent-400/40"
          : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Nummerierter redaktioneller Kartentitel: „01 — Titel" */
export function CardTitle({
  children,
  index,
}: {
  children: ReactNode;
  index?: string;
}) {
  return (
    <h2 className="mb-2 flex items-baseline gap-2.5 font-display text-lg font-semibold tracking-tight">
      {index && (
        <span aria-hidden className="font-display text-xs font-bold text-accent-500">
          {index}
        </span>
      )}
      {children}
    </h2>
  );
}

export function CardBody({ children }: { children: ReactNode }) {
  return (
    <div className="text-sm leading-relaxed text-ink-600 dark:text-ink-300">
      {children}
    </div>
  );
}
