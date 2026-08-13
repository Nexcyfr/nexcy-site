"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { PlanCanvas } from "@/components/home/plan/PlanCanvas";
import { PHASES, phaseIndex } from "@/components/home/plan/render";

/**
 * Hero « Le Plan ».
 *
 * Le scroll à travers la section pilote une progression 0 → 1, et cette
 * progression est la seule source de vérité du visuel : un plan axonométrique
 * qui se trame, s'extrude, se connecte, puis se met en ordre. Parcourir le
 * scroll à l'envers rejoue exactement l'inverse — rien n'est cumulatif.
 *
 * Le visuel est un canvas 2D : aucun asset à télécharger, aucune dépendance à
 * WebGL, même expérience sur mobile. En mouvement réduit, une image fixe est
 * peinte à l'état le plus abouti et la section retombe à une hauteur d'écran.
 *
 * Le texte est du DOM réel — jamais peint dans le canvas.
 */

/** Six temps du récit. Chaque légende porte un argument, pas une décoration. */
const CAPTIONS: string[] = [
  "Tout part d'un point d'entrée : votre situation réelle, mesurée.",
  "On pose la trame avant de bâtir. L'architecture précède le design.",
  "Chaque module a une fonction, une place et une mesure.",
  "Les modules communiquent : données, automatisation, intelligence artificielle.",
  "Ce qui est construit est documenté, mesuré et maintenu.",
  "Web, marque, visibilité, automatisation — un seul système, tenu par une seule équipe.",
];

/** Coordonnées réelles de Bordeaux — une donnée vraie, pas un ornement. */
const COORDS = "44.8378° N — 0.5792° O";

export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const railRef = useRef<HTMLSpanElement>(null);
  /** Repeinte immédiate fournie par le canvas — filet si rAF est bridé. */
  const requestPaintRef = useRef<(() => void) | null>(null);
  const reduced = useReducedMotion();
  const [compact, setCompact] = useState(true);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState(0);

  // Palier de composition : en dessous de 1024px le plan est resserré et le
  // texte passe en pleine largeur. Réévalué en direct au redimensionnement.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setCompact(!mq.matches);
    apply();
    setReady(true);
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const getProgress = useCallback(() => progressRef.current, []);

  // Un seul re-render par changement de phase — la boucle de rendu, elle,
  // tourne à 60 fps sans jamais toucher à l'état React.
  const handleProgress = useCallback((p: number) => {
    const next = phaseIndex(p);
    setPhase((prev) => (prev === next ? prev : next));
    if (railRef.current) railRef.current.style.transform = `scaleX(${p})`;
  }, []);

  useGSAP(
    () => {
      if (reduced) return;
      const section = sectionRef.current;
      if (!section) return;

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        // Les mesures sont reprises après tout changement de mise en page.
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          requestPaintRef.current?.();
        },
      });

      return () => trigger.kill();
    },
    { scope: sectionRef, dependencies: [reduced, compact] },
  );

  // Hauteur de défilement : assez longue pour que chaque temps respire,
  // assez courte pour ne pas retenir l'utilisateur en otage sur mobile.
  const scrollHeight = reduced ? "100svh" : compact ? "240vh" : "360vh";

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative w-full bg-void"
      style={{ height: scrollHeight }}
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* Le plan. Monté une fois la largeur connue, pour éviter un rebuild. */}
        <div className="absolute inset-0">
          {ready ? (
            <PlanCanvas
              getProgress={getProgress}
              compact={compact}
              reduced={reduced}
              onPhaseChange={handleProgress}
              onReady={(requestPaint) => {
                requestPaintRef.current = requestPaint;
              }}
            />
          ) : null}
        </div>

        {/* Voiles de lisibilité — le titre se pose sur le plan, jamais à côté.
            Deux dégradés : le bas porte le bloc de titre, la gauche protège la
            colonne de texte en desktop où le plan remonte plus haut. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.72) 26%, rgba(8,8,8,0) 58%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(to right, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.6) 26%, rgba(8,8,8,0) 52%)",
          }}
        />

        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="container-site relative flex h-full flex-col justify-between">
            {/* Cote haute — une donnée vraie, pas un ornement de HUD */}
            <p className="t-tech pt-[calc(var(--header-h)+1rem)] text-stone">
              {COORDS}
            </p>

            {/* Bloc de titre */}
            <div className="max-w-[34rem] pb-12 sm:max-w-[44rem] lg:max-w-[52rem] lg:pb-16">
              <p className="t-tech mb-5 text-accent">
                NEXCY — Agence digitale · Bordeaux
              </p>

              <h1
                id="hero-title"
                className="t-h1 text-warm-white"
                style={{ textWrap: "balance" }}
              >
                La complexité, mise en ordre.
              </h1>

              {/* Récit en six temps. Supplément visuel : la proposition
                  complète reste lisible par les technologies d'assistance. */}
              <p
                aria-hidden="true"
                className="t-lead measure mt-6 min-h-[4.4em] text-stone sm:min-h-[3em] lg:mt-7 lg:min-h-[2.9em]"
              >
                {CAPTIONS[phase]}
              </p>
              <p className="sr-only">
                NEXCY conçoit, construit et opère les systèmes digitaux
                d&apos;entreprises exigeantes : sites web sur mesure, identité de
                marque, référencement naturel, automatisation des processus et
                intégration d&apos;intelligence artificielle. Basée à Bordeaux.
              </p>

              <div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link
                  href="/contact"
                  className="inline-flex min-h-[52px] items-center rounded-btn bg-accent px-7 text-sm font-medium text-black transition-colors duration-200 hover:bg-accent-light"
                >
                  Démarrer un projet
                </Link>
                <Link
                  href="/services"
                  className="inline-flex min-h-[52px] items-center text-sm font-medium text-text-secondary underline-offset-8 transition-colors duration-200 hover:text-warm-white hover:underline"
                >
                  Voir les expertises
                </Link>
              </div>
            </div>
          </div>

          {/* Rail des phases — la lecture du système, à droite, desktop seul */}
          <ol
            aria-hidden="true"
            className="absolute right-[max(2rem,5vw)] top-1/2 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
          >
            {PHASES.map((ph, i) => (
              <li
                key={ph.id}
                className="t-tech flex items-center justify-end gap-3 transition-colors duration-500"
                style={{ color: i === phase ? "var(--color-accent)" : undefined }}
              >
                <span className={i === phase ? "" : "text-stone/35"}>
                  {ph.label}
                </span>
                <span
                  className="block h-px transition-all duration-500"
                  style={{
                    width: i === phase ? "2rem" : "0.75rem",
                    backgroundColor:
                      i === phase ? "var(--color-accent)" : "rgba(153,149,143,0.3)",
                  }}
                />
              </li>
            ))}
          </ol>

          {/* Jauge de progression — fine, en pied de section */}
          {!reduced ? (
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-px bg-line"
            >
              <span
                ref={railRef}
                className="block h-px origin-left bg-accent"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
