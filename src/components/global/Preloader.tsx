"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const SESSION_KEY = "nexcy-loaded";

/**
 * Préloader (Master Brief §12 / §33).
 * - Affiché uniquement à la première visite de session (sessionStorage flag).
 * - Monogramme N dessiné au tracé (stroke-dashoffset) + compteur 0→100 %.
 * - Durée ~1,8 s, exit fade + scale. Libère le scroll ensuite.
 * - Respecte prefers-reduced-motion (durée quasi nulle, pas de blocage).
 */
export function Preloader() {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  // Décision d'affichage au montage (client uniquement, évite le flash SSR).
  useEffect(() => {
    setMounted(true);
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (!seen) {
      setActive(true);
      document.documentElement.classList.add("lenis-stopped");
    }
  }, []);

  useGSAP(
    () => {
      if (!active) return;
      const root = rootRef.current;
      const path = pathRef.current;
      const counter = counterRef.current;
      if (!root || !path || !counter) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const finish = () => {
        sessionStorage.setItem(SESSION_KEY, "1");
        document.documentElement.classList.remove("lenis-stopped");
        setActive(false);
      };

      if (reduce) {
        counter.textContent = "100";
        gsap.to(root, { autoAlpha: 0, duration: 0.2, delay: 0.2, onComplete: finish });
        return;
      }

      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

      const progress = { value: 0 };
      const tl = gsap.timeline({ onComplete: finish });

      tl.to(path, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, 0)
        .to(
          progress,
          {
            value: 100,
            duration: 1,
            ease: "power1.out",
            onUpdate: () => {
              counter.textContent = String(Math.round(progress.value));
            },
          },
          0.6,
        )
        .to(root, { autoAlpha: 0, scale: 1.04, duration: 0.4, ease: "power2.in" }, 1.8);
    },
    { scope: rootRef, dependencies: [active] },
  );

  if (!mounted || !active) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
      aria-live="polite"
      aria-label="Chargement du site"
      role="status"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        className="h-20 w-20 text-text-primary"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d="M26 78 V22 L74 78 V22"
          stroke="currentColor"
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="mt-6 text-xs font-light tracking-widest text-text-muted">
        <span ref={counterRef}>0</span>
        <span> %</span>
      </div>
    </div>
  );
}
