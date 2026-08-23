import type { TopicId } from "@wahlen/schemas";

export interface Persona {
  id: string;
  label: string;
  description: string;
  /** Themen, die dieser Persona wichtiger sind (Startgewichtung) */
  topicWeights: Partial<Record<TopicId, number>>;
}

export const NO_PERSONA = "none";

export const PERSONAS: Persona[] = [
  {
    id: NO_PERSONA,
    label: "Ohne Voreinstellung",
    description: "Alle Themen gleich gewichtet — du entscheidest selbst.",
    topicWeights: {},
  },
  {
    id: "mieterin",
    label: "Mieterin / Mieter",
    description: "Mieten, Wohnungsbau und Wohnkosten stehen im Vordergrund.",
    topicWeights: { wohnen: 4, "haushalt-finanzen": 2 },
  },
  {
    id: "familie",
    label: "Familie",
    description: "Kita, Schule und soziale Infrastruktur zuerst.",
    topicWeights: { bildung: 4, "arbeit-soziales": 3, wohnen: 2 },
  },
  {
    id: "studierende",
    label: "Studierende / Azubis",
    description: "Wohnraum, Mobilität und Stadtkultur im Fokus.",
    topicWeights: { wohnen: 3, mobilitaet: 3, stadtgesellschaft: 2 },
  },
  {
    id: "seniorinnen",
    label: "Seniorinnen / Senioren",
    description: "Sicherheit, Gesundheit nah am Kiez, ruhige Stadtteile.",
    topicWeights: { sicherheit: 3, "arbeit-soziales": 3, "verwaltung-digital": 2 },
  },
  {
    id: "selbststaendige",
    label: "Selbstständige",
    description: "Haushalt, Verwaltung, Genehmigungen und Steuern zuerst.",
    topicWeights: { "haushalt-finanzen": 4, "verwaltung-digital": 3 },
  },
];

export function getPersona(id: string): Persona {
  return PERSONAS.find((p) => p.id === id) ?? PERSONAS[0];
}
