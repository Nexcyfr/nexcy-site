# NEXCY — Backlog post-lancement (non bloquant)

Classement : P1 = premier mois, P2 = trimestre, P3 = opportuniste.

## P1 — Preuves et conversion
- Première étude de cas **réelle** (avec autorisation écrite du client) ou projet démonstrateur clairement identifié comme tel.
- Page ou section « Réalisations » une fois les références disponibles ; témoignage nominatif autorisé.
- Événements de conversion Plausible (envoi du formulaire, clic de réservation).
- Page de remerciement après envoi du formulaire.
- Brancher Cal.com si ce n'est pas fait au lancement.

## P1 — SEO
- Contenu éditorial ciblé (articles / ressources) : audit SEO, site web et IA pour TPE-PME, automatisation.
- Pages sectorielles (hôtellerie-restauration, immobilier, conseil, professions libérales) lorsque des références existent.
- Page « Bordeaux » ou section locale étoffée ; fiche Google Business Profile ; citations locales.
- Suivi mensuel Search Console (requêtes, indexation, Core Web Vitals réels).

## P2 — Technique
- CSP à nonces (suppression de `'unsafe-inline'` pour les scripts) : implique un rendu dynamique ou un middleware ;
  à arbitrer contre le gain de performance du rendu statique.
- Limitation de débit partagée sur `/api/contact` (Upstash Redis) si un abus réel apparaît.
- Surveillance : disponibilité (uptime), alertes d'erreurs serveur, Core Web Vitals réels.
- Lighthouse CI en tâche planifiée avec seuils bloquants.
- Inscription HSTS preload, après vérification de tous les sous-domaines.
- Mise à jour régulière de Next.js / React (correctifs de sécurité) ; `pnpm audit --prod` mensuel.
- Tests visuels de non-régression (captures comparées) sur les gabarits principaux.

## P2 — Design et contenu
- Revue sur appareils réels (iOS Safari, Android Chrome) et lecteurs d'écran (VoiceOver, NVDA) — complète les contrôles automatiques.
- Variante Open Graph par article lorsque le blog existera.
- Page « Méthode » détaillée (livrables types, calendrier type) sans chiffres non vérifiés.

## P3
- Version anglaise (hreflang) si la clientèle internationale devient un objectif.
- Mode d'impression des pages légales.
- Newsletter / lead magnet, sans alourdir le site.
