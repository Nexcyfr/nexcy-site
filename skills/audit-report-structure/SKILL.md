---
name: audit-report-structure
description: Structure standard pour rédiger un rapport d'audit ou de recherche (résumé exécutif, périmètre, constats, risques, priorités P0-P3, recommandations, limites, prochaine action). À utiliser pour produire des rapports markdown cohérents dans logs/research/ ou logs/changes/.
---

<!--
Source : inspiré de awesome-claude-code-toolkit (rohitg00), Apache-2.0
URL : https://github.com/rohitg00/awesome-claude-code-toolkit
Référence de format : anthropics/skills (Agent Skills)
Adaptation mateo_brain / Nexcy — pas de copie verbatim.
-->

# Structure de rapport d'audit / recherche

Cette skill décrit la structure recommandée pour tout rapport d'audit, de recherche ou de validation produit dans ce dépôt (`logs/research/`, `logs/changes/`).

## Sections recommandées

1. **Résumé exécutif**
   Synthèse en quelques phrases : objectif du rapport, périmètre couvert, conclusion principale.

2. **Périmètre**
   Ce qui a été analysé (ressources, fichiers, dépôts) et ce qui en a été explicitement exclu.

3. **Constats**
   Observations factuelles, idéalement sous forme de tableau ou de liste structurée (ex. ressources analysées, licences, scores).

4. **Risques**
   Risques identifiés (sécurité, licence, RGPD, maintenance, etc.), avec des libellés normalisés si applicable (ex. `LICENSE_UNCLEAR`, `CODE_EXECUTION`, `GDPR_RISK`).

5. **Priorités P0/P1/P2/P3**
   - **P0** : action/référence prioritaire, bloquante ou de conformité.
   - **P1** : action importante à court terme.
   - **P2** : amélioration ou inspiration à valider plus tard.
   - **P3** : exclu ou hors scope pour l'instant.

6. **Recommandations**
   Actions concrètes proposées, classées par priorité, avec justification courte.

7. **Limites / hypothèses**
   Ce que le rapport ne couvre pas, les hypothèses prises (ex. licence non vérifiée, accès réseau limité), et les vérifications restant à faire.

8. **Prochaine action**
   Étape suivante recommandée, idéalement formulée comme un prompt ou une tâche prête à être lancée dans une session dédiée.

## Bonnes pratiques

- Garder les rapports courts et factuels — éviter les sections superflues si elles n'apportent pas d'information.
- Utiliser des tableaux pour les comparaisons (ressources, scores, licences, risques).
- Toujours dater le rapport dans le nom de fichier (`YYYY-MM-DD_*.md`).

## Rappel

Cette skill est purement documentaire : elle ne contient aucun script, n'exécute aucune commande, ne manipule aucun fichier automatiquement et n'accède à aucune ressource réseau.
