---
description: Génère un message de commit clair à partir des changements stagés
---

<!--
Source : inspiré de la collection awesome-claude-code (hesreallyhim), MIT
https://github.com/hesreallyhim/awesome-claude-code
Adaptation mateo_brain / Nexcy — pas de copie verbatim.
-->

Analyse les changements actuellement stagés (`git diff --staged`) et propose un message de commit :

- Une première ligne courte (≤ 72 caractères), au mode impératif, résumant le **pourquoi** du changement plutôt que le détail technique.
- Si nécessaire, un corps de message en 1 à 3 phrases expliquant le contexte ou la motivation.
- Respecte le style des commits récents du dépôt (`git log --oneline -10`) pour la convention de formulation.

Cette commande propose uniquement un message pour validation : elle ne crée pas le commit, ne modifie aucun fichier et n'accède à aucune ressource réseau.
