---
description: Checklist de préparation avant ouverture ou passage en ready-for-review d'une pull request
---

<!--
Source : inspiré de awesome-claude-code-toolkit (rohitg00), Apache-2.0
https://github.com/rohitg00/awesome-claude-code-toolkit
Adaptation mateo_brain / Nexcy — pas de copie verbatim.
-->

Vérifie que la branche courante est prête pour une pull request en contrôlant :

1. **Diff propre** : `git status` ne montre aucun fichier non intentionnel (secrets, fichiers temporaires, build artefacts).
2. **Portée** : le diff (`git diff origin/main...HEAD`) ne touche que les fichiers attendus pour cette tâche.
3. **Build / tests** : si le projet a des scripts de build/lint/test (`package.json`), confirme qu'ils ont été exécutés ou indique pourquoi ce n'est pas applicable.
4. **Description** : propose un titre court (≤ 70 caractères) et un résumé en 2-3 points pour la description de la PR.
5. **Sécurité** : aucun secret, token ou clé API dans le diff.

Présente le résultat sous forme de checklist (✅ / ⚠️ / ❌) avec une brève explication pour chaque point.

Cette commande est une analyse uniquement : elle n'effectue aucune action de push, merge ou création de PR, et n'accède à aucune ressource réseau.
