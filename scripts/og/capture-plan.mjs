/**
 * Capture du plan du hero (canvas) pour les visuels Open Graph.
 *
 * Prérequis : un build de production servi en local (`pnpm build && pnpm start`).
 * Usage     : node scripts/og/capture-plan.mjs [url]   (défaut : http://localhost:3000)
 * Sortie    : scripts/og/plan.png (versionné — les visuels OG se régénèrent sans serveur).
 */
import { chromium } from "playwright-core";
import { fileURLToPath } from "node:url";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:3000";
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "plan.png");
const CHROMIUM = process.env.CHROMIUM_PATH || undefined;

const browser = await chromium.launch({ executablePath: CHROMIUM, args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto(BASE, { waitUntil: "networkidle" });

// Avance dans le hero jusqu'à la phase « Contrôle » (réseau + cotes visibles).
const target = await page.evaluate(() => {
  const section = document.querySelector("section[aria-labelledby=hero-title]");
  return Math.round((section.offsetHeight - window.innerHeight) * 0.82);
});
await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), target);
await page.waitForTimeout(2500);

// Ne garder que le canvas : on masque le texte, les voiles et l'en-tête.
await page.addStyleTag({
  content: `header, [aria-hidden="true"].pointer-events-none, .z-10 { visibility: hidden !important; }
            canvas { visibility: visible !important; }`,
});
await page.waitForTimeout(300);
const canvas = await page.$("canvas");
await canvas.screenshot({ path: OUT });
await browser.close();
console.log("plan capturé →", OUT);
