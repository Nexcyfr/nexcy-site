// Système Motion V3 — media queries centralisées, alignées sur tailwind.config.
// À utiliser avec gsap.matchMedia() : gsap.matchMedia().add(MQ.desktop, () => {...}).
// Constantes pures (aucun "use client", aucune dépendance).

export const MQ = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
  /** Desktop réel avec pointeur précis (magnétique, parallaxe pointeur). */
  pointerFine: "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
  reduce: "(prefers-reduced-motion: reduce)",
  noReduce: "(prefers-reduced-motion: no-preference)",
} as const;
