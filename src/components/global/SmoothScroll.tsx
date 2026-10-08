"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type Lenis from "lenis";
import { LenisContext } from "@/hooks/useLenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Provider Lenis UNIQUE (Master Brief §9 / règle premium : un seul provider).
 * - Scroll fluide desktop uniquement : sur écran tactile (pointeur grossier) le
 *   scroll natif est déjà fluide et Lenis n'est ni chargé, ni exécuté — un
 *   ticker de moins et ~8 kB de JS de moins sur mobile.
 * - Désactivé si prefers-reduced-motion (scroll natif conservé).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);
  // Réagit aux changements de préférence en cours de session : l'effet se
  // ré-exécute (destruction / re-création de Lenis) quand `reduced` change.
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    // Pointeur grossier / sans survol : scroll natif, Lenis inutile.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let cancelled = false;
    let instance: Lenis | null = null;

    // Chargement différé : Lenis ne pèse jamais sur le chemin critique.
    import("lenis").then(({ default: LenisCtor }) => {
      if (cancelled) return;
      instance = new LenisCtor({
        // lerp seul (sans `duration`, sinon Lenis bascule en mode durée+easing
        // et ignore lerp). Amortissement framerate-indépendant, règle premium 0.06–0.10.
        lerp: 0.09,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });

      setLenis(instance);

      const loop = (time: number) => {
        instance?.raf(time);
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      instance?.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
