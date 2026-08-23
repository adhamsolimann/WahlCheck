/**
 * Zentrale Site-Konfiguration — bewusst Code statt Env-Vars, damit der
 * statische Export ohne Build-Umgebung reproduzierbar bleibt.
 */
export const SITE_CONFIG = {
  /**
   * Spenden-Link (z. B. Buy Me a Coffee, Ko-fi, Open Collective).
   * Leerer String = Spenden-Sektion zeigt den Platzhalter an.
   * [PO-Aufgabe: BMC-URL hier eintragen]
   */
  donateUrl: "",

  /** Öffentlicher Kontakt für Korrekturen (Methodik-Seite + Statut) */
  correctionEmail: "",
} as const;
