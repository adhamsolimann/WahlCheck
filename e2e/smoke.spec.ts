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
      if (req.method() !== "GET") {
        networkViolations.push(`${req.method()} ${req.url()}`);
      }
      const host = new URL(req.url()).hostname;
      const allowed =
        host === "127.0.0.1" || host === "localhost" || host.endsWith(".local");
      if (!allowed) {
        // Startseite lädt bewusst Ko-Fi; Quiz-/Ergebnispfade dürfen nicht.
        if (!page.url().includes("/quiz") && !page.url().includes("/results")) {
          return; // Landing/Ko-Fi erlaubt
        }
        networkViolations.push(`third-party on protected path: ${req.url()}`);
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
    await expect(page.getByRole("heading", { name: /WahlCheck Berlin/i })).toBeVisible();
    await expect(page.getByText(/20\. September 2026/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Matching starten" })).toBeVisible();
    // Footer-Navigation vollständig
    for (const label of ["Koalitionen", "Methodik", "Datenschutz", "Impressum"]) {
      await expect(page.locator("footer").getByText(label)).toBeVisible();
    }
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
    await expect(page.getByText(/\d+\/38 beantwortet/)).toBeVisible({
      timeout: 10_000,
    });
    const persisted = await page.getByText(/\d+\/38 beantwortet/).textContent();
    expect(persisted).toMatch(/[1-6]\/38/);

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

    // 16 mögliche Koalitionen (Engine-Anchortest) + Regierungs-Beteiligungs-Chip
    const listItems = page.locator('section[aria-labelledby="coalitions-heading"] ul > li');
    await expect(listItems).toHaveCount(16);
    await expect(page.getByText(/mit beiden Regierungs/).first()).toBeVisible();
  });

  test("Spenden: Ko-Fi-Anbindung aktiv", async ({ page }) => {
    await page.goto("/spenden/");
    await expect(page.getByRole("link", { name: /Zur Spenden-Seite/ })).toHaveAttribute(
      "href",
      "https://ko-fi.com/adhammsoliman",
    );
  });
});
