"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { EASE, AMPLITUDE } from "@/lib/motion/tokens";
import { usePointerMotion } from "@/hooks/usePointerMotion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Compass: 4 service nodes autour d'un nexus central
const CENTER = { x: 200, y: 200 };
const NODES = [
  { x: 200, y: 68  }, // 01 Création web
  { x: 332, y: 200 }, // 02 Branding
  { x: 200, y: 332 }, // 03 SEO
  { x: 68,  y: 200 }, // 04 Auto & IA
];
// Trajectoire de l'éclair : nexus → nord → est
const BOLT_PTS = `${CENTER.x},${CENTER.y} ${NODES[0].x},${NODES[0].y} ${NODES[1].x},${NODES[1].y}`;

/**
 * Scène SVG codée pour le hero Services — réseau de 4 expertises.
 * Langage graphique identique au Hero hybride : diamants, grille, accent doré.
 * Couches : far (grille + arêtes + éclair) / near (nœuds + nexus).
 */
export function ServicesHeroScene({ className }: { className?: string }) {
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
          [...q("[data-grid],[data-edge],[data-node],[data-nexus-ring],[data-bolt],[data-bolt-glow]")],
          { clearProps: "all" },
        );
        return;
      }

      // État initial
      gsap.set(q("[data-grid]"), { opacity: 0 });
      gsap.set(q("[data-edge]"), { strokeDashoffset: 160, strokeDasharray: 160 });
      gsap.set(q("[data-node]"), { scale: 0, opacity: 0, transformOrigin: "center" });
      gsap.set(q("[data-nexus-inner]"), { scale: 0, opacity: 0, transformOrigin: "center" });

      // Séquence d'entrée
      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(q("[data-grid]"), { opacity: 1, duration: 0.5, ease: "power2.inOut" })
        .to(q("[data-edge]"), { strokeDashoffset: 0, duration: 0.65, stagger: 0.1, ease: "power2.out" }, 0.3)
        .to(q("[data-nexus-inner]"), { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2.5)", transformOrigin: "center" }, 0.55)
        .to(q("[data-node]"), { scale: 1, opacity: 1, duration: 0.3, stagger: 0.08, ease: "back.out(2)", transformOrigin: "center" }, 0.72);

      // Boucle ambiante : éclair parcourant nexus → nord → est
      const light = svg.querySelector<SVGPolylineElement>("[data-bolt]");
      const glow = svg.querySelector<SVGPolylineElement>("[data-bolt-glow]");
      if (light) {
        const totalLen = light.getTotalLength();
        const boltLen = Math.round(totalLen * 0.32);
        const gapLen = totalLen - boltLen;
        const targets = [light, ...(glow ? [glow] : [])];
        gsap.set(targets, { strokeDasharray: `${boltLen} ${gapLen}`, strokeDashoffset: boltLen });
        gsap.to(targets, {
          strokeDashoffset: boltLen - totalLen,
          duration: 2.8,
          ease: "none",
          repeat: -1,
          delay: 1.3,
        });
      }

      // Pulse ring nexus
      gsap.to(svg.querySelector("[data-nexus-ring]"), {
        scale: 1.9,
        opacity: 0,
        duration: 2,
        ease: "power1.out",
        repeat: -1,
        repeatDelay: 1.8,
        transformOrigin: `${CENTER.x}px ${CENTER.y}px`,
        delay: 1.0,
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
        data-services-scene
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

        {/* Far : arêtes du réseau + éclair */}
        <g data-layer-far>
          {/* Arêtes : nexus → chaque nœud */}
          {NODES.map((n, i) => (
            <line
              key={i}
              data-edge
              x1={CENTER.x} y1={CENTER.y}
              x2={n.x} y2={n.y}
              stroke="var(--color-border)"
              strokeWidth="1.25"
              strokeDasharray="160"
              strokeDashoffset="160"
            />
          ))}
          {/* Arêtes périphériques (losange) — plus fines */}
          {NODES.map((n, i) => {
            const next = NODES[(i + 1) % NODES.length];
            return (
              <line
                key={`p${i}`}
                data-edge
                x1={n.x} y1={n.y}
                x2={next.x} y2={next.y}
                stroke="var(--color-border)"
                strokeWidth="0.75"
                strokeOpacity="0.45"
                strokeDasharray="160"
                strokeDashoffset="160"
              />
            );
          })}
          {/* Lueur de l'éclair */}
          <polyline
            data-bolt-glow
            points={BOLT_PTS}
            stroke="var(--color-accent)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.18"
          />
          {/* Trace de l'éclair */}
          <polyline
            data-bolt
            points={BOLT_PTS}
            stroke="var(--color-accent)"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Near : nœuds de service + nexus central */}
        <g data-layer-near>
          {/* Anneau pulse nexus */}
          <circle
            data-nexus-ring
            cx={CENTER.x}
            cy={CENTER.y}
            r="18"
            stroke="var(--color-accent)"
            strokeWidth="1"
            opacity="0.32"
          />
          {/* Nexus central (diamant accent) */}
          <g data-nexus-inner>
            <rect
              x={CENTER.x - 9} y={CENTER.y - 9}
              width="18" height="18"
              transform={`rotate(45 ${CENTER.x} ${CENTER.y})`}
              fill="var(--color-black)"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
            />
            <circle cx={CENTER.x} cy={CENTER.y} r="3.5" fill="var(--color-accent)" />
          </g>
          {/* Nœuds services — diamants terminaux */}
          {NODES.map((n, i) => (
            <rect
              key={i}
              data-node
              x={n.x - 4} y={n.y - 4}
              width="8" height="8"
              transform={`rotate(45 ${n.x} ${n.y})`}
              fill="var(--color-black)"
              stroke="var(--color-text-secondary)"
              strokeWidth="1.25"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
