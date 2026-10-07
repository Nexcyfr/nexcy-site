/**
 * NEXCY — « Le Plan » : modèle géométrique du Hero.
 *
 * Un plan axonométrique déterministe : trame, îlots extrudés, couche réseau.
 * Aucune valeur aléatoire à l'exécution — le tirage est semé par une constante,
 * donc la composition est identique à chaque chargement, sur chaque machine.
 * Ce module ne connaît ni le canvas, ni le scroll : il ne produit que des données.
 */

/** PRNG déterministe (mulberry32) — même graine, même plan. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Graine de la composition retenue. La changer change tout le plan. */
const SEED = 20250201;

/** Un îlot bâti : emprise au sol (x, y, w, d) et hauteur h, en unités de plan. */
export interface Plot {
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  /** Ordre d'extrusion normalisé (0 = premier, 1 = dernier) — croissance radiale. */
  order: number;
  /** Îlot pivot : arête supérieure ambre + point d'accroche du réseau. */
  isNode: boolean;
}

/** Un tronçon du réseau, en coordonnées de plan, à l'altitude Z_NET. */
export interface Route {
  points: { x: number; y: number }[];
  /** Longueur cumulée, pour faire progresser les impulsions à vitesse constante. */
  length: number;
  /** Ordre d'apparition normalisé. */
  order: number;
}

export interface PlanModel {
  plots: Plot[];
  routes: Route[];
  /** Demi-étendue de la trame, en unités de plan. */
  radius: number;
  /** Altitude de la couche réseau. */
  netZ: number;
  /** Hauteur bâtie maximale. */
  maxH: number;
}

/** Altitude de la couche réseau au-dessus du plus haut îlot. */
const NET_CLEARANCE = 0.85;
/** Jeu entre deux îlots — la rue. */
const GAP = 0.16;

/**
 * Construit le plan.
 *
 * @param density `full` (desktop) ou `compact` (mobile / petits viewports) —
 *   la composition reste la même, seule l'emprise est réduite pour rester lisible.
 */
export function buildPlan(density: "full" | "compact" = "full"): PlanModel {
  const rnd = mulberry32(SEED);
  const radius = density === "full" ? 4 : 3;

  // Avenues : deux rues traversantes qui structurent la lecture du plan.
  const avenueI = 0;
  const avenueJ = 2;
  // Parvis : une respiration décentrée, pour éviter le pavage mécanique.
  const plazaI = 1;
  const plazaJ = -1;

  // Deux foyers de hauteur — le plan a un centre de gravité, pas un dôme.
  const foci: { x: number; y: number; k: number }[] = [
    { x: -1.6, y: -1.8, k: 3.7 },
    { x: 2.2, y: 1.4, k: 2.3 },
  ];

  const occupied = new Set<string>();
  const raw: Omit<Plot, "order" | "isNode">[] = [];

  for (let i = -radius; i <= radius; i++) {
    for (let j = -radius; j <= radius; j++) {
      if (i === avenueI || j === avenueJ) continue;
      if (Math.abs(i - plazaI) <= 1 && Math.abs(j - plazaJ) <= 1) continue;
      if (occupied.has(`${i},${j}`)) continue;
      // Quelques parcelles restent nues : une ville n'est jamais pleine.
      if (rnd() < 0.14) continue;

      // Fusion occasionnelle avec la parcelle suivante en i → emprises 2×1.
      const canMerge =
        i + 1 <= radius &&
        i + 1 !== avenueI &&
        !occupied.has(`${i + 1},${j}`) &&
        !(Math.abs(i + 1 - plazaI) <= 1 && Math.abs(j - plazaJ) <= 1);
      const merged = canMerge && rnd() < 0.24;

      const w = merged ? 2 : 1;
      occupied.add(`${i},${j}`);
      if (merged) occupied.add(`${i + 1},${j}`);

      // Hauteur : champ lisse autour des foyers + variance courte.
      const cx = i + w / 2;
      const cy = j + 0.5;
      let h = 0.32;
      for (const f of foci) {
        const d = Math.hypot(cx - f.x, cy - f.y);
        h += f.k * Math.exp(-(d * d) / 7.5);
      }
      h *= 0.72 + rnd() * 0.56;
      // Les emprises larges sont plus basses — la silhouette reste crédible.
      if (merged) h *= 0.62;

      raw.push({
        x: i + GAP / 2,
        y: j + GAP / 2,
        w: w - GAP,
        d: 1 - GAP,
        h: Math.max(0.22, h),
      });
    }
  }

  // Ordre d'extrusion : croissance radiale depuis le centre du plan.
  const maxDist = Math.hypot(radius + 1, radius + 1);
  const plots: Plot[] = raw.map((p) => {
    const dist = Math.hypot(p.x + p.w / 2, p.y + p.d / 2);
    return { ...p, order: Math.min(1, dist / maxDist), isNode: false };
  });

  // Îlots pivots : les plus hauts, mais dispersés — jamais deux voisins.
  const byHeight = [...plots].sort((a, b) => b.h - a.h);
  const nodes: Plot[] = [];
  for (const p of byHeight) {
    if (nodes.length >= 5) break;
    const far = nodes.every(
      (n) => Math.hypot(n.x - p.x, n.y - p.y) > (density === "full" ? 2.6 : 2.1),
    );
    if (far) {
      p.isNode = true;
      nodes.push(p);
    }
  }

  const maxH = plots.reduce((m, p) => Math.max(m, p.h), 0);
  const netZ = maxH + NET_CLEARANCE;

  // Réseau : chaînage orthogonal des pivots, trié pour un tracé lisible.
  const ordered = [...nodes].sort((a, b) => a.x + a.y - (b.x + b.y));
  const routes: Route[] = [];
  for (let k = 0; k < ordered.length - 1; k++) {
    const a = ordered[k];
    const b = ordered[k + 1];
    const ax = a.x + a.w / 2;
    const ay = a.y + a.d / 2;
    const bx = b.x + b.w / 2;
    const by = b.y + b.d / 2;
    // Coude en L : on route d'abord en x, puis en y (trace de circuit).
    const points = [
      { x: ax, y: ay },
      { x: bx, y: ay },
      { x: bx, y: by },
    ];
    routes.push({
      points,
      length: polylineLength(points),
      order: k / Math.max(1, ordered.length - 2),
    });
  }
  // Boucle de fermeture : le système est un circuit, pas une chaîne ouverte.
  if (ordered.length > 2) {
    const a = ordered[ordered.length - 1];
    const b = ordered[0];
    const ax = a.x + a.w / 2;
    const ay = a.y + a.d / 2;
    const bx = b.x + b.w / 2;
    const by = b.y + b.d / 2;
    const points = [
      { x: ax, y: ay },
      { x: ax, y: by },
      { x: bx, y: by },
    ];
    routes.push({ points, length: polylineLength(points), order: 1 });
  }

  return { plots, routes, radius, netZ, maxH };
}

function polylineLength(points: { x: number; y: number }[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  return total;
}

/** Position sur une polyligne à l'abscisse curviligne `t` (0 → 1). */
export function pointOnRoute(route: Route, t: number): { x: number; y: number } {
  const target = t * route.length;
  let walked = 0;
  for (let i = 1; i < route.points.length; i++) {
    const a = route.points[i - 1];
    const b = route.points[i];
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    if (walked + seg >= target) {
      const local = seg === 0 ? 0 : (target - walked) / seg;
      return { x: a.x + (b.x - a.x) * local, y: a.y + (b.y - a.y) * local };
    }
    walked += seg;
  }
  const last = route.points[route.points.length - 1];
  return { x: last.x, y: last.y };
}
