/**
 * Zentrale Site-Konfiguration — bewusst Code statt Env-Vars, damit der
 * statische Export ohne Build-Umgebung reproduzierbar bleibt.
 */
export const SITE_CONFIG = {
  /** Produktions-Domain (für Sitemap, Canonical, OG-URLs) */
  siteUrl: "https://wahl-check.com",

  /** Spenden-Link (Ko-Fi); Overlay-Widget sitewide nutzt dasselbe Konto. */
  donateUrl: "https://ko-fi.com/adhamsoliman",

  /** Öffentliches Repository (Impressum, Korrekturprozess) */
  githubUrl: "https://github.com/adhamsolimann",
} as const;

/** Bevorzugter Korrekturkanal: GitHub Issues (transparenter Änderungsverlauf) */
export const CORRECTION_URL = `${SITE_CONFIG.githubUrl}/issues`;
