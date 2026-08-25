import type { PartyTier } from "@wahlen/schemas";

const tierConfig: Record<PartyTier, { label: string; classes: string }> = {
  parliament: {
    label: "Parlament-relevant",
    classes:
      "border-[var(--color-tier-parliament)]/30 bg-[var(--color-tier-parliament)]/[0.08] text-[var(--color-tier-parliament)]",
  },
  small: {
    label: "Kleinpartei",
    classes:
      "border-[var(--color-tier-small)]/30 bg-[var(--color-tier-small)]/[0.08] text-[var(--color-tier-small)]",
  },
  contextual: {
    label: "Einordnung erforderlich",
    classes:
      "border-[var(--color-tier-contextual)]/30 bg-[var(--color-tier-contextual)]/[0.08] text-[var(--color-tier-contextual)]",
  },
};

/** Outline-Badge mit Hairline statt Fläche — ruhiger im redaktionellen Layout. */
export function TierBadge({ tier }: { tier: PartyTier }) {
  const cfg = tierConfig[tier];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider dark:brightness-125 ${cfg.classes}`}
    >
      {cfg.label}
    </span>
  );
}
