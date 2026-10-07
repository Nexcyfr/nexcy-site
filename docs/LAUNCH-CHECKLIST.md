# NEXCY — Checklist de lancement

État du dépôt : le code est prêt. Ce document liste **uniquement** ce qui dépend d'une information ou d'une action
externe. Cocher chaque ligne avant d'annoncer le site.

## A. Actions humaines indispensables

- [ ] **Choisir et confirmer l'hébergeur de production** (Vercel, Hostinger Node.js, VPS…) — voir section C.
- [ ] **Créer / vérifier le domaine Resend** (`nexcy.fr`) : SPF, DKIM, DMARC publiés, statut « Verified ».
- [ ] **Créer la clé Resend** → `RESEND_API_KEY`.
- [ ] **Créer le widget Cloudflare Turnstile** (hostnames `nexcy.fr`, `www.nexcy.fr`) → `TURNSTILE_SECRET_KEY` et
      `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
- [ ] **Renseigner les variables d'environnement** sur la plateforme : `NEXT_PUBLIC_SITE_URL`, `RESEND_API_KEY`,
      `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
- [ ] **Basculer le domaine** vers la nouvelle plateforme (DNS) et retirer l'ancien site (GitHub Pages) du domaine.
- [ ] **Tester le formulaire en réel** (e-mail reçu + accusé reçu) et vérifier que Turnstile bloque un envoi sans token.
- [ ] **Soumettre le sitemap** dans Google Search Console (et Bing Webmaster Tools).

## B. Optionnel mais recommandé

- [ ] **Cal.com** : fournir l'URL publique (`NEXT_PUBLIC_CAL_URL`). Tant qu'elle est absente, le site ne promet aucun créneau
      et n'affiche aucun lien de réservation.
- [ ] **Plausible** : déclarer le site et renseigner `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
- [ ] **Google Business Profile** (SEO local Bordeaux), si l'activité s'y prête.

## C. À CONFIRMER AVANT PRODUCTION (informations juridiques et administratives)

Ces points n'ont **pas** été modifiés dans le dépôt : aucune information inconnue n'a été supposée.

1. **Hébergeur web.** Les mentions légales (§5) désignent _HOSTINGER INTERNATIONAL LIMITED_ (Larnaca, Chypre).
   Le projet est préparé pour Vercel. Si le site est servi par un autre prestataire que celui nommé, **les mentions légales
   et la politique de confidentialité (§11 Hébergement des données) doivent être corrigées** avec l'identité exacte de
   l'hébergeur (raison sociale, adresse, contact). Le dépôt ne permet pas de savoir lequel est retenu.
2. **Sous-traitants et destinataires.** La politique de confidentialité (§9, §12) décrit des catégories génériques de
   prestataires. Les services réellement utilisés par le site sont : **Resend** (envoi des e-mails du formulaire),
   **Cloudflare Turnstile** (anti-robot), **Plausible** (mesure d'audience, si activée), l'hébergeur, et **Cal.com** (si activé).
   À confirmer : faut-il les nommer, avec leur localisation et les garanties de transfert hors UE (§12) ? Décision et
   rédaction à valider (juriste ou référent RGPD).
3. **Cookies et traceurs.** Les mentions (§17) indiquent l'absence de cookie de mesure d'audience non essentiel.
   À confirmer : Plausible n'est utilisé qu'en mode sans cookie ; Turnstile est traité comme strictement nécessaire
   (sécurité du formulaire). Si un autre traceur est ajouté, un recueil de consentement devient nécessaire.
4. **Coordonnées publiées.** Les mentions légales affichent un numéro de téléphone et l'adresse professionnelle.
   Confirmer que leur publication est voulue (elle est obligatoire pour l'éditeur, mais le téléphone est modifiable selon le cas).
5. **Dates de version des textes légaux** (publication 1er janvier 2026, mise à jour 25 juin 2026, version 2.0) :
   à mettre à jour si les textes changent (points 1 à 3).
6. **Année « 2019 »** de la page Studio (« expérience construite depuis 2019 », frise « Début de pratique ») : à confirmer
   comme exacte et vérifiable. La création juridique (février 2025) est, elle, établie par les mentions légales.
7. **Délai de réponse de 48 heures ouvrées**, annoncé partout : engagement à tenir.

## D. Ce que le site ne prétend pas (à conserver tel quel)

Aucun client, chiffre, témoignage, récompense ni certification n'est affiché. Les seules preuves présentées sont
vérifiables publiquement (performances, accessibilité, structure du site). Toute future référence doit être réelle
et autorisée (voir mentions légales §9 et §10).
