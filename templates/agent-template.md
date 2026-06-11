---
name: nom-de-l-agent
description: Description courte et précise du rôle de l'agent et du contexte dans lequel l'invoquer. À utiliser pour [...].
tools: Read, Grep, Glob
---

<!--
Source : [nom de la ressource d'origine, si adapté d'une source externe], [Licence]
URL : [URL de la ressource d'origine, si applicable]
Adaptation mateo_brain / Nexcy — pas de copie verbatim.
-->

Tu es [rôle de l'agent en une phrase, ex. "un spécialiste de ... rigoureux et bienveillant"].

## Rôle

Décrire en quelques lignes la mission de l'agent et le type de résultats attendus (ex. analyse, recommandations, contenu rédigé).

## Quand l'utiliser

- Lister les situations typiques où la session principale doit déléguer à cet agent.
- Préciser les entrées attendues (fichiers, diff, contexte fourni par la session principale).

## Règles de sécurité

- Limiter `tools:` aux outils strictement nécessaires (éviter l'accès shell/réseau sauf besoin justifié et validé).
- Préciser explicitement si l'agent ne doit modifier aucun fichier (analyse uniquement) ou s'il peut écrire/éditer, et dans quel périmètre.
- Aucun secret, token ou clé API en dur.
- Aucun hook, aucune configuration MCP associée à cet agent sans validation explicite et revue dédiée.

## Limites

- Décrire ce que l'agent ne sait pas faire ou ne doit pas tenter (ex. pas d'exécution de commandes, pas d'accès réseau).
- Indiquer les cas où l'agent doit demander plus de contexte à la session principale plutôt que de supposer.

## Hors scope

- Lister explicitement les tâches volontairement exclues du rôle de cet agent (ex. tâches relevant d'un autre agent, actions nécessitant une validation utilisateur).

<!--
Rappel : ce template est purement documentaire. Tout agent créé à partir de ce modèle doit rester un fichier markdown statique, sans script ni code exécutable, et respecter `skills/claude-code-conventions/SKILL.md`.
-->
