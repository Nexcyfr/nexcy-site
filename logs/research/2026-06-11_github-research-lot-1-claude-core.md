# Lot 1 — Claude Code Core (agents, skills, commands, hooks, workflows)

Recherche limitée (mode économie de tokens) : 1 agent, 8 ressources, 3 WebFetch.
Recherche + analyse uniquement — rien cloné, copié ou installé.

## Tableau

| # | Nom | URL | Licence | Gratuit | Score /100 | Risque | Emplacement recommandé |
|---|-----|-----|---------|---------|------------|--------|------------------------|
| 1 | awesome-claude-code | https://github.com/hesreallyhim/awesome-claude-code | MIT | Oui | 95 | Faible | `knowledge-base/` (index) + piocher skills/hooks/commands ponctuels dans `skills/`, `.claude/commands/` |
| 2 | awesome-claude-code-toolkit | https://github.com/rohitg00/awesome-claude-code-toolkit | Apache-2.0 | Oui | 92 | Faible | `.claude/agents/`, `skills/`, `workflows/` (trier au cas par cas, volume énorme) |
| 3 | awesome-claude-code-subagents (VoltAgent) | https://github.com/VoltAgent/awesome-claude-code-subagents | MIT | Oui | 90 | Faible | `.claude/agents/` (sélectionner ~10-15 agents pertinents) |
| 4 | claude-code-subagents (0xfurai) | https://github.com/0xfurai/claude-code-subagents | Non vérifiée | Oui (a priori) | 70 | Moyen — vérifier licence avant copie | `agents/custom/` |
| 5 | claude-code-sub-agents (dl-ezo) | https://github.com/dl-ezo/claude-code-sub-agents | Non vérifiée | Oui (a priori) | 68 | Moyen — vérifier licence/format | `agents/custom/` |
| 6 | awesome-claude-code-and-skills (GetBindu) | https://github.com/GetBindu/awesome-claude-code-and-skills | Non vérifiée | Oui (a priori) | 65 | Moyen — vérifier qualité des SKILL.md | `skills/` (review needed) |
| 7 | claude-code-sub-agents (lst97) | https://github.com/lst97/claude-code-sub-agents | Non vérifiée | Oui (a priori) | 60 | Moyen — repo perso, qualité variable | `A_JETER/review-needed/` |
| 8 | Doc officielle subagents | https://code.claude.com/docs/en/sub-agents | Officiel Anthropic | Oui | 100 | Aucun | `knowledge-base/` (référence format `.claude/agents/*.md`) |

## Notes rapides

1. **awesome-claude-code** (46.2k★, MIT) — LA liste de référence : skills, hooks, slash-commands, orchestrateurs, plugins. À utiliser comme index pour piocher des éléments précis plutôt qu'à intégrer en bloc.
2. **awesome-claude-code-toolkit** (2k★+, Apache-2.0, actif mars 2026) — 135 agents, 35 skills (+400k via SkillKit), 42 commands, 176+ plugins, 20 hooks, 7 templates, MCP configs. Très complet mais volume énorme → trier par domaine (dev web, SEO, automation).
3. **VoltAgent/awesome-claude-code-subagents** (21.6k★, MIT) — 154+ subagents bien catégorisés, format `.claude/agents/*.md` standard, plusieurs méthodes d'install (manuelle, marketplace, installer interactif).
4. **0xfurai/claude-code-subagents** — 100+ subagents "production-ready", placés directement dans `~/.claude/agents/`. Licence à vérifier avant copie.
5. **dl-ezo/claude-code-sub-agents** — 35 subagents pour automatiser un cycle dev complet (end-to-end). Licence/format à vérifier.
6. **GetBindu/awesome-claude-code-and-skills** — collection de Claude Skills (format SKILL.md). Vérifier la qualité/maintenance avant intégration.
7. **lst97/claude-code-sub-agents** — 33 subagents full-stack, repo personnel, à mettre en review.
8. **Doc officielle Claude Code (sub-agents)** — référence pour valider que tout agent récupéré respecte le format YAML frontmatter actuel avant intégration dans `mateo_brain`.

## Risques principaux

- Repos #4-7 : licence non vérifiée → traiter comme **inspiration uniquement** tant que non confirmé MIT/Apache/permissive.
- Volume très élevé sur #1 et #2 → ne pas tout copier, sélectionner agent par agent.
- Toujours valider le format des agents récupérés contre la doc officielle (#8) avant intégration dans `.claude/agents/`.

## Top priorités pour la suite

1. #1 (awesome-claude-code) — index principal
2. #3 (VoltAgent subagents) — meilleure base d'agents prêts à l'emploi
3. #2 (toolkit) — pour skills/commands/hooks complémentaires
4. #8 (doc officielle) — référence de conformité

---
*Lot 2 (Web premium Nexcy) et Lot 3 (Automatisation/SEO/audit) à faire séparément, sur demande.*
