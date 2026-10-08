/**
 * Génère les icônes NEXCY à partir du monogramme N (vectoriel, ~600 octets) :
 *   src/app/icon.svg            favicon (coins arrondis)
 *   src/app/apple-icon.png      180 x 180 (plein cadre : iOS applique son propre masque)
 *   public/assets/brand/icon-192.png / icon-512.png   icônes du manifeste (zone de sécurité respectée)
 *
 * Usage : node scripts/assets/make-icons.mjs
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const glyph = `<path d="M19 47V17l26 30V17" fill="none" stroke="#F4F1EB" stroke-width="3.5" stroke-linecap="square" stroke-linejoin="miter"/><rect x="43.25" y="11" width="3.5" height="3.5" fill="#D9913D"/>`;
const svg = (rx) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><title>NEXCY</title><rect width="64" height="64" rx="${rx}" fill="#0A0A0A"/>${glyph}</svg>\n`;

await writeFile(path.join(root, "src/app/icon.svg"), svg(12));

const square = Buffer.from(svg(0));
const png = (size, file) =>
  sharp(square, { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(root, file));

await png(180, "src/app/apple-icon.png");
await png(192, "public/assets/brand/icon-192.png");
await png(512, "public/assets/brand/icon-512.png");
console.log("icônes générées");
