# Lot 3 — Automatisation / SEO / Audit / Performance / Monitoring

Recherche limitée (mode économie de tokens) : 1 agent, 8 ressources, 3 WebFetch max.
Recherche + scoring uniquement — rien cloné, copié, installé, exécuté ou importé.

## 1. Résumé exécutif

8 ressources analysées. Les outils **performance/analytics/monitoring open source** (Lighthouse CI, web-vitals, Umami, Uptime Kuma, Plausible) sont solides, bien licenciés et faciles à documenter. Les **templates n8n communautaires** sont très utiles mais à haut risque si exécutés tels quels (Code Node, credentials, scraping, RGPD pour le lead-gen). **n8n lui-même** est en licence "fair-code" (gratuit en self-host pour usage interne, pas pour le revendre en SaaS). Aucun import/exécution effectué — tout est en recommandation.

## 2-5. Tableau (licence, gratuité, flags, risques)

| # | Nom | URL | Licence | Gratuité / Limites | OSS vs Cloud | Flags risque | Niveau intégration | Score /100 | Emplacement recommandé |
|---|-----|-----|---------|---------------------|--------------|---------------|----------------------|------------|--------------------------|
| 1 | n8n (core) | https://github.com/n8n-io/n8n | Sustainable Use License (fair-code) | Gratuit en self-host (usage interne), pas pour revendre en SaaS concurrent | Self-host OSS + cloud payant | OPAQUE_INSTALL, CODE_EXECUTION | Adaptation (self-host à mettre en place) | 83 | `automations/` (doc référence) |
| 2 | awesome-n8n-templates (enescingoz) | https://github.com/enescingoz/awesome-n8n-templates | À vérifier par template | Gratuit (repo communautaire) | OSS (templates JSON) | CODE_EXECUTION, CREDENTIALS_REQUIRED, API_KEY_REQUIRED, SCRAPING_RISK, GDPR_RISK, LICENSE_UNCLEAR | Inspiration (NE JAMAIS importer/exécuter tel quel) | 84 | `A_JETER/review-needed/` (puis `skills/n8n/` si trié) |
| 3 | GoogleChrome/lighthouse-ci | https://github.com/GoogleChrome/lighthouse-ci | Apache-2.0 | Gratuit, illimité | OSS officiel Google | GITHUB_ACTIONS (usage normal CI) | Direct (intégration CI/CD) | 95 | `skills/performance-optimization/` |
| 4 | web-vitals (GoogleChrome) | https://github.com/GoogleChrome/web-vitals | Apache-2.0 | Gratuit, illimité | OSS officiel Google | Aucun majeur | Direct (lib JS à intégrer Next.js) | 94 | `skills/performance-optimization/` |
| 5 | SEOnaut | https://github.com/StJudeWasHere/seonaut | Non vérifiée | Gratuit a priori (self-host) | OSS (à confirmer) | OPAQUE_INSTALL, LICENSE_UNCLEAR, UNMAINTAINED (activité non vérifiée) | Inspiration / adaptation | 73 | `A_JETER/review-needed/` |
| 6 | Umami | https://github.com/umami-software/umami | MIT | Gratuit illimité en self-host ; cloud freemium limité | OSS + cloud freemium | OPAQUE_INSTALL (self-host + DB), FREEMIUM_LIMITED (cloud) | Direct (self-host) / adaptation | 91 | `skills/analytics-tracking/` |
| 7 | Plausible | https://github.com/plausible/analytics | AGPL-3.0 (CE) | CE self-host gratuit mais fonctionnalités réduites ; cloud payant | OSS (CE) + cloud payant | OPAQUE_INSTALL, FREEMIUM_LIMITED | Direct (self-host CE) / adaptation | 86 | `skills/analytics-tracking/` |
| 8 | Uptime Kuma | https://github.com/louislam/uptime-kuma | MIT | Gratuit illimité, self-host | OSS | OPAQUE_INSTALL | Direct (self-host) | 89 | `skills/digital-audit-strategy/` ou `automations/monitoring/` |

## 6. Risques sécurité & RGPD détaillés

- **n8n core / templates communautaires** : `CODE_EXECUTION` via Code Node + nodes HTTP/Shell — ne jamais exécuter un workflow tiers sans audit ligne par ligne. Templates lead-gen (#2) impliquent souvent scraping (Apify, Google Maps) → `SCRAPING_RISK` + `GDPR_RISK` (collecte de données personnelles sans consentement, réputation email pour le cold-emailing).
- **SEOnaut** : licence et maintenance non confirmées → traiter comme `LICENSE_UNCLEAR` jusqu'à vérification manuelle.
- **Umami / Plausible / Uptime Kuma** : risques limités au self-hosting (gestion serveur/DB/MAJ), pas de code exécuté côté Nexcy au-delà du tracker JS standard. Plausible CE = AGPL-3.0 → toute modification distribuée doit rester open source (non bloquant pour usage interne).
- **Lighthouse CI / web-vitals** : risque quasi nul, outils officiels Google, largement utilisés en production.

## 7. Top 5 priorités

1. **GoogleChrome/lighthouse-ci** (95) — base de l'audit performance Nexcy, intégrable en CI/CD
2. **web-vitals** (94) — mesure Core Web Vitals réelle sur sites clients Next.js
3. **Umami** (91) — alternative GA4 privacy-friendly, MIT, self-host gratuit
4. **Uptime Kuma** (89) — monitoring uptime pour sites clients, MIT
5. **Plausible** (86) — alternative analytics RGPD-first (AGPL, CE gratuite)

## 8. À éviter / inspiration uniquement

- **awesome-n8n-templates** : très utile comme *index d'idées* (lead-gen, CRM, notifications) mais **chaque template doit être audité manuellement** avant tout usage — flags `CODE_EXECUTION`, `CREDENTIALS_REQUIRED`, `SCRAPING_RISK`, `GDPR_RISK`. Ne jamais importer/exécuter directement.
- **SEOnaut** : licence et activité non confirmées → review-needed avant toute considération.
- **n8n core** : licence "fair-code" → OK pour usage interne Nexcy, mais ne pas envisager de le proposer comme service revendu sans vérifier les termes Sustainable Use License.

## 9. Prompt suivant (intégration Lot 3 — éléments sûrs uniquement)

> Intègre uniquement les ressources sûres du Lot 3 (`logs/research/2026-06-11_github-research-lot-3-automation-seo-audit.md`) : crée des fiches de référence markdown dans `skills/performance-optimization/` (Lighthouse CI + web-vitals, avec exemple d'intégration Next.js) et `skills/analytics-tracking/` (Umami + Plausible, comparatif self-host) et `automations/monitoring/` (Uptime Kuma, doc setup self-host). N'intègre PAS les templates n8n (#2) ni SEOnaut (#5) — laisse-les en `A_JETER/review-needed/` avec leurs flags de risque. Aucun clone, installation, import de workflow ou exécution — uniquement des fiches de référence et liens officiels.

---
*Lots 1 (Claude Code core) et 2 (Web premium Nexcy) déjà livrés dans la PR #2, non modifiés.*
