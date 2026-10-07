/**
 * Génération des visuels Open Graph (1200 x 630) — composition NEXCY :
 * fond graphite, trame de plan, accent ambre, typographie Geist, plan du hero.
 *
 * Usage : pnpm og:generate   (aucun serveur requis : scripts/og/plan.png est versionné)
 * Sortie : public/assets/og/*.png (PNG palette, ~40–70 Ko chacun)
 *
 * Pour mettre à jour le plan lui-même : node scripts/og/capture-plan.mjs
 */
import { chromium } from "playwright-core";
import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const outDir = path.join(root, "public/assets/og");

/** Pages à décliner. `title` accepte un saut de ligne explicite (\n). */
const PAGES = [
  { file: "og-home.png", label: "Studio digital · Bordeaux", title: "La complexité,\nmise en ordre.", sub: "Sites web, IA et automatisation pour les entreprises exigeantes." },
  { file: "og-services.png", label: "Expertises", title: "Cinq domaines,\nune seule exigence.", sub: "Création web, branding, SEO, automatisation et agents IA." },
  { file: "og-studio.png", label: "Le studio", title: "Précision et\nexigence assumées.", sub: "Vision, méthode et standards de NEXCY." },
  { file: "og-contact.png", label: "Contact", title: "Parlons de\nvotre projet.", sub: "Réponse sous 48 heures ouvrées." },
  { file: "og-service-creation-web.png", label: "Expertise · 01", title: "Création de\nsites web.", sub: "Rapides, accessibles, pensés pour la conversion." },
  { file: "og-service-branding.png", label: "Expertise · 02", title: "Branding et\nidentité visuelle.", sub: "Une marque cohérente sur tous les points de contact." },
  { file: "og-service-seo.png", label: "Expertise · 03", title: "SEO et\nréférencement naturel.", sub: "Un travail de fond, mesuré, sans promesse de première place." },
  { file: "og-service-automatisation-ia.png", label: "Expertise · 04", title: "Automatisation\net agents IA.", sub: "Du temps rendu à vos équipes, sans IA gadget." },
];

const [font, logo, plan] = await Promise.all([
  readFile(path.join(root, "src/app/fonts/GeistVF.woff")),
  readFile(path.join(root, "public/assets/brand/logo-nexcy-blanc.png")),
  // Recadrage du plan : on retire les marges noires et la jauge de phases.
  sharp(path.join(here, "plan.png"))
    .extract({ left: 780, top: 230, width: 1780, height: 1330 })
    .resize({ width: 1100 })
    .png()
    .toBuffer(),
]);

const css = `
@font-face { font-family: "Geist"; src: url(data:font/woff;base64,${font.toString("base64")}) format("woff"); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; background: #0a0a0a; color: #f4f1eb; font-family: "Geist", system-ui, sans-serif; position: relative; overflow: hidden; }
.grid { position: absolute; inset: 0; background-image: linear-gradient(to right, rgba(153,149,143,.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(153,149,143,.07) 1px, transparent 1px); background-size: 120px 120px; -webkit-mask-image: radial-gradient(110% 90% at 30% 40%, #000 0%, rgba(0,0,0,.5) 55%, transparent 100%); }
.plan { position: absolute; right: -120px; top: 40px; width: 760px; -webkit-mask-image: radial-gradient(closest-side at 56% 50%, #000 58%, transparent 100%); mask-image: radial-gradient(closest-side at 56% 50%, #000 58%, transparent 100%); }
.plan img { width: 100%; display: block; opacity: .95; }
.glow { position: absolute; right: 80px; top: 120px; width: 480px; height: 360px; background: radial-gradient(closest-side, rgba(217,145,61,.09), transparent); }
.col { position: absolute; left: 72px; top: 64px; bottom: 60px; width: 640px; display: flex; flex-direction: column; justify-content: space-between; }
.rule { height: 1px; background: rgba(153,149,143,.3); position: relative; margin-bottom: 26px; width: 100%; }
.rule::before { content: ""; position: absolute; left: 0; top: -1px; height: 1px; width: 56px; background: #d9913d; }
.label { font-size: 15px; letter-spacing: .24em; text-transform: uppercase; color: #99958f; font-weight: 500; }
.label b { color: #d9913d; font-weight: 500; }
h1 { font-size: 70px; line-height: .98; letter-spacing: -.035em; font-weight: 500; margin-top: 40px; white-space: pre-line; }
.sub { margin-top: 28px; font-size: 25px; line-height: 1.4; color: #9a9a9a; max-width: 520px; letter-spacing: -.01em; }
.foot { display: flex; align-items: center; justify-content: space-between; }
.foot img { width: 150px; }
.tag { font-size: 14px; letter-spacing: .26em; text-transform: uppercase; color: #d9913d; font-weight: 500; }
`;

const html = (p) => `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
<div class="grid"></div><div class="glow"></div>
<div class="plan"><img src="data:image/png;base64,${plan.toString("base64")}"></div>
<div class="col">
  <div>
    <div class="rule"></div>
    <p class="label"><b>NEXCY</b> &nbsp;/&nbsp; ${p.label}</p>
    <h1>${p.title}</h1>
    <p class="sub">${p.sub}</p>
  </div>
  <div class="foot"><img src="data:image/png;base64,${logo.toString("base64")}"><span class="tag">Precision in Motion</span></div>
</div></body></html>`;

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

for (const p of PAGES) {
  await page.setContent(html(p), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const shot = await page.screenshot({ type: "png" });
  // Palette 256 couleurs + dithering léger : fidèle aux dégradés, ~3x plus léger.
  const optimized = await sharp(shot).png({ palette: true, colours: 256, dither: 0.25, compressionLevel: 9, effort: 10 }).toBuffer();
  await writeFile(path.join(outDir, p.file), optimized);
  console.log(`${p.file}  ${(optimized.length / 1024).toFixed(0)} Ko`);
}
await browser.close();
