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
  deliverablesTitle: string;
  deliverables: string[];
  technologies?: string;
  ctaLabel: string;
}

export const serviceDetails: ServiceDetail[] = [
  {
    index: "01",
    slug: "creation-web",
    title: "Création de sites web",
    hook: "Un site web n'est pas une plaquette en ligne. C'est votre meilleur commercial — disponible 24h/24.",
    problem:
      "Des sites génériques, lents, difficiles à trouver et incapables de convertir. Des prestataires qui livrent et disparaissent.",
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
      "Next.js, TypeScript, Tailwind CSS, Vercel — ou WordPress sur mesure selon les besoins.",
    ctaLabel: "Discuter de votre projet",
  },
  {
    index: "02",
    slug: "branding",
    title: "Branding",
    hook: "Une marque cohérente n'est pas un luxe. C'est la condition d'une croissance durable.",
    problem:
      "Des identités visuelles incohérentes entre le logo, le site et les supports. Une marque que personne ne retient.",
    deliverablesTitle: "Ce que nous livrons",
    deliverables: [
      "Logotype et déclinaisons",
      "Charte graphique complète (couleurs, typographie, iconographie)",
      "Charte éditoriale et ton de voix",
      "Templates de supports (présentations, e-mails, réseaux)",
      "Guide d'utilisation",
    ],
    ctaLabel: "Parler de votre identité",
  },
  {
    index: "03",
    slug: "seo",
    title: "SEO — Référencement naturel",
    hook: "Le meilleur site du monde ne sert à rien si personne ne le trouve.",
    problem:
      "Absence de stratégie éditoriale. Technique bâclée. Résultats mesurés en vanity metrics, pas en leads.",
    deliverablesTitle: "Ce que nous livrons",
    deliverables: [
      "Audit SEO technique et éditorial",
      "Stratégie de mots-clés ciblée",
      "Optimisation on-page complète",
      "Création de contenu optimisé",
      "Suivi mensuel et reporting clair",
    ],
    ctaLabel: "Analyser votre visibilité",
  },
  {
    index: "04",
    slug: "automatisation-ia",
    title: "Automatisation & Intelligence artificielle",
    hook: "Automatiser les tâches répétitives, c'est libérer du temps pour ce qui compte vraiment.",
    problem:
      "Des processus manuels chronophages. Des outils qui ne communiquent pas. Des opportunités manquées par manque de ressources.",
    deliverablesTitle: "Ce que nous livrons",
    deliverables: [
      "Audit des processus automatisables",
      "Mise en place de workflows automatisés (n8n, Make, Zapier)",
      "Intégration d'agents IA dans vos processus métier",
      "Connexion entre vos outils existants",
      "Documentation et formation",
    ],
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
