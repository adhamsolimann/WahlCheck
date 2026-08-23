import { z } from "zod";

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

/** 5-point Likert scale: -2 = lehnen vollständig ab … +2 = unterstützen vollständig */
export const STANCE_MIN = -2;
export const STANCE_MAX = 2;
export const WEIGHT_MIN = 1;
export const WEIGHT_MAX = 5;

export const TOPIC_IDS = [
  "wohnen",
  "haushalt-finanzen",
  "arbeit-soziales",
  "bildung",
  "sicherheit",
  "migration",
  "mobilitaet",
  "klima",
  "verwaltung-digital",
  "stadtgesellschaft",
] as const;
export type TopicId = (typeof TOPIC_IDS)[number];

export const PARTY_TIERS = ["parliament", "small", "contextual"] as const;
export type PartyTier = (typeof PARTY_TIERS)[number];

/* ------------------------------------------------------------------ */
/* Shared primitives                                                   */
/* ------------------------------------------------------------------ */

const idSchema = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "expected kebab-case id (a-z, 0-9, hyphens)");

const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "expected hex color like #1FA12E");

export const SourceRefSchema = z.strictObject({
  label: z.string().min(3),
  url: z.string().url(),
});
export type SourceRef = z.infer<typeof SourceRefSchema>;

/* ------------------------------------------------------------------ */
/* Thesis                                                              */
/* ------------------------------------------------------------------ */

export const ThesisSchema = z.strictObject({
  id: idSchema,
  topicId: z.enum(TOPIC_IDS),
  /** Neutral formulierte These ("… soll … werden.") */
  text: z.string().min(20).max(300),
  /** Warum ist diese These im Set? (Differenzierung + Salienz) */
  rationale: z.string().min(20),
  /** In den Quick-Modus (~15 Thesen) aufgenommen? */
  quickMode: z.boolean().default(false),
  sources: z.array(SourceRefSchema).min(1),
});
export type Thesis = z.infer<typeof ThesisSchema>;

/* ------------------------------------------------------------------ */
/* Party                                                               */
/* ------------------------------------------------------------------ */

export const PartySchema = z.strictObject({
  id: idSchema,
  name: z.string().min(2),
  shortName: z.string().min(1).max(40),
  tier: z.enum(PARTY_TIERS),
  listType: z.enum(["landesliste", "bezirksliste"]),
  /** Nur relevant bei listType "bezirksliste"; leer = TODO der Content-Agents */
  bezirke: z.array(z.string()).default([]),
  colorHex: hexColorSchema,
  founded: z.number().int().min(1860).max(2100).optional(),
  summary: z.string().min(40),
  fundingSummary: z.string().optional(),
  leadership: z.array(z.string()).default([]),
  programUrl: z.string().url().optional(),
  /**
   * false = reduziertes Profil (kleine Partei) oder noch unvollständig.
   * UI muss unvollständige Profile transparent kennzeichnen.
   */
  profileComplete: z.boolean().default(false),
});
export type Party = z.infer<typeof PartySchema>;

/* ------------------------------------------------------------------ */
/* Position                                                            */
/* ------------------------------------------------------------------ */

export const POSITION_STATUSES = ["clear", "neutral", "none"] as const;
export type PositionStatus = (typeof POSITION_STATUSES)[number];

/**
 * Parteiposition zu einer These.
 * - status "clear":   stance ∈ [-2..+2], Quote + Quelle erforderlich
 * - status "neutral": Partei macht keine eindeutige Angabe → Scoring gibt 0.5 Kredit
 * - status "none":    keine verwertbare Angabe → These wird für diese Partei excluded
 */
export const PositionSchema = z
  .strictObject({
    thesisId: idSchema,
    stance: z.number().int().min(STANCE_MIN).max(STANCE_MAX).nullable(),
    status: z.enum(POSITION_STATUSES).default("clear"),
    justificationQuote: z.string().min(10).max(400).optional(),
    sourceLabel: z.string().optional(),
    sourceUrl: z.string().url().optional(),
    verification: z.enum(["verified", "pending"]).default("pending"),
  })
  .refine(
    (p) => (p.status === "clear" ? p.stance !== null : p.stance === null),
    {
      message:
        "status 'clear' erfordert eine Stance; 'neutral' und 'none' erfordern stance: null",
    },
  );
export type Position = z.infer<typeof PositionSchema>;

export const PositionsFileSchema = z.strictObject({
  partyId: idSchema,
  positions: z.array(PositionSchema).min(1),
});
export type PositionsFile = z.infer<typeof PositionsFileSchema>;

/* ------------------------------------------------------------------ */
/* User answers                                                        */
/* ------------------------------------------------------------------ */

export const UserAnswerSchema = z.strictObject({
  thesisId: idSchema,
  /** null = übersprungen */
  stance: z.number().int().min(STANCE_MIN).max(STANCE_MAX).nullable(),
  weight: z.number().int().min(WEIGHT_MIN).max(WEIGHT_MAX).default(WEIGHT_MIN),
});
export type UserAnswer = z.infer<typeof UserAnswerSchema>;

/* ------------------------------------------------------------------ */
/* Umfragen (Wahltrend-Snapshot)                                       */
/* ------------------------------------------------------------------ */

const partyKeySchema = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "party-id als key erwartet");

export const PollEntrySchema = z.strictObject({
  institute: z.string().min(2),
  /** ISO-Datum yyyy-mm-dd (Feldende/-stand) */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sampleSize: z.number().int().positive().optional(),
  /** Prozentwerte je Partei; „Sonstige" unter dem key "sonstige" */
  values: z.record(partyKeySchema, z.number().min(0).max(100)),
  sourceUrl: z.string().url(),
});
export type PollEntry = z.infer<typeof PollEntrySchema>;

export const PollAggregateSchema = z.strictObject({
  /** ISO-Datum der letzten Aktualisierung des gewichteten Trends */
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  methodNote: z.string().min(10),
  /** Gewichtetes Trend-Mittel inkl. Parteien unter der Hürde */
  trend: z.record(partyKeySchema, z.number().min(0).max(100)),
});
export type PollAggregate = z.infer<typeof PollAggregateSchema>;

export const ElectionPollsSchema = z.strictObject({
  electionId: idSchema,
  electionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** Mindestparlamentsgröße (Berlin: Überhang/Pauschsitze können erhöhen) */
  parliamentSeats: z.number().int().positive(),
  majoritySeats: z.number().int().positive(),
  thresholdPercent: z.number().min(0).max(50),
  thresholdNote: z.string().min(10),
  polls: z.array(PollEntrySchema).min(1),
  aggregate: PollAggregateSchema,
});
export type ElectionPolls = z.infer<typeof ElectionPollsSchema>;
