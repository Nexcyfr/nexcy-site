# CLAUDE.md

Ce fichier sert de point d'entrée pour Claude Code dans le dépôt `nexcy-site`.

## Commandes Claude Code disponibles

| Commande | Description | Source / Licence |
|---|---|---|
| `/code-review` | Revue de code structurée des changements en cours | Inspiré de [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) (MIT) |
| `/commit-message` | Génère un message de commit à partir des changements stagés | Inspiré de [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) (MIT) |
| `/pr-checklist` | Checklist de préparation avant pull request | Inspiré de [awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit) (Apache-2.0) |

## Règles d'usage

- Ces commandes sont des prompts markdown statiques (`.claude/commands/`) : elles n'exécutent aucun script externe, n'accèdent à aucun réseau et ne modifient aucun fichier en dehors du dépôt courant.
- Aucun hook actif, aucune configuration MCP n'est associée à ces commandes (`.claude/settings.json` non créé).
- Toute extension future (nouveaux agents, skills, hooks, MCP) fait l'objet d'une PR séparée avec revue de sécurité dédiée — voir `logs/research/2026-06-11_vague-1-integration-plan-claude-core.md` pour le plan d'intégration global.

## Historique d'intégration

- Vague 1A (commandes Claude Code core) : voir `logs/changes/2026-06-11_vague-1a-claude-core-commands.md`
