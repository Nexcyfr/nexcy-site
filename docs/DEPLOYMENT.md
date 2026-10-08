# Déploiement de NEXCY

Le site est une application Next.js 15 (pages pré-rendues + une route API `/api/contact`).
Il nécessite un hébergement **Node.js** : un hébergement statique seul (par exemple GitHub Pages) ne suffit pas,
car le formulaire passe par la route API.

> L'hébergeur définitif n'est pas établi par le dépôt. Les mentions légales citent Hostinger International Ltd comme
> hébergeur ; le projet a été préparé pour Vercel. À trancher et à aligner : voir `docs/LAUNCH-CHECKLIST.md`.
> Ne pas confondre **registrar** (où le nom de domaine est acheté), **DNS** (où sont gérés les enregistrements) et
> **hébergeur web** (où tourne l'application). Les trois peuvent être trois services différents.

## 1. Variables d'environnement

À renseigner dans la plateforme de déploiement (jamais dans le dépôt). Modèle : `.env.example`.

| Variable | Où la récupérer | À quoi elle sert |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL finale du site, ex. `https://nexcy.fr` | Canonical, sitemap, Open Graph, JSON-LD |
| `RESEND_API_KEY` | Resend → API Keys → Create (droit « Sending access ») | Envoi des e-mails du formulaire |
| `RESEND_FROM_EMAIL` | Adresse d'un domaine vérifié dans Resend, ex. `NEXCY <contact.agency@nexcy.fr>` | Expéditeur des e-mails |
| `RESEND_TO_EMAIL` | Votre boîte de réception, ex. `contact.agency@nexcy.fr` | Destinataire des demandes |
| `TURNSTILE_SECRET_KEY` | Cloudflare → Turnstile → votre widget → clé secrète | Vérification anti-robot côté serveur |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare → Turnstile → votre widget → clé de site | Widget affiché dans le formulaire |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` _(optionnelle)_ | Plausible → Sites → domaine déclaré | Active la mesure d'audience sans cookie |
| `NEXT_PUBLIC_CAL_URL` _(optionnelle)_ | Cal.com → type d'événement → lien public (`https://cal.com/…`) | Active le bloc de réservation |
| `NEXCY_STRICT_ENV` _(optionnelle)_ | — | `1` : le build échoue si une variable requise manque |

Notes :
- Les variables `NEXT_PUBLIC_*` sont **intégrées au build** : toute modification impose un nouveau déploiement.
- Sur Vercel, le contrôle strict s'active tout seul en production : un build sans les six variables requises échoue
  en nommant celles qui manquent (jamais leurs valeurs).
- En production, si une variable critique manque malgré tout, l'API répond `503` avec un message explicite et journalise
  les noms manquants. Le formulaire n'affiche jamais un faux succès.
- Définir les clés Turnstile **et** Resend dans les environnements Production et, si vous testez des aperçus, Preview.

## 2. Services à préparer

### Resend (e-mails)
1. Créer un compte, ajouter le domaine `nexcy.fr`, publier les enregistrements DNS fournis (SPF, DKIM) ; ajouter un
   enregistrement DMARC.
2. Attendre le statut « Verified ».
3. Créer la clé API et renseigner `RESEND_API_KEY`.

### Cloudflare Turnstile (anti-robot)
1. Cloudflare → Turnstile → Add widget.
2. Hostnames : `nexcy.fr`, `www.nexcy.fr` (et le domaine d'aperçu si besoin). Mode « Managed ».
3. Renseigner `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (publique) et `TURNSTILE_SECRET_KEY` (secrète).

### Plausible (optionnel)
Ajouter le site `nexcy.fr` dans Plausible puis renseigner `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=nexcy.fr`.
Le script est chargé uniquement si la variable est définie.

### Cal.com (optionnel)
Créer un type d'événement de 30 minutes, copier son lien public dans `NEXT_PUBLIC_CAL_URL`.
Le site n'affiche la réservation (et la promesse d'un échange de 30 minutes) que si cette variable contient une URL https valide.

## 3. Mise en ligne

### Option A — Vercel
1. Importer le dépôt GitHub (framework Next.js détecté), branche de production `main`.
2. Renseigner les variables du tableau ci-dessus (Production).
3. Déployer, vérifier l'URL d'aperçu (voir section 5), puis ajouter le domaine `nexcy.fr` dans Vercel et suivre les
   enregistrements DNS demandés.

### Option B — Serveur Node.js (VPS, Hostinger Node.js, etc.)
```bash
node -v                      # 22 ou supérieur
corepack enable && pnpm -v   # pnpm 10
pnpm install --frozen-lockfile
NEXCY_STRICT_ENV=1 pnpm build   # variables d'environnement présentes dans le shell
PORT=3000 pnpm start
```
Placer l'application derrière un reverse proxy HTTPS (Nginx, Caddy, ou le proxy de l'hébergeur) et la maintenir avec un
gestionnaire de processus (systemd, pm2…). Le serveur doit transmettre `X-Forwarded-For` et `Host`.

### Bascule du domaine
Si `nexcy.fr` / `www.nexcy.fr` pointent aujourd'hui vers l'ancien site (GitHub Pages) :
1. Noter les enregistrements DNS actuels (pour pouvoir revenir en arrière).
2. Remplacer les enregistrements A / CNAME par ceux de la nouvelle plateforme, **tels qu'affichés dans son interface**
   (Vercel : Settings → Domains ; autre hébergeur : sa documentation). Ne pas recopier d'adresse IP de mémoire.
3. Retirer le domaine personnalisé du dépôt/ancien site pour éviter un conflit.
4. Rediriger `www` vers l'apex (ou l'inverse) — une seule version canonique, celle de `NEXT_PUBLIC_SITE_URL`.

## 4. Après la mise en ligne

- Search Console : valider la propriété du domaine, soumettre `https://nexcy.fr/sitemap.xml`.
- Bing Webmaster Tools : importer depuis Search Console.
- Google Business Profile : à créer si l'activité s'y prête (SEO local Bordeaux).
- Plausible : vérifier la réception d'une visite.

## 5. Vérifications de recette (aperçu puis production)

- [ ] `https://nexcy.fr/` répond 200, HTTPS valide, redirection HTTP → HTTPS.
- [ ] Formulaire : envoi réel → e-mail reçu **et** accusé de réception reçu par l'expéditeur.
- [ ] Formulaire sans Turnstile valide → refusé.
- [ ] `https://nexcy.fr/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` répondent 200.
- [ ] Anciennes URLs : `/services/seo` → 308 vers `/services/sites-web`, `/services/automatisation-ia` → 308 vers `/services/applications`.
- [ ] En-têtes : <https://securityheaders.com> (CSP, HSTS, nosniff, frame-ancestors).
- [ ] Partage : coller l'URL dans LinkedIn / Slack / WhatsApp, vérifier l'aperçu Open Graph.
- [ ] Données structurées : <https://search.google.com/test/rich-results> sur `/` et `/services/sites-web`.
- [ ] Lighthouse mobile et desktop sur `/`, `/services`, `/studio`, `/contact`.
- [ ] Console navigateur sans erreur ; page 404 personnalisée.

## 6. Exploitation

- **Rotation des clés** (tous les 6 mois ou en cas de doute) : créer la nouvelle clé (Resend / Turnstile), mettre à jour
  la variable, redéployer, révoquer l'ancienne, retester le formulaire.
- **Dépendances** : `pnpm audit --prod` régulièrement ; mises à jour Next.js à suivre (correctifs de sécurité fréquents).
- **Abus du formulaire** : Turnstile + honeypot suffisent au lancement. Si un volume d'abus réel apparaît, ajouter une
  limitation de débit partagée (Upstash Redis + `@upstash/ratelimit`) dans `src/app/api/contact/route.ts`.
- **HSTS preload** : volontairement non activé. À envisager seulement quand tous les sous-domaines sont en HTTPS.
