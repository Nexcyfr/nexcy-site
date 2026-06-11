---
name: claude-code-conventions
description: Conventions internes pour travailler avec Claude Code dans le dépôt nexcy-site (lecture du contexte, périmètre, PR, sécurité, format des diffs). À consulter avant toute tâche impliquant des modifications de fichiers ou la création d'une pull request.
---

<!--
Source : inspiré de awesome-claude-code-toolkit (rohitg00), Apache-2.0
URL : https://github.com/rohitg00/awesome-claude-code-toolkit
Référence de format : anthropics/skills (Agent Skills)
Adaptation mateo_brain / Nexcy — pas de copie verbatim.
-->

# Conventions Claude Code — nexcy-site

Cette skill décrit les règles de fonctionnement à suivre pour toute tâche réalisée avec Claude Code dans ce dépôt.

## 1. Lecture du contexte

- Avant toute action, lire les documents de référence pertinents : `CLAUDE.md`, le plan d'intégration en cours (`logs/research/`), et les logs de changement précédents (`logs/changes/`).
- Ne pas supposer l'existence de fichiers/dossiers non confirmés (ex. structures `mateo_brain` locales) — vérifier l'état réel du dépôt.

## 2. Respect du périmètre

- Limiter chaque tâche/PR au périmètre explicitement demandé (une "Vague"/Phase = une PR).
- Ne pas anticiper ou regrouper des phases futures sans demande explicite.
- Signaler clairement tout élément hors scope plutôt que de l'intégrer silencieusement.

## 3. Séparation des pull requests

- Une pull request = un objectif cohérent et limité (ex. une phase du plan d'intégration).
- Ne pas mélanger des changements de codebase active (Next.js) avec des changements de configuration Claude Code (`.claude/`, `skills/`, documentation).
- Toujours indiquer dans la description de la PR la liste exacte des fichiers créés/modifiés et leurs sources/licences.

## 4. Sécurité

- Aucun hook actif (`.claude/hooks/`, entrées `hooks` dans `settings.json`) sans demande explicite et revue dédiée.
- Aucune configuration MCP ajoutée sans demande explicite et revue dédiée.
- Aucun script shell ou fichier exécutable créé dans le cadre de l'intégration de commandes/agents/skills documentaires.
- Aucun secret, token ou clé API en dur dans les fichiers créés.
- Toute ressource externe (commande, agent, skill) doit mentionner sa source (URL) et sa licence ; les ressources à licence non vérifiée sont traitées en "inspiration uniquement".

## 5. Format des diffs

- Avant tout commit, afficher le diff complet (`git diff` / `git diff --cached`) et la liste des fichiers concernés.
- Vérifier que le diff ne contient que les fichiers attendus pour la tâche en cours.
- Scanner les fichiers ajoutés/modifiés pour des caractères Unicode cachés ou invisibles (catégories Cc/Cf hors `\n`/`\r`/`\t`, espaces spéciaux/insécables) avant de pousser.

## 6. Hooks / MCP / scripts — interdiction par défaut

- Par défaut, ne créer ni activer aucun hook, configuration MCP, ou script exécutable (Python/Node/Bash) dans les livrables Claude Code (commandes, agents, skills).
- Toute exception nécessite une validation explicite de l'utilisateur et fait l'objet d'une PR séparée avec revue de sécurité dédiée.

## Rappel

Cette skill est purement documentaire : elle ne contient aucun script, n'exécute aucune commande, ne manipule aucun fichier automatiquement et n'accède à aucune ressource réseau.
