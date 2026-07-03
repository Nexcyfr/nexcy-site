"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// 4 points de convergence (N E S O) → centre
const CX = 120;
const CY = 100;
const RADIUS = 72;
const OUTER = [
  { x: CX,          y: CY - RADIUS }, // Nord
  { x: CX + RADIUS, y: CY           }, // Est
  { x: CX,          y: CY + RADIUS }, // Sud
  { x: CX - RADIUS, y: CY           }, // Ouest
];

/**
 * Motif « point de convergence » — colonne gauche de la page Contact.
 * 4 lignes depuis les 4 directions convergent vers un nœud central accent.
 * Animation à l'entrée (on mount), réduit-motion respecté.
 */
export function ContactScene() {
  const svgRef = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const svg = svgRef.current;
      if (!svg) return;
      const q = (s: string) => Array.from(svg.querySelectorAll(s));

      if (reduced) {
        gsap.set([...q("[data-ray],[data-dot],[data-outer-node]")], { clearProps: "all" });
        return;
      }

      // État initial
      gsap.set(q("[data-ray]"), { strokeDashoffset: RADIUS, strokeDasharray: RADIUS });
      gsap.set(q("[data-outer-node]"), { scale: 0, opacity: 0, transformOrigin: "center" });
      gsap.set(svg.querySelector("[data-dot]"), { scale: 0, opacity: 0, transformOrigin: "center" });

      // Entrée : rayons → nœuds → point central
      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(q("[data-ray]"), { strokeDashoffset: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" })
        .to(q("[data-outer-node]"), { scale: 1, opacity: 1, duration: 0.25, stagger: 0.06, ease: "back.out(2)", transformOrigin: "center" }, 0.5)
        .to(svg.querySelector("[data-dot]"), { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.5)", transformOrigin: "center" }, 0.75);

      // Pulse ambiant sur le point central
      gsap.to(svg.querySelector("[data-pulse]"), {
        scale: 2.2,
        opacity: 0,
        duration: 1.8,
        ease: "power1.out",
        repeat: -1,
        repeatDelay: 1.2,
        transformOrigin: `${CX}px ${CY}px`,
        delay: 1.1,
      });
    },
    { scope: svgRef, dependencies: [reduced] },
  );

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${CX * 2} ${CY * 2}`}
      aria-hidden="true"
      fill="none"
      className="w-full max-w-[200px]"
      data-contact-scene
    >
      {/* Rayons convergents */}
      {OUTER.map((pt, i) => (
        <line
          key={i}
          data-ray
          x1={pt.x} y1={pt.y}
          x2={CX} y2={CY}
          stroke="var(--color-border)"
          strokeWidth="1.25"
          strokeDasharray={RADIUS.toString()}
          strokeDashoffset={RADIUS.toString()}
        />
      ))}

      {/* Nœuds extérieurs */}
      {OUTER.map((pt, i) => (
        <rect
          key={i}
          data-outer-node
          x={pt.x - 3.5} y={pt.y - 3.5}
          width="7" height="7"
          transform={`rotate(45 ${pt.x} ${pt.y})`}
          fill="var(--color-black)"
          stroke="var(--color-text-secondary)"
          strokeWidth="1.25"
        />
      ))}

      {/* Anneau pulse central */}
      <circle
        data-pulse
        cx={CX} cy={CY}
        r="9"
        stroke="var(--color-accent)"
        strokeWidth="1"
        opacity="0.35"
      />

      {/* Point de convergence central */}
      <circle
        data-dot
        cx={CX} cy={CY}
        r="5"
        fill="var(--color-accent)"
      />
    </svg>
  );
}
