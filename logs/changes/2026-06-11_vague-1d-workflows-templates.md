# Vague 1D — Workflows et templates internes Claude Code core

Référence : `logs/research/2026-06-11_vague-1-integration-plan-claude-core.md` (Phase D uniquement)

## Fichiers créés

- `workflows/claude-code-core-onboarding.md` — workflow décrivant comment utiliser ensemble les commandes (`.claude/commands/`), les subagents (`.claude/agents/`) et les skills (`skills/*/SKILL.md`) de ce dépôt
- `templates/agent-template.md` — modèle standard pour créer un futur subagent (frontmatter YAML, commentaire source/licence, rôle, quand l'utiliser, règles de sécurité, limites, hors scope)
- `templates/skill-template.md` — modèle standard pour créer une future skill (frontmatter YAML, commentaire source/licence, objectif, instructions, sécurité, rappel documentaire)
- `logs/changes/2026-06-11_vague-1d-workflows-templates.md` — ce log

## Fichiers modifiés

- `CLAUDE.md` — ajout de la section "Workflows et templates disponibles" + mise à jour de l'historique d'intégration

## Sources et licences

Ces fichiers sont des documents internes à mateo_brain / Nexcy, basés sur le format des subagents et skills déjà intégrés (Vagues 1B et 1C) :

| Ressource | URL | Licence |
|---|---|---|
| VoltAgent/awesome-claude-code-subagents (référence de format pour `agent-template.md`) | https://github.com/VoltAgent/awesome-claude-code-subagents | MIT |
| awesome-claude-code-toolkit (référence de format pour `skill-template.md`) | https://github.com/rohitg00/awesome-claude-code-toolkit | Apache-2.0 |
| anthropics/skills (référence de format Agent Skills) | https://github.com/anthropics/skills | Référence officielle Anthropic |

Aucune copie verbatim — `workflows/claude-code-core-onboarding.md` est une rédaction originale décrivant l'usage interne des ressources déjà intégrées dans ce dépôt (Vagues 1A-1C) ; `templates/agent-template.md` et `templates/skill-template.md` reprennent la structure (frontmatter, commentaire source/licence, sections) déjà validée pour les fichiers `.claude/agents/*.md` et `skills/*/SKILL.md` existants.

## Contenu

- `claude-code-core-onboarding` : étapes avant/pendant/après une tâche (lecture de `CLAUDE.md` et de `claude-code-conventions`, usage des commandes/agents/skills, vérifications avant commit/PR, création de nouvelles ressources via les templates).
- `agent-template` : structure complète (frontmatter `name`/`description`/`tools`, commentaire source/licence, sections Rôle, Quand l'utiliser, Règles de sécurité, Limites, Hors scope).
- `skill-template` : structure complète (frontmatter `name`/`description`, commentaire source/licence, sections Objectif, Instructions, Sécurité, Rappel).

## Sécurité

- Aucun hook actif, `.claude/settings.json` non créé/modifié.
- Aucune configuration MCP.
- Aucun script shell, aucun fichier exécutable, aucun code exécutable dans les fichiers ajoutés.
- Aucun `npm install`, `package.json` non modifié.
- Aucun accès réseau, aucune manipulation automatique de fichiers.
- Aucune modification de codebase Next.js active.

## Non créé dans cette PR

- Aucun nouvel agent (`.claude/agents/`).
- Aucune nouvelle skill (`skills/*/SKILL.md`).
- Aucune modification des commandes existantes (`.claude/commands/`).
- Phase E (documentation/dashboard complète) et Phase F (dry-run final) — hors périmètre Vague 1D, feront l'objet de PR séparées.

## Vérification Unicode caché/bidirectionnel

Scan des 3 fichiers ajoutés (`workflows/claude-code-core-onboarding.md`, `templates/agent-template.md`, `templates/skill-template.md`) et de `CLAUDE.md` (modifié) pour les catégories Unicode Cc/Cf (hors `\n`, `\r`, `\t`) et les espaces spéciaux/insécables (U+00A0, U+2000-U+200A, U+202F, U+205F, U+3000) — **aucun caractère suspect détecté**. Aucune correction nécessaire.

Note : une coquille avec des caractères cyrilliques visuellement proches du latin ("типiques" au lieu de "typiques") a été introduite par erreur lors de la rédaction de `templates/agent-template.md`, puis corrigée avant le scan final ci-dessus.
