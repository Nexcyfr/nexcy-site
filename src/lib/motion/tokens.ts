// Système Motion V3 — tokens centralisés (durées, staggers, amplitudes).
// Les easings vivent dans ./easing (source Bézier unique).

import { type EaseName, gsapEase, cssEase } from "./easing";

/** Easings GSAP prêts à l'emploi (fonctions) + `linear` natif. */
export const EASE: Record<EaseName, (p: number) => number> & { linear: "none" } = {
  cinematic: gsapEase("cinematic"),
  standard: gsapEase("standard"),
  snappy: gsapEase("snappy"),
  media: gsapEase("media"),
  linear: "none",
};

export { cssEase };

/** Durées en secondes. Plafond user-facing = 1.4 s (hors boucles ambiantes). */
export const DURATION = {
  instant: 0,
  micro: 0.15,
  ui: 0.3,
  reveal: 0.7,
  editorial: 1.0,
  cinematic: 1.4,
  ambientMin: 6,
  ambientMax: 10,
} as const;

/** Staggers en secondes. */
export const STAGGER = {
  chars: 0.02,
  words: 0.05,
  lines: 0.08,
  uiGroup: 0.06,
  list: 0.09,
  editorial: 0.12,
} as const;

/** Durée totale maximale d'un stagger sur mobile (secondes). */
export const MOBILE_STAGGER_CAP = 0.5;

/** Amplitudes usuelles (px, sauf ratios de scale). Valeurs desktop de référence. */
export const AMPLITUDE = {
  revealY: 24,
  revealYMobile: 16,
  editorialX: 40,
  scaleSubtle: 1.04,
  scaleMedia: 1.03,
  blur: 8,
  parallax: 40,
  pointerFar: 10,
  pointerNear: 22,
  /** Déplacement magnétique d'une cible UI (bouton) — subtil, < pointerNear. */
  magnetic: 8,
  rotationMax: 6,
} as const;
