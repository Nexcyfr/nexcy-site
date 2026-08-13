"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { City } from "./City";
import { Lights } from "./Lights";
import { PostFX } from "./PostFX";
import "./progress"; // expose window.__heroProgress (validation statique)

/**
 * Scène R3F du Hero — ville Manhattan / Fold (bake Blender), pilotée au scroll.
 * Cadrage niveau rue (cf. progress.ts) : la brume dense masque volontairement
 * le lointain (répétitions, contenu hérité hors champ) et renforce la
 * profondeur — teinte bleu-nuit assortie à l'éclairage golden hour / blue hour.
 */
export function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      camera={{ fov: 34, near: 0.1, far: 900, position: [0, 6, 10] }}
    >
      <color attach="background" args={["#12151c"]} />
      <fogExp2 attach="fog" args={["#171b24", 0.0033]} />
      <Suspense fallback={null}>
        <Environment files="/hero/env/desert_1k.hdr" environmentIntensity={0.22} />
        <Lights />
        <City />
      </Suspense>
      <PostFX />
    </Canvas>
  );
}
