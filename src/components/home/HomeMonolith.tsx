"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/animations/TextReveal";

const MonolithCanvas = dynamic(
  () => import("@/components/home/MonolithCanvas").then((m) => m.MonolithCanvas),
  { ssr: false },
);

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Section « Precision in Motion » — remplace l'ancienne bande abstraite.
 *
 * Desktop, hors reduced-motion et si WebGL est disponible → monolithe 3D piloté
 * au scroll (MonolithCanvas, monté uniquement à l'approche du viewport).
 * Sinon → fallback statique (halo cuivré + silhouette) : jamais d'écran vide,
 * jamais de contenu bloqué en opacity:0.
 */
export function HomeMonolith() {
  const sectionRef = useRef<HTMLElement>(null);
  const [canRender3D, setCanRender3D] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    setCanRender3D(desktop && !reduced && webglAvailable());
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const mount3D = canRender3D && inView;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-monolith-title"
      className="relative flex min-h-[80vh] items-center overflow-hidden border-y border-border bg-black lg:min-h-[92vh]"
    >
      {/* Zone visuelle — moitié droite en desktop, plein cadre en mobile */}
      <div className="absolute inset-0 lg:left-[40%]" aria-hidden="true">
        {/* Fallback statique : halo cuivré + silhouette de monolithe */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 62% 50%, rgba(200,136,58,0.18) 0%, rgba(200,136,58,0.06) 35%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[52%] w-[14%] min-w-[70px] -translate-x-1/2 -translate-y-1/2 rounded-[6px]"
          style={{
            background:
              "linear-gradient(105deg, #101010 0%, #1c1c1c 45%, #2a2a2a 55%, #121212 100%)",
            boxShadow:
              "0 40px 120px rgba(0,0,0,0.6), inset -2px 0 0 rgba(228,168,91,0.35)",
          }}
        />
        {/* Monolithe 3D — recouvre le fallback quand disponible */}
        {mount3D ? <MonolithCanvas triggerRef={sectionRef} /> : null}
      </div>

      {/* Voile de lisibilité côté texte (desktop) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(to right, #0a0a0a 0%, rgba(10,10,10,0.75) 32%, transparent 55%)",
        }}
      />
      {/* Voile bas (mobile) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, transparent 40%, rgba(10,10,10,0.85) 100%)",
        }}
      />

      {/* Énoncé */}
      <div className="container-site relative z-10">
        <div className="max-w-xl">
          <SectionLabel label="Precision in Motion" />
          <TextReveal
            as="h2"
            id="home-monolith-title"
            className="mt-6 text-[clamp(2.2rem,4.5vw,4.5rem)] font-bold leading-[0.95] tracking-tight text-text-primary"
          >
            La précision, faite matière.
          </TextReveal>
          <p className="mt-7 max-w-md text-base leading-relaxed text-text-secondary lg:text-lg">
            Chaque système que nous concevons est taillé, poli, ajusté — jusqu&apos;à
            ce qu&apos;il ne reste que l&apos;essentiel. Une exigence unique, tenue de
            la première ligne au lancement.
          </p>
        </div>
      </div>
    </section>
  );
}
