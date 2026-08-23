"use client";

import { useState } from "react";
import type { Party } from "@wahlen/schemas";
import { Button } from "@/components/ui/Button";

interface TopMatch {
  party: Party;
  percent: number;
}

/**
 * T-112: client-seitig generiertes Ergebnis-Bild (1200×630).
 * Bewusst Canvas statt Server-Rendering: das Bild entsteht auf dem Gerät,
 * es wird nichts hochgeladen (Art.-9-Architektur).
 */
export function ShareButton({ topMatches }: { topMatches: TopMatch[] }) {
  const [busy, setBusy] = useState(false);

  if (topMatches.length === 0) return null;

  const generate = () => {
    setBusy(true);
    try {
      const W = 1200;
      const H = 630;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Hintergrund
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, W, H);

      // Markenbalken
      const gradient = ctx.createLinearGradient(0, 0, W, 0);
      gradient.addColorStop(0, "#3547ec");
      gradient.addColorStop(1, "#e85d3b");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, 14);

      // Titel
      ctx.fillStyle = "#18181b";
      ctx.font = "700 58px system-ui, -apple-system, 'Segoe UI', sans-serif";
      ctx.fillText("Mein WahlCheck", 80, 130);

      // Untertitel
      ctx.fillStyle = "#52525b";
      ctx.font = "400 30px system-ui, -apple-system, 'Segoe UI', sans-serif";
      ctx.fillText(
        "Abgeordnetenhauswahl · Sonntag, 20. September 2026",
        80,
        185,
      );

      // Top-Matches
      const rowY = 270;
      const rowH = 92;
      const maxPct = Math.max(...topMatches.map((m) => m.percent), 1);
      topMatches.slice(0, 3).forEach((match, i) => {
        const y = rowY + i * rowH;

        // Farbbalken als Parteinennung
        ctx.fillStyle = match.party.colorHex;
        ctx.fillRect(80, y - 8, 10, 52);

        // Name + Prozent
        ctx.fillStyle = "#27272a";
        ctx.font = "600 40px system-ui, -apple-system, 'Segoe UI', sans-serif";
        ctx.fillText(match.party.shortName, 116, y + 28);
        ctx.textAlign = "right";
        ctx.fillText(`${match.percent.toLocaleString("de-DE")} %`, W - 100, y + 28);
        ctx.textAlign = "left";

        // Anteiliger Balken
        const barMax = W - 116 - 260;
        ctx.fillStyle = "#f4f4f5";
        ctx.fillRect(116, y + 42, barMax, 12);
        ctx.fillStyle = match.party.colorHex;
        ctx.fillRect(116, y + 42, (barMax * match.percent) / maxPct, 12);
      });

      // Fußzeile
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "400 24px system-ui, -apple-system, 'Segoe UI', sans-serif";
      ctx.fillText(
        "Berechnet lokal im Browser — keine Antwortdaten verlassen dieses Gerät.",
        80,
        H - 60,
      );

      // Download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "wahlcheck-ergebnis.png";
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button variant="secondary" size="sm" onClick={generate} disabled={busy}>
      {busy ? "Erstelle Bild …" : "Als Bild teilen"}
    </Button>
  );
}
