"use client";

import { useMemo, useRef } from "react";
import type { Party } from "@wahlen/schemas";

/**
 * Vereinfachtes Parlaments-Halbrund ("Hemicycle"):
 * Sitzpunkte auf konzentrischen Bögen, Blöcke in Partei-Farben.
 *
 * Hover-Prinzip: Pointer-Proximity auf dem SVG-Root — der nächstgelegene
 * Sitzpunkt bestimmt die hervorgehobene Partei. Keine unsichtbaren
 * Trigger-Zonen, kein Label unter dem Cursor (deshalb flackert nichts).
 */

export interface HemicycleProps {
  /** partyId → Sitze (Summe = Sitzanzahl des Modells) */
  allocation: Record<string, number>;
  partiesById: Map<string, Party>;
  hovered: string | null;
  onHover: (partyId: string | null) => void;
}

const ROWS = 6;
const R_INNER = 15;
const R_OUTER = 34;
const CX = 60;
const CY = 56;
const SEAT_R = 1.35;

interface Seat {
  x: number;
  y: number;
}

function seatsPerRow(total: number, rows: number): number[] {
  const radii = Array.from({ length: rows }, (_, i) =>
    R_INNER + ((R_OUTER - R_INNER) * i) / (rows - 1),
  );
  const sumR = radii.reduce((a, b) => a + b, 0);
  const raw = radii.map((r) => (total * r) / sumR);
  const counts = raw.map((v) => Math.floor(v));
  let rest = total - counts.reduce((a, b) => a + b, 0);
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  for (const { i } of order) {
    if (rest <= 0) break;
    counts[i] += 1;
    rest -= 1;
  }
  return counts;
}

function buildSeats(total: number): Seat[] {
  const perRow = seatsPerRow(total, ROWS);
  const seats: Seat[] = [];
  for (let row = 0; row < ROWS; row++) {
    const r = R_INNER + ((R_OUTER - R_INNER) * row) / (ROWS - 1);
    const n = perRow[row];
    for (let k = 0; k < n; k++) {
      const angle = Math.PI * (1 - (k + 0.5) / n);
      seats.push({
        x: CX + r * Math.cos(angle),
        y: CY - r * Math.sin(angle),
      });
    }
  }
  return seats;
}

export function Hemicycle({ allocation, partiesById, hovered, onHover }: HemicycleProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const entries = useMemo(
    () => Object.entries(allocation).sort((a, b) => b[1] - a[1]),
    [allocation],
  );
  const total = entries.reduce((sum, [, n]) => sum + n, 0);
  const seats = useMemo(() => buildSeats(total), [total]);

  const seatParty = useMemo(() => {
    const map: string[] = [];
    let idx = 0;
    for (const [partyId, n] of entries) {
      for (let i = 0; i < n; i++) map[idx++] = partyId;
    }
    return map;
  }, [entries]);

  function handlePointer(e: React.PointerEvent<SVGSVGElement>) {
    const el = svgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * 120;
    const sy = ((e.clientY - rect.top) / rect.height) * 62;

    let bestIdx = -1;
    let bestDistSq = Infinity;
    const maxDistSq = (SEAT_R + 1.15) ** 2; // Toleranz um jeden Sitzpunkt
    for (let i = 0; i < seats.length; i++) {
      const dx = seats[i].x - sx;
      const dy = seats[i].y - sy;
      const d = dx * dx + dy * dy;
      if (d < bestDistSq) {
        bestDistSq = d;
        bestIdx = i;
      }
    }
    if (bestIdx >= 0 && bestDistSq <= maxDistSq) {
      onHover(seatParty[bestIdx] ?? null);
    } else {
      onHover(null);
    }
  }

  const hoveredEntry = entries.find(([id]) => id === hovered);
  const hoveredCount = hoveredEntry?.[1] ?? 0;
  const hoveredLabel = hovered ? (partiesById.get(hovered)?.shortName ?? hovered) : "";

  return (
    <svg
      ref={svgRef}
      data-testid="hemicycle"
      viewBox="0 0 120 62"
      className="block w-full"
      style={{ touchAction: "pan-y" }}
      role="img"
      aria-label={`Sitzverteilung im Modell: ${total} Sitze`}
      onPointerMove={handlePointer}
      onPointerDown={handlePointer}
      onPointerLeave={() => onHover(null)}
    >
      {/* Mehrheitslinie */}
      <line
        x1={CX - R_OUTER - 3}
        y1={CY - R_OUTER + 2}
        x2={CX + R_OUTER + 3}
        y2={CY - R_OUTER + 2}
        stroke="#cbd5e1"
        strokeWidth={0.35}
        strokeDasharray="1 1.4"
      />

      {seats.map((seat, i) => {
        const partyId = seatParty[i];
        if (!partyId) return null;
        const dimmed = hovered !== null && hovered !== partyId;
        const party = partiesById.get(partyId);
        return (
          <circle
            key={i}
            cx={seat.x}
            cy={seat.y}
            r={SEAT_R}
            fill={party?.colorHex ?? "#a1a1aa"}
            opacity={dimmed ? 0.25 : 1}
            style={{ transition: "opacity .12s ease" }}
          />
        );
      })}

      {/* Feste Info-Leiste oben — bewegt sich nicht unter dem Zeiger */}
      {hovered && hoveredCount > 0 && (
        <g pointerEvents="none">
          <rect
            x={CX - 21}
            y={3.4}
            width={42}
            height={6.2}
            rx={1.6}
            fill="#0f172a"
            opacity={0.92}
          />
          <text
            x={CX}
            y={7.6}
            fontSize={3.9}
            fontWeight={700}
            textAnchor="middle"
            fill="#ffffff"
          >
            {hoveredLabel} · {hoveredCount} Sitze
          </text>
        </g>
      )}
    </svg>
  );
}
