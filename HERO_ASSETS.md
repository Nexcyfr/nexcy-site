# HERO_ASSETS.md — assets du Hero « Monolith » NEXCY

Inventaire des ressources récupérées pour le Hero 3D. Tous les assets externes
sont **CC0** (domaine public, aucune attribution requise, usage commercial OK).

## Environnement (IBL / HDRI)
| Fichier | Source | Licence | Usage |
|---|---|---|---|
| `public/hero/env/desert_1k.hdr` | Poly Haven — *abandoned_tank_farm_05* (1k) | CC0 | Éclairage par image (IBL) : reflets PBR du monolithe + ambiance chaude désertique. Chargé avec `background={false}` → le ciel n'est PAS affiché (fond = fog + couleur maison), donc aucun ciel bleu. La couleur signal reste pilotée par la `directionalLight` ambre. |

## Textures PBR — sable (dunes)
Source : Poly Haven — *aerial_sand* (1k, jpg). Licence **CC0**.
| Map | Fichier | Usage |
|---|---|---|
| Albedo | `public/hero/textures/sand/albedo_1k.jpg` | **Non utilisé tel quel** (sable tan = sépia interdit). Sert de détail de luminance ; la couleur de base est forcée en graphite `#141414`→`#1D1D1B`. |
| Normal (GL) | `public/hero/textures/sand/normal_1k.jpg` | Relief des rides de sable (micro-détail réaliste). Map principale. |
| Roughness | `public/hero/textures/sand/rough_1k.jpg` | Variation de rugosité (mat minéral). |
| AO | `public/hero/textures/sand/ao_1k.jpg` | Occlusion ambiante (creux des rides). |
| Displacement | `public/hero/textures/sand/disp_1k.jpg` | Option : micro-déplacement en complément du simplex-noise. |

> ⚠️ Palette : le sable reste **quasi-noir**. On exploite normal/roughness/AO pour
> le réalisme, jamais l'albedo tan brut. La texture aérienne contient de légères
> traces (pneus) — invisibles au tiling serré ; sinon bascule sur *coast_sand_02*.

## HUD (icônes)
Source : Iconify (jeu *lucide*, licence ISC/MIT). Teintées `--nx-warm-white`.
| Fichier | Usage |
|---|---|
| `public/hero/hud/crosshair.svg` | Mire de centrage / verrou sur la forme lointaine. |
| `public/hero/hud/plus.svg` | Repères d'angle du HUD. |

## Marque
| Fichier | Statut |
|---|---|
| `public/brand/logo-nexcy.svg` | ⚠️ **PNG raster embarqué** (non vectoriel) → non extrudable. Le monolithe N est actuellement **composé de 3 boîtes** (placeholder fidèle). **À remplacer** par le vrai monogramme en `.glb` ou SVG *path* pour des arêtes/chanfreins parfaits. |

## Police
- **Neue Montreal** : absente de `/public/fonts`. Fallback = **Geist** (police du site, `geist/font`) — plus cohérent que Helvetica brut. À fournir en `.woff2` si l'on veut la Neue Montreal exacte.

## Reste à fournir (idéalement)
- Monogramme N officiel en `.glb` / SVG path (bloquant §13 — placeholder en place).
- (Option) Neue Montreal `.woff2`.
- (Option) Terrain de dunes sculpté en `.glb` haute qualité — sinon terrain procédural (simplex-noise) + maps PBR ci-dessus (choix retenu).

_Généré à l'étape 2 (acquisition d'assets). Assets téléchargés le 2026-07-08._
