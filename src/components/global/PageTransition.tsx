import type { ReactNode } from "react";

/**
 * Transition d'entrée de page — CSS pur.
 *
 * Monté via app/template.tsx, qui remonte à chaque navigation App Router : le
 * conteneur est recréé, donc l'animation `nx-page-in` rejoue. Déplacement
 * vertical seul, sans fondu : le contenu reste peint dès la première image,
 * ce qui ne retarde ni le LCP ni la lecture. Neutralisé en mouvement réduit.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="nx-page-in">{children}</div>;
}
