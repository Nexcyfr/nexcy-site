"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, DURATION, AMPLITUDE } from "@/lib/motion/tokens";
import { MQ } from "@/lib/motion/mediaQueries";
import { cn } from "@/lib/utils";

type MediaVariant = "vertical" | "horizontal" | "editorial" | "fullscreen" | "light";

interface MediaRevealProps {
  children: ReactNode;
  variant?: MediaVariant;
  className?: string;
  delay?: number;
  start?: string;
  once?: boolean;
}

interface VariantConfig {
  from: gsap.TweenVars;
  duration: number;
  ease: gsap.EaseFunction | string;
  light?: boolean;
}

/**
 * Geste principal : `clip-path: inset()` directionnel + translation interne
 * légère + scale ≤ 1.03 + fondu secondaire. Aucun filtre lourd, aucun blur
 * continu. reduced-motion = état final immédiat.
 */
const CONFIG: Record<MediaVariant, VariantConfig> = {
  vertical: { from: { clipPath: "inset(100% 0% 0% 0%)", y: 16 }, duration: DURATION.reveal, ease: EASE.cinematic },
  horizontal: { from: { clipPath: "inset(0% 100% 0% 0%)", x: 24 }, duration: DURATION.reveal, ease: EASE.cinematic },
  editorial: { from: { clipPath: "inset(100% 0% 0% 0%)", y: 24 }, duration: DURATION.editorial, ease: EASE.cinematic },
  fullscreen: { from: { clipPath: "inset(100% 0% 0% 0%)", scale: AMPLITUDE.scaleMedia }, duration: DURATION.cinematic, ease: EASE.cinematic },
  light: { from: { clipPath: "inset(0% 100% 0% 0%)" }, duration: DURATION.editorial, ease: EASE.linear, light: true },
};

/**
 * Révélation de média/scène par masque `clip-path` (Motion System V3).
 * Purement décoratif dans son habillage ; le contenu (`children`) reste visible
 * au SSR. Réservé pour l'instant à la scène DEV Motion (import non public).
 */
export function MediaReveal({
  children,
  variant = "vertical",
  className,
  delay = 0,
  start = "top 80%",
  once = true,
}: MediaRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const cfg = CONFIG[variant];

  useGSAP(
    () => {
      const el = ref.current;
      const inner = el?.querySelector<HTMLElement>("[data-media-inner]");
      if (!el || !inner) return;

      if (window.matchMedia(MQ.reduce).matches) {
        gsap.set(inner, { clipPath: "inset(0% 0% 0% 0%)", x: 0, y: 0, scale: 1, autoAlpha: 1 });
        return;
      }

      gsap.set(inner, { ...cfg.from, autoAlpha: 0, willChange: "clip-path, transform, opacity" });
      gsap.to(inner, {
        clipPath: "inset(0% 0% 0% 0%)",
        x: 0,
        y: 0,
        scale: 1,
        autoAlpha: 1,
        duration: cfg.duration,
        delay,
        ease: cfg.ease,
        scrollTrigger: { trigger: el, start, once },
        onComplete: () => gsap.set(inner, { willChange: "auto" }),
      });

      if (cfg.light) {
        const bar = el.querySelector<HTMLElement>("[data-light-bar]");
        if (bar) {
          gsap.fromTo(
            bar,
            { xPercent: -120, autoAlpha: 0 },
            {
              xPercent: 320,
              autoAlpha: 1,
              duration: cfg.duration,
              delay,
              ease: EASE.linear,
              scrollTrigger: { trigger: el, start, once },
            },
          );
        }
      }
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <div data-media-inner className="h-full w-full">
        {children}
      </div>
      {cfg.light ? (
        <span
          data-light-bar
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        />
      ) : null}
    </div>
  );
}
