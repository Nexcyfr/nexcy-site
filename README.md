# NEXCY — Site officiel

Site premium de **NEXCY**, agence digitale à Bordeaux. _Precision in Motion._

Conçu conformément au **Master Brief v2** (source de vérité). Thème entièrement
sombre, accent doré cuivré `#C8883A`, typographie Geist Sans. **Aucune couleur bleue.**

## Stack

| Domaine | Choix |
|---|---|
| Framework | Next.js 14 (App Router) |
| Langage | TypeScript strict |
| Style | Tailwind CSS v3 |
| Animations | GSAP 3 + ScrollTrigger + `@gsap/react` (`useGSAP`) |
| Scroll | Lenis (un seul provider) |
| Typographie | Geist Sans (`geist` via `next/font`) |
| Formulaire | React Hook Form + Zod + Resend |
| Anti-spam | Cloudflare Turnstile (`@marsidev/react-turnstile`) + honeypot |
| Analytics | Plausible |
| Déploiement | Vercel |

## Démarrage

```bash
pnpm install
cp .env.example .env.local   # renseigner les clés
pnpm dev                     # http://localhost:3000
```

### Vérifications avant livraison

```bash
pnpm exec tsc --noEmit   # 0 erreur TypeScript
pnpm lint                # 0 warning
pnpm build               # build de production
```

## Variables d'environnement

Voir `.env.example`. Requises en production :

- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL` — envoi du formulaire
- `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — anti-spam
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — analytics (`nexcy.fr`)
- `NEXT_PUBLIC_SITE_URL` — URL canonique (`https://nexcy.fr`)
- `NEXT_PUBLIC_CAL_URL` — lien Cal.com (optionnel)

> Le formulaire et Turnstile se dégradent proprement si les clés sont absentes
> (le formulaire affiche un message invitant à écrire directement ; Turnstile
> n'est rendu que si sa clé publique est présente ; en dev sans secret, la
> vérification serveur est ignorée).

## Structure

```
src/
  app/            routes (/, /services, /studio, /contact, légales, 404),
                  api/contact, sitemap, robots, manifest, icônes
  components/     global · ui · animations · home · services · studio · contact · legal
  data/           contenus typés (services, valeurs, méthode, navigation, contact)
  hooks/          useLenis · useReducedMotion
  lib/            gsap · utils · metadata · media (sourcing) · contact-schema · legal
  content/legal/  textes juridiques (extraits des sources RTF, verbatim)
  styles/         globals.css (tokens CSS, reduced-motion)
```

## Décisions techniques notables

- **Dépendances ajustées vs brief** (packages inexistants/renommés) :
  - `@turnstile/next` (inexistant, 404 sur npm) → **`@marsidev/react-turnstile`**
    (wrapper React Turnstile MIT maintenu).
  - `@studio-freight/lenis` (déprécié) → **`lenis`** (même librairie, renommée).
  - Ajouts justifiés : `@gsap/react` (`useGSAP` + cleanup), `@hookform/resolvers`
    (pont Zod↔RHF), `clsx` + `tailwind-merge` (`cn()`), `sharp` (optimisation images).
- **Hero d'accueil** : la séquence de révélation joue **au chargement** (message
  visible en < 2 s, conforme au brief §46 et à la règle premium « animation au
  load »), et le scroll ajoute une **parallaxe subtile** (esprit « Precision in
  Motion »). Un hero purement scroll-gaté laisserait le titre invisible à l'arrivée.
- **Pages légales** : les sources fournies étaient en **RTF** (extension `.md`
  trompeuse). Texte extrait via `textutil`, stocké dans `src/content/legal/*.txt`,
  puis rendu **verbatim** par un parseur maison (aucune dépendance markdown).
- **Visuels** : le hero et les cellules de démonstration sont **générés en code**
  (SVG/Canvas GSAP) — priorité du brief §30, LCP instantané, zéro CLS.

## Assets à remplacer (placeholders générés)

| Asset | Emplacement | Statut |
|---|---|---|
| `og-*.png` | `public/assets/og/` | générés (logo + tagline sur fond noir) — remplaçables par des visuels finaux |
| `monogram-n.svg`, icônes | `public/assets/brand/`, `src/app/` | générés depuis le monogramme N |
| Hero / Studio (IMG-01, IMG-02) | rendus en SVG codé | substitut premium ; images IA optionnelles via prompts du brief §27 |

Assets fournis intégrés : `logo-nexcy.svg`, `bordeaux-skyline.png`, textes légaux.

## Déploiement Vercel

1. Importer le repo, framework **Next.js** détecté automatiquement.
2. Renseigner les variables d'environnement (ci-dessus).
3. Ajouter le domaine `nexcy.fr` (A `76.76.19.19`, CNAME `www` → `cname.vercel-dns.com`).
4. Post-déploiement : soumettre le sitemap à Google Search Console, vérifier les
   en-têtes via securityheaders.com, tester le formulaire en production.
