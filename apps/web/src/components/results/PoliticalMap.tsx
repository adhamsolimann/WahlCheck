"use client";

import { useMemo, useRef, useState } from "react";
import { projectOnAxis } from "@wahlen/engine";
import type { Party } from "@wahlen/schemas";
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
  px: number;
  py: number;
  lowData: boolean;
}

/**
 * Diagramm-Palette (bewusst von Markenfarben entkoppelt): maximale
 * Unterscheidbarkeit auf hellem Grund, alle 17 Parteien paarweise klar
 * getrennt — Identifikation ausschließlich über Hover-Infobar + Legende,
 * damit sich keine Texte überlagern können.
 */
const MAP_COLORS: Record<string, string> = {
  spd: "#D81E05", // kräftiges Rot
  cdu: "#1A1A1A", // Schwarz
  gruene: "#1B9E46", // gesättigtes Grün
  linke: "#E5007D", // Magenta
  afd: "#009EE3", // Himmelblau
  fdp: "#F5C400", // Goldgelb
  bsw: "#FF6F00", // Tieforange
  volt: "#502379", // Violett
  oedp: "#00796B", // Petrol
  pdf: "#0F4C81", // Dunkelblau
  "die-partei": "#795548", // Braun
  tierschutzpartei: "#9CCC65", // Hellgrün
  dkp: "#8B0000", // Dunkelrot
  sgp: "#9C27B0", // Lila
  "die-urbane": "#00838F", // Cyan
  bergpartei: "#C2185B", // Himbeer
  heimat: "#5D4037", // Dunkelbraun
};

/* Canvas: 150×100 (quer), Plot-Fläche zentriert */
const W = 150;
const H = 100;
const OFF_X = 25;
const PLOT_W = 100;
const PAD_Y = 12;

function toX(v: number): number {
  // 2 Nachkommastellen: schützt vor SSR/Client-Float-Divergenz (Hydration)
  return Math.round((OFF_X + ((v + 100) / 200) * PLOT_W) * 100) / 100;
}
function toY(v: number): number {
  return Math.round((PAD_Y + ((v + 100) / 200) * (H - 2 * PAD_Y)) * 100) / 100;
}

export function PoliticalMap({ userEntries }: PoliticalMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { points, userPoint, excluded } = useMemo(() => {
    const pts: PlotPoint[] = [];
    const excludedParties: Party[] = [];

    for (const party of content.parties) {
      const eco = partyProjection(party.id, "economic");
      const soc = partyProjection(party.id, "cultural");
      if (eco.x === null || soc.x === null) {
        excludedParties.push(party);
        continue;
      }
      pts.push({
        id: party.id,
        label: party.shortName,
        color: MAP_COLORS[party.id] ?? party.colorHex,
        px: toX(eco.x),
        py: toY(-soc.x),
        lowData: eco.n < 3 || soc.n < 3,
      });
    }

    const userEco = projectOnAxis(userEntries, ECONOMIC_DIRECTED);
    const userSoc = projectOnAxis(userEntries, CULTURAL_DIRECTED);
    const user =
      userEco.x !== null && userSoc.x !== null
        ? { px: toX(userEco.x), py: toY(-userSoc.x) }
        : null;

    return { points: pts, userPoint: user, excluded: excludedParties };
  }, [userEntries]);

  /* Proximity-Hover wie im Hemicycle */
  function handlePointer(e: React.PointerEvent<SVGSVGElement>) {
    const el = svgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * W;
    const sy = ((e.clientY - rect.top) / rect.height) * H;

    let bestId: string | null = null;
    let bestDistSq = Infinity;
    const maxDistSq = 3.4 ** 2;
    for (const pt of points) {
      const dx = pt.px - sx;
      const dy = pt.py - sy;
      const d = dx * dx + dy * dy;
      if (d < bestDistSq) {
        bestDistSq = d;
        bestId = pt.id;
      }
    }
    setHovered(bestDistSq <= maxDistSq ? bestId : null);
  }

  const activePoint = points.find((p) => p.id === hovered);
  const mid = W / 2;

  return (
    <figure className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full"
          style={{ touchAction: "pan-y" }}
          role="img"
          aria-label="Politische Landkarte: Deine Position im Vergleich zu den Parteien"
          onPointerMove={handlePointer}
          onPointerDown={handlePointer}
          onPointerLeave={() => setHovered(null)}
        >
          <defs>
            <linearGradient id="q-tl" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#faf5ff" />
              <stop offset="100%" stopColor="#f5f3ff" />
            </linearGradient>
            <linearGradient id="q-tr" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eff6ff" />
              <stop offset="100%" stopColor="#f0f9ff" />
            </linearGradient>
            <linearGradient id="q-bl" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#fff7ed" />
              <stop offset="100%" stopColor="#fef2f2" />
            </linearGradient>
            <linearGradient id="q-br" x1="1" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#f1f5f9" />
            </linearGradient>
          </defs>

          {/* Quadranten */}
          <rect x={OFF_X - 2} y={PAD_Y - 2} width={PLOT_W + 4} height={H - 2 * PAD_Y + 4} fill="#ffffff" />
          <rect x={OFF_X - 2} y={PAD_Y - 2} width={PLOT_W / 2 + 2} height={(H - 2 * PAD_Y) / 2 + 2} fill="url(#q-tl)" />
          <rect x={OFF_X + PLOT_W / 2} y={PAD_Y - 2} width={PLOT_W / 2 + 2} height={(H - 2 * PAD_Y) / 2 + 2} fill="url(#q-tr)" />
          <rect x={OFF_X - 2} y={PAD_Y + (H - 2 * PAD_Y) / 2} width={PLOT_W / 2 + 2} height={(H - 2 * PAD_Y) / 2 + 2} fill="url(#q-bl)" />
          <rect x={OFF_X + PLOT_W / 2} y={PAD_Y + (H - 2 * PAD_Y) / 2} width={PLOT_W / 2 + 2} height={(H - 2 * PAD_Y) / 2 + 2} fill="url(#q-br)" />

          {/* Raster */}
          {[25, 75].map((v) => (
            <g key={v} stroke="#e2e8f0" strokeWidth={0.25} strokeDasharray="0.8 1.2">
              <line x1={toX(v)} y1={PAD_Y - 2} x2={toX(v)} y2={H - PAD_Y + 2} />
              <line x1={OFF_X - 2} y1={toY(v)} x2={OFF_X + PLOT_W + 2} y2={toY(v)} />
            </g>
          ))}

          {/* Achsen */}
          <line x1={OFF_X - 3} y1={H / 2} x2={OFF_X + PLOT_W + 3} y2={H / 2} stroke="#94a3b8" strokeWidth={0.45} />
          <line x1={mid} y1={PAD_Y - 3} x2={mid} y2={H - PAD_Y + 3} stroke="#94a3b8" strokeWidth={0.45} />

          {/* Achsen-Chips */}
          <text x={OFF_X - 3} y={H / 2 - 1.6} fontSize={2.7} fontWeight={600} fill="#64748b">
            links · staatlich
          </text>
          <text x={OFF_X + PLOT_W + 3} y={H / 2 - 1.6} fontSize={2.7} fontWeight={600} fill="#64748b" textAnchor="end">
            marktlich · eigenverantwortlich
          </text>
          <text x={mid} y={PAD_Y - 3.4} fontSize={2.7} fontWeight={600} fill="#64748b" textAnchor="middle">
            progressiv · weltoffen
          </text>
          <text x={mid} y={H - PAD_Y + 5.6} fontSize={2.7} fontWeight={600} fill="#64748b" textAnchor="middle">
            konservativ · traditionell
          </text>

          {/* Sitzpunkte (ohne Text — Identifikation über Legende/Hover) */}
          {points.map((pt) => {
            const active = hovered === pt.id;
            return (
              <circle
                key={pt.id}
                cx={pt.px}
                cy={pt.py}
                r={active ? 3 : pt.lowData ? 2.2 : 2.6}
                fill={pt.color}
                stroke="#ffffff"
                strokeWidth={0.9}
                opacity={hovered && !active ? 0.3 : 1}
                style={{ transition: "r .15s ease, opacity .15s ease" }}
              >
                <title>{`${pt.label}${pt.lowData ? " (wenig Daten)" : ""}`}</title>
              </circle>
            );
          })}

          {/* Nutzerposition mit Puls */}
          {userPoint && (
            <g pointerEvents="none">
              <circle
                cx={userPoint.px}
                cy={userPoint.py}
                r={4.2}
                fill="none"
                stroke="#e85d3b"
                strokeWidth={0.7}
                className="animate-pulse"
              />
              <circle cx={userPoint.px} cy={userPoint.py} r={1.9} fill="#e85d3b" stroke="#ffffff" strokeWidth={0.6}>
                <title>Deine Position</title>
              </circle>
            </g>
          )}

        </svg>
      </div>

      {/* Hover-Status unterhalb der Grafik — kein Clipping möglich */}
      <div className="flex h-6 items-center gap-2 text-xs" aria-live="polite">
        {activePoint ? (
          <>
            <span
              aria-hidden
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: activePoint.color }}
            />
            <span className="font-semibold">{activePoint.label}</span>
            {activePoint.lowData && (
              <span className="text-zinc-400">· wenig Daten</span>
            )}
          </>
        ) : (
          <span className="text-zinc-400">
            Zeiger über einen Punkt bewegen für Partei-Details
          </span>
        )}
      </div>

      {/* Legende — vollständige Identifikation inkl. Hover-Sync */}
      <figcaption className="space-y-2 text-xs text-zinc-500">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {points.map((pt) => (
            <span
              key={pt.id}
              onMouseEnter={() => setHovered(pt.id)}
              onMouseLeave={() => setHovered(null)}
              className={`inline-flex cursor-default items-center gap-1 transition-opacity ${
                hovered && hovered !== pt.id ? "opacity-40" : ""
              }`}
            >
              <span aria-hidden className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: pt.color }} />
              {pt.label}
            </span>
          ))}
          {userPoint && (
            <span className="inline-flex items-center gap-1 font-semibold text-accent-600">
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent-500)]" />
              Du
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <span>
            Abgeleitet aus den Positionierungsdaten dieses Tools ({points.length} Parteien
            eingezeichnet
            {excluded.length > 0 && (
              <>
                {" · "}
                <span
                  tabIndex={0}
                  title={`Ohne ausreichende Auswertungsbasis: ${excluded.map((e) => e.shortName).join(", ")}`}
                  className="group relative cursor-help underline decoration-dotted underline-offset-2 outline-none"
                >
                  {excluded.length} ohne ausreichend Daten
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute bottom-full left-0 z-20 mb-1 hidden w-max max-w-[300px] rounded-lg bg-zinc-900 p-2.5 text-left text-[11px] font-normal leading-relaxed text-white shadow-xl group-hover:block group-focus-within:block"
                  >
                    Ohne ausreichende Auswertungsbasis (je Achse weniger als 3 klare
                    Positionen):
                    <span className="mt-1.5 flex flex-wrap gap-x-2.5 gap-y-1">
                      {excluded.map((e) => (
                        <span key={e.id} className="inline-flex items-center gap-1">
                          <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: e.colorHex }} />
                          {e.shortName}
                        </span>
                      ))}
                    </span>
                  </span>
                </span>
              </>
            )}
          </span>
          <a href="/methodik/#kompass" className="underline hover:text-brand-600">
            Wie wird das berechnet?
          </a>
        </div>
      </figcaption>
    </figure>
  );
}
