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

## Subagents Claude Code disponibles

| Agent | Description | Source / Licence |
|---|---|---|
| `code-reviewer` | Revue de code experte (qualité, bugs, sécurité, simplification) | Inspiré de [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) (MIT) |
| `web-design-specialist` | Design web premium Next.js/Tailwind/GSAP/Motion/Lenis | Inspiré de [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) (MIT) |
| `seo-specialist` | Audit et amélioration SEO on-page (Next.js) | Inspiré de [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) (MIT) |
| `content-writer` | Rédaction de contenu web marketing (FR) | Inspiré de [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) (MIT) |
| `automation-specialist` | Documentation/conception de workflows d'automatisation (n8n et autres), sans exécution | Inspiré de [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) (MIT) |

Ces agents sont des fichiers markdown statiques (`.claude/agents/*.md`) avec frontmatter YAML conforme à la documentation officielle Claude Code (sub-agents). Aucun n'exécute de script externe, n'accède au réseau, ni ne modifie de fichier en dehors du dépôt courant.

## Historique d'intégration

- Vague 1A (commandes Claude Code core) : voir `logs/changes/2026-06-11_vague-1a-claude-core-commands.md`
- Vague 1B (subagents Claude Code core) : voir `logs/changes/2026-06-11_vague-1b-claude-core-subagents.md`
