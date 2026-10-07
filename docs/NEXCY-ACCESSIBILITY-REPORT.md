# NEXCY — Rapport d'accessibilité

Objectif WCAG 2.1 **AA**. Les contrastes sont **mesurés réellement** (formule WCAG),
pas déduits de l'usage de tokens.

## Contrastes mesurés (après correction)
| Texte / fond | Ratio | Normal | Large | Usage |
|---|---|---|---|---|
| `text-primary` #F0F0F0 / noir | **17.37:1** | AAA | AAA | titres, texte |
| `text-secondary` #9A9A9A / noir | **7.04:1** | AAA | AAA | corps |
| `text-secondary` / surface #111 | **6.71:1** | AA | AAA | corps sur surface |
| `text-secondary` / card #161616 | **6.43:1** | AA | AAA | corps sur carte |
| **`text-muted` #808080 / noir** | **5.01:1** | **AA** | AAA | légendes, notes |
| `text-muted` / card | **4.58:1** | **AA** | AAA | labels sur carte |
| `accent` #C8883A / noir | **6.64:1** | AA | AAA | liens, accents |
| `accent-light` #E4A85B / noir | **9.48:1** | AAA | AAA | erreurs de formulaire |
| noir / `accent` (bouton primaire) | **6.64:1** | AA | AAA | texte des CTA dorés |

**Correction appliquée** : `text-muted` **#5A5A5A → #808080**. L'ancienne valeur mesurait
**2.87:1** (échec AA même en grand texte, malgré la doc du brief annonçant 3.1:1). La
nouvelle passe **AA normal** sur noir **et** sur carte. Aucun autre couple n'échoue.

## Clavier
- **Header** : liens + CTA focusables, `aria-current` sur la page active.
- **Menu mobile** : `role="dialog"` + `aria-modal`, **piège de focus**, focus initial sur le 1er lien, **retour du focus** au hamburger à la fermeture, Échap ferme.
- **Démonstrations** : 6 vrais `<button type="button">`, `aria-pressed` sur les bascules, noms accessibles, activation Enter/Espace vérifiée.
- **Formulaire** : `<label>` associés, `aria-invalid` + `aria-describedby` sur erreurs, **focus déplacé sur le 1er champ invalide** (RHF), `role="status"` (succès) / `role="alert"` (erreur serveur).
- **Focus visible** : `:focus-visible { outline: 2px solid accent; offset 3px }` (global).
- **Skip link** « Aller au contenu principal » en 1er élément du body.

## Reduced-motion (`prefers-reduced-motion: reduce`)
- Lenis **désactivé** (scroll natif) ; CSS global neutralise durées d'animation/transition.
- **Hero** : scène **statique** (état assemblé), aucun mouvement.
- **Démonstrations** : bascules instantanées, état final signifiant rendu par le markup.
- **Aucun contenu essentiel masqué** avant animation (markup = état final).
- Aucun mouvement à risque vestibulaire (pas de parallaxe/scintillement sous reduced-motion).

## SVG
- **Décoratifs → `aria-hidden="true"`** : `HeroScene`, `ServiceMotif`, `WatermarkN`, SVG des démonstrations, indicateur de scroll.
- **Informatif** : composant `Monogram` accepte un `title` (rôle img) quand il porte du sens ; sinon `aria-hidden`.
- Aucun texte essentiel enfermé uniquement dans un SVG non accessible (les intitulés sont en HTML).

## Structure & divers
- Landmarks : `<header>` (implicite via nav fixe), `<main id="main">`, `<footer>`, `<nav aria-label>`.
- Hiérarchie de titres : un seul `<h1>` par page, pas de saut de niveau.
- Aucune fonctionnalité **hover-only** (tout est cliquable/tap + focus).
- `<html lang="fr">`, `colorScheme: dark`.

## Non couvert / à faire (Étape 12)
- **axe-core** non exécuté (suite de tests automatisés à mettre en place) → à lancer sur les 6 routes.
- **Zoom 200 %** : layout en unités relatives (rem/%), reflow attendu — **à vérifier manuellement** dans un navigateur réel.
- Tests lecteurs d'écran réels (VoiceOver/NVDA) recommandés avant livraison.
