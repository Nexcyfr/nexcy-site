# Onboarding Claude Code core — nexcy-site

Ce workflow documente comment utiliser ensemble les ressources Claude Code "core" disponibles dans ce dépôt :

- les commandes `.claude/commands/*.md`
- les subagents `.claude/agents/*.md`
- les skills `skills/*/SKILL.md`

Il est purement documentaire : il ne déclenche aucune action automatique et ne remplace pas la lecture de `CLAUDE.md`.

## 1. Avant de commencer une tâche

1. Lire `CLAUDE.md` (racine) pour connaître les commandes, agents et skills disponibles et leurs sources/licences.
2. Lire la skill `skills/claude-code-conventions/SKILL.md` : elle rappelle les règles de périmètre, de séparation des PR, de sécurité et de format des diffs à appliquer pour toute tâche du dépôt.
3. Identifier la "Vague" / phase concernée si la tâche s'inscrit dans le plan d'intégration (`logs/research/2026-06-11_vague-1-integration-plan-claude-core.md`) ou tout autre plan ultérieur.

## 2. Pendant la tâche

### Utiliser les commandes (`.claude/commands/`)

- `/code-review` : lancer une revue structurée des changements en cours avant de committer.
- `/commit-message` : générer un message de commit à partir des changements stagés.
- `/pr-checklist` : vérifier qu'une pull request est prête (diff propre, sécurité, documentation à jour).

Ces commandes sont des prompts statiques : elles guident la session en cours, sans exécuter de script ni accéder au réseau.

### Déléguer à un subagent (`.claude/agents/`)

Utiliser un subagent quand la tâche correspond précisément à son rôle documenté dans `CLAUDE.md` :

- `code-reviewer` pour une revue de code experte sur un ensemble de fichiers modifiés.
- `web-design-specialist` pour la conception/amélioration de composants UI Next.js/Tailwind/GSAP/Motion/Lenis.
- `seo-specialist` pour un audit SEO on-page.
- `content-writer` pour la rédaction de contenu marketing en français.
- `automation-specialist` pour documenter/concevoir un workflow d'automatisation (sans l'exécuter).

Avant de déléguer, vérifier que les outils (`tools:`) déclarés dans le frontmatter de l'agent couvrent le besoin et restent dans les limites de sécurité du dépôt (pas d'accès shell/réseau pour les agents de contenu/design/SEO).

### Appliquer une skill (`skills/*/SKILL.md`)

Les skills documentaires s'appliquent en lecture, comme des rappels de méthode :

- `claude-code-conventions` : à relire avant toute tâche modifiant des fichiers ou créant une pull request.
- `audit-report-structure` : à appliquer pour structurer tout rapport d'audit/recherche déposé dans `logs/research/` ou `logs/changes/`.

## 3. Avant de committer / créer une PR

1. Relire la skill `claude-code-conventions` (sections "Format des diffs" et "Sécurité").
2. Afficher le diff complet (`git diff` / `git diff --cached`) et vérifier que seuls les fichiers attendus sont modifiés.
3. Scanner les fichiers ajoutés/modifiés pour des caractères Unicode cachés ou invisibles, comme décrit dans `claude-code-conventions`.
4. Si la tâche correspond à une nouvelle "Vague"/phase, créer un log dans `logs/changes/` en suivant la structure `audit-report-structure` lorsque pertinent (rapports de recherche/audit) ou une structure de log de changement simple (fichiers créés/modifiés, sources, sécurité, vérification Unicode) pour les PR d'intégration.
5. Utiliser `/pr-checklist` pour une dernière vérification avant l'ouverture de la pull request.

## 4. Créer de nouvelles ressources

Pour ajouter un nouvel agent ou une nouvelle skill, partir des modèles fournis :

- `templates/agent-template.md` pour un nouveau subagent (`.claude/agents/*.md`).
- `templates/skill-template.md` pour une nouvelle skill (`skills/[nom]/SKILL.md`).

Chaque nouvelle ressource doit ensuite être référencée dans `CLAUDE.md` (table correspondante) et faire l'objet d'une pull request dédiée, conformément à `claude-code-conventions`.

## Rappel

Ce workflow est purement documentaire : il ne contient aucun script, n'exécute aucune commande, ne manipule aucun fichier automatiquement et n'accède à aucune ressource réseau.
