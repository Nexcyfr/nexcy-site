"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Démonstration NEXCY — Branding « Identité → système ».
 * Marque fictive neutre (« ÉCLAT »). Le markup rend l'état UNIFIÉ (final) :
 * aucun contenu essentiel masqué. Hors reduced-motion, GSAP disperse les
 * éléments au montage ; le bouton « Unifier » les réaligne. Sous reduced-motion,
 * l'état unifié reste et le bouton bascule instantanément.
 */
export function DemoBranding() {
  const scope = useRef<HTMLDivElement>(null);
  const [unified, setUnified] = useState(true);
  const reduceRef = useRef(false);

  // Décalages « dispersés » (déterministes, pas de Math.random au SSR).
  const scatter = [
    { x: -34, y: -18, r: -9 },
    { x: 40, y: 10, r: 7 },
    { x: -22, y: 26, r: 5 },
    { x: 30, y: -24, r: -6 },
    { x: 8, y: 20, r: 10 },
    { x: -40, y: 4, r: -4 },
  ];

  useGSAP(
    () => {
      reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceRef.current) return; // état unifié conservé
      const els = scope.current?.querySelectorAll<HTMLElement>("[data-brand-el]");
      if (!els) return;
      els.forEach((el, i) => gsap.set(el, scatter[i % scatter.length]));
      setUnified(false);
    },
    { scope },
  );

  const toggle = () => {
    const els = scope.current?.querySelectorAll<HTMLElement>("[data-brand-el]");
    if (!els) return;
    if (unified) {
      // disperser
      if (reduceRef.current) {
        els.forEach((el, i) => gsap.set(el, scatter[i % scatter.length]));
      } else {
        els.forEach((el, i) =>
          gsap.to(el, { ...scatter[i % scatter.length], duration: 0.5, ease: "power2.inOut" }),
        );
      }
      setUnified(false);
    } else {
      // unifier
      if (reduceRef.current) {
        els.forEach((el) => gsap.set(el, { x: 0, y: 0, rotate: 0 }));
      } else {
        els.forEach((el) =>
          gsap.to(el, { x: 0, y: 0, rotate: 0, duration: 0.6, ease: "power3.out" }),
        );
      }
      setUnified(true);
    }
  };

  return (
    <div ref={scope}>
      <div className="relative mx-auto grid max-w-sm grid-cols-3 gap-4 rounded-card border border-border bg-card p-8">
        {/* marque */}
        <div
          data-brand-el
          className="col-span-3 flex items-center gap-2 will-change-transform"
        >
          <svg viewBox="0 0 40 40" className="h-7 w-7 text-accent" aria-hidden="true">
            <path d="M8 30 V10 L32 30 V10" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
          <span className="text-lg font-semibold tracking-tight text-text-primary">
            ÉCLAT
          </span>
        </div>
        {/* couleurs */}
        {["bg-accent", "bg-text-primary", "bg-text-muted"].map((c) => (
          <span
            key={c}
            data-brand-el
            className={cn("h-10 rounded will-change-transform", c)}
            aria-hidden="true"
          />
        ))}
        {/* typo */}
        <div
          data-brand-el
          className="col-span-2 flex items-end gap-1 rounded bg-surface px-3 py-2 will-change-transform"
        >
          <span className="text-2xl font-bold text-text-primary">Aa</span>
          <span className="text-xs text-text-muted">Geist</span>
        </div>
        {/* composant */}
        <div
          data-brand-el
          className="flex items-center justify-center rounded border border-accent px-2 py-2 text-[10px] font-medium text-accent will-change-transform"
        >
          Bouton
        </div>
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={unified}
        className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-btn border border-accent px-6 py-2.5 text-sm font-medium text-accent transition-colors duration-200 hover:bg-accent hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {unified ? "Disperser" : "Unifier"}
      </button>
    </div>
  );
}
