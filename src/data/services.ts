/**
 * Services — Master Brief §13 (Accueil) & §14 (page Services).
 * Textes intégrés tels quels. Aucune reformulation.
 */

/** Aperçu des 5 blocs de la page d'accueil (section « Ce que nous construisons »). */
export interface ServicePreview {
  index: string;
  title: string;
  description: string;
}

export const servicePreviews: ServicePreview[] = [
  {
    index: "01",
    title: "Création web",
    description:
      "Sites et applications conçus pour convertir, performer et durer. Du vitrine au sur-mesure complexe.",
  },
  {
    index: "02",
    title: "Branding",
    description:
      "Identités visuelles construites pour être mémorables, cohérentes et distinctives.",
  },
  {
    index: "03",
    title: "SEO",
    description:
      "Référencement naturel stratégique. Visibilité durable, audience qualifiée.",
  },
  {
    index: "04",
    title: "Automatisation & IA",
    description:
      "Systèmes automatisés et agents IA pour réduire la charge opérationnelle et accélérer la croissance.",
  },
  {
    index: "05",
    title: "Maintenance",
    description:
      "Accompagnement continu. Votre site évolue avec votre activité.",
  },
];

/** Détail complet d'un service pour la page /services. */
export interface ServiceDetail {
  index: string;
  slug: string;
  title: string;
  hook: string;
  problem?: string;
  /** Résultat visé pour le client. */
  result: string;
  /** Étapes de la méthode (résumé en une ligne). */
  method: string;
  deliverablesTitle: string;
  deliverables: string[];
  technologies?: string;
  /** Critères de réussite mesurables/observables. */
  criteria: string;
  /** Limite assumée (une phrase). */
  limit: string;
  ctaLabel: string;
}

export const serviceDetails: ServiceDetail[] = [
  {
    index: "01",
    slug: "creation-web",
    title: "Création de sites web",
    hook: "Un site web doit soutenir votre crédibilité, votre visibilité et votre conversion.",
    problem:
      "Des sites génériques, lents, difficiles à trouver et incapables de convertir. Des prestataires qui livrent et disparaissent.",
    result:
      "Un site rapide, trouvable et pensé pour transformer un visiteur en prise de contact.",
    method:
      "Diagnostic des objectifs → architecture et copywriting → design → développement → optimisation Core Web Vitals → mise en ligne et transfert.",
    deliverablesTitle: "Ce que nous livrons",
    deliverables: [
      "Site vitrine ou applicatif sur mesure",
      "Design exclusif aligné avec votre identité",
      "Performance Core Web Vitals optimisée",
      "Référencement naturel intégré dès la conception",
      "Responsive mobile-first",
      "Tableau de bord d'administration si nécessaire",
      "Documentation de prise en main",
    ],
    technologies:
      "Next.js, TypeScript, Tailwind CSS et Vercel pour le sur-mesure ; WordPress lorsque l'autonomie éditoriale prime. Le choix est dicté par vos besoins, pas par une mode.",
    criteria:
      "Temps de chargement maîtrisé, site administrable, base SEO saine et une base technique propre, documentée et maintenable.",
    limit:
      "Nous ne livrons pas de site que nous ne pourrions pas maintenir proprement.",
    ctaLabel: "Discuter de votre projet",
  },
  {
    index: "02",
    slug: "branding",
    title: "Branding",
    hook: "Une marque cohérente n'est pas un luxe. C'est la condition d'une croissance durable.",
    problem:
      "Des identités visuelles incohérentes entre le logo, le site et les supports. Une marque que personne ne retient.",
    result:
      "Une identité claire, cohérente sur tous les points de contact, réutilisable sans nous.",
    method:
      "Cadrage du positionnement → territoire visuel → logotype et système → déclinaisons → guide d'utilisation.",
    deliverablesTitle: "Ce que nous livrons",
    deliverables: [
      "Logotype et déclinaisons",
      "Charte graphique complète (couleurs, typographie, iconographie)",
      "Charte éditoriale et ton de voix",
      "Templates de supports (présentations, e-mails, réseaux)",
      "Guide d'utilisation",
    ],
    criteria:
      "Cohérence vérifiable sur chaque support et autonomie de vos équipes via le guide.",
    limit:
      "Le branding ne remplace pas une offre claire — nous cadrons d'abord le positionnement.",
    ctaLabel: "Parler de votre identité",
  },
  {
    index: "03",
    slug: "seo",
    title: "SEO — Référencement naturel",
    hook: "Le meilleur site du monde ne sert à rien si personne ne le trouve.",
    problem:
      "Absence de stratégie éditoriale. Technique bâclée. Résultats mesurés en vanity metrics, pas en leads.",
    result:
      "Une visibilité durable sur des requêtes qui amènent des clients, pas du trafic vide.",
    method:
      "Audit technique et éditorial → stratégie de mots-clés → optimisation on-page → contenu → suivi mensuel.",
    deliverablesTitle: "Ce que nous livrons",
    deliverables: [
      "Audit SEO technique et éditorial",
      "Stratégie de mots-clés ciblée",
      "Optimisation on-page complète",
      "Création de contenu optimisé",
      "Suivi mensuel et reporting clair",
    ],
    criteria:
      "Progression sur les requêtes cibles et reporting lisible (positions, trafic qualifié).",
    limit:
      "Le SEO est un travail de fond : nous ne promettons ni première place ni résultats immédiats.",
    ctaLabel: "Analyser votre visibilité",
  },
  {
    index: "04",
    slug: "automatisation-ia",
    title: "Automatisation & Intelligence artificielle",
    hook: "Automatiser les tâches répétitives, c'est libérer du temps pour ce qui compte vraiment.",
    problem:
      "Des processus manuels chronophages. Des outils qui ne communiquent pas. Des opportunités manquées par manque de ressources.",
    result:
      "Des processus fiabilisés, du temps rendu à vos équipes, des outils qui se parlent.",
    method:
      "Audit des processus → cartographie → workflows (n8n, Make, Zapier) → intégration d'agents IA → documentation et formation.",
    deliverablesTitle: "Ce que nous livrons",
    deliverables: [
      "Audit des processus automatisables",
      "Mise en place de workflows automatisés (n8n, Make, Zapier)",
      "Intégration d'agents IA dans vos processus métier",
      "Connexion entre vos outils existants",
      "Documentation et formation",
    ],
    criteria:
      "Réduction observable des tâches manuelles et des erreurs, et autonomie via la documentation.",
    limit:
      "Nous automatisons ce qui doit l'être — pas d'IA gadget sans gain réel.",
    ctaLabel: "Explorer les possibilités",
  },
];

/** Offre d'accompagnement continu (abonnement) — présentée à part. */
export const maintenanceService = {
  index: "05",
  slug: "maintenance",
  eyebrow: "Abonnement mensuel",
  title: "Accompagnement continu",
  hook: "Votre site est livré. Notre travail ne s'arrête pas là.",
  deliverablesTitle: "Ce que comprend l'abonnement",
  deliverables: [
    "Mises à jour techniques et de sécurité",
    "Sauvegardes régulières",
    "Monitoring de disponibilité et performances",
    "Modifications de contenu (heures incluses selon formule)",
    "Rapport mensuel",
    "Accès prioritaire pour les interventions urgentes",
  ],
  note: "Aucun tarif public — chaque formule est adaptée à votre site et vos besoins.",
  ctaLabel: "Demander une formule sur mesure",
} as const;
