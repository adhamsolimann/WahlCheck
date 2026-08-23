/**
 * T-132 Fact-Check-Checkliste — generiert aus dem validierten Content-Bundle.
 *
 * Die Checkliste ist datengetrieben: Wird in einer positions/*.yaml
 * `verification: verified` gesetzt und das Skript erneut ausgeführt,
 * ändert sich der Status in der Tabelle automatisch.
 *
 * Ausführen: pnpm --filter @wahlen/web exec tsx ../../scripts/gen-factcheck.mts
 */
import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Party } from "../packages/schemas/src/index.ts";
import { loadContent } from "../packages/schemas/src/node.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const bundle = loadContent(join(repoRoot, "content"));
const outFile = join(repoRoot, "docs", "factcheck-checklist.md");

const thesesById = new Map(bundle.theses.map((t) => [t.id, t]));

function cell(value: string | undefined, max = 90): string {
  const text = (value ?? "").replace(/\s+/g, " ").replace(/\|/g, "\\|").trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function stanceLabel(p: Position): string {
  if (p.status === "neutral") return "neutral";
  if (p.status === "none" || p.stance === null) return "—";
  return p.stance > 0 ? `+${p.stance}` : String(p.stance);
}

const tierOrder: Party["tier"][] = ["parliament", "small", "contextual"];
const sortedParties = [...bundle.parties].sort(
  (a, b) =>
    tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier) ||
    a.shortName.localeCompare(b.shortName, "de"),
);

let totalPending = 0;
let totalVerified = 0;
const sections: string[] = [];

for (const party of sortedParties) {
  const positions = bundle.positions.get(party.id) ?? [];
  const clear = positions.filter((p) => p.status !== "none");
  if (clear.length === 0 && !positions.some((p) => p.sourceLabel)) continue;

  const pending = clear.filter((p) => p.verification !== "verified").length;
  const verified = clear.length - pending;
  totalPending += pending;
  totalVerified += verified;

  const lines: string[] = [];
  lines.push(`### ${party.shortName} — ${pending} offen / ${verified} erledigt`);
  lines.push("");
  lines.push(`Programm: ${party.programUrl ?? "**kein Link hinterlegt**"}`);
  lines.push("");
  lines.push("| ✓ | These | Haltung | Zitat (Auszug) | Quelle | Notiz |");
  lines.push("|--:|-------|--------:|----------------|--------|-------|");

  for (const pos of clear.sort((a, b) => a.thesisId.localeCompare(b.thesisId))) {
    const done = pos.verification === "verified";
    const thesis = thesesById.get(pos.thesisId);
    lines.push(
      `| ${done ? "✅" : "☐"} | ${cell(thesis?.text ?? pos.thesisId, 60)} | ${stanceLabel(pos)} | „${cell(pos.justificationQuote)}“ | ${cell(pos.sourceLabel ?? pos.sourceUrl, 40)} | |`,
    );
  }

  // „Keine Angabe“ mit Quellenvermerk (optional nachzuprüfen)
  const noneWithSource = positions.filter(
    (p) => p.status === "none" && (p.sourceLabel || p.justificationQuote),
  );
  if (noneWithSource.length > 0) {
    lines.push("");
    lines.push("<details><summary>„Keine Angabe“ mit Quellenvermerk (optional)</summary>");
    lines.push("");
    lines.push("| These | Vermerk |");
    lines.push("|-------|---------|");
    for (const pos of noneWithSource) {
      lines.push(
        `| ${cell(thesesById.get(pos.thesisId)?.text ?? pos.thesisId, 60)} | ${cell(pos.sourceLabel ?? pos.justificationQuote)} |`,
      );
    }
    lines.push("");
    lines.push("</details>");
  }

  sections.push(lines.join("\n"));
}

const tierNote = [
  "**Freigabe-Regel (Freeze-Gate):** Alle Positionen der Tier-Stufen",
  "`parliament` und `small` müssen `verification: verified` haben, bevor die",
  "Faktencheck-Freeze ausgerufen wird. `contextual`-Parteien folgen best effort.",
].join(" ");

const md = `# Faktencheck-Checkliste (T-132)

> Generiert am ${new Date().toISOString().slice(0, 10)} durch \`scripts/gen-factcheck.mts\` — NICHT manuell editieren.
> Status wird ausschließlich in \`content/positions/*.yaml\` gepflegt (\`verification: verified\`),
> danach Skript erneut ausführen und beides zusammen committen.

## Gesamtstand

| Tier | Offen | Verified |
|------|------:|---------:|
| gesamt | **${totalPending}** | ${totalVerified} |

${tierNote}

## Arbeitsablauf je Position

1. Programm-PDF öffnen (Link in der Parteisektion).
2. Passage suchen und prüfen: (a) Zitat wortgleich? (b) trifft unsere
   Haltungs-Skala (−2…+2) den Sinn? (c) Quellenangabe korrekt?
3. Ergebnis umsetzen:
   - ✅ passt → in der YAML \`verification: verified\` setzen
   - ✏️ Zitat ungenau → Zitat/S. korrigieren, dann verified setzen
   - ⬇️ nicht belegbar → Status auf \`none\`, stance \`null\`, Grund in Notiz
4. Nach jeder Partei: Skript ausführen + \`pnpm test\` (Cross-Ref-Integrität),
   committen (\`content\` + \`docs/factcheck-checklist.md\` gemeinsam).

## Werkzeuge

\`\`\`bash
pipx install pypdf          # oder: brew install poppler (pdftotext)
python3 - <<'EOF'
from pypdf import PdfReader
r = PdfReader("programm.pdf")
print("\\n".join(p.extract_text() for p in r.pages[:3]))
EOF
\`\`\`

---

${sections.join("\n\n---\n\n")}
`;

writeFileSync(outFile, md, "utf8");

console.log(
  `✓ factcheck-checklist.md: ${totalPending} offen, ${totalVerified} verified ` +
    `(${bundle.parties.length} Parteien, ${bundle.positions.size} Positionsdateien)`,
);
