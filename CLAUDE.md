# CLAUDE.md

Mémoire technique permanente du dépôt `nexcy-site` (site officiel de NEXCY). Lue par Claude Code à chaque session.
Toute décision structurante prise ici prime sur les habitudes par défaut.

## Vision NEXCY

NEXCY est un **studio digital** à Bordeaux qui **conçoit et développe des sites web et des applications sur mesure**.
C'est le cœur — et la totalité — de l'offre. Positionnement : spécialiste, pas généraliste ; _excellence invisible_ —
systèmes élégants, fluides, précis, sans bruit inutile. Signature : _Precision in Motion_.

### Offre : exactement deux services
1. **Sites web** : vitrines, corporate, e-commerce, landing pages, éditoriaux et événementiels, expériences haut de gamme,
   refonte (partielle ou complète) et optimisation d'un site existant. La refonte appartient à cette offre : **jamais un 3e service**.
2. **Applications** : applications web, SaaS, plateformes métier, outils internes, dashboards, extranets et portails clients,
   interfaces d'administration, applications métier sur mesure, MVP, produits digitaux complexes.

**Interdit** : réintroduire branding, SEO, automatisation/IA, agents IA ou maintenance comme services principaux ou pages
vendues séparément. Ces compétences restent des **capacités transversales** (`capabilities` dans `src/data/services.ts`)
mentionnées comme incluses lorsque le projet les nécessite (SEO technique d'un site, automatisation ou IA intégrées à une
application, identité visuelle nécessaire à une interface, maintenance liée à un projet livré).

Le visiteur doit comprendre en quelques secondes : ce que fait NEXCY, pourquoi c'est différent, pourquoi lui faire
confiance, comment prendre contact. NEXCY ne doit jamais ressembler à une agence générique, un template, un portfolio
artistique incompréhensible ou un SaaS « startup ».

### Ton et contenu
- Sobre, précis, stratégique, direct, haut de gamme. Phrases courtes. Pas d'emoji. Signature « NEXCY ».
- Terme principal : **« studio digital »**. « Agence » seulement s'il y a une vraie raison SEO ou contextuelle.
- Ne pas répéter « premium », « innovation », « sur mesure » sans substance. Pas de jargon IA, pas de superlatif.
- **Ne jamais inventer** clients, chiffres, témoignages, résultats, certifications, récompenses, références.
  Les seules preuves admises sont vérifiables publiquement (méthode, standards, comportement du site lui-même).
  Un projet démonstrateur ne se présente jamais comme une mission client.
- Ne pas mentionner de modèle de sous-traitance : NEXCY « mobilise les bonnes expertises selon le projet »,
  avec un interlocuteur unique.
- Une information juridique ou administrative inconnue n'est jamais devinée : elle va dans `docs/LAUNCH-CHECKLIST.md`
  (section « À CONFIRMER AVANT PRODUCTION »).

## Design system

Source unique : `src/app/globals.css` (variables CSS) + `tailwind.config.ts` (mêmes valeurs). Ne pas dupliquer de couleur en dur.

- **Accent officiel : AMBRE `#D9913D`** (`accent`, clair `#E7AA62`, foncé `#B96E27`). Usage parcimonieux : CTA, traits,
  états actifs, détails, lueurs très discrètes. Jamais en aplat dominant : le site ne devient pas « orange ».
- **Aucune couleur froide. L'ancien accent bleu (`#176BE0`) est définitivement abandonné** — ne jamais le réintroduire,
  ni aucune teinte bleue.
- Fonds : `void #080808` (plan), `black #0A0A0A` (page), `surface #111`, `card #161616`. Textes : `text-primary #F0F0F0`,
  `text-secondary #9A9A9A`, `text-muted #808080` (ratios AA vérifiés), `warm-white #F4F1EB`, `stone #99958F`.
- Erreur de formulaire : `danger #F0907E` (corail doux, chaud).
- Typographie : Geist Sans. Échelle fluide `--type-*` ; classes `t-display`, `t-h1`, `t-h2`, `t-h3`, `t-lead`, `t-body`,
  `t-body-lg`, `t-tech` (labels « plan »). Pas de taille ad hoc si une classe existe.
- Espacements : `--space-1..9` (utilitaires `p-space-*`). Rythme de section : `.section-y`. Conteneur : `.container-site` (1440 px).
- Langage « plan technique » : `.plan-grid`, `.plan-grid-fade`, `.plan-rule` (filet avec amorce ambre), cotes `t-tech`.
- Composants de section : `PageHero` (ouverture de page), `SectionHead` (ouverture de section), `CtaSection` (bande finale),
  `Button`, `TextLink`. Les composants `SectionLabel` (Studio) sont l'ancienne génération : migrer vers `SectionHead` lorsqu'on y touche.
- CTA : libellé primaire unique « Démarrer un projet » → `/contact`. Les CTA contextuels sont secondaires.

## Architecture

Next.js 15 (App Router), React 19, TypeScript strict, Tailwind 3. Pages pré-rendues en statique.

- Routes : `/`, `/services`, `/services/sites-web`, `/services/applications` (`generateStaticParams`, `dynamicParams = false`),
  `/studio`, `/contact`, `/mentions-legales`, `/politique-de-confidentialite`, 404, `api/contact`, sitemap, robots, manifest, icônes.
- Anciennes URLs de l'offre à cinq services : redirections 308 dans `next.config.mjs` (`redirects()`), testées dans
  `tests/e2e/redirects.spec.ts`. Ne jamais les transformer en 404. Ancres de la page Services : `#offre-sites-web`, `#offre-applications`.
- `src/data/*` : contenus typés. Modifier une offre = `src/data/services.ts` (`offers`, `capabilities`) : alimente accueil,
  /services, pages dédiées, sitemap, JSON-LD. Types du formulaire : `src/data/contact.ts`.
- `src/content/legal/*.txt` : textes juridiques, rendus verbatim par `src/lib/legal.ts`. **Ne pas les réécrire sans validation
  de Matéo** ; sommaire généré automatiquement.
- `src/lib/metadata.ts` : `buildMetadata()` pour toute page (canonical absolu, OG, Twitter). Titre ≤ 75 car., description ≤ 160.
- JSON-LD : `Organization` + `WebSite` (layout), `ProfessionalService` (accueil), `Service` + `BreadcrumbList` (pages d'offre),
  `ItemList` (offres), `AboutPage`, `ContactPage`. Uniquement des champs vérifiés ; pas de schéma décoratif.
- `config/required-env.mjs` : liste unique des variables requises en production (utilisée par `next.config.mjs` et l'API).

## Règles d'animation (performance d'abord)

- **Aucune bibliothèque d'animation JS** (GSAP retiré). Les révélations au scroll sont en CSS pur
  (`animation-timeline: view()`) via `MotionReveal`, `TextReveal`, `LineReveal` : composants **serveur**, aucun JS client.
  La révélation se fait par masque (`clip-path`) et léger déplacement, **jamais par fondu** : un texte semi-transparent
  fait échouer les contrôles de contraste (axe, Lighthouse).
  Sans prise en charge ou en mouvement réduit, le contenu est affiché directement. Ne pas les rendre « client ».
- Pas de fade sur chaque élément : réserver la révélation aux titres, blocs clés et listes structurantes.
- Transition de page : déplacement seul, sans fondu (ne retarde pas le LCP).
- Hero « Le Plan » (`src/components/home/plan/`) : à préserver. `system.ts` = géométrie, `render.ts` = rendu pur,
  `PlanCanvas.tsx` = plomberie. Règles : la boucle rAF s'arrête hors viewport et onglet caché ; cadence adaptée
  (mobile ~30 Hz en défilement, ~12–20 Hz au repos) ; DPR plafonné (2 desktop, 1,5 mobile) ; aucune allocation par image
  dans `drawPlot` ; tri des îlots fait une seule fois. Le texte du hero reste du DOM.
- Lenis : desktop à pointeur fin uniquement, chargé à la demande (`import()`), désactivé en `prefers-reduced-motion`.
- `prefers-reduced-motion` : toujours respecté (hero statique d'une hauteur d'écran, aucune révélation).

## Responsive

Largeurs de référence testées : 375, 390, 430, 768, 1024, 1280, 1440, 1920. Aucun débordement horizontal.
Barre d'en-tête : une seule barre fixe qui se masque **entièrement** en descendant (jamais de logo rogné), fond translucide
après 24 px, menu mobile hors de la barre (pas d'ancêtre transformé), `inert` quand fermé, safe areas (`viewportFit: cover`).
Ancres : `scroll-padding-top` global dans `globals.css` — ne pas ajouter d'offset au cas par cas.

## Accessibilité (WCAG 2.2 AA)

- axe-core doit rester à **0 violation** sur toutes les routes (`pnpm test:a11y`). Ne pas régresser.
- Cibles tactiles ≥ 24 px (formulaire et boutons ≥ 44–48 px). Focus visible ambre global. Lien d'évitement en premier.
- Formulaire : vrais `<label>`, `aria-invalid` + `aria-describedby`, résumé d'erreurs en région vivante, focus sur le premier
  champ invalide, focus sur la confirmation après envoi, anti double envoi.
- Contrastes mesurés (voir tokens). Contenu jamais masqué par `visibility: hidden` avant animation.

## Performance

Objectifs (build de production) : Lighthouse mobile ≥ 90 (accueil mesuré ≈ 98), desktop ≈ 100, accessibilité 100,
SEO 100, CLS 0. JS initial accueil ≈ 112 kB. Images via `next/image` ; aucun média lourd. Avant d'ajouter une dépendance
client, mesurer son poids (`pnpm analyze`). Pas de polices externes.

## SEO

Titres uniques, canonical absolu, OG par page (`public/assets/og`, générés par `pnpm og:generate`), sitemap avec dates
stables (mises à jour manuellement dans `src/app/sitemap.ts`), robots (`/api/` exclu), un seul `h1` par page, axes : création de site internet / refonte à Bordeaux, studio web Bordeaux, développement d'application web, SaaS,
plateforme métier — intégrés naturellement, sans bourrage de mots-clés. Signaux locaux Bordeaux sans texte artificiel.

## Sécurité

- Aucun secret dans le code ; variables dans `.env.example` (noms uniquement). `NEXT_PUBLIC_*` = public par nature.
- CSP et en-têtes dans `next.config.mjs` : limitées aux besoins réels (Turnstile, Plausible). Pas de `'unsafe-eval'`
  en production ; Zod est configuré en mode `jitless` pour cette raison.
- `/api/contact` : Content-Type strict, taille bornée, contrôle d'origine, validation Zod serveur (enums), honeypot,
  Turnstile **fail-closed** en production (jamais de contournement), échappement HTML, objet d'e-mail sur une ligne,
  accusé non bloquant, 503 explicite si configuration manquante, aucun journal de donnée personnelle.
- Build de production strict si `NEXCY_STRICT_ENV=1` ou `VERCEL_ENV=production`.
- `pnpm audit --prod` doit rester propre ; les dépendances transitives sensibles sont épinglées via `pnpm.overrides`.

## Commandes

```bash
pnpm dev | build | start       # développement / production
pnpm typecheck && pnpm lint    # contrôles statiques
pnpm test:e2e                  # Playwright (desktop + mobile) ; test:a11y pour axe seul
pnpm audit:lighthouse          # Lighthouse CI
pnpm og:generate               # visuels Open Graph
```

CI : `.github/workflows/ci.yml` (typecheck, lint, build, e2e).

## Règles à ne pas casser

1. Ne pas refaire le site : préserver l'identité (hero « Le Plan », grille, sobriété, ambre).
2. Ambre = seul accent. Jamais de bleu.
3. Aucune preuve inventée ; aucune information légale devinée.
4. Aucun secret en dur ; production explicite si configuration critique manquante ; Turnstile jamais contourné.
5. axe à 0 violation ; mobile Lighthouse ≥ 90 ; pas de débordement horizontal.
6. Pas d'animation JS lourde ; reveals en CSS serveur ; `prefers-reduced-motion` respecté.
7. Textes légaux verbatim ; toute modification validée par Matéo.
8. Commits logiques, branche de travail, PR en brouillon vers `main`.

## Commandes Claude Code disponibles

| Commande | Description | Source / Licence |
|---|---|---|
| `/code-review` | Revue de code structurée des changements en cours | Inspiré de [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) (MIT) |
| `/commit-message` | Génère un message de commit à partir des changements stagés | Inspiré de [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) (MIT) |
| `/pr-checklist` | Checklist de préparation avant pull request | Inspiré de [awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit) (Apache-2.0) |

## Règles d'usage

- Ces commandes sont des prompts markdown statiques (`.claude/commands/`) : elles n'exécutent aucun script externe, n'accèdent à aucun réseau et ne modifient aucun fichier en dehors du dépôt courant.
- Aucun hook actif, aucune configuration MCP n'est associée à ces commandes (`.claude/settings.json` non créé).
- Toute extension future (nouveaux agents, skills, hooks, MCP) fait l'objet d'une PR séparée avec revue de sécurité dédiée — voir `logs/research/2026-06-11_vague-1-integration-plan-claude-core.md` pour le plan d'intégration global.

## Subagents Claude Code disponibles

| Agent | Description | Source / Licence |
|---|---|---|
| `code-reviewer` | Revue de code experte (qualité, bugs, sécurité, simplification) | Inspiré de [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) (MIT) |
| `web-design-specialist` | Design web premium Next.js/Tailwind/GSAP/Motion/Lenis | Inspiré de [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) (MIT) |
| `seo-specialist` | Audit et amélioration SEO on-page (Next.js) | Inspiré de [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) (MIT) |
| `content-writer` | Rédaction de contenu web marketing (FR) | Inspiré de [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) (MIT) |
| `automation-specialist` | Documentation/conception de workflows d'automatisation (n8n et autres), sans exécution | Inspiré de [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) (MIT) |

Ces agents sont des fichiers markdown statiques (`.claude/agents/*.md`) avec frontmatter YAML conforme à la documentation officielle Claude Code (sub-agents). Aucun n'exécute de script externe, n'accède au réseau, ni ne modifie de fichier en dehors du dépôt courant.

## Skills Claude Code disponibles

| Skill | Description | Source / Licence |
|---|---|---|
| `claude-code-conventions` | Conventions internes pour travailler avec Claude Code dans ce dépôt (contexte, périmètre, PR, sécurité, diffs) | Inspiré de [awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit) (Apache-2.0) ; format de référence [anthropics/skills](https://github.com/anthropics/skills) |
| `audit-report-structure` | Structure standard pour les rapports d'audit/recherche (résumé, périmètre, constats, risques, priorités P0-P3, recommandations) | Inspiré de [awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit) (Apache-2.0) ; format de référence [anthropics/skills](https://github.com/anthropics/skills) |

Ces skills sont des fichiers markdown statiques (`skills/*/SKILL.md`) purement documentaires : aucun script, aucun code exécutable, aucun accès réseau, aucune manipulation automatique de fichiers.

## Historique d'intégration

- Vague 1A (commandes Claude Code core) : voir `logs/changes/2026-06-11_vague-1a-claude-core-commands.md`
- Vague 1B (subagents Claude Code core) : voir `logs/changes/2026-06-11_vague-1b-claude-core-subagents.md`
- Vague 1C (skills documentaires sûres) : voir `logs/changes/2026-06-11_vague-1c-claude-core-skills.md`
