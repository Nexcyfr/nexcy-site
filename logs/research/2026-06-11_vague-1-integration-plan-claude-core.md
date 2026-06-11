# Vague 1 — Plan d'intégration Claude Code core (mateo_brain)

Document de **planification uniquement**. Aucune ressource externe clonée/copiée/installée. Aucun fichier créé/modifié hors `logs/research/`.

> **Note de contexte importante** : ce dépôt (`nexcy-site`) ne contient que `README.md` et `logs/research/`. Les fichiers `CLAUDE.md`, `_SYSTEM/scope-rules.md`, `_SYSTEM/security-rules.md`, `_DASHBOARD/quick-index.md` et `projects/nexcy/CLAUDE.md` référencés dans la demande appartiennent à l'environnement local `~/Desktop/mateo_brain`, non accessible depuis cette session distante. Ce plan est donc construit à partir :
> - du rapport `2026-06-11_github-research-lot-1-claude-core.md`
> - du rapport `2026-06-11_pr-2-final-validation.md`
> - des conventions mateo_brain décrites dans la conversation (arborescence `.claude/agents/`, `agents/custom/`, `skills/[nom]/SKILL.md`, `workflows/`, `templates/`, `_DASHBOARD/`, `knowledge-base/`, `A_JETER/review-needed/`)
>
> À l'exécution réelle (Vague 1A et suivantes), il faudra relire les fichiers `_SYSTEM/scope-rules.md` et `_SYSTEM/security-rules.md` locaux et ajuster ce plan en conséquence avant toute création de fichier.

---

## 1. Résumé exécutif

**Objectif Vague 1** : sélectionner, parmi les 8 ressources du Lot 1, les éléments "Claude Code core" (commandes, subagents, skills, doc) sûrs et bien licenciés, et préparer leur adaptation en fichiers markdown internes à mateo_brain — sans automatisation active.

**Autorisé dans cette vague** :
- Création/adaptation de fichiers markdown statiques : `.claude/commands/*.md`, `.claude/agents/*.md` (ou `agents/custom/`), `skills/*/SKILL.md` (sans script exécutable), `workflows/*.md`, `templates/*.md`
- Mise à jour de documentation (`CLAUDE.md`, `_DASHBOARD/quick-index.md`, `projects/nexcy/CLAUDE.md`)
- Logs de changement dans `logs/changes/`

**Interdit dans cette vague** :
- Hooks actifs (`.claude/hooks/`, entrées `hooks` dans `settings.json`)
- Serveurs/configs MCP
- Scripts shell externes copiés depuis les repos sources
- Plugins non audités (notamment les 176+ plugins du toolkit #2)
- Skills contenant du code exécutable (Python/Node/Bash dans `SKILL.md` ou fichiers associés)
- Ressources sans licence claire (#4, #5, #6, #7) — sauf après vérification manuelle
- Toute modification de codebase active (Nexcy ou autre projet)

**Risques principaux** :
1. Volume — les collections #2 (176+ plugins, 135 agents) et #3 (154 subagents) peuvent inciter à une intégration en masse non maîtrisée → sélection stricte et au cas par cas.
2. Licences non vérifiées sur 4/8 ressources (#4, #5, #6, #7) → traiter en inspiration uniquement tant que non confirmées.
3. Dérive de format — les agents récupérés doivent être conformes au format YAML frontmatter actuel de Claude Code (référence #8) avant intégration.
4. Confusion conceptuelle mateo_brain vs Nexcy — bien séparer ce qui va dans la doc générale (`knowledge-base/`, `.claude/agents/` globaux) de ce qui est spécifique à `projects/nexcy/`.

---

## 2. Ressources Lot 1 retenues

| # | Nom | URL | Score | Licence | Type | Niveau intégration | Action recommandée |
|---|-----|-----|-------|---------|------|---------------------|----------------------|
| 1 | awesome-claude-code | https://github.com/hesreallyhim/awesome-claude-code | 95 | MIT | index (commands, hooks, skills, orchestrateurs) | Adaptation | Utiliser comme index : sélectionner 3-5 slash commands + repérer 1-2 idées de hooks (documentées, non activées) |
| 2 | awesome-claude-code-toolkit | https://github.com/rohitg00/awesome-claude-code-toolkit | 92 | Apache-2.0 | agents/skills/commands/hooks/templates | Adaptation | Sélectionner un sous-ensemble ciblé (2-3 skills doc-only, 1-2 commands) pertinent mateo_brain/Nexcy |
| 3 | awesome-claude-code-subagents (VoltAgent) | https://github.com/VoltAgent/awesome-claude-code-subagents | 90 | MIT | subagents (154+, 10 catégories) | Adaptation | Sélectionner 5-8 agents (dev web, SEO, contenu, automatisation) à réécrire au format mateo_brain |
| 4 | claude-code-subagents (0xfurai) | https://github.com/0xfurai/claude-code-subagents | 70 | Non vérifiée | subagents (100+) | Inspiration | Garder en review ; vérifier licence avant toute adaptation |
| 5 | claude-code-sub-agents (dl-ezo) | https://github.com/dl-ezo/claude-code-sub-agents | 68 | Non vérifiée | subagents (35, end-to-end) | Inspiration | Idem — inspiration pour structurer un futur agent "dev lifecycle" |
| 6 | awesome-claude-code-and-skills (GetBindu) | https://github.com/GetBindu/awesome-claude-code-and-skills | 65 | Non vérifiée | skills (SKILL.md) | Inspiration | Vérifier qualité/licence avant toute adaptation de skill |
| 7 | claude-code-sub-agents (lst97) | https://github.com/lst97/claude-code-sub-agents | 60 | Non vérifiée | subagents (33, full-stack) | Exclu pour l'instant | Reste en `A_JETER/review-needed/`, pas d'action |
| 8 | Doc officielle Claude Code (sub-agents) | https://code.claude.com/docs/en/sub-agents | 100 | Officielle Anthropic | documentation/référence | Direct | Utiliser comme check-list de conformité de format pour tout agent créé en Vague 1 |

---

## 3. Plan d'intégration par étapes

### Phase A — Commandes Claude Code
- Parcourir l'index #1 (awesome-claude-code, section slash-commands) et le toolkit #2
- Sélectionner 3-5 commandes utiles et génériques (ex : revue de code, génération de message de commit, génération de doc, checklist de PR)
- Réécrire chaque commande en prompt markdown adapté au contexte mateo_brain (pas de copie verbatim si la licence l'exige, sinon copie directe pour MIT/Apache-2.0)
- Documenter la source (URL + licence) en commentaire d'en-tête de chaque commande

### Phase B — Subagents sûrs
- Source principale : #3 (VoltAgent, MIT, 154 agents catégorisés)
- Sélectionner ~5-8 agents couvrant les besoins récurrents : ex. `code-reviewer`, `web-design-specialist` (Next.js/Tailwind), `seo-specialist`, `content-writer`, `automation-specialist`
- Adapter le YAML frontmatter (name, description, tools) selon la doc officielle (#8) pour garantir la compatibilité
- Conserver la mention de la source dans chaque fichier agent

### Phase C — Skills sûres
- Sources : #2 (toolkit, Apache-2.0) et #6 (GetBindu, après vérification manuelle de licence/qualité)
- Sélectionner 2-3 skills **purement documentaires/process** (pas de scripts exécutables) — ex. conventions de revue de code, structure de rapport d'audit
- Créer en `skills/[nom]/SKILL.md` au format Agent Skills (frontmatter + instructions)

### Phase D — Workflows / templates internes
- Créer un workflow markdown "onboarding Claude Code core" décrivant comment utiliser les commandes/agents/skills sélectionnés dans mateo_brain et dans `projects/nexcy/`
- Créer 1-2 templates internes (ex. `templates/agent-template.md`, `templates/skill-template.md`) basés sur le format validé en Phase B/C, pour faciliter la création de futurs agents/skills cohérents

### Phase E — Documentation et dashboard
- Mettre à jour `_DASHBOARD/quick-index.md` avec la liste des nouveaux agents/skills/commands et leur emplacement
- Mettre à jour `CLAUDE.md` (racine mateo_brain) : section "Agents/Skills/Commands disponibles" + règles d'usage (référence aux règles de sécurité)
- Mettre à jour `projects/nexcy/CLAUDE.md` si certains agents sont spécifiquement utiles à Nexcy (ex. `web-design-specialist`, `seo-specialist`)
- Logger l'intégration dans `logs/changes/2026-06-11_vague-1-claude-core.md` (résumé des fichiers créés/modifiés, sources, licences)

### Phase F — Dry-run final
- Vérifier qu'aucun hook n'est activé (`.claude/settings.json` non modifié, pas de dossier `hooks/`)
- Vérifier la conformité de chaque agent/skill/command face à la doc officielle (#8)
- Revue finale des licences (MIT/Apache-2.0 confirmées pour tout ce qui est copié/adapté directement)
- Présentation du diff complet à l'utilisateur avant toute PR — pas de merge sans validation explicite

---

## 4. Fichiers à créer ou modifier (prévisionnel — aucun créé à ce stade)

```
.claude/commands/code-review.md
.claude/commands/commit-message.md
.claude/commands/pr-checklist.md

.claude/agents/code-reviewer.md
.claude/agents/web-design-specialist.md
.claude/agents/seo-specialist.md
.claude/agents/content-writer.md
.claude/agents/automation-specialist.md

skills/claude-code-conventions/SKILL.md
skills/audit-report-structure/SKILL.md   (si source #2/#6 validée)

workflows/claude-code-core-onboarding.md

templates/agent-template.md
templates/skill-template.md

_DASHBOARD/quick-index.md           (mise à jour)
CLAUDE.md                           (mise à jour, racine mateo_brain)
projects/nexcy/CLAUDE.md            (mise à jour, section agents Nexcy)

logs/changes/2026-06-11_vague-1-claude-core.md  (nouveau log de changement)
```

---

## 5. Ce qu'il ne faut PAS intégrer maintenant

- **Hooks automatiques** : tout hook listé dans #1 (20 hooks) ou #2 (20 hooks) — documentation possible en `knowledge-base/` mais aucune activation dans `settings.json`
- **MCP** : aucune config MCP des collections #1/#2/#3 — hors scope Vague 1
- **Scripts shell externes** : aucun `.sh`/installer interactif copié (ex. installeurs de #3, #4)
- **Plugins non audités** : les 176+ plugins du toolkit #2 — nécessitent une vague dédiée avec audit individuel
- **Skills avec code exécutable** : tout SKILL.md contenant des scripts Python/Node/Bash à exécuter
- **Ressources sans licence claire** : #4, #5, #6 (tant que non vérifiées), #7 (exclu)
- **Ressources non maintenues / repos personnels à faible activité** : #7 (lst97) reste en `A_JETER/review-needed/`

---

## 6. Scoring de priorité

| Priorité | Ressources / actions |
|---|---|
| **P0** | #8 (doc officielle, référence de conformité — Phase A/B/C) ; #3 (VoltAgent subagents MIT — Phase B) ; #1 (awesome-claude-code, index commands — Phase A) |
| **P1** | #2 (toolkit Apache-2.0, skills/commands complémentaires — Phase C) |
| **P2** | #4, #5 (subagents non vérifiés — inspiration structurelle une fois licence confirmée) ; #6 (skills GetBindu — inspiration, vérifier avant adaptation) |
| **P3** | #7 (lst97 — exclu, reste en review-needed) ; tout hook/MCP/plugin des collections #1/#2/#3 |

---

## 7. Plan de sécurité

- **Aucune exécution automatique** : tous les livrables Vague 1 sont des fichiers markdown statiques (prompts/instructions), aucun script exécuté lors de l'intégration
- **Aucun secret** : aucune clé API, token ou credential dans les fichiers créés
- **Aucune modification de `.env`**
- **Aucune action shell sans validation explicite de l'utilisateur**
- **Aucune nouvelle dépendance externe** (pas de `npm install`, pas de modification de `package.json`/lockfiles)
- **Aucun hook activé** : `.claude/settings.json` non touché en Vague 1 ; tout hook reste à l'état de documentation
- **Toute extension future** (hooks actifs, MCP, plugins, scripts) nécessite une **PR séparée avec revue de sécurité dédiée**, hors périmètre Vague 1

---

## 8. Prompt suivant — "Vague 1A : intégration des commandes Claude Code core"

À copier-coller dans une nouvelle session/tâche pour préparer (sans exécuter) la PR Vague 1A :

> Prépare la PR "Vague 1A — intégration des commandes Claude Code core" à partir du plan `logs/research/2026-06-11_vague-1-integration-plan-claude-core.md` (Phase A uniquement).
>
> Objectif : créer 3 à 5 fichiers `.claude/commands/*.md` adaptés depuis les ressources #1 (awesome-claude-code, MIT) et #2 (awesome-claude-code-toolkit, Apache-2.0) du rapport Lot 1, couvrant par exemple : revue de code, génération de message de commit, checklist de PR.
>
> Contraintes :
> - Aucune commande ne doit exécuter de script shell, accéder au réseau, ou modifier des fichiers en dehors du repo courant.
> - Chaque commande doit inclure un en-tête de commentaire indiquant la source (URL) et la licence.
> - Mettre à jour `_DASHBOARD/quick-index.md` et `CLAUDE.md` pour référencer les nouvelles commandes.
> - Créer un log de changement dans `logs/changes/`.
> - Ne pas toucher aux Phases B-F (subagents, skills, workflows, dashboard complet) — elles feront l'objet de PR séparées.
> - Ne pas activer de hook, ne pas ajouter de MCP, ne pas modifier `settings.json`.
> - Présenter le diff complet avant de committer/pousser, et créer la PR en draft pour validation.

---

*Plan basé sur `2026-06-11_github-research-lot-1-claude-core.md` et `2026-06-11_pr-2-final-validation.md` (commit `b013140` sur `main`). Aucune intégration effectuée à ce stade.*
