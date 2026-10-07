import { createElement, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MotionRevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /**
   * Décalage d'entrée, en fraction de la fenêtre de révélation (0 → 1).
   * Sert à échelonner une liste : 0, 0.08, 0.16…
   */
  delay?: number;
}

/**
 * Révélation au scroll — CSS pur, aucun JavaScript.
 *
 * Le bloc est rendu tel quel côté serveur (lisible sans JS, indexable, annoncé
 * par les lecteurs d'écran) ; une animation pilotée par le scroll
 * (`animation-timeline: view()`) l'élève de quelques pixels en le fondant,
 * pendant son entrée dans le viewport. Voir `.nx-reveal` dans globals.css.
 *
 * Dégradation : navigateur sans scroll-driven animations ou
 * `prefers-reduced-motion: reduce` → le contenu est affiché directement, sans
 * aucun état intermédiaire. Un bloc déjà visible au chargement n'est jamais masqué.
 */
export function MotionReveal({
  children,
  as = "div",
  className,
  delay = 0,
}: MotionRevealProps) {
  const style = delay
    ? ({ "--nx-offset": `${Math.round(delay * 100)}%` } as CSSProperties)
    : undefined;
  return createElement(as, { className: cn("nx-reveal", className), style }, children);
}
