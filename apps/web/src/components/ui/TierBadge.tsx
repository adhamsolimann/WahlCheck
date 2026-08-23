import type { PartyTier } from "@wahlen/schemas";

const tierConfig: Record<PartyTier, { label: string; classes: string }> = {
  parliament: {
    label: "Parlament-relevant",
    classes: "bg-[var(--color-tier-parliament)]/10 text-[var(--color-tier-parliament)] dark:brightness-125",
  },
  small: {
    label: "Kleinpartei",
    classes: "bg-[var(--color-tier-small)]/10 text-[var(--color-tier-small)] dark:brightness-150",
  },
  contextual: {
    label: "Einordnung erforderlich",
    classes: "bg-[var(--color-tier-contextual)]/10 text-[var(--color-tier-contextual)] dark:brightness-150",
  },
};

export function TierBadge({ tier }: { tier: PartyTier }) {
  const cfg = tierConfig[tier];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.classes}`}
    >
      {cfg.label}
    </span>
  );
}
