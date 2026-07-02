"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

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
 * Scène hero codée « système en assemblage » (DA P2 — architecture invisible
 * en mouvement). SVG + GSAP (aucune lib ajoutée, aucun Canvas/WebGL).
 * - Markup = état final assemblé (contenu jamais masqué ; reduced-motion OK).
 * - Hors reduced-motion : la grille, les nœuds, les liens, les fragments, la
 *   ligne de lumière cuivrée et le monogramme N s'assemblent une fois, puis repos
 *   (aucune boucle permanente). Parallaxe pointeur subtile (desktop, transforms).
 * - Décorative : aria-hidden (le message vit dans le texte du hero).
 */
export function HeroScene({ className }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null);

  const lightPoints = LIGHT.map((i) => `${NODES[i].x},${NODES[i].y}`).join(" ");

  useGSAP(
    () => {
      const svg = root.current;
      if (!svg) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return; // markup déjà en état final

      const q = <T extends Element>(s: string) => Array.from(svg.querySelectorAll<T>(s));
      const grid = q("[data-grid]");
      const nodes = q("[data-node]");
      const links = q<SVGLineElement>("[data-link]");
      const frags = q("[data-frag]");
      const light = svg.querySelector<SVGPolylineElement>("[data-light]");
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
        gsap.set(light, { strokeDasharray: lightLen, strokeDashoffset: lightLen });
      }
      gsap.set(lightHead, { opacity: 0 });

      const tl = gsap.timeline();
      tl.to(grid, { opacity: 1, duration: 0.6, stagger: 0.03, ease: "power1.out" })
        .to(nodes, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.06, ease: "back.out(1.7)" }, 0.4)
        .to(links, { strokeDashoffset: 0, duration: 0.7, stagger: 0.05, ease: "power2.inOut" }, 0.7)
        .to(frags, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, 1.1)
        .to(light, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 1.2)
        .to(lightHead, { opacity: 1, duration: 0.3 }, 1.4);

      // Parallaxe pointeur subtile (desktop + pointeur fin uniquement)
      const canHover = window.matchMedia("(min-width:1024px) and (hover:hover)").matches;
      if (!canHover) return;
      const layerFar = svg.querySelector("[data-layer-far]");
      const layerNear = svg.querySelector("[data-layer-near]");
      let raf = 0;
      const onMove = (e: PointerEvent) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const r = svg.getBoundingClientRect();
          const dx = (e.clientX - r.left) / r.width - 0.5;
          const dy = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(layerFar, { x: dx * 10, y: dy * 10, duration: 0.6, ease: "power2.out" });
          gsap.to(layerNear, { x: dx * 22, y: dy * 22, duration: 0.6, ease: "power2.out" });
        });
      };
      const parent = svg.parentElement;
      parent?.addEventListener("pointermove", onMove);
      return () => {
        parent?.removeEventListener("pointermove", onMove);
        if (raf) cancelAnimationFrame(raf);
      };
    },
    { scope: root },
  );

  return (
    <svg
      ref={root}
      viewBox="0 0 500 500"
      className={cn("block h-full w-full", className)}
      aria-hidden="true"
      fill="none"
    >
      {/* Grille architecturale */}
      <g stroke="var(--color-border)" strokeWidth="1">
        {[83, 166, 249, 332, 415].map((x) => (
          <line key={`v${x}`} data-grid x1={x} y1="20" x2={x} y2="480" />
        ))}
        {[83, 166, 249, 332, 415].map((y) => (
          <line key={`h${y}`} data-grid x1="20" y1={y} x2="480" y2={y} />
        ))}
      </g>

      {/* Couche lointaine : liens */}
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

      {/* Fragments d'interface */}
      <g data-layer-far>
        {FRAGMENTS.map((f, i) => (
          <g key={i} data-frag transform={`translate(${f.x} ${f.y})`}>
            <rect width="44" height="30" rx="3" fill="var(--color-card)" stroke="var(--color-border)" />
            <rect x="6" y="7" width="24" height="3" rx="1.5" fill="var(--color-text-muted)" />
            <rect x="6" y="15" width="32" height="2.5" rx="1.25" fill="var(--color-border)" />
            <rect x="6" y="21" width="18" height="2.5" rx="1.25" fill="var(--color-border)" />
          </g>
        ))}
      </g>

      {/* Ligne de lumière cuivrée (trajectoire) */}
      <polyline
        data-light
        points={lightPoints}
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Couche proche : nœuds */}
      <g data-layer-near>
        {NODES.map((n, i) => (
          <circle
            key={i}
            data-node
            cx={n.x}
            cy={n.y}
            r="4.5"
            fill="var(--color-black)"
            stroke="var(--color-text-secondary)"
            strokeWidth="1.5"
          />
        ))}
        {/* tête lumineuse en bout de trajectoire */}
        <circle
          data-light-head
          cx={NODES[LIGHT[LIGHT.length - 1]].x}
          cy={NODES[LIGHT[LIGHT.length - 1]].y}
          r="5"
          fill="var(--color-accent)"
        />
      </g>
    </svg>
  );
}
