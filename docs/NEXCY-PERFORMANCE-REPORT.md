# NEXCY — Rapport de performance

> ⚠️ Les mesures ci-dessous sont **locales** (`next start`, réseau local) — **elles ne
> valent pas des résultats de production**. Les cibles Lighthouse doivent être
> revalidées sur une **preview Vercel** (réseau mobile simulé, cache froid) avant
> livraison. Voir la checklist de déploiement.

## Bundle (build de production)
- **Accueil — First Load JS : 162 kB** (partagé ~87 kB + page ~7,3 kB + GSAP/Lenis).
- Aucune librairie graphique ajoutée en P2 (hero & motifs = **SVG inline** + GSAP déjà présent).
- Composants client : **18** (dont hooks/lib) — pages `page.tsx` toutes **server components**.

## Poids des assets
- **Total assets : ~516 Ko** (vs ~1,2 Mo avant P2) — **≈ -57 %**.
- Par page (chargé) : hero & motifs = 0 requête (SVG inline) ; textures en `lazy`
  (immersive-light 100 Ko sous la flottaison ; precision-band 184 Ko sur Studio) ;
  skyline footer 36 Ko `lazy`. OG non chargés (métadonnées).

## Mesures locales (indicatives)
| Vue | LCP (local) | CLS | Erreurs console |
|---|---|---|---|
| Accueil 1440 | ~160 ms | **0** | aucune |
| (mesures antérieures cohérentes : LCP local très bas, CLS 0 partout) | | | |

- **LCP** : l'élément LCP reste le **H1 texte** (la scène hero décorative n'est pas LCP).
- **CLS 0** : dimensions explicites (scène en `aspect-square`, images `next/image` dimensionnées).
- **Hydratation** : aucun avertissement (coordonnées de la scène **déterministes**, pas de `Math.random`).
- **Animations** : hero joué **une fois** puis repos (pas de rAF permanent) ; démonstrations
  déclenchées à la demande ; parallaxe pointeur throttlée rAF + nettoyée ; aucune boucle infinie.

## Cibles à valider en preview Vercel (production-like)
- Performance mobile ≥ 90 · Accessibilité ≥ 95 · Best Practices ≥ 95 · SEO ≥ 95.
- LCP < 2,5 s · CLS < 0,1 · INP < 200 ms · TBT maîtrisé · 0 erreur console.
- Lancer : `npx lighthouse <preview-url> --preset=desktop` et mobile, cache froid.

## Points de vigilance
- `precision-band.avif` (184 Ko) : plus lourd des assets — sur Studio, `lazy`, hors LCP. OK.
- GSAP/Lenis : coût JS assumé (animations premium) ; Lenis désactivé en reduced-motion.
- Revalider INP/TBT sur mobile réel (les mesures locales ne sont pas représentatives).
