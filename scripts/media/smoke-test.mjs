// Test fumée du pipeline média (§10 Lot 1). Entièrement TEMPORAIRE.
// Rend une scène courte déterministe → WebM + MP4 + poster AVIF → analyse
// FFprobe → rapport complet → SUPPRESSION des fichiers temporaires.
// Ne laisse rien dans public/assets, ne commit aucun média.

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { renderScene } from "./render-scene.mjs";
import { encodeVideo } from "./encode-video.mjs";
import { makePoster } from "./make-poster.mjs";
import {
  BASE_URL,
  RENDER,
  BUDGETS,
  TMP,
  OUT_DIR,
  framesDir,
} from "./media.config.mjs";

const run = promisify(execFile);

async function assertBinary(bin) {
  try {
    await run(bin, ["-version"]);
  } catch {
    throw new Error(`Binaire requis absent : ${bin}`);
  }
}

async function probe(url) {
  try {
    const res = await fetch(url, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

async function ffprobe(file) {
  const { stdout } = await run("ffprobe", [
    "-v", "error",
    "-print_format", "json",
    "-show_format",
    "-show_streams",
    file,
  ]);
  const j = JSON.parse(stdout);
  const v = j.streams.find((s) => s.codec_type === "video") || {};
  const a = j.streams.find((s) => s.codec_type === "audio");
  const [num, den] = (v.r_frame_rate || "0/1").split("/");
  return {
    duration: Number(j.format.duration || 0),
    width: v.width,
    height: v.height,
    codec: v.codec_name,
    profile: v.profile || "—",
    pixfmt: v.pix_fmt,
    bitrate: Number(j.format.bit_rate || v.bit_rate || 0),
    fps: Number(num) / Number(den || 1),
    hasAudio: Boolean(a),
  };
}

async function startDevIfNeeded() {
  if (await probe(`${BASE_URL}/render/test`)) return null; // serveur déjà là
  const child = spawn("pnpm", ["dev"], { detached: true, stdio: "ignore" });
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await probe(`${BASE_URL}/render/test`)) return child;
  }
  try {
    process.kill(-child.pid, "SIGKILL");
  } catch {
    /* noop */
  }
  throw new Error("Le serveur dev n'a pas démarré (route /render/test injoignable).");
}

function fail(msg) {
  throw new Error(msg);
}

async function main() {
  const t0 = Date.now();
  await assertBinary("ffmpeg");
  await assertBinary("ffprobe");

  let devChild = null;
  try {
    devChild = await startDevIfNeeded();

    // 1. Rendu frames
    const tR = Date.now();
    const r = await renderScene({ scene: "test" });
    const renderMs = Date.now() - tR;

    // Vérif frames présentes & non vides
    const dir = framesDir("test");
    const pngs = readdirSync(dir).filter((f) => f.endsWith(".png"));
    if (pngs.length !== r.frames) fail(`Frame manquante : ${pngs.length}/${r.frames}`);
    for (const f of pngs) {
      if (statSync(path.join(dir, f)).size === 0) fail(`Frame vide : ${f}`);
    }

    // 2. Encodage + poster
    const tE = Date.now();
    const enc = await encodeVideo({ scene: "test" });
    const pos = await makePoster({ scene: "test" });
    const encodeMs = Date.now() - tE;

    if (enc.webmBytes === 0 || enc.mp4Bytes === 0 || pos.bytes === 0) fail("Fichier généré vide");

    // 3. Analyse FFprobe
    const webm = await ffprobe(enc.webm);
    const mp4 = await ffprobe(enc.mp4);

    // 4. Validations (§10)
    if (webm.hasAudio || mp4.hasAudio) fail("Piste audio présente");
    if (mp4.width !== RENDER.width || mp4.height !== RENDER.height) {
      fail(`Résolution incorrecte : ${mp4.width}x${mp4.height} ≠ ${RENDER.width}x${RENDER.height}`);
    }
    if (Math.abs(mp4.fps - RENDER.fps) > 0.5) fail(`Framerate incorrect : ${mp4.fps}`);
    if (Math.abs(mp4.duration - RENDER.seconds) > 0.4) fail(`Durée hors tolérance : ${mp4.duration}s`);

    const webmKB = enc.webmBytes / 1024;
    const mp4KB = enc.mp4Bytes / 1024;
    const posterKB = pos.bytes / 1024;
    const budgetOK =
      webmKB <= BUDGETS.webmKB && mp4KB <= BUDGETS.mp4KB && posterKB <= BUDGETS.posterKB;
    if (!budgetOK) fail(`Budget dépassé (webm ${webmKB.toFixed(0)}/${BUDGETS.webmKB}, mp4 ${mp4KB.toFixed(0)}/${BUDGETS.mp4KB}, poster ${posterKB.toFixed(1)}/${BUDGETS.posterKB})`);

    const totalMs = Date.now() - t0;

    // 5. Rapport
    console.log("\n──────── TEST FUMÉE PIPELINE MÉDIA ────────");
    console.log(`Scène         : test (déterministe)`);
    console.log(`Résolution    : ${mp4.width}x${mp4.height}`);
    console.log(`Framerate     : ${mp4.fps} fps`);
    console.log(`Durée         : ${mp4.duration.toFixed(2)} s`);
    console.log(`Frames        : ${r.frames}`);
    console.log(`WebM          : ${webm.codec} / ${webm.pixfmt} · ${webmKB.toFixed(1)} Ko · ${(webm.bitrate / 1000).toFixed(0)} kb/s`);
    console.log(`MP4           : ${mp4.codec} (${mp4.profile}) / ${mp4.pixfmt} · ${mp4KB.toFixed(1)} Ko · ${(mp4.bitrate / 1000).toFixed(0)} kb/s`);
    console.log(`Poster AVIF   : ${posterKB.toFixed(1)} Ko`);
    console.log(`Audio         : ${webm.hasAudio || mp4.hasAudio ? "PRÉSENT ✗" : "absent ✓"}`);
    console.log(`Temps rendu   : ${(renderMs / 1000).toFixed(1)} s`);
    console.log(`Temps encodage: ${(encodeMs / 1000).toFixed(1)} s`);
    console.log(`Temps total   : ${(totalMs / 1000).toFixed(1)} s`);
    console.log(`Budgets       : ${budgetOK ? "respectés ✓" : "DÉPASSÉS ✗"}`);
    console.log("───────────────────────────────────────────\n");
    console.log("✓ Pipeline média opérationnel de bout en bout.");
  } finally {
    // Nettoyage TOTAL des temporaires (aucun résidu, rien dans public/assets)
    await fs.rm(TMP, { recursive: true, force: true }).catch(() => {});
    void OUT_DIR;
    if (devChild) {
      try {
        process.kill(-devChild.pid, "SIGKILL");
      } catch {
        /* noop */
      }
    }
  }
}

main().catch((err) => {
  console.error(`\n✗ TEST FUMÉE ÉCHOUÉ : ${err.message}`);
  process.exit(1);
});
