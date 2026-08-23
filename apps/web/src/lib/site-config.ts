/**
 * Zentrale Site-Konfiguration — bewusst Code statt Env-Vars, damit der
 * statische Export ohne Build-Umgebung reproduzierbar bleibt.
 */
/**
 * Zentrale Site-Konfiguration — bewusst Code statt Env-Vars, damit der
 * statische Export ohne Build-Umgebung reproduzierbar bleibt.
 */
export const SITE_CONFIG = {
  /**
   * Spenden-Link (Ko-Fi); Overlay-Widget auf der Startseite nutzt dasselbe
   * Konto (adhamsoliman).
   */
  donateUrl: "https://ko-fi.com/adhamsoliman",

  /** Öffentlicher Kontakt für Korrekturen (Methodik-Seite + Statut) */
  correctionEmail: "",
} as const;
