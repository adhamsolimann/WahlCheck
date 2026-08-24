/**
 * Täglicher News-Scanner: Holt den Google-News-RSS-Feed zur
 * Abgeordnetenhauswahl Berlin, filtert auf Aktualität und Dedupliziert
 * gegen bestehende Einträge. Neue Artikel werden an
 * content/news/<jahr>.yaml angehängt.
 *
 * Aufruf: pnpm news:scan  (oder automatisch per GitHub-Actions-Cron)
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const newsDir = join(repoRoot, "content", "news");

const RSS_URL =
  "https://news.google.com/rss/search?q=%22Abgeordnetenhauswahl%22+Berlin&hl=de&gl=DE&ceid=DE:de";

/* Partei-Erkennung für Auto-Tagging (Reihenfolge = Priorität) */
const PARTY_KEYWORDS: Array<[string, string]> = [
  ["Die Linke", "linke"],
  ["Linke", "linke"],
  ["CDU", "cdu"],
  ["AfD", "afd"],
  ["Grüne", "gruene"],
  ["SPD", "spd"],
  ["BSW", "bsw"],
  ["FDP", "fdp"],
  ["Volt", "volt"],
  ["Tierschutzpartei", "tierschutzpartei"],
];

interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
}

function parseRss(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const blocks = xml.split("<item>").slice(1);
  for (const block of blocks) {
    const tag = (name: string): string => {
      const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
      return m ? m[1].trim() : "";
    };
    const title = tag("title").replace(/<!\[CDATA\[|\]\]>/g, "");
    const link = tag("link");
    const pubDate = tag("pubDate");
    const srcMatch = block.match(/<source[^>]*>([\s\S]*?)<\/source>/);
    const source = srcMatch ? srcMatch[1].replace(/<!\[CDATA\[|\]\]>/g, "") : "";
    if (title && link && pubDate) items.push({ title, link, pubDate, source });
  }
  return items;
}

function toDateIso(rfc822: string): string {
  const d = new Date(rfc822);
  return d.toISOString().slice(0, 10);
}

function detectParty(title: string): string | undefined {
  const lower = title.toLowerCase();
  for (const [keyword, id] of PARTY_KEYWORDS) {
    if (lower.includes(keyword.toLowerCase())) return id;
  }
  return undefined;
}

async function main() {
  console.log(`Hole RSS von ${RSS_URL}`);
  const res = await fetch(RSS_URL, {
    headers: { "user-agent": "WahlCheck-Bot/1.0" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) {
    console.error(`RSS-Fetch fehlgeschlagen: HTTP ${res.status}`);
    process.exit(1);
  }
  const xml = await res.text();
  const items = parseRss(xml);
  console.log(`${items.length} RSS-Items empfangen`);

  // Bestehende URLs laden (Dedup)
  const yamlFile = join(newsDir, "2026.yaml");
  const existingUrls = new Set<string>();
  if (existsSync(yamlFile)) {
    const text = readFileSync(yamlFile, "utf8");
    for (const m of text.matchAll(/sourceUrl: "([^"]+)"/g)) {
      existingUrls.add(m[1]);
    }
  }

  // Neue Items filtern: letzte 3 Tage, noch nicht bekannt
  const cutoff = Date.now() - 3 * 24 * 60 * 60 * 1000;
  const fresh = items.filter((item) => {
    if (existingUrls.has(item.link)) return false;
    const d = new Date(item.pubDate);
    return d.getTime() >= cutoff;
  });

  if (fresh.length === 0) {
    console.log("Keine neuen Artikel.");
    return;
  }

  // YAML-Einträge generieren (neueste zuerst)
  fresh.sort((a, b) => b.pubDate.localeCompare(a.pubDate));
  const newEntries = fresh.map((item) => {
    const date = toDateIso(item.pubDate);
    const partyId = detectParty(item.title);
    const cleanTitle = item.title.replace(/\s+-\s+[^-]+$/, ""); // Suffix "- Quelle" entfernen
    const lines = [
      `- date: "${date}"`,
      `  title: >-`,
      `    ${cleanTitle}`,
      `  sourceLabel: "${item.source || item.title.match(/-\s+(.+)$/)?.[1] || item.source}"`,
      `  sourceUrl: "${item.link}"`,
    ];
    if (partyId) lines.splice(1, 0, `  partyId: ${partyId}`);
    return { date, yaml: lines.join("\n") };
  });

  // An bestehende Datei anhängen (neueste zuerst → oben einfügen)
  let yamlContent = "";
  if (existsSync(yamlFile)) {
    yamlContent = readFileSync(yamlFile, "utf8");
    // Nach Header-Kommentar einfügen
    const firstEntry = yamlContent.indexOf("- date:");
    if (firstEntry >= 0) {
      const insertText = newEntries.map((e) => e.yaml).join("\n") + "\n";
      yamlContent =
        yamlContent.slice(0, firstEntry) + insertText + yamlContent.slice(firstEntry);
    } else {
      yamlContent += "\n" + newEntries.map((e) => e.yaml).join("\n") + "\n";
    }
  } else {
    yamlContent = newEntries.map((e) => e.yaml).join("\n") + "\n";
  }

  writeFileSync(yamlFile, yamlContent, "utf8");
  console.log(
    `✓ ${newEntries.length} neue Artikel angehängt (${fresh.length} gefiltert von ${items.length})`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
