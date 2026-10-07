/**
 * Audit d'accessibilité axe-core sur toutes les routes publiques.
 *   node scripts/qa/a11y.mjs
 * Passe QA_BASE pour cibler le build de production.
 */
import { chromium } from "playwright-core";
import { readdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { readFileSync, existsSync } = require("node:fs");
const { globSync } = require("node:fs");

/**
 * axe-core arrive en dépendance transitive de @axe-core/playwright : pnpm ne
 * le remonte pas à la racine de node_modules, on le résout donc dans le store.
 */
function resolveAxe() {
  try {
    return require.resolve("axe-core/axe.min.js");
  } catch {
    const hits = globSync("node_modules/.pnpm/axe-core@*/node_modules/axe-core/axe.min.js");
    if (!hits.length) throw new Error("axe-core introuvable.");
    return hits.sort().pop();
  }
}

const axePath = resolveAxe();
if (!existsSync(axePath)) throw new Error("axe-core introuvable : " + axePath);
const AXE_SOURCE = readFileSync(axePath, "utf8");

const BASE = process.env.QA_BASE ?? "http://localhost:3211";
const ROUTES = [
  "/",
  "/services",
  "/studio",
  "/contact",
  "/mentions-legales",
  "/politique-de-confidentialite",
];

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

let total = 0;
for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.addScriptTag({ content: AXE_SOURCE });

  const results = await page.evaluate(async () =>
    // eslint-disable-next-line no-undef
    await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    }),
  );

  // Les « incomplete » comptent : axe y range notamment le contraste qu'il ne
  // peut pas calculer (texte posé sur un canvas). C'est exactement le cas du Hero.
  for (const inc of results.incomplete) {
    console.log(`  (à vérifier) ${inc.id}: ${inc.nodes.length} nœud(s)`);
    for (const n of inc.nodes.slice(0, 4)) {
      console.log(`      ${n.target.join(" ")}`);
    }
  }

  const violations = results.violations;
  total += violations.length;
  console.log(`\n${route}  → ${violations.length} violation(s)`);
  for (const v of violations) {
    console.log(`  [${v.impact}] ${v.id}: ${v.help}`);
    for (const n of v.nodes.slice(0, 3)) {
      console.log(`      ${n.target.join(" ")}`);
      if (n.failureSummary) {
        console.log(
          `      ${n.failureSummary.replace(/\n/g, " ").slice(0, 170)}`,
        );
      }
    }
  }
  await ctx.close();
}

console.log(`\nTOTAL: ${total} violation(s)`);
await browser.close();
