"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface ImmersiveBandProps {
  src: string;
  alt: string;
  /** Court énoncé centré (optionnel). */
  statement?: string;
  eyebrow?: string;
  className?: string;
}

/**
 * Bande plein-cadre cinématique (image + parallaxe) — rupture de rythme.
 * Image en fond, dégradé sombre pour la lisibilité, parallaxe Y légère au scroll.
 * Lazy (sous la ligne de flottaison), reduced-motion : pas de parallaxe.
 */
export function ImmersiveBand({
  src,
  alt,
  statement,
  eyebrow,
  className,
}: ImmersiveBandProps) {
  const root = useRef<HTMLElement>(null);
  const imgWrap = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = imgWrap.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        el,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label={statement ? undefined : alt}
      className={cn(
        "relative flex min-h-[52vh] items-center justify-center overflow-hidden border-y border-border bg-black md:min-h-[62vh]",
        className,
      )}
    >
      <div ref={imgWrap} className="absolute inset-0 scale-110">
        <Image
          src={src}
          alt={alt}
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover"
        />
      </div>
      {/* Dégradé de lisibilité */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"
      />

      {statement ? (
        <div className="container-site relative z-10 text-center">
          {eyebrow ? (
            <p className="mb-6 text-xs uppercase tracking-widest2 text-accent">
              {eyebrow}
            </p>
          ) : null}
          <p className="mx-auto max-w-3xl text-2xl font-light leading-snug tracking-tight text-text-primary md:text-4xl">
            {statement}
          </p>
        </div>
      ) : null}
    </section>
  );
}
