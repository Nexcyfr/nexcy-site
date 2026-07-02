"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

declare global {
  interface Window {
    /** Positionne la timeline de la scène (0→1) pour la capture frame par frame. */
    __seek?: (progress: number) => void;
    /** Passe à true quand la scène est prête à être capturée. */
    __sceneReady?: boolean;
    /** Durée logique visée de la boucle (secondes). */
    __duration?: number;
  }
}

/**
 * Scène DÉTERMINISTE de test (rendu média DEV uniquement, jamais publique).
 * Aucun aléatoire → même sortie serveur/client et frame par frame reproductible.
 * Expose `window.__seek(p)` pour piloter la timeline depuis le renderer headless.
 */
export function TestScene() {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = root.current;
      if (!svg) return;

      const ring = svg.querySelector("[data-ring]");
      const nodes = svg.querySelectorAll<SVGCircleElement>("[data-node]");
      const line = svg.querySelector<SVGPathElement>("[data-line]");

      if (line) {
        const len = line.getTotalLength();
        gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      }
      gsap.set(nodes, { transformOrigin: "center", scale: 0, opacity: 0 });

      const tl = gsap.timeline({ paused: true });
      tl.to(ring, { rotate: 360, transformOrigin: "center", ease: "none", duration: 1 }, 0)
        .to(nodes, { scale: 1, opacity: 1, stagger: 0.06, duration: 0.4 }, 0)
        .to(line, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);

      window.__seek = (p: number) => tl.progress(Math.min(Math.max(p, 0), 1));
      window.__duration = 2;
      window.__sceneReady = true;

      return () => {
        window.__seek = undefined;
        window.__sceneReady = false;
      };
    },
    { scope: root },
  );

  return (
    <svg
      ref={root}
      viewBox="0 0 1280 720"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full bg-black"
      fill="none"
    >
      <g data-ring stroke="var(--color-border)" strokeWidth="2">
        <circle cx="640" cy="360" r="220" />
        <circle cx="640" cy="360" r="150" opacity="0.5" />
      </g>
      <path
        data-line
        d="M300 360 L520 240 L760 440 L980 300"
        stroke="var(--color-accent)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {[
        [520, 240],
        [760, 440],
        [980, 300],
        [300, 360],
      ].map(([x, y], i) => (
        <circle
          key={i}
          data-node
          cx={x}
          cy={y}
          r="8"
          fill="var(--color-black)"
          stroke="var(--color-text-secondary)"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}
