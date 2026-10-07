"use client";

import type { ReactNode } from "react";
import { MotionReveal } from "./MotionReveal";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance de translation verticale initiale (px). */
  y?: number;
  /** Applique un léger scale (images). */
  scale?: boolean;
  start?: string;
  as?: "div" | "section" | "article" | "li" | "span";
}

/**
 * @deprecated Utiliser `<MotionReveal>`. Alias de compatibilité conservé pour ne
 * pas migrer en masse les appels existants (Motion System V3, sous-lot 2b).
 * Comportement en vue identique à l'historique (y 24px, power2.out, 0.8 s,
 * start "top 88%", scale 1.04 optionnel). Seule différence : sous
 * prefers-reduced-motion, l'état final est désormais posé **instantanément**
 * (au lieu d'un fondu de 0.4 s) — plus conforme, imperceptible en usage normal.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
  scale = false,
  start = "top 88%",
  as = "div",
}: FadeInProps) {
  return (
    <MotionReveal
      as={as}
      className={className}
      delay={delay}
      start={start}
      duration={0.8}
      ease="power2.out"
      y={y}
      scaleFrom={scale ? 1.04 : undefined}
    >
      {children}
    </MotionReveal>
  );
}
