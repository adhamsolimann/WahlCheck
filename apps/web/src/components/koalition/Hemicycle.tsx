"use client";

import { useMemo } from "react";
import type { Party } from "@wahlen/schemas";

/**
 * Vereinfachtes Parlaments-Halbrund ("Hemicycle"):
 * Sitzpunkte auf konzentrischen Bögen, Blöcke in Partei-Farben,
 * Hover hebt alle Sitze einer Partei hervor. Bewusst reduziert —
 * keine Überhang-/Fraktionslogik.
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

/** Sitzanzahl je Reihe ∝ Radius (gleichmäßige Dichte), Summe exakt. */
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
  // innen → außen, jede Reihe links (180°) nach rechts (0°)
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
  const entries = useMemo(
    () => Object.entries(allocation).sort((a, b) => b[1] - a[1]),
    [allocation],
  );
  const total = entries.reduce((sum, [, n]) => sum + n, 0);

  const seats = useMemo(() => buildSeats(total), [total]);

  // Sitzindex → partyId (kumulative Blöcke, größte Partei links)
  const seatParty = useMemo(() => {
    const map: string[] = [];
    let idx = 0;
    for (const [partyId, n] of entries) {
      for (let i = 0; i < n; i++) map[idx++] = partyId;
    }
    return map;
  }, [entries]);

  return (
    <svg
      data-testid="hemicycle"
      viewBox="0 0 120 62"
      className="block w-full"
      role="img"
      aria-label={`Sitzverteilung im Modell: ${total} Sitze`}
      onMouseLeave={() => onHover(null)}
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
          >
            <title>
              {`${party?.shortName ?? partyId}: ${
                allocation[partyId]
              } Sitze (${((allocation[partyId] / total) * 100).toFixed(1)} %)`}
            </title>
          </circle>
        );
      })}

      {/* unsichtbare Hover-Zonen pro Partei (über deren Sitzblöcken) */}
      {entries.map(([partyId, n]) => {
        const startIdx = entries
          .slice(0, entries.findIndex(([id]) => id === partyId))
          .reduce((sum, [, m]) => sum + m, 0);
        const midSeat = seats[Math.floor(startIdx + n / 2)];
        if (!midSeat) return null;
        const party = partiesById.get(partyId);
        return (
          <g key={`hover-${partyId}`}>
            <circle
              cx={midSeat.x}
              cy={midSeat.y}
              r={5.5}
              fill="transparent"
              onMouseEnter={() => onHover(partyId)}
            />
            <title>{`${party?.shortName ?? partyId}: ${n} Sitze`}</title>
            {hovered === partyId && (
              <text
                x={Math.min(Math.max(midSeat.x, 16), 104)}
                y={midSeat.y - 6}
                fontSize={4.2}
                fontWeight={700}
                textAnchor="middle"
                fill="#0f172a"
                stroke="#ffffff"
                strokeWidth={0.7}
                style={{ paintOrder: "stroke" }}
              >
                {party?.shortName ?? partyId} · {n}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
