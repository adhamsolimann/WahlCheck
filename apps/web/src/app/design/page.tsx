"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardTitle } from "@/components/ui/Card";
import { StanceScale } from "@/components/ui/StanceScale";
import { TierBadge } from "@/components/ui/TierBadge";
import { WeightSlider } from "@/components/ui/WeightSlider";

export default function DesignPage() {
  const [stance, setStance] = useState<number | null>(null);
  const [weight, setWeight] = useState(1);
  const [replay, setReplay] = useState(0);

  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Sprint 0 · T-000d
        </p>
        <h1 className="text-3xl font-bold">Design-System</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Lebender Komponentenkatalog (Storybook-Ersatz, siehe
          docs/deviations.md). Alle Bausteine des Quiz-Flows.
        </p>
      </header>

      <Card>
        <CardTitle>Buttons</CardTitle>
        <CardBody>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardTitle>Tier-Badges (Ergebnis-Gruppierung)</CardTitle>
        <CardBody>
          <div className="flex flex-wrap gap-2">
            <TierBadge tier="parliament" />
            <TierBadge tier="small" />
            <TierBadge tier="contextual" />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardTitle>StanceScale — 5-Punkt-Skala</CardTitle>
        <CardBody>
          <p className="mb-4 text-base font-medium">
            Für die landeseigenen Wohnungsunternehmen soll ein Mietendeckel
            eingeführt werden.
          </p>
          <StanceScale value={stance} onChange={setStance} />
          <p className="mt-3 text-xs text-zinc-500">
            Gewählt: {stance === null ? "—" : stance > 0 ? `+${stance}` : stance}
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardTitle>WeightSlider — Wichtigkeit 1–5×</CardTitle>
        <CardBody>
          <WeightSlider value={weight} onChange={setWeight} />
        </CardBody>
      </Card>

      {/* ---------- Bewegung (docs/design-system.md §3) ---------- */}
      <Card>
        <CardTitle>Bewegung — animate-fade-up / animate-bar-x</CardTitle>
        <CardBody>
          <p className="mb-4 text-xs text-zinc-500">
            Beide laufen nur bei „keine reduzierte Bewegung“; Stagger über
            inline animation-delay. Replay per Klick.
          </p>
          <div className="space-y-3">
            {[80, 55, 30].map((pct, i) => (
              <div key={`${replay}-${i}`} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: ["#D81E05", "#1A1A1A", "#E5007D"][i] }}
                />
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <span
                    className="animate-bar-x block h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: ["#D81E05", "#1A1A1A", "#E5007D"][i],
                      animationDelay: `${i * 90}ms`,
                    }}
                  />
                </span>
                <span className="w-12 text-right text-sm tabular-nums">{pct} %</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button size="sm" variant="secondary" onClick={() => setReplay((n) => n + 1)}>
              Animation wiederholen
            </Button>
            <span className="animate-fade-up text-xs text-zinc-500" key={replay}>
              ← Karte/Eintritte nutzen dasselbe wc-fade-up
            </span>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
