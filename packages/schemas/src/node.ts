/**
 * Node-only content loaders. Browser bundles must import from "@wahlen/schemas"
 * (root) only — this module pulls in `node:fs`.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parse as parseYaml } from "yaml";
import type {
  ChangelogEntry,
  ElectionPolls,
  Party,
  Position,
  Thesis,
} from "./index.js";
import {
  ChangelogFileSchema,
  ElectionPollsSchema,
  PartySchema,
  PositionsFileSchema,
  ThesisSchema,
} from "./index.js";

interface ParseIssue {
  path: ReadonlyArray<string | number | symbol>;
  message: string;
}

interface ParserLike<T> {
  safeParse(data: unknown):
    | { success: true; data: T }
    | { success: false; error: { issues: ParseIssue[] } };
}

export class ContentValidationError extends Error {
  constructor(
    message: string,
    public readonly problems: string[],
  ) {
    super(`${message}\n${problems.map((p) => `  - ${p}`).join("\n")}`);
    this.name = "ContentValidationError";
  }
}

function formatIssues(file: string, issues: ParseIssue[]): string {
  return issues.map((i) => `${file}: ${i.path.join(".")}: ${i.message}`).join("\n");
}

function loadYamlFiles<T>(dir: string, schema: ParserLike<T>, kind: string): T[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    throw new ContentValidationError(`Missing content directory for ${kind}: ${dir}`, []);
  }

  const out: T[] = [];
  const problems: string[] = [];

  for (const entry of entries.filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))) {
    const file = join(dir, entry);
    let raw: unknown;
    try {
      raw = parseYaml(readFileSync(file, "utf8"));
    } catch (err) {
      problems.push(`${entry}: invalid YAML (${String(err)})`);
      continue;
    }
    const result = schema.safeParse(raw);
    if (result.success) {
      out.push(result.data);
    } else {
      const msg = formatIssues(entry, result.error.issues);
      problems.push(msg);
    }
  }

  if (problems.length > 0) {
    throw new ContentValidationError(`Invalid ${kind} content in ${dir}`, problems);
  }
  return out;
}

export function loadParties(contentRoot: string): Party[] {
  return loadYamlFiles(join(contentRoot, "parties"), PartySchema, "party");
}

export function loadTheses(contentRoot: string): Thesis[] {
  return loadYamlFiles(join(contentRoot, "theses"), ThesisSchema, "thesis");
}

export function loadPositions(contentRoot: string): Map<string, Position[]> {
  const files = loadYamlFiles(
    join(contentRoot, "positions"),
    PositionsFileSchema,
    "positions",
  );
  return new Map(files.map((f) => [f.partyId, f.positions]));
}

export function loadPolls(contentRoot: string): ElectionPolls[] {
  return loadYamlFiles(join(contentRoot, "polls"), ElectionPollsSchema, "polls");
}

export function loadChangelog(contentRoot: string): ChangelogEntry[] {
  const files = loadYamlFiles(
    join(contentRoot, "changelog"),
    ChangelogFileSchema,
    "changelog",
  );
  return files.flat();
}

export interface ContentBundle {
  parties: Party[];
  theses: Thesis[];
  positions: Map<string, Position[]>;
}

export function loadContent(contentRoot: string): ContentBundle {
  return {
    parties: loadParties(contentRoot),
    theses: loadTheses(contentRoot),
    positions: loadPositions(contentRoot),
  };
}
