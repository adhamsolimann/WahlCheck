"use client";

import { useState } from "react";
import type { Party } from "@wahlen/schemas";
import { Button } from "@/components/ui/Button";

interface TopMatch {
  party: Party;
  percent: number;
}

/** Liest die von next/font generierte Font-Familie aus einer CSS-Variable. */
function probeFont(varName: string): string {
  const el = document.createElement("span");
  el.style.fontFamily = `var(${varName})`;
  el.style.position = "absolute";
  el.style.visibility = "hidden";
  document.body.appendChild(el);
  const family = getComputedStyle(el).fontFamily || "sans-serif";
  el.remove();
  return family;
}

/** Zeichnet das WahlCheck-Zeichen: Tinte-Quadrat, Stimmzettel, korallener Haken. */
function drawMark(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
) {
  const r = size * 0.19;
  // Tinte-Quadrat
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, r);
  ctx.fillStyle = "#0e0e12";
  ctx.fill();
  // Stimmzettel
  const cardX = x + size * 0.22;
  const cardY = y + size * 0.16;
  const cardW = size * 0.56;
  const cardH = size * 0.69;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, size * 0.06);
  ctx.fillStyle = "#f7f6f3";
  ctx.fill();
  // Korallener Haken
  ctx.beginPath();
  ctx.moveTo(cardX + cardW * 0.22, cardY + cardH * 0.52);
  ctx.lineTo(cardX + cardW * 0.44, cardY + cardH * 0.72);
  ctx.lineTo(cardX + cardW * 0.82, cardY + cardH * 0.28);
  ctx.strokeStyle = "#e85d3b";
  ctx.lineWidth = size * 0.1;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();
}

/**
 * T-112: client-seitig generiertes Ergebnis-Bild (1200×630) im
 * „Stimmzettel trifft Redaktion"-Markenlook. Bewusst Canvas statt
 * Server-Rendering: das Bild entsteht auf dem Gerät, es wird nichts
 * hochgeladen (Art.-9-Architektur).
 */
export function ShareButton({ topMatches }: { topMatches: TopMatch[] }) {
  const [busy, setBusy] = useState(false);

  if (topMatches.length === 0) return null;

  const generate = async () => {
    setBusy(true);
    try {
      // Sicherstellen, dass die Webfonts für Canvas verfügbar sind
      await document.fonts.ready;
      const display = probeFont("--font-grotesk");
      const body = probeFont("--font-inter");

      const W = 1200;
      const H = 630;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Papier-Hintergrund
      ctx.fillStyle = "#f7f6f3";
      ctx.fillRect(0, 0, W, H);

      // Punktraster-Textur
      ctx.fillStyle = "rgba(14, 14, 18, 0.06)";
      for (let gx = 22; gx < W; gx += 22) {
        for (let gy = 22; gy < H; gy += 22) {
          ctx.fillRect(gx, gy, 1.5, 1.5);
        }
      }

      // Korallener Signatur-Streifen oben
      ctx.fillStyle = "#e85d3b";
      ctx.fillRect(0, 0, W, 10);

      // Marke: Zeichen + Wortmarke
      drawMark(ctx, 72, 56, 56);
      ctx.fillStyle = "#0e0e12";
      ctx.font = `700 40px ${display}`;
      ctx.fillText("Wahl", 144, 100);
      const wahlWidth = ctx.measureText("Wahl").width;
      ctx.fillStyle = "#e85d3b";
      ctx.fillText("Check", 144 + wahlWidth, 100);

      // Kicker
      ctx.fillStyle = "#cc4728";
      ctx.font = `700 20px ${display}`;
      try {
        (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
          "4px";
      } catch {
        /* letterSpacing nicht unterstützt */
      }
      ctx.fillText(
        "BERLIN · ABGEORDNETENHAUSWAHL · 20.09.2026".toUpperCase(),
        74,
        190,
      );
      try {
        (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
          "0px";
      } catch {
        /* ignore */
      }

      // Headline
      ctx.fillStyle = "#0e0e12";
      ctx.font = `700 76px ${display}`;
      ctx.fillText("Mein Ergebnis", 72, 268);

      // Top-Matches
      const rowY = 330;
      const rowH = 84;
      const maxPct = Math.max(...topMatches.map((m) => m.percent), 1);
      topMatches.slice(0, 3).forEach((match, i) => {
        const y = rowY + i * rowH;

        // Partei-Farbchip
        ctx.beginPath();
        ctx.roundRect(74, y - 2, 12, 46, 6);
        ctx.fillStyle = match.party.colorHex;
        ctx.fill();

        // Name + Prozent
        ctx.fillStyle = "#16161b";
        ctx.font = `600 38px ${display}`;
        ctx.fillText(match.party.shortName, 108, y + 32);
        ctx.textAlign = "right";
        ctx.font = `700 40px ${display}`;
        ctx.fillText(
          `${match.percent.toLocaleString("de-DE")} %`,
          W - 80,
          y + 34,
        );
        ctx.textAlign = "left";

        // Haarlinien-Balken
        const barMax = W - 108 - 240;
        ctx.fillStyle = "rgba(14, 14, 18, 0.1)";
        ctx.beginPath();
        ctx.roundRect(108, y + 48, barMax, 6, 3);
        ctx.fill();
        ctx.fillStyle = match.party.colorHex;
        ctx.beginPath();
        ctx.roundRect(108, y + 48, (barMax * match.percent) / maxPct, 6, 3);
        ctx.fill();
      });

      // Fußzeile: Hairline + Vertrauenszeile + Domain
      ctx.fillStyle = "rgba(14, 14, 18, 0.12)";
      ctx.fillRect(72, H - 92, W - 144, 1);
      ctx.fillStyle = "#62626e";
      ctx.font = `400 22px ${body}`;
      ctx.fillText(
        "Berechnet lokal im Browser — keine Antwortdaten verlassen dieses Gerät.",
        72,
        H - 48,
      );
      ctx.fillStyle = "#0e0e12";
      ctx.font = `700 22px ${display}`;
      ctx.textAlign = "right";
      ctx.fillText("wahl-check.com", W - 72, H - 48);
      ctx.textAlign = "left";

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
