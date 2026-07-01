"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { Button } from "@/components/ui/Button";
import { WatermarkN } from "@/components/ui/WatermarkN";
import { HeroVisual } from "@/components/home/HeroVisual";
import { BRAND_TAGLINE } from "@/data/navigation";

const H1_LINE_1 = "Systèmes digitaux";
const H1_LINE_2 = "d'un niveau rare.";

/**
 * Hero d'accueil (Master Brief §13 / §46).
 * - Révélation séquentielle AU CHARGEMENT (message visible en < 2 s) : H1 mot par
 *   mot → tagline → description → ligne dorée → CTA. Sert le « message dans les
 *   3 premières secondes » et la règle premium « animation au load ».
 * - Le mouvement lié au scroll (esprit « Precision in Motion ») est préservé par
 *   une parallaxe subtile sur le visuel et le filigrane (transform/opacity, GPU).
 * - prefers-reduced-motion : tout est visible immédiatement, aucune parallaxe.
 */
export function HomeHero() {
  const root = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const words = gsap.utils.toArray<HTMLElement>("[data-hero-word]");
      const tagline = scope.querySelector("[data-hero-tagline]");
      const desc = scope.querySelector("[data-hero-desc]");
      const line = scope.querySelector("[data-hero-line]");
      const ctas = scope.querySelector("[data-hero-ctas]");
      const hint = scope.querySelector("[data-hero-hint]");
      const visual = scope.querySelector("[data-hero-visual]");
      const watermark = scope.querySelector("[data-hero-watermark]");

      if (reduce) {
        gsap.set([...words], { yPercent: 0 });
        gsap.set([tagline, desc, ctas, visual, hint], { autoAlpha: 1, y: 0, scale: 1 });
        gsap.set(line, { scaleX: 1 });
        return;
      }

      // État initial
      gsap.set(words, { yPercent: 110, willChange: "transform" });
      gsap.set([tagline, desc, ctas], { autoAlpha: 0, y: 20 });
      gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(visual, { autoAlpha: 0, scale: 1.05 });
      gsap.set(hint, { autoAlpha: 0 });

      // Séquence d'entrée — construite en pause, jouée au bon moment
      // (à la disparition du préloader en 1re visite, sinon immédiatement).
      const tl = gsap.timeline({ paused: true });
      timelineRef.current = tl;
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

      // Parallaxe subtile au scroll (uniquement desktop, sans reduced-motion)
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.to(visual, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(watermark, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: scope, start: "top top", end: "bottom top", scrub: true },
        });
      });

      ScrollTrigger.refresh();
    },
    { scope: root },
  );

  // Déclenche l'entrée du hero au bon moment (Master Brief §46) :
  // - 1re visite : à la fin du préloader (évènement « nexcy:preloader-done ») ;
  // - visites suivantes (flag présent) : immédiatement ;
  // - filet de sécurité : jouée après 3 s si aucun signal n'arrive.
  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return; // reduced-motion : contenu déjà visible, rien à jouer
    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      tl.play(0);
    };
    if (sessionStorage.getItem("nexcy-loaded")) {
      play();
    } else {
      window.addEventListener("nexcy:preloader-done", play, { once: true });
    }
    const fallback = window.setTimeout(play, 3000);
    return () => {
      window.removeEventListener("nexcy:preloader-done", play);
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <section
      ref={root}
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-black"
    >
      <div
        data-hero-watermark
        className="pointer-events-none absolute right-[-6%] top-1/2 h-[120%] w-[70%] -translate-y-1/2 lg:right-[2%] lg:w-[42%]"
      >
        <WatermarkN className="inset-0 h-full w-full" />
      </div>

      <div className="container-site relative z-10 grid w-full items-center gap-12 pt-28 lg:grid-cols-[1.1fr_0.9fr] lg:pt-0">
        {/* Colonne texte */}
        <div className="max-w-2xl">
          <h1 className="font-bold leading-[0.98] tracking-tight text-text-primary">
            <span className="block text-5xl sm:text-6xl lg:text-8xl">
              {H1_LINE_1.split(" ").map((w, i, arr) => (
                <span
                  key={i}
                  className="inline-block overflow-hidden align-bottom"
                  style={{ marginRight: i < arr.length - 1 ? "0.24em" : undefined }}
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
                  style={{ marginRight: i < arr.length - 1 ? "0.24em" : undefined }}
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

        {/* Colonne visuelle */}
        <div
          data-hero-visual
          className="relative hidden aspect-square w-full overflow-hidden rounded-card border border-border lg:block"
        >
          <HeroVisual className="h-full w-full" />
        </div>
      </div>

      {/* Indicateur de scroll */}
      <div
        data-hero-hint
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-text-muted"
      >
        <span className="text-[10px] uppercase tracking-widest2">Défiler</span>
        <span className="h-8 w-px animate-pulse bg-border" />
      </div>
    </section>
  );
}
