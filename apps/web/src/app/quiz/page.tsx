"use client";



import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThesisCard } from "@/components/quiz/ThesisCard";
import { thesesForMode } from "@/lib/content";
import { PERSONAS } from "@/lib/personas";
import {
  baseWeight,
  clearSession,
  loadSession,
  newSession,
  saveSession,
  type Mode,
  type Session,
} from "@/lib/session";

type Phase = "mode" | "persona" | "quiz";

export default function QuizPage() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [phase, setPhase] = useState<Phase>("mode");
  const [index, setIndex] = useState(0);

  // Hydration-safe: Session erst client-seitig laden
  useEffect(() => {
    const existing = loadSession();
    setSession(existing);
    if (existing) setPhase("quiz");
    setReady(true);
  }, []);

  const scope = useMemo(
    () => thesesForMode(session?.mode ?? "quick"),
    [session?.mode],
  );
  const current = scope[index];
  const answeredCount = session ? Object.keys(session.stances).length : 0;

  const update = useCallback((fn: (s: Session) => Session) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = fn(prev);
      saveSession(next);
      return next;
    });
  }, []);

  const startMode = (mode: Mode) => {
    const fresh = newSession(mode, session?.personaId ?? PERSONAS[0].id);
    setSession(fresh);
    saveSession(fresh);
    setPhase("persona");
  };

  const choosePersona = (personaId: string) => {
    if (!session) return;
    update((s) => ({ ...s, personaId }));
    setIndex(0);
    setPhase("quiz");
  };

  const isDecided = useCallback(
    (thesisId: string) =>
      !!session &&
      (session.stances[thesisId] !== undefined || session.skips.includes(thesisId)),
    [session],
  );

  const canAdvance = useCallback(
    (i: number) => i < scope.length - 1 || isDecided(scope[i]?.id ?? ""),
    [scope, isDecided],
  );

  const goNext = useCallback(() => {
    setIndex((i) => (canAdvance(i) ? Math.min(i + 1, scope.length - 1) : i));
  }, [canAdvance, scope.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const setStance = (thesisId: string, stance: number) =>
    update((s) => ({
      ...s,
      stances: { ...s.stances, [thesisId]: stance },
      skips: s.skips.filter((id) => id !== thesisId),
    }));

  const toggleSkip = (thesisId: string) =>
    update((s) => {
      const skipped = s.skips.includes(thesisId);
      if (skipped) {
        return { ...s, skips: s.skips.filter((id) => id !== thesisId) };
      }
      // Überspringen entfernt eine vorhandene Position nicht dauerhaft –
      // sie wird nur für die Auswertung ausgeschlossen.
      return { ...s, skips: [...s.skips, thesisId] };
    });

  const setWeight = (thesisId: string, weight: number) =>
    update((s) => ({ ...s, weights: { ...s.weights, [thesisId]: weight } }));

  // Tastatursteuerung
  useEffect(() => {
    if (!ready || phase !== "quiz" || !current) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inField =
        target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      const onRange = target instanceof HTMLInputElement && target.type === "range";

      if (/^Digit[1-5]$/.test(e.code)) {
        e.preventDefault();
        setStance(current.id, Number(e.code.slice(5)) - 3); // 1→-2 … 5→+2
        return;
      }
      if ((e.key === "s" || e.key === "S") && !inField) {
        e.preventDefault();
        toggleSkip(current.id);
        return;
      }
      if (e.key === "ArrowRight" && !(inField && !onRange)) {
        if (inField && onRange) e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft" && !(inField && !onRange)) {
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, phase, current, goNext, goPrev]);

  if (!ready) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-center text-sm text-ink-400">Lade …</p>
      </main>
    );
  }

  /* ---------------- Phase: Moduswahl ---------------- */
  if (phase === "mode") {
    return (
      <main className="mx-auto max-w-2xl space-y-8 px-6 py-16">
        <header className="space-y-3 text-center">
          <p className="kicker text-accent-600 dark:text-accent-400">Modus wählen</p>
          <h1 className="font-display text-4xl font-bold tracking-tight">
            Wie tief willst du einsteigen?
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Deine Antworten bleiben ausschließlich auf diesem Gerät gespeichert.
          </p>
        </header>
        <div className="space-y-4">
          {[
            {
              mode: "quick" as Mode,
              index: "01",
              title: "Schnell-Modus",
              body: `${thesesForMode("quick").length} zentrale Thesen — rund 5 Minuten.`,
            },
            {
              mode: "full" as Mode,
              index: "02",
              title: "Vollständiger Modus",
              body: `Alle ${thesesForMode("full").length} Thesen mit Gewichtung — rund 15 Minuten.`,
            },
          ].map(({ mode, index, title, body }) => (
            <Card
              key={mode}
              role="button"
              tabIndex={0}
              hoverable
              onClick={() => startMode(mode)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && startMode(mode)}
              className="group flex cursor-pointer items-center gap-5"
            >
              <span aria-hidden className="font-display text-3xl font-bold text-accent-500">
                {index}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-semibold tracking-tight">
                  {title}
                </span>
                <span className="block text-sm text-ink-500 dark:text-ink-400">{body}</span>
              </span>
              <svg
                aria-hidden
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-ink-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-accent-500 dark:text-ink-600"
              >
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </Card>
          ))}
        </div>
        {session && (
          <button
            onClick={() => setPhase("quiz")}
            className="block w-full text-center text-xs text-ink-400 underline underline-offset-2 hover:text-ink-700 dark:hover:text-white"
          >
            Vorherige Sitzung fortsetzen
          </button>
        )}
      </main>
    );
  }

  /* ---------------- Phase: Persona ---------------- */
  if (phase === "persona") {
    return (
      <main className="mx-auto max-w-2xl space-y-8 px-6 py-16">
        <header className="space-y-3">
          <p className="kicker text-accent-600 dark:text-accent-400">Optional</p>
          <h1 className="font-display text-4xl font-bold tracking-tight">Wer bist du?</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Wir starten die Wichtigkeit einzelner Themen höher — jederzeit änderbar.
          </p>
        </header>
        <div className="grid gap-3 sm:grid-cols-2">
          {PERSONAS.map((p) => (
            <Card
              key={p.id}
              role="button"
              tabIndex={0}
              hoverable
              onClick={() => choosePersona(p.id)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && choosePersona(p.id)}
              className={`cursor-pointer ${
                session?.personaId === p.id
                  ? "border-accent-500 ring-1 ring-accent-500"
                  : ""
              }`}
            >
              <h2 className="font-display text-base font-semibold tracking-tight">{p.label}</h2>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{p.description}</p>
            </Card>
          ))}
        </div>
        <button
          onClick={() => session && setPhase("quiz")}
          className="mx-auto block text-sm font-medium text-ink-500 underline underline-offset-4 hover:text-ink-900 dark:hover:text-white"
        >
          Ohne Voreinstellung starten →
        </button>
      </main>
    );
  }

  /* ---------------- Phase: Quiz ---------------- */
  if (!session || !current) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-sm text-ink-400">Keine aktive Sitzung.</p>
        <Button className="mt-4" onClick={() => setPhase("mode")}>
          Neu starten
        </Button>
      </main>
    );
  }

  const stanceValue = session.skips.includes(current.id)
    ? null
    : (session.stances[current.id] ?? null);
  const effectiveWeight = session.weights[current.id] ?? baseWeight(session, current.topicId);

  return (
    <main className="mx-auto max-w-2xl px-6 pb-16 pt-6">
      {/* Fortschritt — sticky am oberen Rand */}
      <div className="sticky top-0 z-30 -mx-6 bg-paper/95 px-6 pb-3 pt-3 backdrop-blur-md dark:bg-ink-950/95">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-display font-bold tracking-tight text-ink-900 dark:text-white">
            These <span className="text-accent-500">{index + 1}</span>
            <span className="text-ink-400"> / {scope.length}</span>
          </span>
          <span className="text-ink-400">
            {answeredCount} beantwortet
          </span>
          <button
            className="text-ink-400 underline underline-offset-2 hover:text-accent-600"
            onClick={() => {
              if (confirm("Sitzung wirklich löschen und neu beginnen?")) {
                clearSession();
                setSession(null);
                setIndex(0);
                setPhase("mode");
              }
            }}
          >
            Zurücksetzen
          </button>
        </div>

        {/* Segmentierte Klick-Leiste */}
        <div className="flex gap-[3px]" role="list" aria-label="Fortschritt">
          {scope.map((t, i) => {
            const decided = isDecided(t.id);
            const current = i === index;
            return (
              <button
                key={t.id}
                role="listitem"
                aria-label={`These ${i + 1}: ${decided ? "beantwortet" : "offen"}`}
                aria-current={current ? "step" : undefined}
                onClick={() => setIndex(i)}
                className={`h-1.5 min-w-[6px] flex-1 rounded-full transition-colors duration-150 ${
                  current
                    ? "!bg-accent-500"
                    : decided
                      ? "bg-ink-900 hover:bg-ink-700 dark:bg-ink-300 dark:hover:bg-ink-100"
                      : "bg-ink-900/15 hover:bg-ink-900/30 dark:bg-white/15 dark:hover:bg-white/30"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* key = These-ID → sanfter Fade bei jedem Fragenwechsel */}
      {/* Feste Höhe: Bedienelemente bleiben immer an derselben Position */}
      <div key={current.id} className="animate-fade mt-6 h-[26rem]">
        <ThesisCard
          thesis={current}
          index={index}
          total={scope.length}
          stance={stanceValue}
          skipped={session.skips.includes(current.id)}
          weight={effectiveWeight}
          onStance={(s) => setStance(current.id, s)}
          onSkip={() => toggleSkip(current.id)}
          onWeight={(w) => setWeight(current.id, w)}
          onPrev={goPrev}
          onNext={goNext}
        />
      </div>

      <div className="mt-6 flex justify-end">
        {index === scope.length - 1 ? (
          <Link href="/results/">
            <Button size="lg" disabled={answeredCount === 0}>
              Auswertung ansehen ({answeredCount} Antworten)
            </Button>
          </Link>
        ) : (
          answeredCount > 0 && (
            <Link href="/results/">
              <Button variant="ghost" size="sm">
                Zwischenstand ansehen
              </Button>
            </Link>
          )
        )}
      </div>
    </main>
  );
}
