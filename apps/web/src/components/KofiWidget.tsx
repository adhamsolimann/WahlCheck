"use client";

import Script from "next/script";

declare global {
  interface Window {
    kofiWidgetOverlay?: {
      draw: (
        account: string,
        options: Record<string, string>,
      ) => void;
    };
  }
}

/**
 * Ko-Fi Floating-Chat-Tipp-Button (Startseite).
 * Bewusst nur dort eingebunden — die Quiz-/Ergebnispfade bleiben frei von
 * Dritt-Skripten (Art.-9-Architektur, geprüft durch check-quiz-purity.sh).
 */
export function KofiWidget() {
  const handleLoad = () => {
    window.kofiWidgetOverlay?.draw("adhamsoliman", {
      type: "floating-chat",
      "floating-chat.donateButton.text": "Support Us",
      "floating-chat.donateButton.background-color": "#00b9fe",
      "floating-chat.donateButton.text-color": "#fff",
    });
  };

  return (
    <Script
      src="https://storage.ko-fi.com/cdn/scripts/overlay-widget.js"
      strategy="lazyOnload"
      onLoad={handleLoad}
    />
  );
}
