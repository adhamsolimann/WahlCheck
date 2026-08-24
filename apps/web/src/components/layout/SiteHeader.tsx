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

/** Sticky Hauptnavigation mit aktiver Pfad-Markierung.
 *  Desktop: Logo | zentrierte Nav | Theme + Unterstützen
 *  Mobile:  Logo | Hamburger → Dropdown-Menü               */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href);

  function close() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-x-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          onClick={close}
          className="shrink-0 text-lg font-bold tracking-tight"
          aria-label="WahlCheck – Startseite"
        >
          <span className="text-zinc-900 dark:text-white">Wahl</span>
          <span className="text-brand-600 dark:text-brand-400">Check</span>
        </Link>

        {/* Desktop: zentrierte Navigation */}
        <nav
          aria-label="Hauptnavigation"
          className="hidden min-w-0 items-center justify-center gap-x-1 md:flex"
        >
          {NAV.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-50 text-brand-700 dark:bg-zinc-800 dark:text-brand-300"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Rechte Zone: Theme + Unterstützen + Hamburger (nur mobil) */}
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Link
            href="/spenden/"
            onClick={close}
            className={`hidden whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors sm:inline-flex ${
              isActive("/spenden")
                ? "bg-accent-600 text-white"
                : "bg-accent-500 text-white hover:bg-accent-600"
            }`}
          >
            Unterstützen ♥
          </Link>

          {/* Hamburger — nur unterhalb md sichtbar */}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            onClick={() => setOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 md:hidden"
          >
            {open ? (
              /* X */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              /* Burger */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile-Dropdown */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile Hauptnavigation"
          className="border-t border-zinc-200 bg-white px-4 pb-4 pt-2 dark:border-zinc-800 dark:bg-zinc-950 md:hidden"
        >
          {NAV.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                aria-current={active ? "page" : undefined}
                className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-50 text-brand-700 dark:bg-zinc-800 dark:text-brand-300"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/spenden/"
            onClick={close}
            className="mt-2 block rounded-lg bg-accent-500 px-3 py-2.5 text-center text-sm font-semibold text-white"
          >
            Unterstützen ♥
          </Link>
        </nav>
      )}
    </header>
  );
}
