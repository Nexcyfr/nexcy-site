"use client";

import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "@/lib/gsap";
import { MQ } from "@/lib/motion/mediaQueries";

interface UseAmbientMotionOptions {
  /** Élément observé pour la pause/reprise hors viewport. */
  target: RefObject<Element>;
  /** Construit la timeline ambiante (appelée UNE fois par montage). */
  buildTimeline: () => gsap.core.Timeline;
  disabled?: boolean;
}

/**
 * Gère le cycle de vie d'une timeline GSAP ambiante (Motion System V3).
 * - Crée une seule timeline par montage (via `buildTimeline`).
 * - **IntersectionObserver** (pas ScrollTrigger) pour pause/reprise ; démarre
 *   uniquement quand la cible est visible, se met en pause hors viewport, reprend
 *   SANS recréer la timeline.
 * - Ne démarre pas en reduced-motion, ni si `disabled`, ni sur mobile.
 * - Aucun state React, aucune boucle rAF indépendante (la timeline utilise le
 *   ticker GSAP partagé). Timeline tuée + observer déconnecté au démontage ;
 *   aucun callback après démontage.
 * Le composant reste responsable des éléments animés, amplitudes, durées et
 * de l'état visuel final.
 */
export function useAmbientMotion({
  target,
  buildTimeline,
  disabled = false,
}: UseAmbientMotionOptions) {
  const buildRef = useRef(buildTimeline);
  buildRef.current = buildTimeline;

  useEffect(() => {
    if (disabled) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia(MQ.reduce).matches) return;
    if (window.matchMedia(MQ.mobile).matches) return; // pas d'ambient sur mobile
    const el = target.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const timeline = buildRef.current();
    timeline.pause(); // ne démarre que lorsque visible

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) timeline.play();
        else timeline.pause();
      },
      { threshold: 0 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      timeline.kill();
    };
  }, [target, disabled]);
}
