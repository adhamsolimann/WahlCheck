"use client";

import { useMemo } from "react";
import { projectOnAxis } from "@wahlen/engine";
import {
  CULTURAL_DIRECTED,
  ECONOMIC_DIRECTED,
  partyProjection,
} from "@/lib/compass-config";
import { content } from "@/lib/content";

export interface PoliticalMapProps {
  /** Nutzer-Einträge: thesisId → { stance, weight } (nur beantwortete) */
  userEntries: Array<{ thesisId: string; stance: number; weight: number }>;
}

interface PlotPoint {
  id: string;
  label: string;
  color: string;
  x: number;
  y: number;
  lowData: boolean;
}

const SIZE = 100; // viewBox-Koordinaten
const PAD = 12;

function toSvg(v: number): number {
  // Achsenwert [-100..100] → SVG-Koordinaten mit Rand
  return PAD + ((v + 100) / 200) * (SIZE - 2 * PAD);
}

/**
 * 2D-Politiklandkarte (Wirtschaft × Soziokultur).
 * Partei-Positionen werden transparent aus unseren eigenen Positionierungsdaten
 * abgeleitet — Formel und Zuordnungen: /methodik#kompass.
 */
export function PoliticalMap({ userEntries }: PoliticalMapProps) {
  const { points, userPoint, excludedCount } = useMemo(() => {
    const pts: PlotPoint[] = [];
    let excluded = 0;

    for (const party of content.parties) {
      const eco = partyProjection(party.id, "economic");
      const soc = partyProjection(party.id, "cultural");
      if (eco.x === null || soc.x === null) {
        excluded += 1;
        continue;
      }
      pts.push({
        id: party.id,
        label: party.shortName,
        color: party.colorHex,
        x: toSvg(eco.x),
        y: toSvg(-soc.x), // progressiv oben → SVG-y invertieren
        lowData: eco.n < 3 || soc.n < 3,
      });
    }

    const userEco = projectOnAxis(userEntries, ECONOMIC_DIRECTED);
    const userSoc = projectOnAxis(userEntries, CULTURAL_DIRECTED);
    const user =
      userEco.x !== null && userSoc.x !== null
        ? { x: toSvg(userEco.x), y: toSvg(-userSoc.x) }
        : null;

    return { points: pts, userPoint: user, excludedCount: excluded };
  }, [userEntries]);

  const mid = SIZE / 2;

  return (
    <figure className="space-y-2">
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="block w-full"
          role="img"
          aria-label="Politische Landkarte: Deine Position im Vergleich zu den Parteien"
        >
          {/* Quadranten */}
          <rect x={0} y={0} width={mid} height={mid} fill="#f8fafc" />
          <rect x={mid} y={0} width={mid} height={mid} fill="#eff6ff" />
          <rect x={0} y={mid} width={mid} height={mid} fill="#fef2f2" />
          <rect x={mid} y={mid} width={mid} height={mid} fill="#fafaf9" />

          {/* Achsen */}
          <line x1={PAD - 4} y1={mid} x2={SIZE - PAD + 4} y2={mid} stroke="#94a3b8" strokeWidth={0.5} />
          <line x1={mid} y1={PAD - 4} x2={mid} y2={SIZE - PAD + 4} stroke="#94a3b8" strokeWidth={0.5} />

          {/* Achsenbeschriftungen */}
          <text x={4} y={mid - 1.5} fontSize={3} fill="#64748b">staatlich</text>
          <text x={SIZE - 4} y={mid - 1.5} fontSize={3} fill="#64748b" textAnchor="end">marktlich</text>
          <text x={mid + 1.5} y={7} fontSize={3} fill="#64748b">progressiv-weltoffen</text>
          <text x={mid + 1.5} y={SIZE - 3} fontSize={3} fill="#64748b">konservativ-traditionell</text>

          {/* Parteien */}
          {points.map((p) => (
            <g key={p.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={2.4}
                fill={p.color}
                stroke={p.lowData ? "#94a3b8" : "#ffffff"}
                strokeWidth={p.lowData ? 0.5 : 0.8}
                strokeDasharray={p.lowData ? "1 0.8" : undefined}
              >
                <title>{`${p.label}${p.lowData ? " (wenig Daten)" : ""}`}</title>
              </circle>
              <text x={p.x + 3.2} y={p.y + 1} fontSize={2.8} fill="#334155">
                {p.label}
              </text>
            </g>
          ))}

          {/* Nutzerposition */}
          {userPoint && (
            <g>
              <circle cx={userPoint.x} cy={userPoint.y} r={3.4} fill="none" stroke="#e85d3b" strokeWidth={1} />
              <circle cx={userPoint.x} cy={userPoint.y} r={1.6} fill="#e85d3b">
                <title>Deine Position</title>
              </circle>
            </g>
          )}
        </svg>
      </div>

      <figcaption className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
        <span>
          Abgeleitet aus den Positionierungsdaten dieses Tools ({points.length} Parteien
          eingezeichnet{excludedCount > 0 ? `, ${excludedCount} ohne ausreichend Daten` : ""}).
          Gestrichelter Rand = wenig Daten.
        </span>
        <a href="/methodik#kompass" className="underline hover:text-brand-600">
          Wie wird das berechnet?
        </a>
      </figcaption>
    </figure>
  );
}
