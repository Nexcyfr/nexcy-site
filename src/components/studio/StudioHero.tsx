"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StudioScene } from "@/components/studio/StudioScene";

/**
 * Hero de la page Studio — composition 2-colonnes : texte (gauche) + scène (droite).
 * La scène représente l'architecture en tension (précision × mouvement).
 *
 * Chorégraphie d'entrée :
 *   0.10 s → mots H1 (yPercent 110→0, stagger)
 *   0.30 s → scène (autoAlpha + scale 1.03→1)
 *   0.55 s → description (autoAlpha)
 * prefers-reduced-motion : tout visible immédiatement.
 */
export function StudioHero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const words = Array.from(scope.querySelectorAll<HTMLElement>("[data-sth-word]"));
      const scene = scope.querySelector("[data-sth-scene]");
      const desc = scope.querySelector("[data-sth-desc]");

      if (reduce) {
        gsap.set(words, { yPercent: 0 });
        gsap.set([scene, desc], { autoAlpha: 1, scale: 1 });
        return;
      }

      gsap.set(words, { yPercent: 110, willChange: "transform" });
      gsap.set(scene, { autoAlpha: 0, scale: 1.03 });
      gsap.set(desc, { autoAlpha: 0 });

      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(words, {
        yPercent: 0,
        duration: 0.78,
        ease: "power3.out",
        stagger: 0.07,
        onComplete: () => gsap.set(words, { willChange: "auto" }),
      })
        .to(scene, { autoAlpha: 1, scale: 1, duration: 1.0, ease: "power2.out" }, 0.3)
        .to(desc, { autoAlpha: 1, duration: 0.7, ease: "power2.out" }, 0.55);
    },
    { scope: root },
  );

  const H1 = "Une agence conçue pour l'exigence.";

  return (
    <section
      ref={root}
      aria-labelledby="studio-hero-title"
      className="relative overflow-hidden border-b border-border bg-black pb-16 pt-40 md:pb-24 md:pt-48"
    >
      <div className="container-site relative z-10">
        <SectionLabel label="02 / Studio" />

        <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          {/* Colonne gauche : texte */}
          <div>
            <h1
              id="studio-hero-title"
              className="font-bold leading-[1.02] tracking-tight text-text-primary"
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
                    <span data-sth-word className="inline-block">
                      {w}
                    </span>
                  </span>
                ))}
              </span>
            </h1>
            <p
              data-sth-desc
              className="mt-8 max-w-xl text-lg leading-relaxed text-text-secondary"
            >
              NEXCY est née d&apos;un constat simple : le marché digital français
              manque d&apos;agences capables de combiner la précision technique, la
              rigueur stratégique et une exigence esthétique de premier plan.
            </p>
          </div>

          {/* Colonne droite : scène architecturale — desktop uniquement */}
          <div
            data-sth-scene
            aria-hidden="true"
            className="hidden aspect-square overflow-hidden rounded-card border border-border lg:block"
          >
            <StudioScene />
          </div>
        </div>
      </div>
    </section>
  );
}
