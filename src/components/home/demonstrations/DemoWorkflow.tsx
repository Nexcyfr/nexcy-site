"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Kind = "auto" | "ia" | "human" | "result";

const STEPS: { label: string; sub: string; kind: Kind; tag: string }[] = [
  { label: "Déclencheur", sub: "Nouvelle demande reçue", kind: "auto", tag: "Automatisé" },
  { label: "Traitement", sub: "Collecte et tri des données", kind: "auto", tag: "Automatisé" },
  { label: "Étape IA", sub: "Analyse assistée, proposition", kind: "ia", tag: "IA (assistance)" },
  { label: "Validation humaine", sub: "Contrôle et décision", kind: "human", tag: "Humain" },
  { label: "Résultat", sub: "Action exécutée", kind: "result", tag: "Automatisé" },
];

/**
 * Démonstration NEXCY — Automatisation & IA « Workflow automatisé ».
 * Les étapes s'activent en séquence au clic sur « Lancer ». La validation humaine
 * est mise en évidence (l'IA assiste, elle ne décide pas). Aucun gain chiffré
 * inventé. Tous les libellés sont lisibles avant animation. Reduced-motion :
 * activation instantanée. Timers nettoyés au démontage.
 */
export function DemoWorkflow() {
  const [active, setActive] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const run = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setActive(0);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setActive(STEPS.length);
      return;
    }
    STEPS.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setActive(i + 1), 450 * (i + 1)));
    });
  };

  return (
    <div>
      <ol className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-2">
        {STEPS.map((s, i) => {
          const on = i < active;
          return (
            <li key={s.label} className="flex flex-1 items-stretch gap-2 md:flex-col">
              <div
                className={cn(
                  "flex-1 rounded-card border bg-card p-4 transition-colors duration-300",
                  on ? "border-accent" : "border-border",
                  s.kind === "human" && "ring-1 ring-accent/40",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-text-primary">
                    {s.label}
                  </span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[9px] uppercase tracking-wide",
                      s.kind === "human"
                        ? "bg-accent/20 text-accent-light"
                        : "bg-surface text-text-muted",
                    )}
                  >
                    {s.tag}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                  {s.sub}
                </p>
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-3 block h-0.5 origin-left rounded-full bg-accent transition-transform duration-300",
                    on ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </div>
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        onClick={run}
        className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-btn border border-accent px-6 py-2.5 text-sm font-medium text-accent transition-colors duration-200 hover:bg-accent hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {active >= STEPS.length ? "Relancer le workflow" : "Lancer le workflow"}
      </button>
      <p className="mt-3 text-xs text-text-muted">
        L&apos;IA <strong className="font-medium text-text-secondary">assiste</strong> ; la
        décision reste <strong className="font-medium text-text-secondary">humaine</strong>. Ce
        qui est automatisé et ce qui est contrôlé est distingué.
      </p>
    </div>
  );
}
