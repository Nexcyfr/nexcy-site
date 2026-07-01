"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { LenisContext } from "@/hooks/useLenis";

/**
 * Provider Lenis UNIQUE (Master Brief §9 / règle premium : un seul provider).
 * - Scroll fluide desktop, natif sur mobile (syncTouch désactivé).
 * - Branché sur le ticker GSAP → ScrollTrigger reste synchronisé.
 * - Désactivé si prefers-reduced-motion (scroll natif conservé).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const rafRef = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const instance = new Lenis({
      // lerp seul (sans `duration`, sinon Lenis bascule en mode durée+easing
      // et ignore lerp). Amortissement framerate-indépendant, règle premium 0.06–0.10.
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false, // scroll natif sur mobile
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    setLenis(instance);

    // Synchronisation Lenis ↔ ScrollTrigger ↔ ticker GSAP.
    instance.on("scroll", ScrollTrigger.update);

    const update = (time: number) => instance.raf(time * 1000);
    rafRef.current = update;
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      if (rafRef.current) gsap.ticker.remove(rafRef.current);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
