# NEXCY — Manifeste des assets V2

Après la DA P2 : **total assets ~516 Ko** (vs ~1,2 Mo avant). Priorité au **code**
(SVG inline pour le hero et les motifs services → 0 requête). **2 textures matière
maximum**, aucune répétition, aucune photo de banque identifiable, aucune URL externe.

## Assets conservés

| Fichier | Page | Fonction | Origine | Licence | Poids | Statut |
|---|---|---|---|---|---|---|
| `brand/logo-nexcy-blanc.png` | global | logotype (header/footer/OG/JSON-LD) | fourni Matéo, optimisé | propriété NEXCY | 20 Ko | ✅ conservé |
| `brand/bordeaux-skyline.png` | footer | ligne d'horizon Bordeaux (narratif local) | fourni Matéo, **recompressé 301→36 Ko** | propriété NEXCY | 36 Ko | ✅ conservé (optimisé) |
| `brand/icon-192.png` · `icon-512.png` | global | icônes manifest/PWA | généré (monogramme N) | propriété NEXCY | 4 / 12 Ko | ✅ conservé |
| `home/immersive-light.avif` | Accueil | **texture #1** — bande « Precision in Motion » | Pexels (Yakup Gökdeniz), gradée duotone | Pexels License | 100 Ko | ✅ conservé (1/2) |
| `studio/precision-band.avif` | Studio | **texture #2** — bande matière | Pexels (Avak Ava), gradée | Pexels License | 184 Ko | ✅ conservé (2/2) |
| `og/og-{home,services,studio,contact}.png` | OG | partage social (logotype réel + charte) | composé | propriété NEXCY | 40 Ko ×4 | ✅ conservé |
| `src/app/icon.svg` · `apple-icon.png` | global | favicons | fourni Matéo | propriété NEXCY | — | ✅ conservé |

## Assets supprimés (DA P2)

| Fichier | Raison |
|---|---|
| `home/hero-abstract.avif` (+mobile) | **remplacé** par la scène codée `HeroScene` |
| `services/{creation-web,branding,seo,automatisation-ia}.avif` | **remplacés** par les motifs codés `ServiceMotif` |
| `home/reassurance-bg.avif` | texture décorative sans rôle narratif → supprimée |
| `contact/bg.avif` | texture décorative → supprimée |
| `studio/manifesto-matter.avif` (+mobile) | dépassait la limite 1-2 textures → supprimée |
| `home/immersive-light-mobile.avif` | orphelin (next/image gère le responsive) |
| `brand/logo-nexcy.svg` (676 Ko) | trop lourd ; réf. JSON-LD basculée sur `logo-nexcy-blanc.png` |
| `brand/monogram-n.svg` | orphelin (le monogramme est inline dans les composants) |
| `brand/logo-nexcy-noir.png` · `wordmark-white.png` | orphelins |
| `brand/source/*` (4 fichiers, ~728 Ko) | archive non servie — supprimée (originaux conservés par Matéo) |
| `home/showcase-texture.avif` | supprimé au sous-lot démonstrations |

## Visuels générés en code (0 asset, 0 requête)
Hero `HeroScene` (SVG) · `ServiceMotif` ×4 (SVG) · démonstrations (SVG/CSS) ·
filigranes `WatermarkN` (SVG) · monogramme/favicons.

## Règles respectées
Licences vérifiées · aucune personne · aucun stock générique visible · aucun bleu ·
2 textures max · aucune répétition · aucune URL externe · assets inutilisés supprimés
avec leurs imports/styles.
