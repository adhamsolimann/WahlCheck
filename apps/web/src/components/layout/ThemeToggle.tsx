"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const KEY = "wahlcheck.theme";

function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

/**
 * Hell/Dunkl-Umschalter. Initialwert: gespeicherte Wahl, sonst System.
 * Kein Flash: layout.tsx setzt die Klasse vor dem ersten Paint per
 * Inline-Script.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(KEY) as Theme | null;
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(stored ?? system);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    apply(next);
    localStorage.setItem(KEY, next);
    setTheme(next);
  }

  // bis zur Hydration neutral rendern (verhindert Icon-Springen)
  if (theme === null) {
    return <div className="h-9 w-9" aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Zu hellem Design wechseln" : "Zu dunklem Design wechseln"}
      title={theme === "dark" ? "Helles Design" : "Dunkles Design"}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 transition hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white"
    >
      {theme === "dark" ? (
        // Sonne
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Mond
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
