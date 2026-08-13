"use client";

import { createElement, useRef, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, DURATION, AMPLITUDE } from "@/lib/motion/tokens";
import { MQ } from "@/lib/motion/mediaQueries";

interface TextRevealProps {
  children: string;
  as?: ElementType;
  className?: string;
  /** id transmis à l'élément racine (ex. cible d'aria-labelledby). */
  id?: string;
  /** Décalage de départ du ScrollTrigger. */
  start?: string;
  delay?: number;
  /** Conservé pour compatibilité d'API (les deux modes révèlent le bloc). */
  mode?: "words" | "container";
}

/**
 * Révélation de titre au scroll — rise + fade sur le bloc (Motion System V3).
 *
 * Le texte est rendu tel quel (visible au SSR, lisible sans JS, parfait pour le
 * SEO et les lecteurs d'écran). `useGSAP` (layout effect) pose l'état initial
 * avant le paint, puis anime `opacity + y` à l'entrée dans le viewport.
 * prefers-reduced-motion : état final immédiat, aucune transformation.
 *
 * NB : implémentation alignée sur MotionReveal (opacity + y en px), fiable avec
 * ScrollTrigger + Lenis — contrairement à l'ancien masquage par mot en `yPercent`
 * qui restait bloqué dans son état initial (contenu invisible).
 */
export function TextReveal({
  children,
  as = "p",
  className,
  id,
  start = "top 85%",
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia(MQ.reduce).matches) {
        gsap.set(el, { opacity: 1, y: 0 });
        return;
      }

      const mobile = window.matchMedia(MQ.mobile).matches;
      // `opacity` et non `autoAlpha` : un titre en `visibility: hidden` n'est
      // pas annoncé par les lecteurs d'écran, qui naviguent justement de
      // titre en titre. Voir la note d'accessibilité dans MotionReveal.
      gsap.set(el, {
        opacity: 0,
        y: mobile ? AMPLITUDE.revealYMobile : AMPLITUDE.revealY,
        willChange: "transform, opacity",
      });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: DURATION.reveal,
        ease: EASE.cinematic,
        delay,
        scrollTrigger: { trigger: el, start, once: true },
        onComplete: () => gsap.set(el, { willChange: "auto" }),
      });
    },
    { scope: ref },
  );

  return createElement(as, { ref, id, className }, children);
}
