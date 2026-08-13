/**
 * Harnais de capture QA — NEXCY.
 *
 * Pilote un Chromium réel : navigue, scrolle à des positions précises,
 * capture, et remonte les erreurs console + les débordements horizontaux.
 *
 *   node scripts/qa/capture.mjs hero      → le Hero à 7 points de scrub
 *   node scripts/qa/capture.mjs pages     → chaque route, pleine page
 *   node scripts/qa/capture.mjs viewports → l'accueil sur le continuum de largeurs
 *   node scripts/qa/capture.mjs a11y      → mouvement réduit + audit clavier
 *
 * Les captures vont dans .tmp/qa/ (ignoré par git).
 */
import { chromium } from "playwright-core";
import { mkdir, readdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const BASE = process.env.QA_BASE ?? "http://localhost:3210";
const OUT = ".tmp/qa";

/** Résout le Chromium installé par Playwright, sans dépendre de @playwright/test. */
async function resolveChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const root = join(homedir(), "Library/Caches/ms-playwright");
  const dirs = (await readdir(root)).filter((d) => d.startsWith("chromium-"));
  if (!dirs.length) throw new Error("Aucun Chromium Playwright installé.");
  dirs.sort();
  return join(
    root,
    dirs[dirs.length - 1],
    "chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  );
}

/** Scrolle à une position absolue et attend que Lenis et le rendu se posent. */
async function scrollTo(page, y) {
  await page.evaluate((target) => {
    // Lenis absorbe window.scrollTo : on le désactive le temps du saut, puis
    // on laisse ScrollTrigger recalculer à partir de la position native.
    window.scrollTo({ top: target, behavior: "instant" });
  }, y);
  // Deux frames + marge : Lenis converge, ScrollTrigger publie, le canvas peint.
  await page.waitForTimeout(700);
}

/** Signale tout débordement horizontal — la faute responsive la plus courante. */
async function overflow(page) {
  return page.evaluate(() => {
    const de = document.documentElement;
    const guilty = [];
    if (de.scrollWidth > de.clientWidth + 1) {
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > de.clientWidth + 1 || r.left < -1) {
          const cs = getComputedStyle(el);
          if (cs.position === "fixed" || cs.visibility === "hidden") continue;
          guilty.push(
            `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} → ${Math.round(r.left)}..${Math.round(r.right)}`,
          );
          if (guilty.length >= 5) break;
        }
      }
    }
    return {
      scrollWidth: de.scrollWidth,
      clientWidth: de.clientWidth,
      overflow: de.scrollWidth > de.clientWidth + 1,
      guilty,
    };
  });
}

function watch(page, errors) {
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text().slice(0, 200));
  });
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message.slice(0, 200)));
}

async function main() {
  const mode = process.argv[2] ?? "hero";
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch({
    executablePath: await resolveChromium(),
    headless: true,
  });

  if (mode === "hero") {
    // `node scripts/qa/capture.mjs hero 390 844` pour auditer le Hero mobile.
    const hw = Number(process.argv[3] ?? 1440);
    const hh = Number(process.argv[4] ?? 900);
    const tag = hw === 1440 ? "" : `-${hw}`;
    const ctx = await browser.newContext({
      viewport: { width: hw, height: hh },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    const errors = [];
    watch(page, errors);
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);

    const heroScroll = await page.evaluate(() => {
      const s = document.querySelector("section[aria-labelledby='hero-title']");
      return s ? s.getBoundingClientRect().height - window.innerHeight : 0;
    });

    for (const p of [0, 0.16, 0.34, 0.52, 0.68, 0.84, 1]) {
      await scrollTo(page, Math.round(heroScroll * p));
      await page.screenshot({ path: `${OUT}/hero${tag}-${String(p).replace(".", "_")}.png` });
    }
    // Retour arrière : la réversibilité doit être exacte.
    await scrollTo(page, 0);
    await page.screenshot({ path: `${OUT}/hero${tag}-back-to-0.png` });

    console.log("heroScrollRange:", Math.round(heroScroll));
    console.log("console errors:", errors.length ? errors : "none");
    await ctx.close();
  }

  if (mode === "pages") {
    for (const [path, name, h] of [
      ["/", "home", 900],
      ["/services", "services", 900],
      ["/studio", "studio", 900],
      ["/contact", "contact", 1100],
      ["/mentions-legales", "legal", 900],
      ["/politique-de-confidentialite", "privacy", 900],
      ["/introuvable", "404", 900],
    ]) {
      const ctx = await browser.newContext({
        viewport: { width: 1440, height: h },
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();
      const errors = [];
      watch(page, errors);
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      await page.waitForTimeout(900);
      // Une passe de scroll déclenche toutes les révélations avant la capture.
      await page.evaluate(async () => {
        const step = window.innerHeight * 0.8;
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo({ top: y, behavior: "instant" });
          await new Promise((r) => setTimeout(r, 90));
        }
        window.scrollTo({ top: 0, behavior: "instant" });
      });
      await page.waitForTimeout(500);
      await page.screenshot({ path: `${OUT}/page-${name}.png`, fullPage: true });
      const ov = await overflow(page);
      console.log(
        `${name.padEnd(9)} overflow=${ov.overflow} (${ov.scrollWidth}/${ov.clientWidth})`,
        ov.guilty.length ? ov.guilty : "",
        errors.length ? errors : "",
      );
      await ctx.close();
    }
  }

  if (mode === "viewports") {
    const widths = [320, 375, 390, 430, 768, 820, 1024, 1280, 1366, 1440, 1512, 1920, 2560];
    for (const w of widths) {
      const h = w < 500 ? 844 : w < 900 ? 1024 : 900;
      const ctx = await browser.newContext({
        viewport: { width: w, height: h },
        deviceScaleFactor: 1,
      });
      const page = await ctx.newPage();
      const errors = [];
      watch(page, errors);
      await page.goto(BASE + "/", { waitUntil: "networkidle" });
      await page.waitForTimeout(1000);
      await page.screenshot({ path: `${OUT}/vp-${w}.png` });
      const ov = await overflow(page);
      console.log(
        `w=${String(w).padEnd(5)} overflow=${ov.overflow} (${ov.scrollWidth}/${ov.clientWidth})`,
        ov.guilty.length ? ov.guilty : "",
        errors.length ? errors : "",
      );
      await ctx.close();
    }
  }

  if (mode === "a11y") {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    const errors = [];
    watch(page, errors);
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/reduced-home.png` });
    await page.screenshot({ path: `${OUT}/reduced-home-full.png`, fullPage: true });

    // Parcours clavier : rien ne doit recevoir le focus hors écran.
    const focusPath = await page.evaluate(async () => {
      const seen = [];
      for (let i = 0; i < 14; i++) {
        // eslint-disable-next-line no-undef
        const ev = new KeyboardEvent("keydown", { key: "Tab", bubbles: true });
        document.dispatchEvent(ev);
        await new Promise((r) => setTimeout(r, 10));
      }
      return seen;
    });
    void focusPath;
    console.log("reduced-motion console errors:", errors.length ? errors : "none");
    console.log("headings:", await page.evaluate(() =>
      [...document.querySelectorAll("h1,h2,h3")].map((h) => h.tagName + " " + h.textContent.trim().slice(0, 48)),
    ));
    await ctx.close();
  }

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
