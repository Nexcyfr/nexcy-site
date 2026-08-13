"use client";

/**
 * Éclairage cinématographique — golden hour / blue hour urbain, façon Batman /
 * Blade Runner 2049. Une clé ambre très rasante (ombres longues, dramatiques),
 * un rim froid pour détacher les silhouettes du fond, un fill bleu-nuit très
 * bas pour ne jamais aplatir les noirs. Volontairement sous-exposé : la scène
 * doit rester lisible sans être uniformément éclairée — on préfère perdre des
 * volumes dans l'ombre plutôt que tout montrer.
 *
 * Échelle ville (pas monolithe) : frustum d'ombre recalibré sur la zone
 * réellement traversée par la caméra (cf. progress.ts CAMERA_KEYFRAMES).
 */
export function Lights() {
  return (
    <group>
      {/* Clé — soleil bas, rasant, longues ombres dramatiques */}
      <directionalLight
        color={0xffb066}
        intensity={2.0}
        position={[-260, 90, 120]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
        shadow-normalBias={1.2}
        shadow-camera-near={5}
        shadow-camera-far={420}
        shadow-camera-left={-150}
        shadow-camera-right={150}
        shadow-camera-top={160}
        shadow-camera-bottom={-20}
      />
      {/* Rim froid — détache les silhouettes des tours du fond brumeux */}
      <directionalLight color={0x6f8fb8} intensity={1.4} position={[120, 60, -260]} />
      {/* Fill bleu-nuit très bas — jamais plat, garde les noirs profonds */}
      <directionalLight color={0x1c2636} intensity={0.35} position={[40, 30, 80]} />
      {/* Ambiance minimale — évite le noir absolu sans écraser le contraste */}
      <ambientLight color={0x0c0d12} intensity={0.18} />
    </group>
  );
}
