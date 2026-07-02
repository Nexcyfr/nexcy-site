# Pipeline média NEXCY (Lot 1 — Infrastructure)

Production **locale** et **déterministe** de médias à partir de scènes codées.
Aucune dépendance npm ajoutée : `playwright-core` (dev), `ffmpeg`/`ffprobe`
(système), `sharp` (dep). Aucun média externe, aucune donnée sensible.

## Prérequis
- FFmpeg + FFprobe dans le `PATH` (`ffmpeg -version`).
- Chromium de Playwright (`CHROMIUM_PATH` sinon chemin par défaut ms-playwright).
- Un serveur local sur `http://127.0.0.1:3000` pour le rendu (`pnpm dev`),
  ou laisser `media:smoke` le démarrer.

## Commandes
```bash
pnpm media:smoke                          # test fumée bout-en-bout (jetable)
pnpm media:render --scene test            # scène → .tmp/frames/test/*.png
pnpm media:encode --scene test            # frames → .tmp/out/test.{webm,mp4}
pnpm media:poster --scene test            # frame 0 → .tmp/out/test-poster.avif
pnpm media:images --in x.png --out d --sizes 640,1280 --budget-kb 120
```

## Sécurité (§8)
- `render-scene.mjs` n'accepte qu'un **identifiant de scène en liste blanche**
  (`test`, `hero`), construit lui-même l'URL `/render/<scene>`, écrit uniquement
  sous `.tmp/frames/<scene>/`, ferme Chromium en `finally`, impose un timeout.
- Binaires appelés via `execFile` (arguments séparés) — jamais de shell.

## Conventions de nommage (§9)
`kebab-case`, sans espace ni accent, rôle explicite :
```
hero-desktop.webm   hero-desktop.mp4   hero-poster.avif
precision-band-loop.webm
maree-cover.avif    maree-mockup-desktop.avif   maree-mockup-mobile.avif
```

## Codecs (§7)
- WebM : VP9 (`libvpx-vp9`, CRF 34, `-b:v 0`), primaire.
- MP4 : H.264 (`libx264`, CRF 24, `+faststart`), fallback Safari/iOS.
- Poster : AVIF (sharp). Tous sans piste audio, `pix_fmt yuv420p`, métadonnées minimales.

## Dossiers
- `.tmp/` : frames + sorties temporaires (gitignore, jamais commité).
- `public/assets/{video,posters,concepts}` : sorties finales (remplies aux lots suivants).

## Route de rendu DEV
`/render/[scene]` — **DEV uniquement** (`notFound()` en production), `noindex`,
hors sitemap. Scènes : `test`, `hero` (capturables), `ambient` (démo `AmbientMedia`).
