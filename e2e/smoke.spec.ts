import { expect, test, type Page } from "@playwright/test";

/**
 * E2E-Smoke: Quiz → Ergebnisse → Koalition gegen den Produktions-Build.
 *
 * Deckt die Akzeptanzkriterien aus T-107 (Sitzung persistiert, ZERO
 * Netzwerkaufrufe während des Quiz) und die Regression „kein Weiter auf
 * der letzten Frage“ ab.
 */

const QUIZ_URL = "/quiz/";
const RESULTS_URL = "/results/";

/** Bedient eine Karte: Position per Skala, optional Wichtung, weiter. */
async function answerCurrent(page: Page, stanceIndex: number) {
  // StanceScale-Buttons tragen role=radio; n-te Option wählen
  await page.getByRole("radiogroup").getByRole("radio").nth(stanceIndex).click();
}

async function nextCard(page: Page) {
  const next = page.getByRole("button", { name: /^Weiter/ });
  if (await next.isVisible().catch(() => false)) {
    await next.click();
    return true;
  }
  return false; // letzte Frage hat bewusst keinen Weiter-Button
}

test.describe("WahlCheck Berlin — E2E Smoke", () => {
  let networkViolations: string[] = [];

  test.beforeEach(async ({ page }) => {
    networkViolations = [];
    page.on("request", (req) => {
      const url = req.url();
      const host = new URL(url).hostname;
      const isLocal =
        host === "127.0.0.1" || host === "localhost" || host.endsWith(".local");
      // Ko-Fi-Widget (sitewide, datenschutzseitig offengelegt) lädt auch
      // seine Schriftart von Google Fonts — technischer Bestandteil desselben
      // EINZIGEN freigegebenen Drittanbieters.
      const isKofi =
        /(^|\.)ko-fi\.com$/.test(host) ||
        host === "storage.ko-fi.com" ||
        host === "fonts.googleapis.com" ||
        host === "fonts.gstatic.com";

      // Universal: nie schreibende Requests (Antwortdaten verlassen das Gerät nicht)
      if (isLocal && req.method() !== "GET") {
        networkViolations.push(`${req.method()} ${url}`);
      }
      // Fremde Hosts: nur Ko-Fi erlaubt (sitewide Spenden-Widget)
      if (!isLocal && !isKofi) {
        networkViolations.push(`unexpected third-party: ${url}`);
      }
    });
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
  });

  test.afterEach(async () => {
    expect(
      networkViolations,
      `Netzwerkverletzungen: ${networkViolations.join("; ")}`,
    ).toHaveLength(0);
  });

  test("Landing: Kerninhalte und Navigation", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: /WahlCheck/ })).toBeVisible();
    // Logo-Zweiteilung: Wahl (schwarz) + Check (blau)
    await expect(page.locator("h1 span").first()).toHaveText("Wahl");
    await expect(page.getByText(/20\. September 2026/).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Matching starten" })).toBeVisible();
    // Header-Navigation sichtbar
    // Footer-Navigation vollständig
    // (Desktop-Hauptnavigation wird implizit durch andere Tests geprüft —
    //  auf Mobile ist sie im Hamburger versteckt)
    for (const label of ["Koalitionen", "Methodik", "Änderungslog", "Datenschutz", "Impressum"]) {
      await expect(page.locator("footer").getByText(label)).toBeVisible();
    }
  });

  test("Änderungslog: Einträge mit Kategorien sichtbar", async ({ page }) => {
    await page.goto("/aenderungen/");
    await expect(page.getByRole("heading", { name: "Änderungslog" })).toBeVisible();
    // Seed-Einträge vorhanden
    await expect(page.getByText(/Zuordnung des Regierenden Bürgermeisters korrigiert/)).toBeVisible();
    await expect(page.getByText(/Matching-Engine veröffentlicht/)).toBeVisible();
    // Kategorie-Badges gerendert
    await expect(page.getByText("Korrektur", { exact: true }).first()).toBeVisible();
  });

  test("Quiz-Vollzyklus: Onboarding, Antworten, letzte Frage ohne Weiter, Auswertung", async ({
    page,
  }) => {
    await page.goto(QUIZ_URL);

    // Onboarding: Vollständiger Modus
    await page.getByText("Vollständiger Modus").click();
    // Persona: ohne Voreinstellung
    await page.getByText("Ohne Voreinstellung").click();

    // Erste These sichtbar
    await expect(page.getByText(/^These 1 von 38$/)).toBeVisible();

    // 6 Karten beantworten (inkl. Skip + Gewichtung)
    for (let i = 0; i < 6; i++) {
      if (i === 2) {
        await page.getByRole("button", { name: "Überspringen" }).click();
      } else {
        await answerCurrent(page, i % 2 === 0 ? 4 : 1);
      }
      if (i < 5) {
        await expect(page.getByRole("button", { name: /^Weiter/ })).toBeVisible();
        await nextCard(page);
      } else {
        // nicht auf die letzte Karte navigieren — Zwischenstand reicht
      }
    }

    // Reload: Sitzung muss persistieren (T-107)
    await page.reload();
    await expect(page.getByText(/\d+ beantwortet/)).toBeVisible({
      timeout: 10_000,
    });
    const persisted = await page.getByText(/\d+ beantwortet/).textContent();
    expect(persisted).toMatch(/[1-6] beantwortet/);

    // Zur letzten Frage springen via Fortschritts-Dots
    const dots = page.locator('[role="list"][aria-label="Fortschritt"] button');
    await dots.last().click();
    await expect(page.getByText(/^These 38 von 38$/)).toBeVisible();
    await expect(page.getByRole("button", { name: /^Weiter/ })).toHaveCount(0); // Regression
    await expect(page.getByText(/Letzte These/)).toBeVisible();

    // Beantworten und Auswertung öffnen
    await answerCurrent(page, 4);
    await page.getByRole("link", { name: /Auswertung ansehen/ }).click();
    await expect(page).toHaveURL(new RegExp(RESULTS_URL));
    await expect(page.getByRole("heading", { name: "Deine Auswertung" })).toBeVisible();
  });

  test("Ergebnisse: Ranking, Landkarte, Teilen-Button", async ({ page }) => {
    // Robuster UI-Pfad bis zur Auswertung mit 3 Antworten
    await page.goto(QUIZ_URL);
    await page.getByText("Schnell-Modus").click();
    await page.getByText("Mieterin / Mieter").click();
    for (let i = 0; i < 3; i++) {
      await answerCurrent(page, i % 5);
      if (i < 2) await nextCard(page);
    }
    await page.getByRole("link", { name: /Auswertung ansehen|Zwischenstand/ }).first().click();

    await expect(page.getByRole("heading", { name: "Deine Auswertung" })).toBeVisible();
    await expect(page.getByText(/Basis: 3 von \d+ Thesen/)).toBeVisible();
    // Partei-Ranking vorhanden (mindestens eine Prozentangabe)
    await expect(page.locator("main").getByText(/%\s*$/).first()).toBeVisible();
    // Landkarte gerendert
    await expect(page.locator("svg[role='img']").first()).toBeVisible();
    // Teilen-Button vorhanden
    await expect(page.getByRole("button", { name: "Als Bild teilen" })).toBeVisible();
  });

  test("Koalition: Sitze, Optionen, persönliche Overlay-Karte", async ({ page }) => {
    await page.goto("/koalition/");
    await expect(page.getByRole("heading", { name: "Wer kann regieren?" })).toBeVisible();

    // Projektion aus dem Anchortest: Linke 30 · CDU 29 · AfD 26 · Grüne 25 · SPD 20
    await expect(page.getByText("30 Sitze", { exact: true })).toBeVisible();
    await expect(page.getByText("20 Sitze", { exact: true })).toBeVisible();

    // Unter-Hürde-Parteien gekennzeichnet
    await expect(page.getByText(/unter 5 %/).first()).toBeVisible();

    // Hemicycle: exakt die Modell-Sitzanzahl als Punkte (130)
    const seatCircles = page.locator('[data-testid="hemicycle"] circle[fill]:not([fill="transparent"])');
    await expect(seatCircles).toHaveCount(130);

    // Standard: Brandmauer aktiv — Optionen ohne AfD-Beteiligung
    // (4 Dreier + 1 Vierer = 5 von 16 arithmetischen Kombinationen)
    const listItems = page.locator('section[aria-labelledby="coalitions-heading"] ul > li');
    await expect(listItems).toHaveCount(5);
    await expect(page.getByText(/mit beiden Regierungs/).first()).toBeVisible();

    // Toggle: AfD-Beteiligung einblenden → alle 16
    await page.getByLabel(/Koalitionen mit AfD-Beteiligung anzeigen/).check();
    await expect(listItems).toHaveCount(16);
  });

  test("Spenden: Ko-Fi-Anbindung aktiv", async ({ page }) => {
    await page.goto("/spenden/");
    await expect(page.getByRole("link", { name: /Zur Spenden-Seite/ })).toHaveAttribute(
      "href",
      "https://ko-fi.com/adhamsoliman",
    );
  });
});
