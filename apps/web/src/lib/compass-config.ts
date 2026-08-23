import type { DirectedThesis } from "@wahlen/engine";
import { projectOnAxis, type AxisProjection } from "@wahlen/engine";
import { content } from "./content";

/**
 * Redaktionelle Achsen-Zuordnung für den politischen Kompass.
 *
 * JEDE Richtung ist eine dokumentierte redaktionelle Entscheidung und wird
 * automatisch auf der Seite /methodik als Tabelle ausgewiesen (die Seite
 * importiert genau diese Datei — Abweichungen sind ausgeschlossen).
 *
 * Richtung +1: Stance +2 (= volle Zustimmung zur These) verschiebt nach RECHTS
 *              auf der jeweiligen Achse
 * Richtung −1: Stance +2 verschiebt nach LINKS
 */

export interface AxisMeta {
  id: "economic" | "cultural";
  negativeLabel: string;
  positiveLabel: string;
  description: string;
}

export const ECONOMIC_AXIS: AxisMeta = {
  id: "economic",
  negativeLabel: "Umverteilung / staatlich",
  positiveLabel: "Markt / Eigenverantwortung",
  description:
    "Wirtschafts- und Haushaltsfragen: Rolle des Staates vs. Markt, Steuern, Regulierungsdichte.",
};

export const CULTURAL_AXIS: AxisMeta = {
  id: "cultural",
  negativeLabel: "Konservativ-traditionell",
  positiveLabel: "Progressiv-weltoffen",
  description:
    "Gesellschaftspolitische Grundsatzfragen: Migration, innere Sicherheit/Bürgerrechte, Lebensweisen.",
};

export const ECONOMIC_DIRECTED: DirectedThesis[] = [
  { thesisId: "haushaltsnotlage-investitionen-ueber-neue-kredite", direction: -1 }, // Staatsaktivierung über Kredite
  { thesisId: "staerkere-besteurung-hoher-einkommen", direction: -1 }, // Umverteilung durch Steuern
  { thesisId: "tariftreue-bei-oeffentlichen-auftraegen", direction: -1 }, // Arbeitsmarktregulierung
  { thesisId: "sozialwohnungsquote-im-baulandmodell", direction: -1 }, // Baupflichtenquote
  { thesisId: "privatisierungsverbot-in-der-verfassung", direction: -1 }, // Verstaatlichungsrichtung
  { thesisId: "personalabbau-in-der-verwaltung", direction: 1 }, // schlanker Staat
  { thesisId: "abschaffung-der-grundsteuer", direction: 1 }, // Steuersenkung
  { thesisId: "foerderung-von-wohneigentum", direction: 1 }, // Eigentumsförderung statt Mietmarkt
];

export const CULTURAL_DIRECTED: DirectedThesis[] = [
  { thesisId: "erleichterte-abschiebungen", direction: -1 },
  { thesisId: "vorrang-einheimische-bei-gefoerdertem-wohnraum", direction: -1 },
  { thesisId: "ausbau-videoueberwachung-oeffentlicher-raeume", direction: -1 },
  { thesisId: "mehr-polizeipersonal", direction: -1 }, // klassische Sicherheitszuordnung, bewusst dokumentiert
  { thesisId: "begrenzung-polizeilicher-befugnisse", direction: 1 },
  { thesisId: "dezentrale-unterkuenfte-statt-notunterkuenfte", direction: 1 },
  { thesisId: "ausbau-der-integrationsangebote", direction: 1 },
  { thesisId: "ausbau-queerer-gesundheitsversorgung", direction: 1 },
  { thesisId: "schutz-und-foerderung-der-clubkultur", direction: 1 },
  { thesisId: "gemeinschaftsschule-fuer-alle", direction: 1 },
  { thesisId: "klimaneutralitaet-bis-2045", direction: 1 }, // ökologische Transformation als progressives Projekt (vgl. Wahl-Kompass „progressiv-ökologisch")
];

/* ------------------------------------------------------------------ */
/* Projektions-Helfer                                                  */
/* ------------------------------------------------------------------ */

interface AxisEntry {
  thesisId: string;
  stance: number;
  weight: number;
}

/** Partei-Projektion: klare Positionen (Gewicht 1), neutral/none fließen nicht ein. */
export function partyProjection(
  partyId: string,
  axis: "economic" | "cultural",
): AxisProjection {
  const directed = axis === "economic" ? ECONOMIC_DIRECTED : CULTURAL_DIRECTED;
  const entries: AxisEntry[] = content.positions
    .filter((p) => p.partyId === partyId && p.status === "clear" && p.stance !== null)
    .map((p) => ({ thesisId: p.thesisId, stance: p.stance as number, weight: 1 }));
  return projectOnAxis(entries, directed);
}

export interface UserPoint {
  eco: AxisProjection;
  soc: AxisProjection;
}

export function hasOverlap(a: AxisProjection, b: AxisProjection): boolean {
  return a.x !== null && b.x !== null;
}
