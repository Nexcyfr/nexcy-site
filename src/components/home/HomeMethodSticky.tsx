"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/animations/TextReveal";
import { methodSteps } from "@/data/method";

/**
 * Méthode — section sticky à défilement lié (remplace HomeMethod plat).
 *
 * Desktop : colonne gauche en position sticky (grand numéro de l'étape active),
 * colonne droite = les 4 étapes qui défilent ; chaque étape entrant dans la zone
 * active met à jour le numéro et s'illumine (scrub via ScrollTrigger).
 * Mobile / reduced-motion / no-JS : liste empilée entièrement lisible, aucune
 * dépendance à l'animation, aucun contenu masqué.
 */
export function HomeMethodSticky() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]", root);

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const triggers = steps.map((step, i) =>
          ScrollTrigger.create({
            trigger: step,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => {
              if (self.isActive) setActive(i);
            },
          }),
        );
        return () => triggers.forEach((t) => t.kill());
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      aria-labelledby="home-method-title"
      className="section-y border-t border-border bg-black"
    >
      <div ref={rootRef} className="container-site">
        <SectionLabel label="03 / Méthode" />
        <TextReveal
          as="h2"
          id="home-method-title"
          className="mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl"
        >
          Un processus en quatre étapes, sans surprise.
        </TextReveal>

        <div className="mt-12 grid gap-12 lg:mt-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Colonne sticky — grand numéro de l'étape active (desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-screen flex-col justify-center">
              <span
                aria-hidden="true"
                className="block text-[clamp(7rem,16vw,15rem)] font-bold leading-none tracking-tighter text-accent/25 tabular-nums transition-colors"
              >
                {methodSteps[active]?.index}
              </span>
              <p className="mt-4 max-w-sm text-sm uppercase tracking-[0.25em] text-text-secondary">
                Étape {methodSteps[active]?.index} — {methodSteps[active]?.title}
              </p>
              {/* Rail de progression */}
              <div className="mt-10 flex gap-2">
                {methodSteps.map((s, i) => (
                  <span
                    key={s.index}
                    className={`h-0.5 flex-1 rounded-full transition-colors duration-500 ${
                      i <= active ? "bg-accent" : "bg-border"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Colonne défilante — les 4 étapes */}
          <div className="flex flex-col">
            {methodSteps.map((step, i) => (
              <div
                key={step.index}
                data-step
                className="border-t border-border py-10 first:border-t-0 first:pt-0 lg:min-h-[62vh] lg:justify-center lg:py-0 lg:flex lg:flex-col"
              >
                <div className="flex gap-6">
                  <span
                    aria-hidden="true"
                    className={`text-5xl font-bold leading-none tabular-nums transition-colors duration-500 md:text-6xl lg:hidden ${
                      i === active ? "text-accent" : "text-accent/20"
                    }`}
                  >
                    {step.index}
                  </span>
                  <div className="pt-1">
                    <h3
                      className={`text-2xl font-medium transition-colors duration-500 md:text-3xl ${
                        i === active ? "text-text-primary" : "text-text-primary lg:text-text-secondary"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-text-secondary lg:text-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
