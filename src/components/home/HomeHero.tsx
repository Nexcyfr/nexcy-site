"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { HeroScene } from "@/components/home/HeroScene";
import { HeroMedia } from "@/components/home/HeroMedia";
import { BRAND_TAGLINE } from "@/data/navigation";

const H1_LINE_1 = "Systèmes digitaux";
const H1_LINE_2 = "conçus avec précision.";

/**
 * Hero d'accueil hybride (Lot 3 — quatre couches).
 *
 * Architecture visuelle (colonne droite) :
 *   1. HeroScene  — scène SVG codée, toujours présente (fallback + reduced-motion)
 *   2. HeroMedia  — boucle vidéo ambiante, desktop + pointeur fin uniquement
 *   3. Vignette   — dégradé atmosphérique bas (CSS, pointer-events none)
 *
 * Chorégraphie d'entrée :
 *   0.15 s → mots H1 (yPercent 110→0, stagger)
 *   0.20 s → colonne visuelle (autoAlpha + scale)
 *   0.50 s → tagline
 *   0.70 s → description
 *   0.80 s → ligne dorée (scaleX)
 *   0.95 s → CTA
 *   1.20 s → indicateur scroll
 *
 * Scroll : légère parallaxe yPercent sur le visuel (desktop uniquement).
 * prefers-reduced-motion : tout visible immédiatement, aucune parallaxe.
 */
export function HomeHero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const words = gsap.utils.toArray<HTMLElement>("[data-hero-word]", scope);
      const tagline = scope.querySelector("[data-hero-tagline]");
      const desc = scope.querySelector("[data-hero-desc]");
      const line = scope.querySelector("[data-hero-line]");
      const ctas = scope.querySelector("[data-hero-ctas]");
      const hint = scope.querySelector("[data-hero-hint]");
      const visual = scope.querySelector("[data-hero-visual]");

      if (reduce) {
        gsap.set(words, { yPercent: 0 });
        gsap.set([tagline, desc, ctas, visual, hint], { autoAlpha: 1, y: 0, scale: 1 });
        gsap.set(line, { scaleX: 1 });
        return;
      }

      // État initial
      gsap.set(words, { yPercent: 110, willChange: "transform" });
      gsap.set([tagline, desc, ctas], { autoAlpha: 0, y: 20 });
      gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(visual, { autoAlpha: 0, scale: 1.04 });
      gsap.set(hint, { autoAlpha: 0 });

      // Séquence d'entrée
      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(words, {
        yPercent: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.09,
        onComplete: () => gsap.set(words, { willChange: "auto" }),
      })
        .to(visual, { autoAlpha: 1, scale: 1, duration: 1.1, ease: "power2.out" }, 0.2)
        .to(tagline, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.5)
        .to(desc, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.7)
        .to(line, { scaleX: 1, duration: 0.8, ease: "power3.inOut" }, 0.8)
        .to(ctas, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.95)
        .to(hint, { autoAlpha: 1, duration: 0.6 }, 1.2);

      // Parallaxe subtile au scroll (desktop uniquement)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.to(visual, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: true },
        });
      });

      ScrollTrigger.refresh();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-black"
    >
      <div className="container-site relative z-10 grid w-full items-center gap-12 pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:pt-0">
        {/* Colonne texte */}
        <div className="max-w-2xl">
          <h1 className="font-bold leading-[0.98] tracking-tight text-text-primary">
            <span className="block text-5xl sm:text-6xl lg:text-8xl">
              {H1_LINE_1.split(" ").map((w, i, arr) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden align-bottom"
                  style={{
                    marginRight: i < arr.length - 1 ? "0.24em" : undefined,
                    paddingBottom: "0.1em",
                    marginBottom: "-0.1em",
                  }}
                >
                  <span data-hero-word className="inline-block">
                    {w}
                  </span>
                </span>
              ))}
            </span>
            <span className="block text-5xl sm:text-6xl lg:text-8xl">
              {H1_LINE_2.split(" ").map((w, i, arr) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden align-bottom"
                  style={{
                    marginRight: i < arr.length - 1 ? "0.24em" : undefined,
                    paddingBottom: "0.1em",
                    marginBottom: "-0.1em",
                  }}
                >
                  <span data-hero-word className="inline-block">
                    {w}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <p
            data-hero-tagline
            className="mt-8 text-sm font-light uppercase tracking-widest2 text-accent"
          >
            {BRAND_TAGLINE}
          </p>

          <p
            data-hero-desc
            className="mt-6 max-w-[480px] text-lg leading-relaxed text-text-secondary"
          >
            Nous concevons des sites web, des identités visuelles et des systèmes
            d&apos;automatisation pour les entreprises qui refusent le compromis.
          </p>

          <span
            data-hero-line
            aria-hidden="true"
            className="mt-8 block h-px w-24 bg-accent"
          />

          <div data-hero-ctas className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact" variant="primary">
              Démarrer un projet
            </Button>
            <Button href="/services" variant="secondary">
              Découvrir nos services
            </Button>
          </div>
        </div>

        {/* Colonne visuelle — quatre couches empilées */}
        <div
          data-hero-visual
          className="relative hidden aspect-square w-full overflow-hidden rounded-card border border-border lg:block"
        >
          {/* Couche 2 : scène codée (toujours présente, fallback + reduced-motion) */}
          <div className="absolute inset-0">
            <HeroScene />
          </div>

          {/* Couche 3 : boucle vidéo ambiante (desktop + pointeur fin uniquement) */}
          <HeroMedia
            mp4="/assets/video/hero.mp4"
            webm="/assets/video/hero.webm"
            poster="/assets/posters/hero-poster.avif"
            priority
          />

          {/* Couche 4 : vignette atmosphérique bas de cadre */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/35"
          />
        </div>
      </div>

      {/* Indicateur de scroll */}
      <div
        data-hero-hint
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center text-text-muted"
      >
        <span className="h-8 w-px bg-border" />
        <svg
          viewBox="0 0 16 10"
          className="mt-1 h-2.5 w-4 animate-bounce text-text-muted"
          fill="none"
        >
          <path
            d="M2 2l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
