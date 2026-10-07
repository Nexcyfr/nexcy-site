# NEXCY — Site officiel

Site de **NEXCY**, studio digital à Bordeaux : sites web, branding, SEO, automatisation et agents IA.
Signature : _Precision in Motion_.

Direction visuelle : thème sombre, grille « plan technique », accent **ambre** `#D9913D` utilisé avec parcimonie
(CTA, traits, états actifs). Aucune couleur froide. Typographie Geist.

## Stack

| Domaine | Choix |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript strict |
| Style | Tailwind CSS 3, tokens CSS dans `src/app/globals.css` |
| Mouvement | CSS pur (animations pilotées par le scroll), canvas 2D pour le hero, Lenis (desktop uniquement) |
| Typographie | Geist Sans, auto-hébergée (`geist`) |
| Formulaire | React Hook Form + Zod, route API `/api/contact`, Resend (e-mails), Cloudflare Turnstile + honeypot |
| Mesure | Plausible (sans cookie), optionnel |
| Rendez-vous | Cal.com (lien), optionnel |
| Tests | Playwright (e2e, accessibilité axe-core), GitHub Actions |

## Démarrage

Prérequis : Node.js 22, pnpm 10.

```bash
pnpm install
cp .env.example .env.local   # facultatif en développement
pnpm dev                     # http://localhost:3000
```

En développement, le site fonctionne **sans aucune clé** : Turnstile est ignoré (jamais en production) et l'API
répond `503` explicite tant que `RESEND_API_KEY` n'est pas renseignée (aucun faux succès).

## Commandes

| Commande | Rôle |
|---|---|
| `pnpm dev` | Serveur de développement |
| `pnpm build` / `pnpm start` | Build et serveur de production |
| `pnpm typecheck` | TypeScript (`tsc --noEmit`) |
| `pnpm lint` | ESLint (`next lint`) |
| `pnpm test:e2e` | Suite Playwright (desktop + mobile), démarre `pnpm dev` si besoin |
| `pnpm test:a11y` | Seulement les tests d'accessibilité (axe-core, WCAG 2.2 AA) |
| `pnpm audit:lighthouse` | Build + Lighthouse CI (seuils dans `.lighthouserc.json`) |
| `pnpm analyze` | Analyse du bundle |
| `pnpm og:generate` | Régénère les visuels Open Graph (`public/assets/og`) |
| `pnpm og:capture` | Recapture le plan du hero (serveur de production requis) |

Les tests e2e utilisent Chromium. Hors CI, indiquer son chemin si besoin : `PW_CHROMIUM_PATH=/chemin/chromium pnpm test:e2e`.

## Variables d'environnement

Modèle complet et commenté : `.env.example`. Détail, provenance et configuration : [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

| Variable | Requise en production | Rôle |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | oui | URL canonique (metadata, sitemap, JSON-LD) |
| `RESEND_API_KEY` | oui | Envoi des e-mails du formulaire |
| `RESEND_FROM_EMAIL` | oui | Expéditeur (domaine vérifié chez Resend) |
| `RESEND_TO_EMAIL` | oui | Boîte de réception des demandes |
| `TURNSTILE_SECRET_KEY` | oui | Vérification anti-robot (serveur) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | oui | Widget Turnstile (public) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | non | Active la mesure d'audience |
| `NEXT_PUBLIC_CAL_URL` | non | Active le bloc de réservation (https uniquement) |
| `NEXCY_STRICT_ENV` | non | `1` : le build de production échoue si une variable requise manque |

Aucun secret n'est versionné. Sur Vercel en production, le contrôle strict est automatique (`VERCEL_ENV=production`).

## Structure

```
src/
  app/            routes : /, /services, /services/[slug], /studio, /contact, pages légales, 404,
                  api/contact, sitemap, robots, manifest, icônes
  components/     global · ui · animations · home (+ plan/ : moteur canvas) · services · studio · contact · legal
  data/           contenus typés (services, méthode, valeurs, navigation, formulaire)
  hooks/          useLenis · useReducedMotion
  lib/            metadata · utils · site-config · env · contact-schema · legal · motion/easing
  content/legal/  textes juridiques (texte brut, rendu verbatim par lib/legal.ts)
config/           liste des variables requises en production (partagée avec next.config.mjs)
scripts/          og/ (visuels sociaux) · assets/ (icônes)
tests/e2e/        Playwright
```

## Qualité

- Lighthouse (mesures locales, build de production) : accueil mobile ≥ 95, desktop ≈ 100 ; accessibilité 100 ; SEO 100.
- Pages pré-rendues en statique ; JavaScript initial de l'accueil ≈ 112 kB.
- `pnpm audit --prod` : aucune vulnérabilité connue.
- Détail des choix et règles à ne pas casser : [`CLAUDE.md`](CLAUDE.md).

## Déploiement

Voir [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) (variables, domaine, Resend, Turnstile, vérifications après mise en ligne) et
[`docs/LAUNCH-CHECKLIST.md`](docs/LAUNCH-CHECKLIST.md) (actions humaines et informations à confirmer avant production).
