"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

const SESSION_KEY = "nexcy-loaded";

/**
 * Transition de marque (Master Brief §12 — réévalué, audit V2 P1-6).
 * - Uniquement à la première visite de session (sessionStorage).
 * - **< 600 ms**, sans faux compteur : le monogramme N apparaît puis l'overlay
 *   s'efface. Le contenu n'est jamais retardé artificiellement.
 * - Libère le scroll et signale la fin (le hero enchaîne — voir HomeHero).
 * - prefers-reduced-motion : disparition quasi immédiate.
 */
export function Preloader() {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    setMounted(true);
    if (!sessionStorage.getItem(SESSION_KEY)) {
      setActive(true);
      document.documentElement.classList.add("lenis-stopped");
    }
  }, []);

  useGSAP(
    () => {
      if (!active) return;
      const root = rootRef.current;
      const mark = markRef.current;
      if (!root || !mark) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const finish = () => {
        sessionStorage.setItem(SESSION_KEY, "1");
        document.documentElement.classList.remove("lenis-stopped");
        setActive(false);
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          window.dispatchEvent(new Event("nexcy:preloader-done"));
        });
      };

      if (reduce) {
        gsap.to(root, { autoAlpha: 0, duration: 0.15, onComplete: finish });
        return;
      }

      // Transition de marque < 600 ms : N apparaît (0.22 s) → overlay s'efface (0.3 s).
      gsap.set(mark, { autoAlpha: 0, scale: 0.92 });
      const tl = gsap.timeline({ onComplete: finish });
      tl.to(mark, { autoAlpha: 1, scale: 1, duration: 0.22, ease: "power2.out" }, 0)
        .to(root, { autoAlpha: 0, duration: 0.3, ease: "power2.inOut" }, 0.28);
    },
    { scope: rootRef, dependencies: [active] },
  );

  if (!mounted || !active) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      aria-hidden="true"
    >
      <svg
        ref={markRef}
        viewBox="0 0 100 100"
        fill="none"
        className="h-16 w-16 text-text-primary"
      >
        <path
          d="M26 78 V22 L74 78 V22"
          stroke="currentColor"
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
