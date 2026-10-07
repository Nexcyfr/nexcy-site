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
  /** Pour quel type de client — formulé uniquement à partir de secteurs réellement visés. */
  audience: string;
  deliverablesTitle: string;
  deliverables: string[];
  technologies?: string;
  /** Critères de réussite mesurables/observables. */
  criteria: string;
  /** Limite assumée (une phrase). */
  limit: string;
  /** Prochaine étape proposée au visiteur. */
  nextStep: string;
  ctaLabel: string;
  /** Balises <title> et description de la page dédiée /services/[slug]. */
  metaTitle: string;
  metaDescription: string;
}

export const serviceDetails: ServiceDetail[] = [
  {
    index: "01",
    slug: "creation-web",
    title: "Création de sites web",
    hook: "Un site web doit soutenir votre crédibilité, votre visibilité et votre conversion.",
    problem:
      "Des sites génériques, lents, difficiles à trouver et incapables de convertir. Des prestataires qui livrent et disparaissent.",
    audience:
      "Dirigeants et indépendants dont le site doit crédibiliser l'activité et générer des demandes de contact : hôtellerie-restauration, immobilier, conseil, professions libérales, structures en phase de crédibilisation.",
    result:
      "Un site rapide, trouvable et pensé pour transformer un visiteur en prise de contact.",
    method:
      "Diagnostic des objectifs → architecture et copywriting → design → développement → optimisation Core Web Vitals → mise en ligne et transfert.",
    deliverablesTitle: "Ce que nous livrons",
    deliverables: [
      "Site vitrine ou applicatif sur mesure",
      "Design conçu pour votre identité, pas adapté d'un modèle",
      "Performance Core Web Vitals optimisée",
      "Référencement naturel intégré dès la conception",
      "Responsive mobile-first",
      "Tableau de bord d'administration si nécessaire",
      "Documentation de prise en main",
    ],
    technologies:
      "Next.js, TypeScript et Tailwind CSS pour le sur-mesure ; WordPress lorsque l'autonomie éditoriale prime. Le choix est dicté par vos besoins, pas par une mode.",
    criteria:
      "Temps de chargement maîtrisé, site administrable, base SEO saine et une base technique propre, documentée et maintenable.",
    limit:
      "Nous ne livrons pas de site que nous ne pourrions pas maintenir proprement.",
    nextStep:
      "Décrivez votre projet : nous revenons vers vous sous 48 heures ouvrées avec des questions de cadrage, puis une proposition écrite détaillée ligne par ligne.",
    ctaLabel: "Discuter de votre projet",
    metaTitle: "Création de sites web sur mesure à Bordeaux — NEXCY",
    metaDescription:
      "Studio digital à Bordeaux : conception et développement de sites web rapides, accessibles et pensés pour la conversion. Du diagnostic à la mise en ligne, avec un interlocuteur unique.",
  },
  {
    index: "02",
    slug: "branding",
    title: "Branding",
    hook: "Une marque cohérente n'est pas un luxe. C'est la condition d'une croissance durable.",
    problem:
      "Des identités visuelles incohérentes entre le logo, le site et les supports. Une marque que personne ne retient.",
    audience:
      "Structures qui lancent ou repositionnent leur marque et veulent une identité cohérente, du logotype au site web et aux supports du quotidien.",
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
    nextStep:
      "Présentez-nous votre activité et vos ambitions : nous cadrons d'abord le positionnement, puis nous vous proposons un périmètre d'identité adapté.",
    ctaLabel: "Parler de votre identité",
    metaTitle: "Branding et identité visuelle — NEXCY",
    metaDescription:
      "Identité de marque cohérente, du logotype au site web : positionnement, système visuel, déclinaisons et guide d'utilisation. Studio digital NEXCY, Bordeaux.",
  },
  {
    index: "03",
    slug: "seo",
    title: "SEO — Référencement naturel",
    hook: "Le meilleur site du monde ne sert à rien si personne ne le trouve.",
    problem:
      "Absence de stratégie éditoriale. Technique bâclée. Résultats mesurés en vanity metrics, pas en leads.",
    audience:
      "Entreprises dont le site existe mais reste invisible sur les requêtes qui comptent, en particulier celles qui dépendent d'une recherche locale.",
    result:
      "Une visibilité durable sur des requêtes qui amènent des clients, pas du trafic vide.",
    method:
      "Audit technique et éditorial → stratégie de mots-clés → optimisation on-page → contenu → suivi mensuel.",
    deliverablesTitle: "Ce que nous livrons",
    deliverables: [
      "Audit SEO technique et éditorial",
      "Stratégie de mots-clés ciblée",
      "Optimisation on-page complète",
      "Référencement local lorsque l'activité s'y prête",
      "Création de contenu optimisé",
      "Suivi mensuel et reporting clair",
    ],
    criteria:
      "Progression sur les requêtes cibles et reporting lisible (positions, trafic qualifié).",
    limit:
      "Le SEO est un travail de fond : nous ne promettons ni première place ni résultats immédiats.",
    nextStep:
      "Indiquez-nous l'adresse de votre site et vos requêtes cibles : nous commençons par un audit avant de proposer quoi que ce soit.",
    ctaLabel: "Analyser votre visibilité",
    metaTitle: "SEO et référencement naturel — NEXCY",
    metaDescription:
      "Audit technique et éditorial, stratégie de mots-clés, optimisation on-page et suivi mensuel. Un travail de fond, sans promesse de première place. NEXCY, Bordeaux.",
  },
  {
    index: "04",
    slug: "automatisation-ia",
    title: "Automatisation & Intelligence artificielle",
    hook: "Automatiser les tâches répétitives, c'est libérer du temps pour ce qui compte vraiment.",
    problem:
      "Des processus manuels chronophages. Des outils qui ne communiquent pas. Des opportunités manquées par manque de ressources.",
    audience:
      "Équipes qui perdent du temps sur des tâches répétitives (saisie, relances, tri, reporting) et veulent des outils qui communiquent entre eux, avec ou sans agents IA.",
    result:
      "Des processus fiabilisés, du temps rendu à vos équipes, des outils qui se parlent.",
    method:
      "Audit des processus → cartographie → workflows (n8n, Make, Zapier) → intégration d'agents IA → documentation et formation.",
    deliverablesTitle: "Ce que nous livrons",
    deliverables: [
      "Audit des processus automatisables",
      "Mise en place de workflows automatisés (n8n, Make, Zapier)",
      "Agents IA intégrés à vos processus, avec périmètre et garde-fous définis",
      "Connexion entre vos outils existants",
      "Documentation et formation",
    ],
    criteria:
      "Réduction observable des tâches manuelles et des erreurs, et autonomie via la documentation.",
    limit:
      "Nous automatisons ce qui doit l'être — pas d'IA gadget sans gain réel.",
    nextStep:
      "Décrivez une tâche répétitive de votre quotidien : nous évaluons avec vous ce qui mérite d'être automatisé, et ce qui ne le mérite pas.",
    ctaLabel: "Explorer les possibilités",
    metaTitle: "Automatisation et agents IA — NEXCY",
    metaDescription:
      "Workflows automatisés (n8n, Make, Zapier), connexion de vos outils et agents IA intégrés à vos processus. Du temps rendu à vos équipes, sans IA gadget. NEXCY, Bordeaux.",
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
