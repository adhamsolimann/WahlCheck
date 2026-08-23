"use client";

import { useMemo, useState } from "react";
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
  /** Plot-Koordinaten im 100×100-Raum (-100..100 skaliert) */
  px: number;
  py: number;
  lowData: boolean;
}

/* Canvas: 150×100 (quer) mit 25 Einheiten Rand links/rechts für Labels */
const W = 150;
const H = 100;
const OFF_X = 25;
const PLOT_W = 100;
const PAD_Y = 12;

function toX(v: number): number {
  return OFF_X + ((v + 100) / 200) * PLOT_W;
}
function toY(v: number): number {
  return PAD_Y + ((v + 100) / 200) * (H - 2 * PAD_Y);
}

/** Kollisionsprüfung: Rechteck gegen bereits platzierte Label-Rechtecke. */
function collides(
  box: { x1: number; y1: number; x2: number; y2: number },
  placed: Array<{ x1: number; y1: number; x2: number; y2: number }>,
): boolean {
  return placed.some(
    (p) => box.x1 < p.x2 && box.x2 > p.x1 && box.y1 < p.y2 && box.y2 > p.y1,
  );
}

/**
 * Politische Landkarte (Wirtschaft × Soziokultur).
 *
 * Labels werden per Greedy-Algorithmus kollisionsfrei platziert:
 * pro Punkt vier Ankerkandidaten (rechts, links, oben, unten) — gewählt wird
 * der erste freie; passt keiner, erscheint das Label nur beim Hover und die
 * Partei bleibt über die Legende identifizierbar.
 */
export function PoliticalMap({ userEntries }: PoliticalMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);

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
        color: party.colorHex,
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

  /* ---------- Label-Platzierung (Greedy, Priorität: Parlament → Rest) ---------- */

  const FONT = 2.9;
  const CHAR_W = 1.62; // empirisch für System-Sans bei fontSize 2.9

  const labels = useMemo(() => {
    const tierOf = (id: string) =>
      content.parties.find((p) => p.id === id)?.tier ?? "contextual";
    const order = [...points].sort((a, b) => {
      const t =
        tierOrderIndex(tierOf(a.id)) - tierOrderIndex(tierOf(b.id)) ||
        b.label.length - a.label.length;
      return t;
    });

    const placedBoxes: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    // Nutzer-Marker hat Vorrang auf Platz
    if (userPoint) {
      placedBoxes.push({
        x1: userPoint.px - 4,
        y1: userPoint.py - 4,
        x2: userPoint.px + 4,
        y2: userPoint.py + 4,
      });
    }

    interface Placed {
      id: string;
      x: number;
      y: number;
      anchor: "start" | "end" | "middle";
      visible: boolean;
    }
    const out = new Map<string, Placed>();

    for (const pt of order) {
      const w = pt.label.length * CHAR_W + 1.6;
      const h = FONT + 0.9;
      const candidates: Array<{ lx: number; ly: number; anchor: "start" | "end" | "middle" }> = [
        { lx: pt.px + 3.2, ly: pt.py + 0.95, anchor: "start" },
        { lx: pt.px - 3.2, ly: pt.py + 0.95, anchor: "end" },
        { lx: pt.px, ly: pt.py - 3.4, anchor: "middle" },
        { lx: pt.px, ly: pt.py + 4.4, anchor: "middle" },
      ];

      let chosen: Placed | null = null;
      for (const c of candidates) {
        const box = {
          x1: c.anchor === "end" ? c.lx - w : c.anchor === "middle" ? c.lx - w / 2 : c.lx,
          y1: c.ly - h + 0.6,
          x2: c.anchor === "end" ? c.lx : c.anchor === "middle" ? c.lx + w / 2 : c.lx + w,
          y2: c.ly + 0.6,
        };
        if (
          box.x1 < 1 ||
          box.x2 > W - 1 ||
          box.y1 < 1 ||
          box.y2 > H - 1 ||
          collides(box, placedBoxes)
        ) {
          continue;
        }
        placedBoxes.push(box);
        chosen = { id: pt.id, x: c.lx, y: c.ly, anchor: c.anchor, visible: true };
        break;
      }
      out.set(pt.id, chosen ?? { id: pt.id, x: pt.px, y: pt.py, anchor: "start", visible: false });
    }
    return out;
  }, [points, userPoint]);

  const mid = W / 2;

  return (
    <figure className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block w-full"
          role="img"
          aria-label="Politische Landkarte: Deine Position im Vergleich zu den Parteien"
          onMouseLeave={() => setHovered(null)}
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

          {/* Parteien */}
          {points.map((pt) => {
            const label = labels.get(pt.id);
            const active = hovered === pt.id;
            return (
              <g
                key={pt.id}
                onMouseEnter={() => setHovered(pt.id)}
                className="cursor-pointer"
              >
                {/* großzügige Hit-Area */}
                <circle cx={pt.px} cy={pt.py} r={5.5} fill="transparent" />
                <circle
                  cx={pt.px}
                  cy={pt.py}
                  r={active ? 3 : pt.lowData ? 2.2 : 2.5}
                  fill={pt.color}
                  stroke="#ffffff"
                  strokeWidth={0.85}
                  opacity={hovered && !active ? 0.35 : 1}
                  style={{ transition: "r .15s ease, opacity .15s ease" }}
                >
                  <title>{`${pt.label}${pt.lowData ? " (wenig Daten)" : ""}`}</title>
                </circle>
                {(label?.visible || active) && (
                  <text
                    x={active && !label?.visible ? pt.px + 3.2 : label!.x}
                    y={active && !label?.visible ? pt.py + 0.95 : label!.y}
                    fontSize={FONT}
                    textAnchor={active && !label?.visible ? "start" : label!.anchor}
                    fill={active ? "#0f172a" : "#334155"}
                    fontWeight={active ? 700 : 500}
                    stroke="#ffffff"
                    strokeWidth={0.6}
                    style={{ paintOrder: "stroke" }}
                  >
                    {pt.label}
                  </text>
                )}
              </g>
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
              <text
                x={userPoint.px}
                y={userPoint.py - 5}
                fontSize={2.7}
                fontWeight={700}
                fill="#e85d3b"
                textAnchor="middle"
                stroke="#ffffff"
                strokeWidth={0.55}
                style={{ paintOrder: "stroke" }}
              >
                Du
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Vollständige Legende — auch Partein mit verstecktem Label identifizierbar */}
      <figcaption className="space-y-2 text-xs text-zinc-500">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {points.map((pt) => (
            <span
              key={pt.id}
              onMouseEnter={() => setHovered(pt.id)}
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

function tierOrderIndex(tier: string): number {
  return tier === "parliament" ? 0 : tier === "small" ? 1 : 2;
}
