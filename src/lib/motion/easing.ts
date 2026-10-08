// Courbes d'accélération NEXCY — source unique pour Tailwind et le CSS.
// Les mêmes points de contrôle sont déclarés en variables CSS dans globals.css
// (--ease-*) : toute modification se fait ici ET là, nulle part ailleurs.

export type EaseName = "cinematic" | "standard" | "snappy" | "media";

/** Points de contrôle [x1, y1, x2, y2] — la seule définition de vérité. */
export const EASE_POINTS: Record<EaseName, readonly [number, number, number, number]> = {
  cinematic: [0.16, 1, 0.3, 1],
  standard: [0.4, 0, 0.2, 1],
  snappy: [0.5, 0, 0, 1],
  media: [0.25, 0.1, 0.25, 1],
};

/** Chaîne CSS `cubic-bezier(...)` pour une courbe nommée. */
export function cssEase(name: EaseName): string {
  return `cubic-bezier(${EASE_POINTS[name].join(", ")})`;
}
