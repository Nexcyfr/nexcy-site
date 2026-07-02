// Encodage séquence PNG → WebM (VP9) + MP4 (H.264) via FFmpeg (§7 Lot 1).
// Déterministe : fps/CRF/pixfmt/GOP fixes, aucune piste audio, faststart MP4,
// métadonnées minimales. Binaire appelé via execFile (arguments séparés, jamais
// de commande shell concaténée).

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  RENDER,
  ENCODE,
  OUT_DIR,
  assertScene,
  framesDir,
} from "./media.config.mjs";

const run = promisify(execFile);

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) out[a.slice(2)] = argv[++i];
  }
  return out;
}

export async function encodeVideo({ scene, fps = RENDER.fps } = {}) {
  assertScene(scene);
  const dir = framesDir(scene);
  if (!existsSync(path.join(dir, "frame-0000.png"))) {
    throw new Error(`Aucune frame dans ${dir}. Lance d'abord render-scene.`);
  }
  await fs.mkdir(OUT_DIR, { recursive: true });

  const input = path.join(dir, "frame-%04d.png");
  const gop = String(Math.max(1, Math.round(fps * ENCODE.gopSeconds)));
  const webm = path.join(OUT_DIR, `${scene}.webm`);
  const mp4 = path.join(OUT_DIR, `${scene}.mp4`);

  // WebM / VP9
  await run("ffmpeg", [
    "-y",
    "-framerate", String(fps),
    "-i", input,
    "-c:v", ENCODE.webm.codec,
    "-crf", String(ENCODE.webm.crf),
    "-b:v", "0",
    "-pix_fmt", ENCODE.pixfmt,
    "-g", gop,
    "-an",
    "-map_metadata", "-1",
    webm,
  ]);

  // MP4 / H.264
  await run("ffmpeg", [
    "-y",
    "-framerate", String(fps),
    "-i", input,
    "-c:v", ENCODE.mp4.codec,
    "-crf", String(ENCODE.mp4.crf),
    "-pix_fmt", ENCODE.pixfmt,
    "-g", gop,
    "-movflags", "+faststart",
    "-an",
    "-map_metadata", "-1",
    mp4,
  ]);

  return {
    webm,
    mp4,
    webmBytes: statSync(webm).size,
    mp4Bytes: statSync(mp4).size,
  };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = parseArgs(process.argv.slice(2));
  encodeVideo({ scene: args.scene, fps: args.fps ? Number(args.fps) : undefined })
    .then((r) => {
      console.log(`✓ webm ${(r.webmBytes / 1024).toFixed(0)}Ko · mp4 ${(r.mp4Bytes / 1024).toFixed(0)}Ko`);
    })
    .catch((err) => {
      console.error(`✗ encode-video : ${err.message}`);
      process.exit(1);
    });
}
