"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";

const MILESTONES = [
  { year: "2019", label: "Début de pratique", detail: "Premier projet digital professionnel." },
  { year: "2025", label: "Création de NEXCY", detail: "Structuration sous la marque NEXCY." },
  { year: "Auj.", label: "En activité", detail: "Bordeaux, France." },
];

/**
 * Frise chronologique visuelle — page Studio.
 * Mobile : colonne verticale (flex-col, pas de scroll horizontal).
 * Desktop (lg+) : rangée horizontale avec ligne animée.
 * Réduit-motion : tout visible immédiatement, sans transformation.
 */
export function StudioTimeline() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el.querySelectorAll("[data-tl-reveal]"), { opacity: 1, y: 0 });
        gsap.set(el.querySelector("[data-tl-line]"), { scaleX: 1 });
        return;
      }

      // La ligne n'est visible qu'en desktop (lg+) — GSAP l'anime, affichage contrôlé par CSS
      gsap.set(el.querySelector("[data-tl-line]"), { scaleX: 0, transformOrigin: "left center" });
      gsap.set(el.querySelectorAll("[data-tl-reveal]"), { opacity: 0, y: 16 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });

      tl.to(el.querySelector("[data-tl-line]"), {
        scaleX: 1,
        duration: 0.9,
        ease: "power3.inOut",
        onComplete: () =>
          gsap.set(el.querySelector("[data-tl-line]"), { clearProps: "scaleX,transformOrigin,willChange" }),
      }).to(
        el.querySelectorAll("[data-tl-reveal]"),
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: "power2.out" },
        0.35,
      );
    },
    { scope: root },
  );

  return (
    <section
      aria-label="Chronologie du studio"
      className="section-y border-t border-border bg-surface"
      ref={root}
    >
      <div className="container-site">
        <SectionLabel label="Chronologie" />

        <div className="relative mt-10 py-2 lg:py-8">
          {/* Ligne horizontale — desktop uniquement, aria-hidden car décorative */}
          <div
            data-tl-line
            aria-hidden="true"
            className="absolute hidden h-px bg-border lg:left-0 lg:right-0 lg:top-[calc(2.5rem+10px)] lg:block"
          />

          {/* Jalons — colonne sur mobile, grille 3 colonnes sur desktop */}
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-3">
            {MILESTONES.map((m, i) => (
              <div
                key={m.year}
                data-tl-reveal
                className={[
                  "flex items-start gap-4",
                  "lg:flex-col lg:gap-3",
                  i === 1 ? "lg:items-center" : i === 2 ? "lg:items-end" : "",
                ].join(" ")}
              >
                {/* Nœud diamant */}
                <div aria-hidden="true" className="relative z-10 flex flex-shrink-0 items-center justify-center">
                  <svg viewBox="0 0 18 18" width="18" height="18">
                    <rect
                      x="2" y="2"
                      width="14" height="14"
                      transform="rotate(45 9 9)"
                      fill="var(--color-surface)"
                      stroke="var(--color-accent)"
                      strokeWidth="1.5"
                    />
                    <circle cx="9" cy="9" r="2.5" fill="var(--color-accent)" />
                  </svg>
                </div>

                {/* Labels */}
                <div
                  className={[
                    "flex flex-col gap-1",
                    i === 1 ? "lg:items-center lg:text-center" : i === 2 ? "lg:items-end lg:text-right" : "",
                  ].join(" ")}
                >
                  <span className="t-h3 text-text-primary">
                    {m.year}
                  </span>
                  <span className="text-sm font-medium text-text-secondary">
                    {m.label}
                  </span>
                  <span className="text-xs leading-relaxed text-text-muted">
                    {m.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
