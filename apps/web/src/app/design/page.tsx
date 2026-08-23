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
    </main>
  );
}
