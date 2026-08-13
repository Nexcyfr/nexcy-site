/**
 * Capture chaque section d'une page à la taille réelle du viewport.
 *   node scripts/qa/sections.mjs [chemin] [largeur] [hauteur]
 */
import { chromium } from "playwright-core";
import { mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { readdir } from "node:fs/promises";

const BASE = process.env.QA_BASE ?? "http://localhost:3210";
const path = process.argv[2] ?? "/";
const width = Number(process.argv[3] ?? 1440);
const height = Number(process.argv[4] ?? 900);
const OUT = ".tmp/qa";

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
await mkdir(OUT, { recursive: true });
const ctx = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 160)));
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message.slice(0, 160)));
await page.goto(BASE + path, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);

// Réveille toutes les révélations au scroll avant de capturer.
await page.evaluate(async () => {
  const step = window.innerHeight * 0.6;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 80));
  }
});
await page.waitForTimeout(400);

const tops = await page.evaluate(() =>
  [...document.querySelectorAll("main section, footer")].map((s, i) => ({
    i,
    top: Math.round(s.getBoundingClientRect().top + window.scrollY),
    h: Math.round(s.getBoundingClientRect().height),
    label:
      s.getAttribute("aria-labelledby") ??
      s.getAttribute("aria-label") ??
      s.tagName.toLowerCase(),
  })),
);

const slug = path === "/" ? "home" : path.replace(/\//g, "");
for (const s of tops) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), s.top);
  await page.waitForTimeout(450);
  const name = `${OUT}/sec-${slug}-${String(s.i).padStart(2, "0")}-${s.label.replace(/[^a-z0-9-]/gi, "")}.png`;
  await page.screenshot({ path: name });
  console.log(`${name}  h=${s.h}`);
}
console.log("console errors:", errors.length ? errors : "none");
await browser.close();
