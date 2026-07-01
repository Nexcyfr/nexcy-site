# NEXCY — Rapport de sécurité

Branche `refactor/international-premium-v2`. Statut : **Lot 1 (P0) appliqué.**

## 1. Secrets & versionnement
- Aucun secret suivi par Git (seul `.env.example` = placeholders).
- `.gitignore` couvre `.env`, `.env*.local`, `.next`, `node_modules`, `.DS_Store`, `/shots`.
- `.env.local` confirmé **ignoré** (`git check-ignore` OK).
- Aucune valeur secrète affichée ni reproduite dans ce dépôt/docs.

## 2. Content Security Policy (durcie — P0-7)
Avant → après (`next.config.mjs`) :
- `script-src` : **`'unsafe-eval'` retiré** (Next 14 prod + GSAP n'en ont pas besoin — testé : 0 violation, animations OK). `'unsafe-inline'` conservé (scripts inline Next sans nonce).
- `img-src` : domaines Pexels/Unsplash/Pixabay **retirés** (tous les médias sont locaux) → `'self' data: blob:`.
- `connect-src` : domaines média + Resend **retirés** → `'self' https://plausible.io https://challenges.cloudflare.com`.
- `remotePatterns` next/image **retirés** (aucun domaine distant).
- Conservés : Cloudflare Turnstile (`frame-src`/`script-src`/`connect-src`), Plausible.
- Vérifié en live : `unsafe-eval` absent, domaines média absents, 0 violation console.

## 3. Formulaire de contact
- **Turnstile fail-closed (P0-4)** : en production sans `TURNSTILE_SECRET_KEY`, l'API **refuse** (403) et loggue l'erreur — plus de bypass silencieux. Bypass toléré uniquement hors production. Vérifié : soumission sans secret → 403.
- **Rate-limit en mémoire retiré (P0-5)** : inefficace en serverless (instances éphémères, non partagées). Protection réelle = **Turnstile + honeypot**. Décision : ne pas ajouter d'infra tant que le risque d'abus ne le justifie pas. Si nécessaire ultérieurement → **Upstash Redis** (`@upstash/ratelimit`), variables `UPSTASH_REDIS_REST_URL`/`_TOKEN`.
- Honeypot (`website`) : succès silencieux si rempli (n'alerte pas les robots).
- Validation Zod serveur indépendante du client.
- Échappement HTML des champs dans l'e-mail entrant.

## 4. Cookies & consentement (Option A — P0-6)
- **Bannière retirée.** Justification : Plausible fonctionne **sans cookie** (script `script.js` standard, données EU) ; Cloudflare Turnstile n'est chargé que sur `/contact` et est **strictement nécessaire** à la protection du formulaire (cookie fonctionnel exempté de consentement au sens CNIL/RGPD pour la sécurité d'un service demandé par l'utilisateur).
- **À valider avec Matéo** : confirmer auprès de Plausible qu'aucun cookie n'est posé, et vérifier que la **politique de confidentialité** (texte juridique — non modifié ici) décrit bien Turnstile comme traceur strictement nécessaire. Si un cookie non essentiel est réintroduit un jour → repasser en Option B (consentement réel avec gating technique).

## 5. Clés de sourcing média (P0-9)
- `src/lib/media.ts` supprimé (mort au runtime). Les clés Pexels/Unsplash/Pixabay ne servent qu'au **sourcing local** (hors runtime de l'app).
- **Ne pas configurer** ces clés comme variables d'environnement de production sur Vercel.

## 6. En-têtes de sécurité (inchangés, conservés)
HSTS, X-Frame-Options SAMEORIGIN, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy (camera/micro/geo bloqués), X-XSS-Protection, `poweredByHeader: false`.

## 7. Procédure de rotation des clés
En cas de suspicion de fuite (ou rotation périodique — **recommandé tous les 6 mois**) :

1. **Resend** (`RESEND_API_KEY`) : créer une nouvelle clé dans le dashboard Resend → mettre à jour la variable dans **Vercel → Settings → Environment Variables** → redéployer → révoquer l'ancienne clé.
2. **Cloudflare Turnstile** (`TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`) : régénérer la paire dans le dashboard Turnstile → mettre à jour les deux variables Vercel → redéployer → l'ancienne paire cesse d'être valide.
3. **Média (dev)** (Pexels/Unsplash/Pixabay) : régénérer côté fournisseur, mettre à jour `.env.local` **local uniquement** (jamais en prod).
4. Après toute rotation : vérifier le formulaire en production (e-mail reçu + accusé) et l'absence d'erreur.
5. Ne jamais committer une clé ; toujours passer par les variables d'environnement Vercel.
6. Si une clé a été committée par erreur : la **révoquer immédiatement**, purger l'historique Git (`git filter-repo`) puis forcer le push.

## Variables d'environnement de production (Vercel)
Requises : `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_SITE_URL`.
Optionnelle : `NEXT_PUBLIC_CAL_URL`.
**À ne pas mettre en prod** : clés de sourcing média.
