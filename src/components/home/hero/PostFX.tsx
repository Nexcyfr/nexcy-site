"use client";

import { EffectComposer, Bloom, Vignette, DepthOfField, SMAA } from "@react-three/postprocessing";

/**
 * Post-processing cinématographique : profondeur de champ légère (le premier
 * plan reste net, l'arrière-plan se dissout — masque les répétitions loin de
 * la caméra), bloom réservé aux accents lumineux (seuil de luminance élevé),
 * vignette pour recentrer l'œil, SMAA. ACES réglé sur le renderer (gl du Canvas).
 */
export function PostFX({ bloomIntensity = 0.7 }: { bloomIntensity?: number }) {
  return (
    <EffectComposer multisampling={0}>
      <DepthOfField focusDistance={0.015} focalLength={0.035} bokehScale={2.4} height={480} />
      <Bloom
        luminanceThreshold={1.1}
        luminanceSmoothing={0.3}
        intensity={bloomIntensity}
        mipmapBlur
      />
      <Vignette offset={0.28} darkness={0.68} eskil={false} />
      <SMAA />
    </EffectComposer>
  );
}
