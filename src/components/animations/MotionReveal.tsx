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
        gsap.set(el, { autoAlpha: 1, x: 0, y: 0, scale: 1 });
        return;
      }

      const mobile = window.matchMedia(MQ.mobile).matches;
      const from: gsap.TweenVars = { autoAlpha: 0, willChange: "transform, opacity" };
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
      gsap.to(el, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration,
        delay,
        ease,
        scrollTrigger: { trigger: el, start, once },
        onComplete: () => gsap.set(el, { willChange: "auto" }),
      });
    },
    { scope: ref },
  );

  return createElement(as, { ref, className: cn(className) }, children);
}
