"use client";

import { createElement, useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, DURATION, AMPLITUDE } from "@/lib/motion/tokens";
import { MQ } from "@/lib/motion/mediaQueries";
import { cn } from "@/lib/utils";

type Variant = "fade" | "rise" | "slide" | "scale";

interface MotionRevealProps {
  children: ReactNode;
  as?: ElementType;
  variant?: Variant;
  className?: string;
  delay?: number;
  duration?: number;
  start?: string;
  once?: boolean;
  /** Overrides bas niveau (utilisés notamment par l'alias FadeIn). */
  y?: number;
  x?: number;
  scaleFrom?: number;
  ease?: gsap.EaseFunction | string;
}

/**
 * Révélation générique au scroll (Motion System V3).
 * - Le contenu est rendu VISIBLE au SSR (aucune classe d'opacité) → lisible
 *   sans JS ; `useGSAP` (layout effect) pose l'état initial AVANT le paint →
 *   aucun flash durable.
 * - reduced-motion : état final immédiat, aucune transformation.
 * - `will-change` posé puis retiré ; ScrollTrigger `once` par défaut ; cleanup
 *   automatique via useGSAP.
 *
 * Accessibilité — l'état initial est `opacity: 0`, jamais `autoAlpha`.
 * `autoAlpha` pose `visibility: hidden`, ce qui sort le bloc de l'ordre de
 * tabulation ET de l'arbre d'accessibilité tant que le ScrollTrigger n'a pas
 * tiré. Au clavier, la première traversée de la page sautait alors tout le
 * corps de l'accueil pour aller du Hero au footer. Avec `opacity`, le contenu
 * reste annoncé et atteignable ; `focusin` termine la révélation
 * immédiatement si le focus arrive avant le scroll.
 */
export function MotionReveal({
  children,
  as = "div",
  variant = "fade",
  className,
  delay = 0,
  duration = DURATION.reveal,
  start = "top 85%",
  once = true,
  y,
  x,
  scaleFrom,
  ease = EASE.cinematic,
}: MotionRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (window.matchMedia(MQ.reduce).matches) {
        gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
        return;
      }

      const mobile = window.matchMedia(MQ.mobile).matches;
      const from: gsap.TweenVars = { opacity: 0, willChange: "transform, opacity" };
      if (variant === "rise" || y != null) {
        from.y = y ?? (mobile ? AMPLITUDE.revealYMobile : AMPLITUDE.revealY);
      }
      if (variant === "slide" || x != null) {
        from.x = x ?? (mobile ? 0 : AMPLITUDE.editorialX);
      }
      if (variant === "scale" || scaleFrom != null) {
        from.scale = scaleFrom ?? AMPLITUDE.scaleSubtle;
      }

      gsap.set(el, from);
      const tween = gsap.to(el, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration,
        delay,
        ease,
        scrollTrigger: { trigger: el, start, once },
        onComplete: () => gsap.set(el, { willChange: "auto" }),
      });

      // Filet clavier : si le focus atteint le bloc avant que le scroll ne
      // l'ait révélé, on termine la révélation sur-le-champ.
      const onFocusIn = () => {
        tween.scrollTrigger?.kill();
        tween.progress(1);
        gsap.set(el, { willChange: "auto" });
      };
      el.addEventListener("focusin", onFocusIn);
      return () => el.removeEventListener("focusin", onFocusIn);
    },
    { scope: ref },
  );

  return createElement(as, { ref, className: cn(className) }, children);
}
