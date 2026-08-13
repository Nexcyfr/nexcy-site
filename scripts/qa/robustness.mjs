/**
 * QA de robustesse — redimensionnement à chaud, navigation clavier,
 * rechargement en cours de scroll, fuites de ScrollTrigger à la navigation.
 *   node scripts/qa/robustness.mjs
 */
import { chromium } from "playwright-core";
import { readdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const BASE = process.env.QA_BASE ?? "http://localhost:3211";

async function resolveChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const root = join(homedir(), "Library/Caches/ms-playwright");
  const dirs = (await readdir(root)).filter((d) => d.startsWith("chromium-"));
  dirs.sort();
  return join(
    root,
    dirs[dirs.length - 1],
    "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  );
}

const browser = await chromium.launch({
  executablePath: await resolveChromium(),
  headless: true,
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

/* 1. Redimensionnement à chaud — les mesures ne doivent pas rester périmées. */
console.log("\n— Redimensionnement à chaud —");
for (const [w, h] of [
  [1440, 900],
  [820, 1180],
  [390, 844],
  [1920, 1080],
  [1024, 640],
  [1440, 900],
]) {
  await page.setViewportSize({ width: w, height: h });
  await page.waitForTimeout(600);
  const state = await page.evaluate(() => {
    const de = document.documentElement;
    const cv = document.querySelector("canvas");
    const r = cv?.getBoundingClientRect();
    return {
      overflow: de.scrollWidth > de.clientWidth + 1,
      // Le buffer doit suivre la taille CSS (au ratio DPR près).
      canvasMatches: r
        ? Math.abs(cv.width / Math.min(devicePixelRatio, 2) - Math.round(r.width)) <= 2
        : null,
    };
  });
  console.log(
    `  ${String(w).padStart(4)}×${String(h).padEnd(4)} overflow=${state.overflow} canvasSynchro=${state.canvasMatches}`,
  );
}

/* 2. Reprise du scrub après redimensionnement. */
console.log("\n— Scrub après redimensionnement —");
await page.evaluate(() => window.scrollTo({ top: 1200, behavior: "instant" }));
await page.waitForTimeout(500);
await page.setViewportSize({ width: 1280, height: 800 });
await page.waitForTimeout(800);
const afterResize = await page.evaluate(() => {
  const de = document.documentElement;
  return { scrollY: window.scrollY, overflow: de.scrollWidth > de.clientWidth + 1 };
});
console.log("  ", JSON.stringify(afterResize));

/* 3. Rechargement en plein scroll — le navigateur restaure la position. */
console.log("\n— Rechargement en cours de scroll —");
await page.evaluate(() => window.scrollTo({ top: 2000, behavior: "instant" }));
await page.waitForTimeout(400);
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1200);
const afterReload = await page.evaluate(() => ({
  scrollY: Math.round(window.scrollY),
  heroVisible: !!document.querySelector("section[aria-labelledby='hero-title']"),
  h1: document.querySelector("h1")?.textContent?.trim(),
}));
console.log("  ", JSON.stringify(afterReload));

/* 4. Navigation clavier — ordre et visibilité du focus. */
console.log("\n— Navigation clavier (12 tabulations) —");
await page.setViewportSize({ width: 1440, height: 900 });
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.waitForTimeout(400);
for (let i = 0; i < 12; i++) {
  await page.keyboard.press("Tab");
  const info = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 34),
      onScreen: r.width > 0 && r.height > 0,
      // Un focus doit rester visible : outline OU box-shadow.
      hasRing: cs.outlineStyle !== "none" || cs.boxShadow !== "none",
    };
  });
  if (info) {
    console.log(
      `  ${String(i + 1).padStart(2)}. ${info.tag.padEnd(6)} visible=${info.onScreen} anneau=${info.hasRing}  "${info.text}"`,
    );
  }
}

/* 5. Navigation entre routes — les ScrollTrigger ne doivent pas s'accumuler. */
console.log("\n— Fuite de ScrollTrigger sur navigation —");
const counts = [];
for (const path of ["/", "/services", "/studio", "/", "/services", "/"]) {
  await page.click(`a[href="${path}"]`).catch(async () => {
    await page.goto(BASE + path, { waitUntil: "networkidle" });
  });
  await page.waitForTimeout(900);
  const n = await page.evaluate(
    () => window.ScrollTrigger?.getAll?.().length ?? "n/a",
  );
  counts.push(`${path}:${n}`);
}
console.log("  ", counts.join("  "));

console.log("\nErreurs console :", errors.length ? errors.slice(0, 6) : "aucune");
await browser.close();
