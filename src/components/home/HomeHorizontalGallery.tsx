"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * Galerie horizontale « Fragments » — texture de notre artisanat.
 *
 * Desktop, hors reduced-motion : section pinnée, la bande d'images translate
 * horizontalement au scroll (scrub), synchronisée à Lenis.
 * Mobile / reduced-motion : carrousel à défilement horizontal natif (scroll-snap)
 * — même contenu, aucune dépendance au pin. Images locales, toujours visibles.
 */

// Images strictement neutres de marque (architecture / intérieurs), pour ne
// jamais impliquer de faux client ni afficher d'asset sous droits.
const FRAGMENTS = [
  { src: "/assets/home/hero-bg-2.jpg", label: "Structure", caption: "Une architecture qui tient." },
  { src: "/assets/home/hero-bg-1.jpg", label: "Lumière", caption: "Ce que le regard suit." },
  { src: "/assets/home/hero-bg-3.jpg", label: "Matière", caption: "La texture avant l'effet." },
  { src: "/assets/projects/hospitality/cover-1.jpg", label: "Détail", caption: "Le dixième qui distingue." },
];

export function HomeHorizontalGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!section || !viewport || !track) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        viewport.style.overflowX = "hidden";
        const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          viewport.style.overflowX = "";
          gsap.set(track, { x: 0 });
        };
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-fragments-title"
      className="relative overflow-hidden border-t border-border bg-black lg:h-screen"
    >
      <div className="flex h-full flex-col justify-center py-16 lg:py-0">
        <div className="container-site">
          <SectionLabel label="Fragments" />
          <h2
            id="home-fragments-title"
            className="mt-6 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl"
          >
            Le soin, dans chaque détail.
          </h2>
        </div>

        {/* Viewport : scroll natif en mobile, piloté par GSAP en desktop */}
        <div
          ref={viewportRef}
          className="mt-10 w-full overflow-x-auto lg:mt-14 lg:overflow-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: "x mandatory" }}
        >
          <div
            ref={trackRef}
            className="flex w-max gap-5 px-5 md:gap-6 md:px-10 lg:px-20"
          >
            {FRAGMENTS.map((f) => (
              <figure
                key={f.label}
                className="group relative aspect-[3/4] w-[76vw] flex-shrink-0 overflow-hidden bg-surface sm:w-[54vw] lg:w-[34vw] xl:w-[30vw]"
                style={{ scrollSnapAlign: "center" }}
              >
                <Image
                  src={f.src}
                  alt={f.caption}
                  fill
                  sizes="(max-width: 1024px) 76vw, 32vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.1) 45%, transparent 100%)",
                  }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
                    {f.label}
                  </p>
                  <p className="mt-2 text-lg font-medium text-text-primary lg:text-xl">
                    {f.caption}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
