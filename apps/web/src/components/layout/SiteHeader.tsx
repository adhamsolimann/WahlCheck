"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const NAV = [
  { href: "/quiz/", label: "Matching" },
  { href: "/koalition/", label: "Koalitionen" },
  { href: "/news/", label: "News" },
  { href: "/methodik/", label: "Methodik" },
  { href: "/aenderungen/", label: "Änderungslog" },
];

/** Wortmarke mit Stimmzettel-Haken als Markenzeichen. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-display font-bold tracking-tight ${className}`}>
      <svg aria-hidden width="20" height="20" viewBox="0 0 64 64" className="shrink-0">
        <rect width="64" height="64" rx="12" fill="currentColor" className="text-ink-950 dark:text-white" />
        <rect x="14" y="10" width="36" height="44" rx="4" fill="#f7f6f3" />
        <path
          d="M23 33.5 30.5 41 43 24"
          fill="none"
          stroke="#e85d3b"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        <span>Wahl</span>
        <span className="text-accent-500">Check</span>
      </span>
    </span>
  );
}

/** Sticky Hauptnavigation mit aktiver Unterstreichung.
 *  Desktop: Logo | Nav | Theme + CTA · Mobile: Hamburger → Panel   */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href);

  function close() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/10 bg-paper/90 backdrop-blur-md dark:border-white/10 dark:bg-ink-950/90">
      {/* Korallen Signatur-Streifen oben — Wiedererkennungsmerkmal */}
      <div aria-hidden className="h-[3px] bg-accent-500" />

      <div className="mx-auto flex max-w-5xl items-center justify-between gap-x-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          onClick={close}
          className="shrink-0 text-lg text-ink-950 dark:text-white"
          aria-label="WahlCheck – Startseite"
        >
          <Wordmark />
        </Link>

        {/* Desktop-Navigation mit aktiver Unterstreichung */}
        <nav
          aria-label="Hauptnavigation"
          className="hidden min-w-0 items-center gap-x-6 md:flex"
        >
          {NAV.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative whitespace-nowrap py-1 text-sm font-medium transition-colors ${
                  active
                    ? "text-ink-950 after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:bg-accent-500 dark:text-white"
                    : "text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Rechte Zone */}
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            href="/quiz/"
            className="hidden rounded-lg bg-ink-900 px-4 py-2 font-display text-sm font-semibold tracking-tight text-white transition hover:bg-ink-700 sm:inline-flex dark:bg-white dark:text-ink-950 dark:hover:bg-ink-200"
          >
            Matching starten
          </Link>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-900/10 text-ink-700 transition hover:border-ink-900/30 dark:border-white/15 dark:text-ink-200 dark:hover:border-white/40 md:hidden"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile-Panel */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile Hauptnavigation"
          className="border-t border-ink-900/10 bg-paper px-4 pb-5 pt-2 dark:border-white/10 dark:bg-ink-950 md:hidden"
        >
          {NAV.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                aria-current={active ? "page" : undefined}
                className={`block border-l-2 py-2.5 pl-3 font-display text-base font-medium transition-colors ${
                  active
                    ? "border-accent-500 text-ink-950 dark:text-white"
                    : "border-transparent text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/spenden/"
            onClick={close}
            className="mt-3 block rounded-lg bg-accent-500 px-3 py-2.5 text-center font-display text-sm font-semibold text-white"
          >
            Unterstützen ♥
          </Link>
        </nav>
      )}
    </header>
  );
}
