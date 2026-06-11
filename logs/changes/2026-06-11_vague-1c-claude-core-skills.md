# Vague 1C — Intégration des skills documentaires Claude Code core

Référence : `logs/research/2026-06-11_vague-1-integration-plan-claude-core.md` (Phase C uniquement)

## Fichiers créés

- `skills/claude-code-conventions/SKILL.md` — conventions internes Claude Code (contexte, périmètre, PR, sécurité, diffs)
- `skills/audit-report-structure/SKILL.md` — structure standard de rapport d'audit/recherche
- `logs/changes/2026-06-11_vague-1c-claude-core-skills.md` — ce log

## Fichiers modifiés

- `CLAUDE.md` — ajout de la section "Skills Claude Code disponibles" + mise à jour de l'historique d'intégration

## Sources et licences

| Ressource | URL | Licence |
|---|---|---|
| awesome-claude-code-toolkit | https://github.com/rohitg00/awesome-claude-code-toolkit | Apache-2.0 |
| anthropics/skills (référence de format uniquement) | https://github.com/anthropics/skills | Référence officielle Anthropic |

Aucune copie verbatim — skills réécrites/adaptées pour mateo_brain / Nexcy, conformément à la section "Plan de sécurité" du plan Vague 1.

GetBindu/awesome-claude-code-and-skills (#6 du Lot 1) **non utilisé** dans cette PR — licence non vérifiée, reste en review.

## Contenu

- `claude-code-conventions` : lecture du contexte, respect du périmètre, séparation des PR, règles de sécurité, format des diffs, interdiction par défaut des hooks/MCP/scripts sans validation explicite.
- `audit-report-structure` : sections recommandées (résumé exécutif, périmètre, constats, risques, priorités P0-P3, recommandations, limites/hypothèses, prochaine action) + bonnes pratiques.

## Sécurité

- Aucun hook actif, `.claude/settings.json` non créé/modifié.
- Aucune configuration MCP.
- Aucun script shell, aucun fichier exécutable, aucun code exécutable dans les `SKILL.md`.
- Aucun `npm install`, `package.json` non modifié.
- Aucun accès réseau, aucune manipulation automatique de fichiers.
- Aucune modification de codebase Next.js active.

## Non créé dans cette PR

- Workflows, templates, nouveaux agents — hors périmètre Vague 1C.
- Aucune modification des commandes existantes (`.claude/commands/`).
- Skills supplémentaires (ex. issues de GetBindu) — feront l'objet d'une PR séparée après vérification de licence.

## Vérification Unicode caché/bidirectionnel

Scan des 2 fichiers `skills/*/SKILL.md` ajoutés et de `CLAUDE.md` (modifié) pour les catégories Unicode Cc/Cf (hors `\n`, `\r`, `\t`) et les espaces spéciaux/insécables (U+00A0, U+2000-U+200A, U+202F, U+205F, U+3000) — **aucun caractère suspect détecté**. Aucune correction nécessaire.
