"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

// Même positions déterministes que HeroScene (cohérence visuelle).
const NODES = [
  { x: 92, y: 116 }, { x: 210, y: 74 }, { x: 342, y: 132 },
  { x: 150, y: 224 }, { x: 286, y: 250 }, { x: 404, y: 300 },
  { x: 112, y: 344 }, { x: 250, y: 392 }, { x: 372, y: 418 },
];
const LINKS: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [3, 4], [4, 2],
  [4, 5], [3, 6], [6, 7], [7, 8], [8, 5],
];
const LIGHT = [0, 3, 4, 7, 8, 5];
const FRAGMENTS = [
  { x: 300, y: 96 }, { x: 60, y: 270 }, { x: 320, y: 350 },
];

declare global {
  interface Window {
    __sceneReady?: boolean;
    __seek?: (p: number) => void;
  }
}

/**
 * Cible de rendu du hero — DEV uniquement (jamais publique, §8 Lot 1).
 *
 * Pipeline : render-scene.mjs attend `window.__sceneReady === true`, puis
 * appelle `window.__seek(p)` (p ∈ [0,1]) pour capturer chaque frame.
 *
 * La scène est en état final assemblé. L'animation de rendu est une boucle
 * ambiante : un éclair doré (30 % du chemin) parcourt la trajectoire en un
 * cycle parfait (dashOffset 0 → −lightLen → retour au départ = seamless).
 */
export function HeroRenderTarget() {
  const svgRef = useRef<SVGSVGElement>(null);

  const lightPoints = LIGHT.map((i) => `${NODES[i].x},${NODES[i].y}`).join(" ");

  useGSAP(
    () => {
      window.__sceneReady = false;
      window.__seek = undefined;

      const svg = svgRef.current;
      if (!svg) return;

      const q = (s: string) => Array.from(svg.querySelectorAll(s));

      // État final assemblé (tous les éléments visibles)
      gsap.set(q("[data-grid]"), { opacity: 1 });
      gsap.set(q("[data-node]"), { scale: 1, opacity: 1, transformOrigin: "center" });
      gsap.set(q("[data-link]"), { strokeDasharray: "none", strokeDashoffset: "0" });
      gsap.set(q("[data-frag]"), { opacity: 1, y: 0 });
      gsap.set(svg.querySelector("[data-light-head]"), { opacity: 1, scale: 1, transformOrigin: "center" });

      // Boucle ambiante : éclair parcourant la trajectoire (seamless)
      const light = svg.querySelector<SVGPolylineElement>("[data-light]");
      const lightGlow = svg.querySelector<SVGPolylineElement>("[data-light-glow]");
      if (!light) return;

      const totalLen = light.getTotalLength();
      const boltLen = Math.round(totalLen * 0.3);   // 30 % = longueur de l'éclair
      const gapLen = totalLen - boltLen;             // 70 % = espace (total = 1 cycle)

      // dashOffset boltLen → boltLen - totalLen : l'éclair progresse du début à la fin
      // puis revient au départ (identique à offset=boltLen) → boucle parfaite
      gsap.set([light, lightGlow], {
        strokeDasharray: `${boltLen} ${gapLen}`,
        strokeDashoffset: boltLen,
      });

      const tl = gsap.timeline({ paused: true });
      tl.to([light, lightGlow], {
        strokeDashoffset: boltLen - totalLen,
        duration: 1,
        ease: "none",
      });

      window.__seek = (p: number) => tl.progress(Math.max(0, Math.min(1, p)));
      window.__sceneReady = true;

      return () => {
        window.__sceneReady = false;
        window.__seek = undefined;
      };
    },
    { scope: svgRef },
  );

  return (
    <main
      className="fixed inset-0 flex items-center justify-center bg-black"
      aria-hidden="true"
    >
      <div className="aspect-square h-full max-h-screen w-full max-w-screen-sm">
        <svg
          ref={svgRef}
          viewBox="0 0 500 500"
          className="h-full w-full"
          fill="none"
        >
          {/* Grille */}
          <g stroke="var(--color-border)" strokeWidth="0.75">
            {[83, 166, 249, 332, 415].map((x) => (
              <line key={`v${x}`} data-grid x1={x} y1="20" x2={x} y2="480" />
            ))}
            {[83, 166, 249, 332, 415].map((y) => (
              <line key={`h${y}`} data-grid x1="20" y1={y} x2="480" y2={y} />
            ))}
          </g>

          {/* Liens */}
          <g data-layer-far stroke="var(--color-border)" strokeWidth="1.25">
            {LINKS.map(([a, b], i) => (
              <line key={i} data-link
                x1={NODES[a].x} y1={NODES[a].y}
                x2={NODES[b].x} y2={NODES[b].y}
              />
            ))}
          </g>

          {/* Modules */}
          <g data-layer-far>
            {FRAGMENTS.map((f, i) => (
              <g key={i} data-frag transform={`translate(${f.x} ${f.y})`}>
                <rect width="44" height="30" rx="2" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="0.75" />
                <rect x="6" y="7" width="20" height="2.5" rx="1.25" fill="var(--color-text-muted)" opacity="0.55" />
                <rect x="6" y="13" width="32" height="1.75" rx="0.875" fill="var(--color-border)" />
                <rect x="6" y="19" width={i === 1 ? "24" : "16"} height="1.75" rx="0.875" fill="var(--color-border)" />
                <circle cx="38" cy="8" r="2" fill={i === 0 ? "var(--color-accent)" : "var(--color-border)"} opacity={i === 0 ? 0.85 : 1} />
              </g>
            ))}
          </g>

          {/* Lueur */}
          <polyline
            data-light-glow
            points={lightPoints}
            stroke="var(--color-accent)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.18"
          />

          {/* Trace */}
          <polyline
            data-light
            points={lightPoints}
            stroke="var(--color-accent)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Terminaux */}
          <g data-layer-near>
            {NODES.map((n, i) => (
              <rect key={i} data-node
                x={n.x - 3.5} y={n.y - 3.5}
                width="7" height="7"
                transform={`rotate(45 ${n.x} ${n.y})`}
                fill="var(--color-black)"
                stroke="var(--color-text-secondary)"
                strokeWidth="1.25"
              />
            ))}
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
    </main>
  );
}
