"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { useFrame, useThree } from "@react-three/fiber";
import { heroProgress, CITY_ANIM_DURATION, sampleCamera } from "./progress";
import { batchStaticMeshes } from "./staticBatching";

/** Rollback immédiat : repasser à false désactive la fusion runtime sans autre changement. */
const ENABLE_STATIC_BATCHING = false;

export const MODEL_URL = "/models/nexcy-hero/nexcy_hero_city_FINAL.glb";
const DRACO_PATH = "/draco/";
const LOAD_TIMEOUT_MS = 120_000;

function loadCityGLTF(): Promise<{ scene: THREE.Group; animations: THREE.AnimationClip[] }> {
  const draco = new DRACOLoader();
  draco.setDecoderPath(DRACO_PATH);
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  return new Promise((resolve, reject) => {
    loader.load(
      MODEL_URL,
      (gltf: GLTF) => resolve({ scene: gltf.scene, animations: gltf.animations }),
      undefined,
      (err: unknown) => reject(err instanceof Error ? err : new Error(String(err))),
    );
  });
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`[Hero] timeout (${ms}ms) : ${label}`)), ms);
    }),
  ]);
}

/** Hash déterministe [0,1) à partir d'une chaîne — variation reproductible par mesh. */
function hash01(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

const tmpHSL = { h: 0, s: 0, l: 0 };

/**
 * Variante batchable d'un matériau "bâtiment" : mémoïsée par matériau source
 * (une seule instance partagée par TOUS les meshes qui en dérivent), couleur
 * neutre (blanc) + vertexColors activé. La teinte par bâtiment est bakée en
 * attribut de couleur par mesh (voir applyLookdev) au lieu d'un clone de
 * matériau par mesh — mathématiquement identique au rendu (blanc × teinte =
 * teinte), mais laisse tous les meshes d'un même matériau source partager UNE
 * instance : condition nécessaire à la fusion runtime (staticBatching.ts).
 * Sans ça, chaque mesh aurait son propre matériau cloné → jamais fusionnable.
 */
const batchableMaterialCache = new WeakMap<THREE.Material, THREE.MeshStandardMaterial>();
function getBatchableVariant(std: THREE.MeshStandardMaterial): THREE.MeshStandardMaterial {
  let variant = batchableMaterialCache.get(std);
  if (!variant) {
    variant = std.clone();
    variant.vertexColors = true;
    variant.color.setRGB(1, 1, 1);
    batchableMaterialCache.set(std, variant);
  }
  return variant;
}

/**
 * Lookdev cinématographique appliqué au chargement (pas de re-export Blender) :
 * albedo assombri (surtout les surfaces claires — corrige les toits/façades
 * blancs), roughness resserrée vers des valeurs crédibles, verre nettement
 * plus sombre et teinté, légère variation de teinte par bâtiment (déterministe,
 * pas de patchwork). Modifie les matériaux du GLB chargé, jamais les fichiers
 * source.
 */
function applyLookdev(root: THREE.Object3D) {
  const processedMaterials = new WeakSet<THREE.Material>();
  const darkenedColorCache = new WeakMap<THREE.Material, THREE.Color>();

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh || !mesh.material) return;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const lname = mesh.name.toLowerCase();
    const isRoadOrGround = /asphalt|walk|line|xwalk|terrain|ground/.test(lname);

    const newMaterials = materials.map((mat) => {
      const std = mat as THREE.MeshStandardMaterial & { transmission?: number };
      if (!std.isMeshStandardMaterial) return mat;

      const mname = std.name.toLowerCase();
      const isGlass =
        /glass|vitr|window/.test(mname) || (std.transmission ?? 0) > 0.05 || std.opacity < 0.9;

      if (!processedMaterials.has(std)) {
        processedMaterials.add(std);
        std.color.getHSL(tmpHSL);

        if (isGlass) {
          // Verre fumé sombre : on tue la transmission (coûteuse + délave le
          // contraste à cette échelle) et on assombrit fortement la teinte.
          if (std.transmission !== undefined) std.transmission = 0;
          std.color.multiplyScalar(0.35);
          std.roughness = Math.min(0.85, Math.max(std.roughness, 0.55));
          std.metalness = Math.max(std.metalness, 0.2);
        } else {
          // Assombrit d'autant plus que la surface est claire à l'origine —
          // cible directement les toits/façades blancs signalés.
          const darken = tmpHSL.l > 0.5 ? 0.42 : 0.62;
          std.color.multiplyScalar(darken);
          std.roughness = Math.min(0.95, Math.max(0.45, std.roughness));
        }
        std.envMapIntensity = 0.6;
        darkenedColorCache.set(std, std.color.clone());
      }

      // Variation subtile par bâtiment (teinte/luminosité), jamais sur route/sol.
      if (!isRoadOrGround && !isGlass) {
        const baseColor = darkenedColorCache.get(std) ?? std.color;
        const seed = hash01(mesh.name || mesh.uuid);
        baseColor.getHSL(tmpHSL);
        const hueShift = (seed - 0.5) * 0.015;
        const lightShift = (seed - 0.5) * 0.08;
        const tinted = new THREE.Color().setHSL(
          (tmpHSL.h + hueShift + 1) % 1,
          tmpHSL.s,
          Math.min(0.9, Math.max(0.03, tmpHSL.l + lightShift)),
        );

        const geo = mesh.geometry;
        const vertCount = geo.attributes.position.count;
        const colorArray = new Float32Array(vertCount * 3);
        for (let i = 0; i < vertCount; i++) {
          colorArray[i * 3] = tinted.r;
          colorArray[i * 3 + 1] = tinted.g;
          colorArray[i * 3 + 2] = tinted.b;
        }
        geo.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));

        return getBatchableVariant(std);
      }

      return std;
    });

    mesh.material = Array.isArray(mesh.material) ? newMaterials : newMaterials[0];
    mesh.castShadow = !isRoadOrGround;
    mesh.receiveShadow = true;
  });
}

/**
 * Ville Manhattan / Fold (bake Blender, 111 drivers → 8 clips de keyframes
 * réelles). Chargement manuel (pas useGLTF/Suspense) : un timeout dur protège
 * contre un blocage de chargement (observé de façon intermittente sur une
 * texture parmi 90, cause non confirmée — probablement un aléa de l'environnement
 * de test, non reproduit systématiquement). Au timeout, on THROW pour laisser
 * HeroErrorBoundary basculer sur le poster — jamais d'écran noir indéfini.
 *
 * Scrub pur : mixer.setTime(progress * durée), jamais action.play() en temps réel.
 *
 * Caméra : le GLB n'exporte pas d'objet caméra glTF natif (export_cameras
 * désactivé côté Blender). Le nœud NEXCY_CAMERA_TARGET, lui, est présent et
 * animé — sa position réelle (lue depuis la scène chargée, chaque frame après
 * mixer.setTime) sert de point de visée exact. La position caméra reste
 * pilotée par sampleCamera()/CAMERA_KEYFRAMES (progress.ts), seule source
 * disponible pour la position (validée : NEXCY_CAMERA_TARGET du GLB à p=0 ==
 * valeur convertie à la main, (73.63, 40.24, -610.99)).
 */
export function City() {
  const group = useRef<THREE.Group>(null);
  const [gltf, setGltf] = useState<{ scene: THREE.Group; animations: THREE.AnimationClip[] } | null>(
    null,
  );
  const [loadError, setLoadError] = useState<Error | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const { camera } = useThree();
  const lookAt = useRef(new THREE.Vector3());

  useEffect(() => {
    let cancelled = false;
    withTimeout(loadCityGLTF(), LOAD_TIMEOUT_MS, MODEL_URL)
      .then((result) => {
        if (cancelled) return;
        applyLookdev(result.scene);
        if (ENABLE_STATIC_BATCHING) {
          const stats = batchStaticMeshes(result.scene, result.animations);
          if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.info("[Hero] static batching", stats);
          }
        }
        const mixer = new THREE.AnimationMixer(result.scene);
        result.animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.reset();
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.play();
          action.paused = true;
        });
        mixerRef.current = mixer;
        setGltf(result);
        (window as unknown as { __heroDebug?: unknown }).__heroDebug = {
          scene: result.scene,
          mixer,
          camera,
        };
      })
      .catch((err: Error) => {
        if (!cancelled) setLoadError(err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useFrame(() => {
    if (!mixerRef.current) return;
    mixerRef.current.setTime(heroProgress.value * CITY_ANIM_DURATION);

    const { pos, look } = sampleCamera(heroProgress.value);
    camera.position.set(pos[0], pos[1], pos[2]);
    lookAt.current.set(look[0], look[1], look[2]);
    camera.lookAt(lookAt.current);
  });

  if (loadError) throw loadError;
  if (!gltf) return null;

  return <primitive ref={group} object={gltf.scene} />;
}
