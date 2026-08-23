import { defineConfig, devices } from "@playwright/test";

/**
 * E2E-Smoke-Tests gegen den PRODUKTIONS-Build (statischer Export),
 * nicht gegen den Dev-Server — wir testen genau das, was ausgeliefert wird.
 *
 * Voraussetzung: `pnpm build` wurde ausgeführt (apps/web/out existiert).
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: false, // localStorage-State darf nicht quer laufen
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 13"] }, // Swipe-/Card-Layout mobile-first
    },
  ],
  webServer: {
    command: "python3 -m http.server 4173 --directory apps/web/out --bind 127.0.0.1",
    url: "http://127.0.0.1:4173/",
    reuseExistingServer: true,
    stdout: "ignore",
    stderr: "pipe",
  },
});
