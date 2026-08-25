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
 * Unterscheidbarkeit, alle 17 Parteien paarweise klar getrennt —
 * Identifikation über Hover-Infobar + Legende.
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
      <div className="overflow-hidden rounded-xl border border-ink-900/10 bg-white dark:border-white/10 dark:bg-ink-900/60">
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
            {/* Punktraster statt pastellener Quadranten-Verläufe */}
            <pattern
              id="map-dots"
              width={4.5}
              height={4.5}
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx={0.5}
                cy={0.5}
                r={0.32}
                className="fill-ink-900/[0.13] dark:fill-white/[0.09]"
              />
            </pattern>
          </defs>

          {/* Plot-Fläche */}
          <rect
            x={OFF_X - 2}
            y={PAD_Y - 2}
            width={PLOT_W + 4}
            height={H - 2 * PAD_Y + 4}
            rx={1.6}
            className="fill-white dark:fill-ink-900"
          />
          <rect
            x={OFF_X - 2}
            y={PAD_Y - 2}
            width={PLOT_W + 4}
            height={H - 2 * PAD_Y + 4}
            rx={1.6}
            fill="url(#map-dots)"
          />

          {/* Mittellinien — haarfein, gestrichelt */}
          <line
            x1={OFF_X}
            y1={H / 2}
            x2={OFF_X + PLOT_W}
            y2={H / 2}
            strokeWidth={0.3}
            strokeDasharray="1 1.4"
            className="stroke-ink-900/25 dark:stroke-white/25"
          />
          <line
            x1={mid}
            y1={PAD_Y}
            x2={mid}
            y2={H - PAD_Y}
            strokeWidth={0.3}
            strokeDasharray="1 1.4"
            className="stroke-ink-900/25 dark:stroke-white/25"
          />

          {/* Achsen-Endlabels — Mikro-Typografie */}
          <g
            className="fill-ink-400 dark:fill-ink-500"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
          >
            <text
              x={OFF_X}
              y={H / 2 - 1.8}
              fontSize={2.6}
              letterSpacing={0.35}
            >
              LINKS · STAATLICH
            </text>
            <text
              x={OFF_X + PLOT_W}
              y={H / 2 - 1.8}
              fontSize={2.6}
              letterSpacing={0.35}
              textAnchor="end"
            >
              MARKTLICH · EIGENVERANTWORTLICH
            </text>
            <text
              x={mid}
              y={PAD_Y - 3.2}
              fontSize={2.6}
              letterSpacing={0.35}
              textAnchor="middle"
            >
              PROGRESSIV · WELTOFFEN
            </text>
            <text
              x={mid}
              y={H - PAD_Y + 5.4}
              fontSize={2.6}
              letterSpacing={0.35}
              textAnchor="middle"
            >
              KONSERVATIV · TRADITIONELL
            </text>
          </g>

          {/* Sitzpunkte — niedrige Datenbasis als hohler Ring */}
          {points.map((pt) => {
            const active = hovered === pt.id;
            return (
              <circle
                key={pt.id}
                cx={pt.px}
                cy={pt.py}
                r={active ? 3 : pt.lowData ? 2.2 : 2.6}
                fill={pt.lowData && !active ? "transparent" : pt.color}
                stroke={pt.color}
                strokeWidth={pt.lowData && !active ? 0.7 : 0.9}
                className={pt.lowData && !active ? "" : "stroke-white dark:stroke-ink-950"}
                opacity={hovered && !active ? 0.3 : 1}
                style={{ transition: "r .15s ease, opacity .15s ease" }}
              >
                <title>{`${pt.label}${pt.lowData ? " (wenig Daten)" : ""}`}</title>
              </circle>
            );
          })}

          {/* Nutzerposition — Koralle mit Puls + weichem Hof */}
          {userPoint && (
            <g pointerEvents="none">
              <circle
                cx={userPoint.px}
                cy={userPoint.py}
                r={5.5}
                className="fill-accent-500/15"
              />
              <circle
                cx={userPoint.px}
                cy={userPoint.py}
                r={4.2}
                fill="none"
                stroke="#e85d3b"
                strokeWidth={0.6}
                className="animate-pulse motion-reduce:animate-none"
              />
              <circle
                cx={userPoint.px}
                cy={userPoint.py}
                r={1.9}
                fill="#e85d3b"
                className="stroke-white dark:stroke-ink-950"
                strokeWidth={0.7}
              >
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
            <span className="font-display font-bold tracking-tight">
              {activePoint.label}
            </span>
            {activePoint.lowData && (
              <span className="text-ink-400 dark:text-ink-500">· wenig Daten</span>
            )}
          </>
        ) : (
          <span className="text-ink-400 dark:text-ink-500">
            Zeiger über einen Punkt bewegen für Partei-Details
          </span>
        )}
      </div>

      {/* Legende — vollständige Identifikation inkl. Hover-Sync */}
      <figcaption className="space-y-2 text-xs text-ink-400">
        <div className="flex flex-wrap gap-1.5">
          {points.map((pt) => (
            <span
              key={pt.id}
              onMouseEnter={() => setHovered(pt.id)}
              onMouseLeave={() => setHovered(null)}
              className={`inline-flex cursor-default items-center gap-1.5 rounded-full border border-ink-900/10 px-2 py-0.5 transition-opacity dark:border-white/10 ${
                hovered && hovered !== pt.id ? "opacity-35" : ""
              }`}
            >
              <span
                aria-hidden
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: pt.color }}
              />
              {pt.label}
            </span>
          ))}
          {userPoint && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/40 bg-accent-500/10 px-2 py-0.5 font-display font-bold text-accent-600 dark:text-accent-300">
              <span
                aria-hidden
                className="h-2 w-2 rounded-full bg-accent-500"
              />
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
                    className="pointer-events-none absolute bottom-full left-0 z-20 mb-1 hidden w-max max-w-[300px] rounded-lg bg-ink-950 p-2.5 text-left text-[11px] font-normal leading-relaxed text-white shadow-xl group-hover:block group-focus-within:block"
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
          <a href="/methodik/#kompass" className="underline hover:text-accent-600">
            Wie wird das berechnet?
          </a>
        </div>
      </figcaption>
    </figure>
  );
}
