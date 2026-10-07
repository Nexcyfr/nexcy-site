"use client";

import { createElement, useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePointerMotion } from "@/hooks/usePointerMotion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE, AMPLITUDE } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

interface MagneticTargetProps {
  children: ReactNode;
  className?: string;
  /** Multiplie l'amplitude de base (défaut 1). */
  strength?: number;
  /** Durée de lissage / retour à zéro (défaut 0.35 s). */
  returnDuration?: number;
  disabled?: boolean;
  as?: "div" | "span";
}

/**
 * Cible magnétique — le contenu suit très légèrement le pointeur puis revient au
 * centre (Motion System V3). DEV uniquement : importé par aucune route publique.
 *
 * - Coordonnées via `usePointerMotion` (desktop + pointeur fin) ; amplitude
 *   tokenisée `AMPLITUDE.magnetic` (8 px) × `strength`.
 * - Animation via `gsap.quickTo` → AUCUNE mise à jour React au pointermove.
 * - Désactivé (aucun listener, aucun transform) si reduced-motion ou `disabled`,
 *   ou hors desktop/pointeur-fin (géré par `usePointerMotion`).
 * - N'intercepte pas le clic, ne modifie ni la sémantique, ni le focus, ni la
 *   zone cliquable ; transform seul → aucun reflow. Cleanup complet au démontage.
 */
export function MagneticTarget({
  children,
  className,
  strength = 1,
  returnDuration = 0.35,
  disabled = false,
  as = "div",
}: MagneticTargetProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const quickX = useRef<((v: number) => void) | null>(null);
  const quickY = useRef<((v: number) => void) | null>(null);
  const off = disabled || reduce;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || off) return;
      quickX.current = gsap.quickTo(el, "x", { duration: returnDuration, ease: EASE.standard });
      quickY.current = gsap.quickTo(el, "y", { duration: returnDuration, ease: EASE.standard });
      return () => {
        quickX.current = null;
        quickY.current = null;
        gsap.set(el, { x: 0, y: 0 }); // aucun transform résiduel après désactivation
      };
    },
    { scope: ref, dependencies: [off, returnDuration] },
  );

  usePointerMotion(
    ref,
    (nx, ny) => {
      const amp = AMPLITUDE.magnetic * strength;
      quickX.current?.(nx * amp);
      quickY.current?.(ny * amp);
    },
    { disabled: off },
  );

  return createElement(
    as,
    { ref, className: cn("inline-block", className) },
    children,
  );
}
