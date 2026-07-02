// Optimisation d'images locales → AVIF responsive (§9 Lot 1).
// Règles : fichiers locaux uniquement, extensions en liste blanche, ratio
// préservé, PAS d'upscaling, autorotation EXIF, métadonnées supprimées, tailles
// demandées uniquement, AVIF prioritaire (WebP optionnel), aucun écrasement
// silencieux du source, rapport avant/après, échec si budget dépassé.

import sharp from "sharp";
import fs from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { IMAGE_EXT } from "./media.config.mjs";

function parseArgs(argv) {
  const out = { sizes: [], webp: false, force: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--webp") out.webp = true;
    else if (a === "--force") out.force = true;
    else if (a === "--sizes") out.sizes = argv[++i].split(",").map((n) => parseInt(n, 10));
    else if (a === "--in") out.in = argv[++i];
    else if (a === "--out") out.out = argv[++i];
    else if (a === "--budget-kb") out.budgetKB = Number(argv[++i]);
    else if (a === "--quality") out.quality = Number(argv[++i]);
  }
  return out;
}

export async function optimizeImage({
  input,
  outDir,
  sizes = [],
  webp = false,
  force = false,
  quality = 55,
  budgetKB,
}) {
  if (!input || !existsSync(input)) throw new Error(`Fichier introuvable : ${input}`);
  const ext = path.extname(input).toLowerCase();
  if (!IMAGE_EXT.includes(ext)) throw new Error(`Extension non autorisée : ${ext}`);

  const dir = outDir || path.dirname(input);
  await fs.mkdir(dir, { recursive: true });

  const base = path.basename(input, ext);
  const meta = await sharp(input).metadata();
  const beforeKB = statSync(input).size / 1024;
  const targets = sizes.length ? sizes : [meta.width];
  const results = [];

  for (const w of targets) {
    // pas d'upscaling : on ignore une taille > largeur source
    const width = Math.min(w, meta.width || w);
    for (const fmt of webp ? ["avif", "webp"] : ["avif"]) {
      const dest = path.join(dir, sizes.length ? `${base}-${width}.${fmt}` : `${base}.${fmt}`);
      if (existsSync(dest) && !force) {
        throw new Error(`Cible existe déjà (utilise --force) : ${dest}`);
      }
      // refus d'écrasement silencieux du source
      if (path.resolve(dest) === path.resolve(input)) {
        throw new Error(`Refus d'écraser le fichier source : ${dest}`);
      }
      let pipe = sharp(input).rotate().resize({ width, withoutEnlargement: true });
      pipe = fmt === "avif" ? pipe.avif({ quality }) : pipe.webp({ quality });
      await pipe.toFile(dest);
      const kb = statSync(dest).size / 1024;
      if (budgetKB && kb > budgetKB) {
        throw new Error(`Budget dépassé : ${dest} = ${kb.toFixed(0)}Ko > ${budgetKB}Ko`);
      }
      results.push({ dest, width, fmt, kb });
    }
  }

  return { input, beforeKB, results };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const a = parseArgs(process.argv.slice(2));
  optimizeImage({
    input: a.in,
    outDir: a.out,
    sizes: a.sizes,
    webp: a.webp,
    force: a.force,
    quality: a.quality,
    budgetKB: a.budgetKB,
  })
    .then((r) => {
      console.log(`Source ${path.basename(r.input)} : ${r.beforeKB.toFixed(0)}Ko`);
      for (const o of r.results) {
        const reduc = (100 - (o.kb / r.beforeKB) * 100).toFixed(0);
        console.log(`  → ${path.basename(o.dest)} ${o.width}px ${o.fmt} ${o.kb.toFixed(0)}Ko (-${reduc}%)`);
      }
    })
    .catch((err) => {
      console.error(`✗ optimize-images : ${err.message}`);
      process.exit(1);
    });
}
