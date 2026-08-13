/**
 * Valeur de progression du Hero (0 → 1), partagée entre le DOM (ScrollTrigger)
 * et la scène R3F (lue dans useFrame). Objet mutable volontaire : évite tout
 * re-render React pendant l'animation (l'animation vit dans la boucle de rendu).
 */
export const heroProgress = { value: 0 };

// Exposé en dev pour piloter/valider la scène statiquement (captures aux paliers).
if (typeof window !== "undefined") {
  (window as unknown as { __heroProgress?: typeof heroProgress }).__heroProgress = heroProgress;
}

/** Durée (secondes) du clip Fold bake Blender — 300 frames @ 24fps. mixer.setTime(p * CITY_ANIM_DURATION). */
export const CITY_ANIM_DURATION = 12.5;

/**
 * Keyframes caméra — trajectoire cinématographique réécrite (v2) autour de la
 * ville réellement construite (Downtown X∈[-140,140] Z∈[-220,-80] en repère
 * three.js). L'ancien tracé (extrait brut du bake Blender) montait à Y=1165 —
 * une vue satellite qui révélait la répétition des îlots. Ce tracé reste bas
 * (Y max ≈120, à hauteur des tours voisines, jamais "vue de carte") : niveau
 * rue au départ, traversée entre les tours au milieu, révélation finale en
 * légère plongée-contre-plongée vers le ciel plutôt qu'à la verticale.
 *
 * Repère : three.js Y-up (X=latéral, Y=hauteur, Z=profondeur négative vers
 * l'avant). Cf. historique : ne jamais recopier des coordonnées Blender
 * brutes (Z-up) sans conversion threeX=blenderX, threeY=blenderZ, threeZ=-blenderY.
 */
/**
 * Important : l'animation Fold (districts, cf. Blender) agit sur le décor
 * hérité, situé à Z≈-600 — hors du nouveau quartier Manhattan que nous avons
 * construit (X∈[-140,140], Z∈[10,-290]). Cette trajectoire reste donc
 * volontairement DANS le nouveau quartier sur toute la séquence : chaque
 * point "look" vise une zone où il y a réellement des tours, jamais le vide
 * entre les deux décors (bug vécu : plans 0.5–0.75 vides, caméra pointée
 * entre les deux scènes).
 */
/**
 * Positions X vérifiées contre les bounding boxes réelles des bâtiments (scan
 * runtime, cf. session de diagnostic shadow/UV) : 4 des 8 keyframes plaçaient
 * la caméra à l'intérieur d'un immeuble (0.45, 0.75, 0.9, 1.0), invisible tant
 * que le bug de géométrie corrompue (join/flatten) dominait le rendu. Chaque X
 * ci-dessous est recentré dans le couloir de rue le plus proche à la Y/Z du
 * point ; look/Y/Z inchangés.
 */
export const CAMERA_KEYFRAMES: { p: number; pos: [number, number, number]; look: [number, number, number] }[] = [
  { p: 0.0, pos: [0, 6, 10], look: [0, 14, -100] },
  { p: 0.15, pos: [0, 7, -50], look: [0, 16, -140] },
  { p: 0.3, pos: [0, 10, -110], look: [10, 18, -200] },
  { p: 0.45, pos: [0, 14, -160], look: [-5, 20, -230] },
  { p: 0.6, pos: [-20, 20, -190], look: [15, 28, -260] },
  { p: 0.75, pos: [0, 32, -220], look: [-10, 38, -270] },
  { p: 0.9, pos: [0, 55, -200], look: [30, 70, -260] },
  { p: 1.0, pos: [-7, 85, -160], look: [0, 140, -160] },
];

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/** Interpole position + cible caméra pour une progression donnée (0..1). */
export function sampleCamera(p: number): { pos: [number, number, number]; look: [number, number, number] } {
  const k = CAMERA_KEYFRAMES;
  const clamped = Math.max(0, Math.min(1, p));
  let i = 0;
  while (i < k.length - 2 && clamped > k[i + 1].p) i++;
  const a = k[i];
  const b = k[i + 1];
  const t = easeInOut((clamped - a.p) / (b.p - a.p));
  const lerp = (u: number, v: number) => u + (v - u) * t;
  return {
    pos: [lerp(a.pos[0], b.pos[0]), lerp(a.pos[1], b.pos[1]), lerp(a.pos[2], b.pos[2])],
    look: [lerp(a.look[0], b.look[0]), lerp(a.look[1], b.look[1]), lerp(a.look[2], b.look[2])],
  };
}
