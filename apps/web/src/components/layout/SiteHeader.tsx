"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/quiz/", label: "Matching" },
  { href: "/koalition/", label: "Koalitionen" },
  { href: "/methodik/", label: "Methodik" },
  { href: "/aenderungen/", label: "Änderungslog" },
];

/** Sticky Hauptnavigation mit aktiver Pfad-Markierung. */
export function SiteHeader() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-5xl items-center gap-x-6 gap-y-2 overflow-x-auto px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="shrink-0 font-bold tracking-tight hover:text-brand-700 dark:hover:text-brand-300"
        >
          WahlCheck<span className="text-brand-600 dark:text-brand-400">Berlin</span>
        </Link>

        <nav aria-label="Hauptnavigation" className="flex items-center gap-x-1">
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
          <Link
            href="/spenden/"
            className={`ml-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
              isActive("/spenden")
                ? "bg-accent-600 text-white"
                : "bg-accent-500 text-white hover:bg-accent-600"
            }`}
          >
            Unterstützen ♥
          </Link>
        </nav>
      </div>
    </header>
  );
}
