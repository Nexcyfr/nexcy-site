"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { EASE, AMPLITUDE } from "@/lib/motion/tokens";
import { usePointerMotion } from "@/hooks/usePointerMotion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Composition : intersection de deux axes — précision × mouvement
const CX = 200;
const CY = 200;
// Extrémités des 4 bras (deux diagonales)
const ARMS = [
  { x: 60,  y: 60  }, // ↖ nord-ouest
  { x: 340, y: 340 }, // ↘ sud-est
  { x: 340, y: 60  }, // ↗ nord-est
  { x: 60,  y: 340 }, // ↙ sud-ouest
];
// Modules d'interface aux mi-bras
const FRAGMENTS = [
  { x: 105, y: 112 },
  { x: 276, y: 276 },
  { x: 276, y: 104 },
];

/**
 * Scène SVG codée pour le hero Studio — architecture en tension.
 * Deux axes diagonaux se croisent au centre (précision × mouvement).
 * Même langage graphique que le Hero hybride.
 */
export function StudioScene({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  usePointerMotion(
    containerRef,
    (nx, ny) => {
      const svg = svgRef.current;
      if (!svg) return;
      gsap.to(svg.querySelector("[data-layer-far]"), {
        x: nx * AMPLITUDE.pointerFar,
        y: ny * AMPLITUDE.pointerFar,
        duration: 0.6,
        ease: EASE.standard,
      });
      gsap.to(svg.querySelector("[data-layer-near]"), {
        x: nx * AMPLITUDE.pointerNear,
        y: ny * AMPLITUDE.pointerNear,
        duration: 0.6,
        ease: EASE.standard,
      });
    },
    { disabled: reduced },
  );

  useGSAP(
    () => {
      const svg = svgRef.current;
      if (!svg) return;
      const q = (s: string) => Array.from(svg.querySelectorAll(s));

      if (reduced) {
        gsap.set(
          [...q("[data-grid],[data-arm],[data-frag],[data-node],[data-center]")],
          { clearProps: "all" },
        );
        return;
      }

      // État initial
      gsap.set(q("[data-grid]"), { opacity: 0 });
      gsap.set(q("[data-arm]"), { strokeDashoffset: 220, strokeDasharray: 220 });
      gsap.set(q("[data-frag]"), { opacity: 0, y: 12 });
      gsap.set(q("[data-node]"), { scale: 0, opacity: 0, transformOrigin: "center" });
      gsap.set(q("[data-center]"), { scale: 0, opacity: 0, transformOrigin: "center" });

      // Séquence d'entrée : grille → bras → fragments → nœuds → centre
      const tl = gsap.timeline({ delay: 0.08 });
      tl.to(q("[data-grid]"), { opacity: 1, duration: 0.5, ease: "power2.inOut" })
        .to(q("[data-arm]"), { strokeDashoffset: 0, duration: 0.72, stagger: 0.12, ease: "power2.out" }, 0.3)
        .to(q("[data-frag]"), { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "power2.out" }, 0.75)
        .to(q("[data-node]"), { scale: 1, opacity: 1, duration: 0.28, stagger: 0.07, ease: "back.out(2)", transformOrigin: "center" }, 0.85)
        .to(q("[data-center]"), { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(3)", transformOrigin: "center" }, 1.0);

      // Subtle pulse on center
      gsap.to(svg.querySelector("[data-center-ring]"), {
        scale: 1.7,
        opacity: 0,
        duration: 2.2,
        ease: "power1.out",
        repeat: -1,
        repeatDelay: 2.0,
        transformOrigin: `${CX}px ${CY}px`,
        delay: 1.4,
      });
    },
    { scope: svgRef, dependencies: [reduced] },
  );

  return (
    <div ref={containerRef} className={cn("relative h-full w-full", className)}>
      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        aria-hidden="true"
        fill="none"
        className="block h-full w-full"
        data-studio-scene
      >
        {/* Grille architecturale */}
        <g data-grid stroke="var(--color-border)" strokeWidth="0.75" opacity="0">
          {[80, 160, 240, 320].map((x) => (
            <line key={`v${x}`} x1={x} y1="20" x2={x} y2="380" />
          ))}
          {[80, 160, 240, 320].map((y) => (
            <line key={`h${y}`} x1="20" y1={y} x2="380" y2={y} />
          ))}
        </g>

        {/* Far : bras diagonaux + fragments */}
        <g data-layer-far>
          {/* Bras ↖–↘ (axe 1) */}
          <line
            data-arm
            x1={ARMS[0].x} y1={ARMS[0].y}
            x2={ARMS[1].x} y2={ARMS[1].y}
            stroke="var(--color-border)"
            strokeWidth="1.25"
            strokeDasharray="220"
            strokeDashoffset="220"
          />
          {/* Bras ↗–↙ (axe 2) */}
          <line
            data-arm
            x1={ARMS[2].x} y1={ARMS[2].y}
            x2={ARMS[3].x} y2={ARMS[3].y}
            stroke="var(--color-border)"
            strokeWidth="1.25"
            strokeDasharray="220"
            strokeDashoffset="220"
          />
          {/* Cadre externe (square) — accent structurel */}
          <line data-arm x1="60" y1="60" x2="340" y2="60" stroke="var(--color-border)" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="220" strokeDashoffset="220" />
          <line data-arm x1="340" y1="60" x2="340" y2="340" stroke="var(--color-border)" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="220" strokeDashoffset="220" />
          <line data-arm x1="340" y1="340" x2="60" y2="340" stroke="var(--color-border)" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="220" strokeDashoffset="220" />
          <line data-arm x1="60" y1="340" x2="60" y2="60" stroke="var(--color-border)" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="220" strokeDashoffset="220" />

          {/* Modules d'interface */}
          {FRAGMENTS.map((f, i) => (
            <g key={i} data-frag transform={`translate(${f.x} ${f.y})`}>
              <rect
                width="42" height="28"
                rx="2"
                fill="var(--color-card)"
                stroke="var(--color-border)"
                strokeWidth="0.75"
              />
              <rect x="6" y="7" width="18" height="2" rx="1" fill="var(--color-text-muted)" opacity="0.5" />
              <rect x="6" y="13" width="30" height="1.5" rx="0.75" fill="var(--color-border)" />
              <rect x="6" y="18" width={i === 1 ? "22" : "14"} height="1.5" rx="0.75" fill="var(--color-border)" />
              <circle
                cx="36"
                cy="7"
                r="2"
                fill={i === 0 ? "var(--color-accent)" : "var(--color-border)"}
                opacity={i === 0 ? 0.85 : 1}
              />
            </g>
          ))}
        </g>

        {/* Near : nœuds d'extrémité + centre */}
        <g data-layer-near>
          {/* Nœuds aux extrémités des bras */}
          {ARMS.map((a, i) => (
            <rect
              key={i}
              data-node
              x={a.x - 3.5} y={a.y - 3.5}
              width="7" height="7"
              transform={`rotate(45 ${a.x} ${a.y})`}
              fill="var(--color-black)"
              stroke="var(--color-text-secondary)"
              strokeWidth="1.25"
            />
          ))}
          {/* Anneau pulse central */}
          <circle
            data-center-ring
            cx={CX} cy={CY}
            r="14"
            stroke="var(--color-accent)"
            strokeWidth="1"
            opacity="0.3"
          />
          {/* Intersection centrale (diamant accent) */}
          <g data-center>
            <rect
              x={CX - 8} y={CY - 8}
              width="16" height="16"
              transform={`rotate(45 ${CX} ${CY})`}
              fill="var(--color-black)"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
            />
            <circle cx={CX} cy={CY} r="3" fill="var(--color-accent)" />
          </g>
        </g>
      </svg>
    </div>
  );
}
