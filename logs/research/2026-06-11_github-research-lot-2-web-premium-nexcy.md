# Lot 2 — Web premium Nexcy (UI, animations, design system)

Recherche limitée (mode économie de tokens) : 1 agent, 8 ressources, ~3 WebFetch/recherches au total.
Recherche + scoring uniquement — rien cloné, copié, installé.

## Tableau

| # | Nom | URL | Licence | Gratuit réel | Compte/API requis | Risque sécu | Niveau intégration | Score /100 | Emplacement recommandé |
|---|-----|-----|---------|--------------|--------------------|--------------|---------------------|------------|--------------------------|
| 1 | shadcn/ui | https://github.com/shadcn-ui/ui | MIT | Oui, sans limite | Non | Faible | Direct (copy via CLI) | 99 | `web_design_system/` |
| 2 | GSAP | https://gsap.com | "Standard License" gratuite (depuis avril 2025, ex-Webflow) | Oui, 100% gratuit y compris plugins premium | Non | Faible (1 clause : interdit de créer un outil concurrent à Webflow) | Direct (déjà dans le stack Nexcy) | 88 | `web_design_system/` + note licence dans `knowledge-base/` |
| 3 | React Bits | https://reactbits.dev / https://github.com/DavidHDev/react-bits | MIT | Oui, sans limite | Non | Faible | Direct | 87 | `web_design_system/` + `skills/cinematic-ui/` |
| 4 | Motion (ex-Framer Motion) | https://motion.dev | MIT | Oui, sans limite | Non | Faible | Direct (déjà dans le stack Nexcy) | 87 | `web_design_system/` |
| 5 | Magic UI | https://github.com/magicuidesign/magicui | MIT | Oui, sans limite | Non | Faible | Direct | 85 | `web_design_system/` + `skills/cinematic-ui/` |
| 6 | Lenis | https://github.com/darkroomengineering/lenis | MIT (réputation publique, non re-vérifié) | Oui, sans limite | Non | Faible | Direct (déjà dans le stack Nexcy) | 84 | `web_design_system/` |
| 7 | Aceternity UI | https://ui.aceternity.com | Pas de LICENSE clair sur les composants gratuits ; "Pro" payant (templates/blocs) | Partiel — composants copy-paste gratuits, mais statut juridique flou | Non (gratuit) / Oui (Pro payant) | Moyen — licence floue | Inspiration / adaptation uniquement | 84 | `skills/cinematic-ui/` (inspiration) ou `A_JETER/review-needed/` |
| 8 | 21st.dev / Magic MCP | https://github.com/21st-dev/magic-mcp | MCP server open source ; composants générés = propriété utilisateur | Freemium réel : ~5 requêtes gratuites puis crédits (100/mois plan free) puis $20/mois | Oui — compte 21st.dev + clé API MCP | Moyen — service tiers, clé API à gérer | Adaptation ponctuelle / outil optionnel | 67 | `A_JETER/review-needed/` (tester avant d'adopter) |

## Notes rapides

1. **shadcn/ui** (94k★, MIT) — base du design system, parfaitement aligné Next.js/Tailwind. CLI copie le code source dans le projet (pas de dépendance opaque).
2. **GSAP** — devenu 100% gratuit (avril 2025, rachat Webflow), inclut ScrollTrigger/SplitText/MorphSVG. Seule restriction : ne pas l'utiliser pour créer un outil concurrent de Webflow (non pertinent pour Nexcy).
3. **React Bits** (40.7k★, MIT) — bibliothèque de composants animés "copy-paste", aucune limite, très adaptée aux sections hero/landing premium.
4. **Motion** (ex-Framer Motion, MIT) — totalement open source et indépendant, sponsorisé par Framer/Figma/Tailwind.
5. **Magic UI** (19k★, MIT) — 50+ composants/effets animés (texte, fonds, cartes), bon complément à shadcn pour le côté "premium".
6. **Lenis** (darkroomengineering) — smooth scroll déjà utilisé par Nexcy, s'intègre avec GSAP ScrollTrigger.
7. **Aceternity UI** — rendu très premium/cinématique mais pas de LICENSE explicite sur le repo des composants gratuits → traiter comme inspiration/adaptation, pas de copie en bloc pour livrables clients sans vérif supplémentaire.
8. **21st.dev / Magic MCP** — outil MCP pour générer des variantes de composants UI ; le code généré est libre de droits, mais l'outil lui-même est freemium avec quota limité (~5 requêtes gratuites, puis crédits/abonnement). À tester en usage ponctuel, ne pas en faire une dépendance critique.

## Top 5 priorités

1. **shadcn/ui** — fondation du design system Nexcy
2. **GSAP** — désormais 100% gratuit, à documenter dans `knowledge-base/` (clause de licence)
3. **React Bits** — composants animés premium, MIT sans limite
4. **Motion** — animations React, MIT, déjà utilisé
5. **Magic UI** — effets visuels premium complémentaires à shadcn

## À éviter / inspiration uniquement

- **Aceternity UI** : pas de LICENSE clair sur les composants gratuits → inspiration/adaptation uniquement, vérifier les conditions avant toute réutilisation dans un livrable client.
- **21st.dev / Magic MCP** : freemium avec quota très limité (5 requêtes gratuites) et nécessite un compte/clé API tiers → outil optionnel à tester, ne pas intégrer comme brique centrale du design system.

## Prompt suivant (intégration Lot 2 — éléments sûrs uniquement)

> Intègre uniquement les ressources sûres du Lot 2 (`logs/research/2026-06-11_github-research-lot-2-web-premium-nexcy.md`) dans `web_design_system/` : crée une fiche de référence par ressource (shadcn/ui, GSAP, React Bits, Motion, Magic UI, Lenis) avec lien officiel, licence, et 2-3 exemples de composants/patterns pertinents pour Nexcy (hero animé, cards, scroll-driven sections). N'intègre PAS Aceternity UI ni 21st.dev/Magic MCP pour l'instant (placés en review). Aucun clone de repo, aucune installation — uniquement des fiches markdown de référence + éventuels extraits de code copy-paste sous licence MIT vérifiée.

---
*Lot 1 (Claude Code core) déjà livré dans la PR #2. Lot 3 (Automatisation/SEO/audit) à faire séparément, sur demande.*
