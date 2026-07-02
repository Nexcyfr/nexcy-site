// Configuration unique du pipeline média (Lot 1 — Infrastructure média).
// Aucune valeur sensible. Tout est local et déterministe.

import path from "node:path";

/** Racine du projet (ce fichier vit dans scripts/media/). */
export const ROOT = path.resolve(process.cwd());

/** Origine locale contrôlée pour le harnais de rendu (§8). */
export const BASE_URL = process.env.RENDER_BASE_URL || "http://127.0.0.1:3000";

/** Liste blanche EXPLICITE des scènes autorisées (§8). */
export const SCENES = ["test", "hero"];

/** Dossiers temporaires — jamais commités, toujours sous .tmp/ (§8/§10). */
export const TMP = path.join(ROOT, ".tmp");
export const framesDir = (scene) => path.join(TMP, "frames", scene);
export const OUT_DIR = path.join(TMP, "out");

/** Sorties finales servies par le site (créées par les lots consommateurs). */
export const PUBLIC_VIDEO = path.join(ROOT, "public", "assets", "video");
export const PUBLIC_POSTERS = path.join(ROOT, "public", "assets", "posters");

/** Réglages de rendu par défaut (test fumée : petit, rapide, déterministe). */
export const RENDER = {
  fps: 30,
  width: 640,
  height: 360,
  seconds: 2,
};

/** Réglages d'encodage (§7) — déterministes. */
export const ENCODE = {
  webm: { codec: "libvpx-vp9", crf: 34 },
  mp4: { codec: "libx264", crf: 24 },
  pixfmt: "yuv420p",
  // GOP = 1s (aligné sur le fps) pour une boucle propre.
  gopSeconds: 1,
  poster: { avifQuality: 50 },
};

/** Budgets du test fumée (généreux : preuve de chaîne, pas l'asset final). */
export const BUDGETS = {
  webmKB: 800,
  mp4KB: 1500,
  posterKB: 60,
};

/** Extensions image acceptées par optimize-images (§9). */
export const IMAGE_EXT = [".png", ".jpg", ".jpeg", ".webp", ".avif", ".tiff"];

/** Valide un identifiant de scène contre la liste blanche (§8). */
export function assertScene(scene) {
  if (typeof scene !== "string" || !/^[a-z0-9-]+$/.test(scene) || !SCENES.includes(scene)) {
    throw new Error(
      `Scène invalide : "${scene}". Autorisées : ${SCENES.join(", ")}.`,
    );
  }
  return scene;
}

/** Garantit qu'un chemin résolu reste sous .tmp/ (§8 — anti-évasion). */
export function assertInsideTmp(target) {
  const resolved = path.resolve(target);
  const base = path.resolve(TMP);
  if (resolved !== base && !resolved.startsWith(base + path.sep)) {
    throw new Error(`Chemin hors de .tmp/ refusé : ${resolved}`);
  }
  return resolved;
}
