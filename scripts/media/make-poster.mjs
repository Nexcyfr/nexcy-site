// Poster = 1ʳᵉ frame de la vidéo → AVIF (§6 Lot 1). Sharp, sortie sous .tmp/out.

import sharp from "sharp";
import fs from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ENCODE, OUT_DIR, assertScene, framesDir } from "./media.config.mjs";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) out[a.slice(2)] = argv[++i];
  }
  return out;
}

export async function makePoster({ scene } = {}) {
  assertScene(scene);
  const frame0 = path.join(framesDir(scene), "frame-0000.png");
  if (!existsSync(frame0)) {
    throw new Error(`Frame 0 introuvable : ${frame0}. Lance d'abord render-scene.`);
  }
  await fs.mkdir(OUT_DIR, { recursive: true });
  const poster = path.join(OUT_DIR, `${scene}-poster.avif`);

  await sharp(frame0)
    .avif({ quality: ENCODE.poster.avifQuality })
    .toFile(poster);

  return { poster, bytes: statSync(poster).size };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = parseArgs(process.argv.slice(2));
  makePoster({ scene: args.scene })
    .then((r) => console.log(`✓ poster ${(r.bytes / 1024).toFixed(1)}Ko`))
    .catch((err) => {
      console.error(`✗ make-poster : ${err.message}`);
      process.exit(1);
    });
}
