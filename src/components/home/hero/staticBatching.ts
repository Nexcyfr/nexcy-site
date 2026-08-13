"use client";

import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Fusion runtime des meshes STATIQUES du GLB (jamais export-time — jamais de
 * `join`/`flatten`/`instance` gltf-transform : c'est cette famille d'outils,
 * appliquée à une hiérarchie animée, qui avait corrompu la géométrie lors du
 * diagnostic précédent). Ici, tout se passe après chargement, sur la scène
 * THREE.js déjà construite, avec le mixer déjà en connaissance de la
 * hiérarchie d'origine (les nodes animés ne sont ni renommés ni déplacés,
 * seuls des meshes STATIQUES sont retirés et remplacés par des meshes fusionnés).
 *
 * Sécurité :
 * - ANIMATED_PROTECTED_SET = tout node ciblé par un track d'anim + tous ses
 *   descendants (leur world transform bouge aussi, même sans track direct).
 * - Fusion par cellule spatiale (jamais un mega-mesh unique) : préserve le
 *   frustum culling de Three.js.
 * - Groupement strict : même matériau (uuid), même layout d'attributs, même
 *   castShadow/receiveShadow/renderOrder, jamais de matériau transparent
 *   (le tri de profondeur par objet des meshes transparents ne survivrait
 *   pas à la fusion — exclusion volontaire, pas une négligence).
 * - Chaque géométrie source est clonée avant bake du matrixWorld — la source
 *   n'est jamais mutée.
 */

const CELL_SIZE_METERS = 60;

export interface BatchStats {
  totalMeshes: number;
  protectedMeshes: number;
  eligibleMeshes: number;
  skippedTransparent: number;
  batchedAway: number;
  batchGroupsCreated: number;
  estimatedDrawCallsBefore: number;
  estimatedDrawCallsAfter: number;
}

function collectAnimatedNodeNames(clips: THREE.AnimationClip[]): Set<string> {
  const names = new Set<string>();
  for (const clip of clips) {
    for (const track of clip.tracks) {
      const dot = track.name.lastIndexOf(".");
      if (dot === -1) continue;
      const nodePath = track.name.slice(0, dot);
      const slash = nodePath.lastIndexOf("/");
      names.add(slash === -1 ? nodePath : nodePath.slice(slash + 1));
    }
  }
  return names;
}

/** Nodes animés + TOUS leurs descendants (leur world transform change aussi). */
function collectProtectedObjects(root: THREE.Object3D, animatedNodeNames: Set<string>): Set<THREE.Object3D> {
  const protectedSet = new Set<THREE.Object3D>();
  root.traverse((obj) => {
    if (animatedNodeNames.has(obj.name)) {
      obj.traverse((child) => protectedSet.add(child));
    }
  });
  return protectedSet;
}

function isSkinnedOrMorphed(mesh: THREE.Mesh): boolean {
  if ((mesh as unknown as THREE.SkinnedMesh).isSkinnedMesh) return true;
  const geo = mesh.geometry;
  if (!geo) return true;
  if (geo.morphAttributes && Object.keys(geo.morphAttributes).length > 0) return true;
  if (geo.attributes.skinIndex || geo.attributes.skinWeight) return true;
  return false;
}

function attributeSetKey(geo: THREE.BufferGeometry): string {
  return Object.keys(geo.attributes).sort().join(",");
}

function materialKey(mat: THREE.Material): string {
  return [mat.uuid, mat.side, (mat as THREE.MeshStandardMaterial).alphaTest ?? 0].join("|");
}

const worldPosScratch = new THREE.Vector3();

function cellKeyFor(mesh: THREE.Mesh): string {
  mesh.getWorldPosition(worldPosScratch);
  const cx = Math.floor(worldPosScratch.x / CELL_SIZE_METERS);
  const cy = Math.floor(worldPosScratch.y / CELL_SIZE_METERS);
  const cz = Math.floor(worldPosScratch.z / CELL_SIZE_METERS);
  return `${cx}_${cy}_${cz}`;
}

export function batchStaticMeshes(
  root: THREE.Object3D,
  animations: THREE.AnimationClip[],
): BatchStats {
  const animatedNodeNames = collectAnimatedNodeNames(animations);
  const protectedSet = collectProtectedObjects(root, animatedNodeNames);

  // Bake relatif à `root`, jamais au repère monde absolu : à cet instant
  // (appelé avant l'attache du gltf.scene à l'arbre R3F), `root` peut déjà
  // porter son propre transform local (root.matrix != identité — courant
  // sur un export Blender). matrixWorld l'inclut déjà ; comme `batched` est
  // ensuite rattaché comme enfant DIRECT de `root`, appliquer matrixWorld
  // tel quel appliquerait ce transform deux fois (bug constaté : géométrie
  // fusionnée bien présente mais déplacée hors caméra, tandis que les
  // meshes protégés — jamais fusionnés — restaient corrects).
  root.updateWorldMatrix(true, false);
  const rootWorldInverse = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const localToRoot = new THREE.Matrix4();

  const groups = new Map<string, THREE.Mesh[]>();
  let totalMeshes = 0;
  let protectedMeshes = 0;
  let eligibleMeshes = 0;
  let skippedTransparent = 0;

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    totalMeshes++;

    if (protectedSet.has(mesh)) {
      protectedMeshes++;
      return;
    }
    if (!mesh.visible) return;
    if (!mesh.material || Array.isArray(mesh.material)) return; // multi-matériau exclu, prudence
    if (!mesh.geometry || !mesh.geometry.attributes.position) return;
    if (mesh.geometry.attributes.position.count === 0) return;
    if (isSkinnedOrMorphed(mesh)) return;
    if (mesh.material.transparent) {
      skippedTransparent++;
      return;
    }

    eligibleMeshes++;
    const key = [
      materialKey(mesh.material),
      attributeSetKey(mesh.geometry),
      mesh.castShadow ? 1 : 0,
      mesh.receiveShadow ? 1 : 0,
      mesh.renderOrder,
      cellKeyFor(mesh),
    ].join("::");
    const arr = groups.get(key);
    if (arr) arr.push(mesh);
    else groups.set(key, [mesh]);
  });

  let batchedAway = 0;
  let batchGroupsCreated = 0;

  groups.forEach((meshes) => {
    if (meshes.length < 2) return; // rien à gagner à fusionner un groupe d'1 seul mesh

    const geometries: THREE.BufferGeometry[] = [];
    for (const mesh of meshes) {
      mesh.updateWorldMatrix(true, false);
      localToRoot.multiplyMatrices(rootWorldInverse, mesh.matrixWorld);
      const cloned = mesh.geometry.clone(); // jamais de mutation de la géométrie source
      cloned.applyMatrix4(localToRoot);
      geometries.push(cloned);
    }

    let merged: THREE.BufferGeometry | null = null;
    try {
      merged = mergeGeometries(geometries, false);
    } catch {
      merged = null;
    }
    geometries.forEach((g) => g.dispose());

    if (!merged) return; // layout incompatible détecté à la fusion → on garde les meshes séparés, aucun rollback nécessaire

    merged.computeBoundingBox();
    merged.computeBoundingSphere();
    const bs = merged.boundingSphere;
    if (!bs || !Number.isFinite(bs.radius) || Number.isNaN(bs.center.x)) {
      // Bounding volume dégénéré (NaN) : on ne prend aucun risque, la
      // géométrie fusionnée est jetée et les meshes source restent en l'état.
      merged.dispose();
      return;
    }

    const template = meshes[0];
    const batched = new THREE.Mesh(merged, template.material as THREE.Material);
    batched.castShadow = template.castShadow;
    batched.receiveShadow = template.receiveShadow;
    batched.renderOrder = template.renderOrder;
    batched.name = `batch_${meshes.length}x_${template.name}`;
    batched.frustumCulled = true;

    // Les vertices sont déjà en espace "monde relatif à root" (matrixWorld
    // baké) : le mesh fusionné doit être un enfant direct de root, jamais
    // d'un parent qui appliquerait une seconde fois un transform.
    root.add(batched);

    for (const mesh of meshes) {
      mesh.parent?.remove(mesh);
      mesh.geometry.dispose();
    }

    batchedAway += meshes.length;
    batchGroupsCreated++;
  });

  return {
    totalMeshes,
    protectedMeshes,
    eligibleMeshes,
    skippedTransparent,
    batchedAway,
    batchGroupsCreated,
    estimatedDrawCallsBefore: totalMeshes,
    estimatedDrawCallsAfter: totalMeshes - batchedAway + batchGroupsCreated,
  };
}
