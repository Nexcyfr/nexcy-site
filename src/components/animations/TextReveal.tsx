import { createElement, type CSSProperties, type ElementType } from "react";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  children: string;
  as?: ElementType;
  className?: string;
  /** id transmis à l'élément racine (ex. cible d'aria-labelledby). */
  id?: string;
  delay?: number;
}

/**
 * Titre révélé au scroll — même mécanisme CSS que `MotionReveal`, avec un
 * déplacement un peu plus ample. Le texte reste du HTML ordinaire : visible au
 * rendu serveur, annoncé tel quel, aucun découpage en mots ni en lignes.
 */
export function TextReveal({
  children,
  as = "p",
  className,
  id,
  delay = 0,
}: TextRevealProps) {
  const style = delay
    ? ({ "--nx-offset": `${Math.round(delay * 100)}%` } as CSSProperties)
    : undefined;
  return createElement(
    as,
    { id, className: cn("nx-reveal nx-reveal-title", className), style },
    children,
  );
}
