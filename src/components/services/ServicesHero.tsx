"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ServicesHeroScene } from "@/components/services/ServicesHeroScene";

/**
 * Hero de la page Services — composition éditoriale en deux parties :
 * H1 pleine largeur (révélation mot à mot), puis colonne texte + scène réseau (desktop).
 *
 * Chorégraphie d'entrée :
 *   0.10 s → mots H1 (yPercent 110→0, stagger)
 *   0.40 s → description + scène (autoAlpha)
 * prefers-reduced-motion : tout visible immédiatement.
 */
export function ServicesHero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const words = Array.from(scope.querySelectorAll<HTMLElement>("[data-sh-word]"));
      const below = scope.querySelector("[data-sh-below]");
      const scene = scope.querySelector("[data-sh-scene]");

      if (reduce) {
        gsap.set(words, { yPercent: 0 });
        gsap.set([below, scene], { autoAlpha: 1 });
        return;
      }

      gsap.set(words, { yPercent: 110, willChange: "transform" });
      gsap.set([below, scene], { autoAlpha: 0 });

      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(words, {
        yPercent: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.07,
        onComplete: () => gsap.set(words, { willChange: "auto" }),
      })
        .to(below, { autoAlpha: 1, duration: 0.7, ease: "power2.out" }, 0.4)
        .to(scene, { autoAlpha: 1, duration: 0.9, ease: "power2.out" }, 0.45);
    },
    { scope: root },
  );

  const H1 = "Nos expertises.";

  return (
    <section
      ref={root}
      aria-labelledby="services-hero-title"
      className="relative overflow-hidden border-b border-border bg-black pb-16 pt-40 md:pb-24 md:pt-48"
    >
      <div className="container-site relative z-10">
        <SectionLabel label="01 / Expertises" />

        {/* H1 pleine largeur */}
        <h1
          id="services-hero-title"
          className="mt-8 font-bold leading-[1.02] tracking-tight text-text-primary"
        >
          <span className="block text-5xl md:text-7xl">
            {H1.split(" ").map((w, i, arr) => (
              <span
                key={i}
                className="inline-block overflow-hidden align-bottom"
                style={{
                  marginRight: i < arr.length - 1 ? "0.24em" : undefined,
                  paddingBottom: "0.1em",
                  marginBottom: "-0.1em",
                }}
              >
                <span data-sh-word className="inline-block">
                  {w}
                </span>
              </span>
            ))}
          </span>
        </h1>

        {/* Zone sous le titre : description + scène */}
        <div
          data-sh-below
          className="mt-12 grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-center lg:gap-16"
        >
          <p className="max-w-2xl text-lg leading-relaxed text-text-secondary">
            De la création de sites web sur mesure au branding, au SEO et à
            l&apos;automatisation &amp; IA : cinq domaines, une même exigence —
            concevoir des systèmes digitaux qui performent dans la durée.
          </p>

          {/* Scène réseau — desktop uniquement */}
          <div
            data-sh-scene
            aria-hidden="true"
            className="hidden aspect-square overflow-hidden rounded-card border border-border lg:block"
          >
            <ServicesHeroScene />
          </div>
        </div>
      </div>
    </section>
  );
}
