import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "accent" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  // Tinten-Primär: wie gedruckt. Invertiert im Dark Mode.
  primary:
    "bg-ink-900 text-white hover:bg-ink-800 dark:bg-white dark:text-ink-950 dark:hover:bg-ink-100",
  // Signal-Koralle für die eine entscheidende Aktion
  accent:
    "bg-accent-500 text-white hover:bg-accent-600 focus-visible:outline-accent-600",
  secondary:
    "border border-ink-900/15 bg-transparent text-ink-900 hover:border-ink-900/40 hover:bg-ink-900/[0.04] dark:border-white/20 dark:text-ink-100 dark:hover:border-white/40 dark:hover:bg-white/[0.06]",
  ghost:
    "text-ink-600 hover:bg-ink-900/[0.05] hover:text-ink-900 dark:text-ink-300 dark:hover:bg-white/[0.07] dark:hover:text-white",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-display text-[0.95rem] font-semibold tracking-tight transition duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    />
  );
}
