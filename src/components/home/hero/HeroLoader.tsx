"use client";

import { useProgress } from "@react-three/drei";

/**
 * Overlay DOM (hors Canvas) affichant la progression réelle de chargement du
 * GLB (137 Mo) via le LoadingManager de three.js. Se masque dès `active=false`
 * (chargement terminé, tous les loaders three.js inactifs).
 */
export function HeroLoader() {
  const { active, progress } = useProgress();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 flex items-end justify-start p-6 transition-opacity duration-700 lg:p-10"
      style={{ opacity: active ? 1 : 0 }}
    >
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[#99958F]">
        <span className="inline-block h-px w-10 bg-[#E7AA62]" />
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
