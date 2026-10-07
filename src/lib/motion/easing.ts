// Système Motion V3 — courbes d'accélération.
// SOURCE UNIQUE = les 4 points de contrôle Bézier ci-dessous. CSS et GSAP en
// dérivent (parité stricte), sans CustomEase ni dépendance.

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

/**
 * Fabrique une fonction d'easing `(progress) => number` — même courbe que la
 * `cubic-bezier` CSS correspondante. On résout t tel que X(t) = progress
 * (Newton-Raphson, repli par bissection) puis on évalue Y(t). Pur, GSAP-compatible.
 */
export function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): (progress: number) => number {
  // Coefficients de la Bézier cubique avec P0 = 0 et P3 = 1.
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  const solveT = (x: number) => {
    let t = x;
    // Newton-Raphson
    for (let i = 0; i < 8; i++) {
      const err = sampleX(t) - x;
      if (Math.abs(err) < 1e-6) return t;
      const d = slopeX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    // Repli : bissection
    let lo = 0;
    let hi = 1;
    t = x;
    while (hi - lo > 1e-6) {
      const xEst = sampleX(t);
      if (Math.abs(xEst - x) < 1e-6) break;
      if (xEst < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return t;
  };

  return (progress: number) => {
    if (progress <= 0) return 0;
    if (progress >= 1) return 1;
    return sampleY(solveT(progress));
  };
}

/** Fonction d'easing GSAP pour une courbe nommée (mêmes points que `cssEase`). */
export function gsapEase(name: EaseName): (progress: number) => number {
  return cubicBezier(...EASE_POINTS[name]);
}
