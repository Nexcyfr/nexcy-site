// Rendu d'une scène codée en séquence PNG via Chromium headless (§8 Lot 1).
// Sécurité : identifiant de scène en liste blanche, URL construite en interne,
// écriture strictement sous .tmp/frames/<scene>/, Chromium fermé en finally,
// timeout global, exit code ≠ 0 en cas d'échec.

import { chromium } from "playwright-core";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  BASE_URL,
  RENDER,
  assertScene,
  assertInsideTmp,
  framesDir,
} from "./media.config.mjs";

const DEFAULT_CHROMIUM = path.join(
  os.homedir(),
  "Library/Caches/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-mac-arm64/chrome-headless-shell",
);

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) out[a.slice(2)] = argv[++i];
  }
  return out;
}

export async function renderScene({
  scene,
  fps = RENDER.fps,
  width = RENDER.width,
  height = RENDER.height,
  seconds = RENDER.seconds,
  maxMs = 120000,
} = {}) {
  assertScene(scene); // liste blanche — refuse protocoles/chemins/.. (§8)
  const url = new URL(`/render/${scene}`, BASE_URL).toString(); // URL construite en interne

  const executablePath = process.env.CHROMIUM_PATH || DEFAULT_CHROMIUM;
  if (!existsSync(executablePath)) {
    throw new Error(`Chromium introuvable : ${executablePath} (définir CHROMIUM_PATH).`);
  }

  const dir = assertInsideTmp(framesDir(scene)); // refuse toute sortie hors .tmp/frames
  await fs.rm(dir, { recursive: true, force: true }); // nettoyage propre avant rendu
  await fs.mkdir(dir, { recursive: true });

  const total = Math.max(1, Math.round(fps * seconds));
  let browser;
  let timer;
  const guard = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("Timeout global de rendu")), maxMs);
  });

  try {
    const work = (async () => {
      browser = await chromium.launch({ executablePath, headless: true });
      const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      // Poll via page.evaluate (CDP) plutôt que waitForFunction : la CSP stricte
      // du site (sans 'unsafe-eval') bloque l'évaluation de chaîne de waitForFunction.
      let ready = false;
      for (let i = 0; i < 150 && !ready; i++) {
        ready = await page.evaluate(() => window.__sceneReady === true);
        if (!ready) await page.waitForTimeout(100);
      }
      if (!ready) throw new Error("Scène non prête (window.__sceneReady) après 15s.");

      for (let i = 0; i < total; i++) {
        const progress = total > 1 ? i / (total - 1) : 0;
        await page.evaluate((p) => {
          if (window.__seek) window.__seek(p);
        }, progress);
        // deux rAF : garantit que le rendu de la frame est bien peint
        await page.evaluate(
          () =>
            new Promise((resolve) =>
              requestAnimationFrame(() => requestAnimationFrame(() => resolve(null))),
            ),
        );
        const file = path.join(dir, `frame-${String(i).padStart(4, "0")}.png`);
        await page.screenshot({ path: file });
      }
      return { dir, frames: total, fps, width, height };
    })();

    return await Promise.race([work, guard]);
  } finally {
    clearTimeout(timer);
    if (browser) await browser.close();
  }
}

// CLI
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = parseArgs(process.argv.slice(2));
  renderScene({
    scene: args.scene,
    fps: args.fps ? Number(args.fps) : undefined,
    width: args.width ? Number(args.width) : undefined,
    height: args.height ? Number(args.height) : undefined,
    seconds: args.seconds ? Number(args.seconds) : undefined,
  })
    .then((r) => {
      console.log(`✓ ${r.frames} frames → ${path.relative(process.cwd(), r.dir)}`);
    })
    .catch((err) => {
      console.error(`✗ render-scene : ${err.message}`);
      process.exit(1);
    });
}
