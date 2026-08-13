"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { BRAND_TAGLINE } from "@/data/navigation";
import { heroProgress } from "@/components/home/hero/progress";
import { HeroErrorBoundary } from "@/components/home/hero/HeroErrorBoundary";
import { HeroLoader } from "@/components/home/hero/HeroLoader";

const HeroScene = dynamic(
  () => import("@/components/home/hero/HeroScene").then((m) => m.HeroScene),
  { ssr: false },
);

const MOBILE_BREAKPOINT_PX = 1024; // le GLB (137 Mo) ne charge qu'à partir de ce seuil

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

function hasSaveDataOrSlowConnection(): boolean {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const conn = nav.connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  // Uniquement 2G réel : le seuil desktop (>=1024px) filtre déjà le mobile.
  // "3g" produit trop de faux positifs sur desktop (Wi-Fi/4G mal classés).
  return conn.effectiveType === "slow-2g" || conn.effectiveType === "2g";
}

/** Poster statique — utilisé tant qu'aucune capture réelle n'a été fournie. */
function HeroPoster() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#1a1712_0%,#0a0908_55%,#060607_100%)]"
    />
  );
}

/**
 * Hero d'accueil — ville Manhattan / Fold (bake Blender) pilotée au scroll.
 *
 * Conteneur 400vh + zone sticky 100vh : le scroll à travers les 400vh mappe
 * linéairement sur heroProgress (0→1), lu directement par la scène R3F
 * (City : mixer.setTime + caméra). Lenis↔ScrollTrigger déjà synchronisé
 * globalement (SmoothScroll), donc scrub natif sans proxy supplémentaire.
 *
 * La scène 3D (137 Mo) ne charge que desktop + sans prefers-reduced-motion +
 * sans Save-Data/connexion lente + WebGL disponible. Sinon : poster statique,
 * texte/CTA toujours utilisables, page toujours navigable.
 *
 * Les textes restent du vrai DOM en overlay (SEO / a11y), jamais dans le canvas.
 */
export function HomeHero() {
  const [mount3D, setMount3D] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const isDesktopWidth = window.innerWidth >= MOBILE_BREAKPOINT_PX;
    const eligible =
      !reduced && isDesktopWidth && webglAvailable() && !hasSaveDataOrSlowConnection();
    setMount3D(eligible);
  }, [reduced]);

  useGSAP(
    () => {
      if (!mount3D) return;
      const section = sectionRef.current;
      if (!section) return;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          heroProgress.value = self.progress;
        },
      });
    },
    { scope: sectionRef, dependencies: [mount3D] },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="NEXCY — Precision in Motion"
      className="relative w-full bg-[#080808]"
      style={{ height: mount3D ? "400vh" : "100svh" }}
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* Scène 3D (décorative) ou poster statique selon éligibilité */}
        <div className="absolute inset-0" aria-hidden="true">
          {mount3D ? (
            <HeroErrorBoundary fallback={<HeroPoster />}>
              <HeroScene />
            </HeroErrorBoundary>
          ) : (
            <HeroPoster />
          )}
        </div>

        {mount3D ? <HeroLoader /> : null}

        {/* Overlay texte (DOM) — bloc titre bas-gauche */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="container-site flex h-full flex-col justify-end pb-16 lg:pb-24">
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-[#99958F]">
              {BRAND_TAGLINE}
            </p>
            <h1 className="text-[clamp(3rem,9vw,9rem)] font-medium leading-[0.92] tracking-[-0.02em] text-[#F4F1EB]">
              NEXCY
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
