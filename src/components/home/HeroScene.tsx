"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { EASE, AMPLITUDE } from "@/lib/motion/tokens";
import { usePointerMotion } from "@/hooks/usePointerMotion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Coordonnées DÉTERMINISTES (aucun Math.random → hydratation SSR stable).
const NODES = [
  { x: 92, y: 116 },
  { x: 210, y: 74 },
  { x: 342, y: 132 },
  { x: 150, y: 224 },
  { x: 286, y: 250 },
  { x: 404, y: 300 },
  { x: 112, y: 344 },
  { x: 250, y: 392 },
  { x: 372, y: 418 },
];
const LINKS: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [3, 4], [4, 2],
  [4, 5], [3, 6], [6, 7], [7, 8], [8, 5],
];
// Trajectoire de lumière (chemin dans le système).
const LIGHT = [0, 3, 4, 7, 8, 5];
const FRAGMENTS = [
  { x: 300, y: 96 },
  { x: 60, y: 270 },
  { x: 320, y: 350 },
];

/**
 * Scène hero codée « architecture en mouvement » (DA P2).
 * SVG + GSAP — aucune lib ajoutée, aucun Canvas/WebGL.
 * - Markup = état final assemblé → lisible sans JS, reduced-motion OK.
 * - Hors reduced-motion : assemblage en 1,8 s (grille → terminaux → liens →
 *   modules → impulsion lumineuse), puis repos.
 * - Parallaxe pointeur via usePointerMotion (desktop + pointeur fin uniquement).
 * - Décoratif : aria-hidden (le message vit dans le texte du hero).
 */
export function HeroScene({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();

  const lightPoints = LIGHT.map((i) => `${NODES[i].x},${NODES[i].y}`).join(" ");

  // Parallaxe pointeur sur les couches lointaine et proche.
  usePointerMotion(
    containerRef,
    (nx, ny) => {
      const svg = svgRef.current;
      if (!svg) return;
      const far = svg.querySelector("[data-layer-far]");
      const near = svg.querySelector("[data-layer-near]");
      gsap.to(far, { x: nx * AMPLITUDE.pointerFar, y: ny * AMPLITUDE.pointerFar, duration: 0.6, ease: EASE.standard });
      gsap.to(near, { x: nx * AMPLITUDE.pointerNear, y: ny * AMPLITUDE.pointerNear, duration: 0.6, ease: EASE.standard });
    },
    { disabled: reduced },
  );

  useGSAP(
    () => {
      const svg = svgRef.current;
      if (!svg) return;

      const q = <T extends Element>(s: string) => Array.from(svg.querySelectorAll<T>(s));

      if (reduced) {
        // Garantit l'état final visible si reduced-motion s'active après le montage.
        gsap.set([...q("[data-grid],[data-node],[data-frag],[data-light],[data-light-glow],[data-light-head]")], { clearProps: "all" });
        gsap.set(q<SVGLineElement>("[data-link]"), { strokeDasharray: "none", strokeDashoffset: "0" });
        return;
      }

      const grid = q("[data-grid]");
      const nodes = q("[data-node]");
      const links = q<SVGLineElement>("[data-link]");
      const frags = q("[data-frag]");
      const light = svg.querySelector<SVGPolylineElement>("[data-light]");
      const lightGlow = svg.querySelector<SVGPolylineElement>("[data-light-glow]");
      const lightHead = svg.querySelector("[data-light-head]");

      // État initial (pré-assemblage)
      gsap.set(grid, { opacity: 0 });
      gsap.set(nodes, { transformOrigin: "center", scale: 0, opacity: 0 });
      gsap.set(frags, { opacity: 0, y: 8 });
      links.forEach((l) => {
        const len = l.getTotalLength();
        gsap.set(l, { strokeDasharray: len, strokeDashoffset: len });
      });
      let lightLen = 0;
      if (light) {
        lightLen = light.getTotalLength();
        gsap.set([light, lightGlow], { strokeDasharray: lightLen, strokeDashoffset: lightLen });
      }
      gsap.set(lightHead, { opacity: 0, scale: 0, transformOrigin: "center" });

      // Séquence d'assemblage (1,8 s)
      const tl = gsap.timeline();
      tl.to(grid, { opacity: 1, duration: 0.55, stagger: 0.025, ease: "power1.out" })
        .to(nodes, { scale: 1, opacity: 1, duration: 0.42, stagger: 0.052, ease: "back.out(1.4)" }, 0.4)
        .to(links, { strokeDashoffset: 0, duration: 0.62, stagger: 0.038, ease: "power2.inOut" }, 0.65)
        .to(frags, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, 1.05)
        .to([light, lightGlow], { strokeDashoffset: 0, duration: 1.0, ease: "power2.inOut" }, 1.15)
        .to(lightHead, { opacity: 1, scale: 1, duration: 0.28 }, 1.5);
    },
    { scope: svgRef, dependencies: [reduced] },
  );

  return (
    <div ref={containerRef} className={cn("relative h-full w-full", className)}>
      <svg
        ref={svgRef}
        viewBox="0 0 500 500"
        className="block h-full w-full"
        aria-hidden="true"
        fill="none"
      >
        {/* Grille architecturale */}
        <g stroke="var(--color-border)" strokeWidth="0.75">
          {[83, 166, 249, 332, 415].map((x) => (
            <line key={`v${x}`} data-grid x1={x} y1="20" x2={x} y2="480" />
          ))}
          {[83, 166, 249, 332, 415].map((y) => (
            <line key={`h${y}`} data-grid x1="20" y1={y} x2="480" y2={y} />
          ))}
        </g>

        {/* Couche lointaine : liens de connexion */}
        <g data-layer-far stroke="var(--color-border)" strokeWidth="1.25">
          {LINKS.map(([a, b], i) => (
            <line
              key={i}
              data-link
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
            />
          ))}
        </g>

        {/* Couche lointaine : modules système */}
        <g data-layer-far>
          {FRAGMENTS.map((f, i) => (
            <g key={i} data-frag transform={`translate(${f.x} ${f.y})`}>
              <rect width="44" height="30" rx="2" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="0.75" />
              <rect x="6" y="7" width="20" height="2.5" rx="1.25" fill="var(--color-text-muted)" opacity="0.55" />
              <rect x="6" y="13" width="32" height="1.75" rx="0.875" fill="var(--color-border)" />
              <rect x="6" y="19" width={i === 1 ? "24" : "16"} height="1.75" rx="0.875" fill="var(--color-border)" />
              {/* Indicateur d'état */}
              <circle cx="38" cy="8" r="2" fill={i === 0 ? "var(--color-accent)" : "var(--color-border)"} opacity={i === 0 ? 0.85 : 1} />
            </g>
          ))}
        </g>

        {/* Lueur de l'impulsion lumineuse (large, faible opacité) */}
        <polyline
          data-light-glow
          points={lightPoints}
          stroke="var(--color-accent)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.18"
        />

        {/* Trace lumineuse cuivrée (fine, précise) */}
        <polyline
          data-light
          points={lightPoints}
          stroke="var(--color-accent)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Couche proche : terminaux (losanges) */}
        <g data-layer-near>
          {NODES.map((n, i) => (
            <rect
              key={i}
              data-node
              x={n.x - 3.5}
              y={n.y - 3.5}
              width="7"
              height="7"
              transform={`rotate(45 ${n.x} ${n.y})`}
              fill="var(--color-black)"
              stroke="var(--color-text-secondary)"
              strokeWidth="1.25"
            />
          ))}
          {/* Terminal actif en bout de trajectoire */}
          <circle
            data-light-head
            cx={NODES[LIGHT[LIGHT.length - 1]].x}
            cy={NODES[LIGHT[LIGHT.length - 1]].y}
            r="4.5"
            fill="var(--color-accent)"
          />
        </g>
      </svg>
    </div>
  );
}
