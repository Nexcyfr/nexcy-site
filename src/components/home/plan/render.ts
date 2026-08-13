/**
 * NEXCY — « Le Plan » : rendu.
 *
 * `drawPlan` est une fonction pure : même (progress, largeur, hauteur) → même image.
 * Aucun état accumulé, aucune transformation incrémentale : le scroll peut être
 * parcouru dans les deux sens, relâché, repris à n'importe quel point.
 *
 * `time` n'alimente que deux choses strictement décoratives — le déplacement des
 * impulsions et une respiration lumineuse. La structure, elle, ne dépend que de
 * `progress`.
 */

import { pointOnRoute, type PlanModel, type Plot, type Route } from "./system";

/* ── Palette (miroir des tokens CSS — le canvas ne lit pas le CSS) ────────── */
const COL = {
  void: "#080808",
  line: "153,149,143",
  warmWhite: "244,241,235",
  accent: "217,145,61",
  accentLight: "231,170,98",
} as const;

/** Projection axonométrique isométrique classique (30°). */
const ISO_X = Math.cos(Math.PI / 6);
const ISO_Y = Math.sin(Math.PI / 6);

export interface Camera {
  scale: number;
  cx: number;
  cy: number;
}

function project(x: number, y: number, z: number, cam: Camera) {
  return {
    sx: (x - y) * ISO_X * cam.scale + cam.cx,
    sy: (x + y) * ISO_Y * cam.scale - z * cam.scale + cam.cy,
  };
}

/* ── Utilitaires de progression ───────────────────────────────────────────── */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Fenêtre de progression : renvoie 0→1 pendant que `p` traverse [a, b]. */
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/** Adoucissement doux, sans dépendance (équivalent d'un power2.inOut). */
const smooth = (t: number) => t * t * (3 - 2 * t);
/** Sortie franche — les structures arrivent vite puis se posent. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ── Phases ───────────────────────────────────────────────────────────────── */

export const PHASES = [
  { id: "signal", label: "Signal", at: 0.0 },
  { id: "structure", label: "Structure", at: 0.1 },
  { id: "systeme", label: "Système", at: 0.28 },
  { id: "flux", label: "Flux", at: 0.5 },
  { id: "controle", label: "Contrôle", at: 0.7 },
  { id: "nexcy", label: "NEXCY", at: 0.88 },
] as const;

/** Index de la phase active pour une progression donnée. */
export function phaseIndex(p: number): number {
  let idx = 0;
  for (let i = 0; i < PHASES.length; i++) if (p >= PHASES[i].at) idx = i;
  return idx;
}

/* ── Rendu ────────────────────────────────────────────────────────────────── */

export interface DrawOptions {
  model: PlanModel;
  progress: number;
  /** Secondes écoulées — n'affecte que les impulsions et la respiration. */
  time: number;
  width: number;
  height: number;
  /** Composition adaptée : le texte occupe le bas-gauche en desktop. */
  compact: boolean;
}

/**
 * Cadre la composition : on projette l'enveloppe du plan à sa hauteur pleine,
 * puis on l'inscrit dans le viewport. Recalculé à chaque redimensionnement,
 * donc aucune mesure ne peut rester périmée après un resize.
 */
export function fitCamera(
  model: PlanModel,
  width: number,
  height: number,
  compact: boolean,
  zoom = 1,
): Camera {
  const r = model.radius + 1;
  /** Enveloppe du plan projetée à l'échelle 1 — indépendante du viewport. */
  const bounds = (scale: number) => {
    const probe: Camera = { scale, cx: 0, cy: 0 };
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const [x, y] of [
      [-r, -r],
      [r, -r],
      [-r, r],
      [r, r],
    ]) {
      for (const z of [0, model.netZ]) {
        const { sx, sy } = project(x, y, z, probe);
        minX = Math.min(minX, sx);
        maxX = Math.max(maxX, sx);
        minY = Math.min(minY, sy);
        maxY = Math.max(maxY, sy);
      }
    }
    return { minX, maxX, minY, maxY };
  };

  // Le plan est l'objet dominant : il occupe le cadre, le titre se pose dessus.
  const unit = bounds(1);
  // La marge basse doit laisser passer la ligne de cote, qui vit sous l'objet.
  const padX = compact ? 0.98 : 0.94;
  const padY = compact ? 0.62 : 0.8;
  const scale =
    Math.min(
      (width * padX) / (unit.maxX - unit.minX),
      (height * padY) / (unit.maxY - unit.minY),
    ) * zoom;

  // Recentrage à l'échelle finale : le cadrage reste exact à tout zoom.
  // Décalé à droite en desktop pour dégager la colonne de titre, centré sinon.
  const b = bounds(scale);
  return {
    scale,
    cx: width * (compact ? 0.5 : 0.58) - (b.minX + b.maxX) / 2,
    cy: height * (compact ? 0.38 : 0.44) - (b.minY + b.maxY) / 2,
  };
}

export function drawPlan(ctx: CanvasRenderingContext2D, o: DrawOptions): void {
  const { model, progress: p, time, width: w, height: h, compact } = o;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = COL.void;
  ctx.fillRect(0, 0, w, h);

  // Caméra : léger rapprochement, puis repli quand la proposition prend la parole.
  // `fitCamera` recentre à l'échelle finale, donc aucune dérive cumulée.
  const zoom = lerp(0.88, 1.0, easeOut(seg(p, 0, 0.62)));
  const recede = lerp(1, 0.965, smooth(seg(p, 0.88, 1)));
  const cam = fitCamera(model, w, h, compact, zoom * recede);

  // Respiration : ±6 % sur l'intensité ambre. Décoratif, jamais structurel.
  const breath = 0.94 + 0.06 * Math.sin(time * 0.9);

  // Opacité générale : le plan s'efface derrière la proposition finale.
  const globalFade = lerp(1, 0.34, smooth(seg(p, 0.88, 1)));

  ctx.save();
  ctx.globalAlpha = globalFade;
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";

  drawSite(ctx, model, cam, p);
  drawGrid(ctx, model, cam, p);
  drawFootprints(ctx, model, cam, p);
  drawSignal(ctx, model, cam, p, breath);
  drawPlots(ctx, model, cam, p, breath);
  drawNetwork(ctx, model, cam, p, time, breath);

  ctx.restore();

  // Cotes en espace écran — dessinées hors du fondu général : elles encadrent.
  drawDimensions(ctx, model, cam, p, w, h, compact, globalFade);
}

/* ── Phase 01 · Signal — l'emprise du terrain, présente dès l'arrivée ─────── */

/**
 * Périmètre d'intervention : le losange qui délimite le terrain, plus un léger
 * halo au sol. C'est ce qui donne à l'image d'accueil une composition finie
 * plutôt qu'une trame flottante. Il s'efface quand le bâti prend le relais.
 */
function drawSite(
  ctx: CanvasRenderingContext2D,
  model: PlanModel,
  cam: Camera,
  p: number,
) {
  const r = model.radius + 1;
  const draw = easeOut(seg(p, -0.7, 0.03));
  const fade = 1 - smooth(seg(p, 0.24, 0.5));
  if (draw <= 0 || fade <= 0) return;

  const corners = [
    project(-r, -r, 0, cam),
    project(r, -r, 0, cam),
    project(r, r, 0, cam),
    project(-r, r, 0, cam),
  ];

  ctx.save();

  // Halo au sol : le terrain existe avant qu'on y pose quoi que ce soit.
  const c = project(0, 0, 0, cam);
  const spanX = Math.abs(corners[1].sx - corners[3].sx) / 2;
  const halo = ctx.createRadialGradient(c.sx, c.sy, 0, c.sx, c.sy, spanX);
  halo.addColorStop(0, `rgba(${COL.line},${0.1 * fade})`);
  halo.addColorStop(1, `rgba(${COL.line},0)`);
  ctx.fillStyle = halo;
  poly(ctx, corners);
  ctx.fill();

  // Le trait de périmètre, tracé d'un seul geste depuis le sommet nord.
  ctx.lineWidth = 1;
  ctx.strokeStyle = `rgba(${COL.line},${0.75 * fade})`;
  ctx.setLineDash([4, 5]);
  poly(ctx, corners);
  ctx.stroke();
  ctx.setLineDash([]);

  // Repères d'angle en ambre — quatre points de calage, rien de plus.
  ctx.fillStyle = `rgba(${COL.accent},${0.7 * fade * draw})`;
  for (const q of corners) {
    ctx.fillRect(q.sx - 1.5, q.sy - 1.5, 3, 3);
  }

  ctx.restore();
}

/* ── Signal · l'axe d'origine ─────────────────────────────────────────────── */

function drawSignal(
  ctx: CanvasRenderingContext2D,
  model: PlanModel,
  cam: Camera,
  p: number,
  breath: number,
) {
  // Axe vertical ambre à l'origine du plan : le point d'entrée. Présent dès
  // l'arrivée sur la page, il s'efface une fois le bâti en place.
  const rise = easeOut(seg(p, -0.5, 0.06));
  const fade = 1 - smooth(seg(p, 0.2, 0.4));
  if (rise <= 0 || fade <= 0) return;

  const origin = project(0, 0, 0, cam);
  const top = project(0, 0, model.netZ * 1.1, cam);
  const y = lerp(origin.sy, top.sy, rise);

  const grad = ctx.createLinearGradient(origin.sx, origin.sy, origin.sx, y);
  grad.addColorStop(0, `rgba(${COL.accent},${0.9 * fade * breath})`);
  grad.addColorStop(1, `rgba(${COL.accent},0)`);

  ctx.save();
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(origin.sx, origin.sy);
  ctx.lineTo(origin.sx, y);
  ctx.stroke();

  // Point d'origine — la seule marque au tout début.
  ctx.fillStyle = `rgba(${COL.accent},${fade * breath})`;
  ctx.beginPath();
  ctx.arc(origin.sx, origin.sy, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/* ── Phase 02 · Structure ─────────────────────────────────────────────────── */

function drawGrid(
  ctx: CanvasRenderingContext2D,
  model: PlanModel,
  cam: Camera,
  p: number,
) {
  const r = model.radius + 1;
  // La trame est le donné : elle est déjà là quand on arrive sur la page.
  // La fenêtre déborde en négatif pour que p = 0 corresponde à une trame complète.
  const appear = seg(p, -0.6, 0.04);
  if (appear <= 0) return;
  // Elle s'atténue une fois le bâti en place : elle a joué son rôle.
  const settle = lerp(1, 0.4, smooth(seg(p, 0.34, 0.6)));

  ctx.save();
  ctx.lineWidth = 1;

  for (let i = -r; i <= r; i++) {
    // Les lignes proches du centre se tracent en premier — la trame se déploie.
    const delay = (Math.abs(i) / r) * 0.55;
    const t = easeOut(clamp01((appear - delay) / (1 - delay)));
    if (t <= 0) continue;

    // Hiérarchie de trame : une ligne sur deux porte, les autres accompagnent.
    const alpha = 0.3 * settle * (Math.abs(i) % 2 === 0 ? 1 : 0.42);
    ctx.strokeStyle = `rgba(${COL.line},${alpha})`;

    // Ligne parallèle à y, tracée depuis le centre vers les deux extrémités.
    strokeFromCenter(ctx, cam, i, -r, i, r, t);
    strokeFromCenter(ctx, cam, -r, i, r, i, t);
  }
  ctx.restore();
}

/** Trace un segment du plan en le déployant depuis son milieu. */
function strokeFromCenter(
  ctx: CanvasRenderingContext2D,
  cam: Camera,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  t: number,
) {
  const mx = (x0 + x1) / 2;
  const my = (y0 + y1) / 2;
  const a = project(lerp(mx, x0, t), lerp(my, y0, t), 0, cam);
  const b = project(lerp(mx, x1, t), lerp(my, y1, t), 0, cam);
  ctx.beginPath();
  ctx.moveTo(a.sx, a.sy);
  ctx.lineTo(b.sx, b.sy);
  ctx.stroke();
}

/* ── Phase 02 · Structure — les emprises, à plat, avant tout volume ───────── */

function drawFootprints(
  ctx: CanvasRenderingContext2D,
  model: PlanModel,
  cam: Camera,
  p: number,
) {
  const appear = seg(p, 0.04, 0.3);
  if (appear <= 0) return;
  // Une fois les volumes sortis de terre, l'emprise n'a plus à être lue.
  const fade = 1 - smooth(seg(p, 0.3, 0.5));
  if (fade <= 0) return;

  ctx.save();
  ctx.lineWidth = 1;
  for (const plot of model.plots) {
    const delay = plot.order * 0.7;
    const t = easeOut(clamp01((appear - delay) / (1 - delay)));
    if (t <= 0.001) continue;

    // L'emprise se dessine depuis son centre — chaque parcelle s'ouvre.
    const cx = plot.x + plot.w / 2;
    const cy = plot.y + plot.d / 2;
    const hw = (plot.w / 2) * t;
    const hd = (plot.d / 2) * t;
    const pts = [
      project(cx - hw, cy - hd, 0, cam),
      project(cx + hw, cy - hd, 0, cam),
      project(cx + hw, cy + hd, 0, cam),
      project(cx - hw, cy + hd, 0, cam),
    ];

    ctx.strokeStyle = plot.isNode
      ? `rgba(${COL.accent},${0.55 * t * fade})`
      : `rgba(${COL.line},${0.5 * t * fade})`;
    poly(ctx, pts);
    ctx.stroke();
  }
  ctx.restore();
}

/* ── Phase 03 · Système ───────────────────────────────────────────────────── */

function drawPlots(
  ctx: CanvasRenderingContext2D,
  model: PlanModel,
  cam: Camera,
  p: number,
  breath: number,
) {
  const build = seg(p, 0.22, 0.6);
  if (build <= 0) return;

  // Algorithme du peintre : les îlots lointains d'abord.
  const sorted = [...model.plots].sort((a, b) => a.x + a.y - (b.x + b.y));

  for (const plot of sorted) {
    // Extrusion échelonnée : croissance radiale depuis le cœur du plan.
    const delay = plot.order * 0.62;
    const t = easeOut(clamp01((build - delay) / (1 - delay)));
    if (t <= 0.001) continue;
    drawPlot(ctx, plot, cam, plot.h * t, p, breath);
  }
}

function drawPlot(
  ctx: CanvasRenderingContext2D,
  plot: Plot,
  cam: Camera,
  z: number,
  p: number,
  breath: number,
) {
  const { x, y, w, d } = plot;
  const x1 = x + w;
  const y1 = y + d;

  const topA = project(x, y, z, cam);
  const topB = project(x1, y, z, cam);
  const topC = project(x1, y1, z, cam);
  const topD = project(x, y1, z, cam);
  const botB = project(x1, y, 0, cam);
  const botC = project(x1, y1, 0, cam);
  const botD = project(x, y1, 0, cam);

  // Trois valeurs franches — une source lumineuse unique, haute et à droite.
  // L'écart entre les faces fait tout le volume : sans lui, le plan est illisible.
  ctx.fillStyle = "rgb(36,35,33)";
  poly(ctx, [topB, topC, botC, botB]); // face droite, exposée
  ctx.fill();

  ctx.fillStyle = "rgb(19,19,18)";
  poly(ctx, [topC, topD, botD, botC]); // face avant, en retrait
  ctx.fill();

  ctx.fillStyle = "rgb(54,52,49)";
  poly(ctx, [topA, topB, topC, topD]); // toiture, seule surface qui capte
  ctx.fill();

  // Arêtes : le trait fait le dessin, pas le remplissage.
  ctx.lineWidth = 1;
  ctx.strokeStyle = `rgba(${COL.line},0.42)`;
  poly(ctx, [topA, topB, topC, topD]);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(topC.sx, topC.sy);
  ctx.lineTo(botC.sx, botC.sy);
  ctx.stroke();

  // Arête de crête côté lumière — le liseré qui détache chaque volume du fond.
  ctx.strokeStyle = `rgba(${COL.warmWhite},0.16)`;
  ctx.beginPath();
  ctx.moveTo(topA.sx, topA.sy);
  ctx.lineTo(topB.sx, topB.sy);
  ctx.lineTo(topC.sx, topC.sy);
  ctx.stroke();

  // Îlot pivot : arête de toit ambre, allumée à partir de la phase Contrôle.
  if (plot.isNode) {
    const lit = smooth(seg(p, 0.68, 0.86));
    if (lit > 0) {
      ctx.strokeStyle = `rgba(${COL.accent},${0.85 * lit * breath})`;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(topB.sx, topB.sy);
      ctx.lineTo(topC.sx, topC.sy);
      ctx.lineTo(topD.sx, topD.sy);
      ctx.stroke();
    }
  }
}

function poly(ctx: CanvasRenderingContext2D, pts: { sx: number; sy: number }[]) {
  ctx.beginPath();
  ctx.moveTo(pts[0].sx, pts[0].sy);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].sx, pts[i].sy);
  ctx.closePath();
}

/* ── Phase 04 · Flux ──────────────────────────────────────────────────────── */

function drawNetwork(
  ctx: CanvasRenderingContext2D,
  model: PlanModel,
  cam: Camera,
  p: number,
  time: number,
  breath: number,
) {
  const appear = seg(p, 0.5, 0.78);
  if (appear <= 0) return;

  ctx.save();

  // Colonnes montantes : du toit des pivots jusqu'à la couche réseau.
  const riser = easeOut(seg(p, 0.5, 0.66));
  ctx.lineWidth = 1;
  ctx.strokeStyle = `rgba(${COL.accent},${0.34 * riser})`;
  for (const plot of model.plots) {
    if (!plot.isNode) continue;
    const cx = plot.x + plot.w / 2;
    const cy = plot.y + plot.d / 2;
    const a = project(cx, cy, plot.h, cam);
    const b = project(cx, cy, lerp(plot.h, model.netZ, riser), cam);
    ctx.beginPath();
    ctx.moveTo(a.sx, a.sy);
    ctx.lineTo(b.sx, b.sy);
    ctx.stroke();
  }

  // Tronçons du réseau : tracés dans l'ordre, chacun sur sa fenêtre.
  for (const route of model.routes) {
    const delay = route.order * 0.4;
    const t = easeOut(clamp01((appear - delay) / (1 - delay)));
    if (t <= 0) continue;
    drawRoute(ctx, route, cam, model.netZ, t);
  }

  // Impulsions : la donnée circule. Position pilotée par le temps, opacité par p.
  const pulseAlpha = smooth(seg(p, 0.6, 0.74)) * (1 - smooth(seg(p, 0.92, 1)));
  if (pulseAlpha > 0.01) {
    for (let i = 0; i < model.routes.length; i++) {
      const route = model.routes[i];
      const phase = (time * 0.17 + i * 0.37) % 1;
      const q = pointOnRoute(route, phase);
      const s = project(q.x, q.y, model.netZ, cam);

      const glow = ctx.createRadialGradient(s.sx, s.sy, 0, s.sx, s.sy, 9);
      glow.addColorStop(0, `rgba(${COL.accentLight},${0.8 * pulseAlpha * breath})`);
      glow.addColorStop(1, `rgba(${COL.accent},0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(s.sx, s.sy, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(${COL.warmWhite},${0.95 * pulseAlpha})`;
      ctx.beginPath();
      ctx.arc(s.sx, s.sy, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

/** Trace une polyligne du réseau jusqu'à la fraction `t` de sa longueur. */
function drawRoute(
  ctx: CanvasRenderingContext2D,
  route: Route,
  cam: Camera,
  z: number,
  t: number,
) {
  const target = t * route.length;
  let walked = 0;

  ctx.strokeStyle = `rgba(${COL.accent},0.42)`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  const start = project(route.points[0].x, route.points[0].y, z, cam);
  ctx.moveTo(start.sx, start.sy);

  for (let i = 1; i < route.points.length; i++) {
    const a = route.points[i - 1];
    const b = route.points[i];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    if (walked + len <= target) {
      const q = project(b.x, b.y, z, cam);
      ctx.lineTo(q.sx, q.sy);
      walked += len;
    } else {
      const local = len === 0 ? 0 : (target - walked) / len;
      const q = project(lerp(a.x, b.x, local), lerp(a.y, b.y, local), z, cam);
      ctx.lineTo(q.sx, q.sy);
      break;
    }
  }
  ctx.stroke();

  // Nœuds du réseau : un carré ouvert à chaque coude atteint.
  walked = 0;
  for (let i = 0; i < route.points.length; i++) {
    if (i > 0) {
      walked += Math.hypot(
        route.points[i].x - route.points[i - 1].x,
        route.points[i].y - route.points[i - 1].y,
      );
    }
    if (walked > target) break;
    const q = project(route.points[i].x, route.points[i].y, z, cam);
    ctx.strokeStyle = `rgba(${COL.accent},0.7)`;
    ctx.strokeRect(q.sx - 2.5, q.sy - 2.5, 5, 5);
  }
}

/* ── Phase 05 · Contrôle — cotes en espace écran ──────────────────────────── */

function drawDimensions(
  ctx: CanvasRenderingContext2D,
  model: PlanModel,
  cam: Camera,
  p: number,
  w: number,
  h: number,
  compact: boolean,
  fade: number,
) {
  const appear = smooth(seg(p, 0.7, 0.88));
  if (appear <= 0.01) return;
  const alpha = appear * fade;

  // Enveloppe projetée du bâti — la cote mesure ce qui a réellement été construit.
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const plot of model.plots) {
    for (const [x, y] of [
      [plot.x, plot.y],
      [plot.x + plot.w, plot.y],
      [plot.x, plot.y + plot.d],
      [plot.x + plot.w, plot.y + plot.d],
    ]) {
      for (const z of [0, plot.h]) {
        const q = project(x, y, z, cam);
        minX = Math.min(minX, q.sx);
        maxX = Math.max(maxX, q.sx);
        minY = Math.min(minY, q.sy);
        maxY = Math.max(maxY, q.sy);
      }
    }
  }
  const pad = compact ? 14 : 24;
  minX -= pad;
  maxX += pad;
  minY -= pad;
  maxY += pad;

  ctx.save();
  ctx.lineWidth = 1;

  // Équerres de coin — jamais un cadre fermé : ça respire.
  const arm = compact ? 14 : 22;
  ctx.strokeStyle = `rgba(${COL.line},${0.55 * alpha})`;
  const corners: [number, number, number, number][] = [
    [minX, minY, 1, 1],
    [maxX, minY, -1, 1],
    [minX, maxY, 1, -1],
    [maxX, maxY, -1, -1],
  ];
  for (const [cx, cy, dx, dy] of corners) {
    ctx.beginPath();
    ctx.moveTo(cx + dx * arm, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + dy * arm);
    ctx.stroke();
  }

  // Ligne de cote horizontale, sous l'enveloppe.
  const dimY = Math.min(maxY + (compact ? 18 : 26), h - (compact ? 12 : 20));
  ctx.strokeStyle = `rgba(${COL.line},${0.4 * alpha})`;
  ctx.beginPath();
  ctx.moveTo(minX, dimY);
  ctx.lineTo(maxX, dimY);
  ctx.stroke();
  for (const x of [minX, maxX]) {
    ctx.beginPath();
    ctx.moveTo(x, dimY - 4);
    ctx.lineTo(x, dimY + 4);
    ctx.stroke();
  }

  // Graduation régulière — la mesure, pas la décoration.
  const ticks = compact ? 8 : 16;
  ctx.strokeStyle = `rgba(${COL.line},${0.22 * alpha})`;
  for (let i = 1; i < ticks; i++) {
    const x = lerp(minX, maxX, i / ticks);
    ctx.beginPath();
    ctx.moveTo(x, dimY);
    ctx.lineTo(x, dimY + 3);
    ctx.stroke();
  }

  // Étiquette de cote : le décompte réel du plan, calé à gauche sous la ligne,
  // là où il ne peut croiser ni le bâti ni le bloc de titre.
  ctx.fillStyle = `rgba(${COL.line},${0.8 * alpha})`;
  ctx.font = "500 10px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.letterSpacing = "0.14em";
  ctx.fillText(
    `${model.plots.length} MODULES · ${model.routes.length} LIAISONS`,
    minX,
    dimY + 9,
  );
  ctx.letterSpacing = "0px";

  ctx.restore();
}
