---
description: Revue de code structurée des changements en cours (qualité, bugs, sécurité, simplification)
---

<!--
Source : inspiré de la collection awesome-claude-code (hesreallyhim), MIT
https://github.com/hesreallyhim/awesome-claude-code
Adaptation mateo_brain / Nexcy — pas de copie verbatim.
-->

Effectue une revue de code des changements en cours (diff non commité, ou diff de la branche courante par rapport à `main`) :

1. **Correctness** : repère les bugs potentiels, cas limites non gérés, erreurs de logique.
2. **Sécurité** : vérifie l'absence de failles courantes (injection, XSS, secrets en dur, validation d'entrée manquante).
3. **Lisibilité / simplicité** : signale le code dupliqué, les abstractions inutiles, les noms peu clairs.
4. **Cohérence** : vérifie le respect des conventions existantes du projet (style, structure, typage).
5. **Tests** : indique si des tests manquent pour les changements critiques.

Présente le résultat sous forme de liste à puces, groupée par fichier, avec un niveau de sévérité (bloquant / important / mineur) pour chaque point.

Cette commande est une analyse uniquement : ne modifie aucun fichier, n'exécute aucun script et n'accède à aucune ressource réseau.
