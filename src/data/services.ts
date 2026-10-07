/**
 * Offre NEXCY — deux métiers, et uniquement deux :
 *   01 Sites web        (création, refonte, optimisation)
 *   02 Applications     (applications web, SaaS, plateformes métier, outils internes)
 *
 * Le SEO technique, l'automatisation, l'IA, la direction artistique, la sécurité,
 * l'infrastructure et la maintenance ne sont PAS des services vendus à part :
 * ce sont des capacités transversales, mobilisées lorsqu'elles servent la création
 * d'un site ou d'une application (voir `capabilities`).
 *
 * Source unique : accueil, /services, /services/[slug], sitemap et données
 * structurées en dérivent. Aucun chiffre, client ni résultat inventé.
 */

export type OfferSlug = "sites-web" | "applications";

/** Un type de réalisation couvert par l'offre. */
export interface ScopeItem {
  title: string;
  description: string;
}

/** Une étape de la méthode, propre à l'offre. */
export interface OfferStep {
  title: string;
  description: string;
}

export interface Offer {
  index: string;
  slug: OfferSlug;
  /** Nom court, utilisé dans la navigation et les liens. */
  name: string;
  /** Titre complet de la page. */
  title: string;
  /** Promesse, une phrase. */
  hook: string;
  /** Introduction de la page dédiée. */
  intro: string;
  /** Pour quel type de client. */
  audience: string;
  /** Résultat attendu. */
  result: string;
  /** Résumé en une ligne, pour les cartes de l'accueil et de /services. */
  summary: string;
  /** Intitulé de la section « ce que nous réalisons ». */
  scopeTitle: string;
  scope: ScopeItem[];
  /** Méthode pas à pas. */
  steps: OfferStep[];
  /** Ce qui est inclus, lorsque le projet le nécessite. */
  includedTitle: string;
  included: ScopeItem[];
  /** Choix techniques, formulés sans mode ni promesse. */
  technologies: string;
  criteria: string;
  limit: string;
  nextStep: string;
  ctaLabel: string;
  /** Titre SEO (≤ 75 caractères) et description (≤ 160). */
  metaTitle: string;
  metaDescription: string;
  /** Libellé du service dans les données structurées. */
  serviceType: string;
}

export const offers: Offer[] = [
  {
    index: "01",
    slug: "sites-web",
    name: "Sites web",
    title: "Sites web",
    hook: "Du site simple à l'expérience très interactive : création complète, refonte ou optimisation, au même niveau d'exigence.",
    intro:
      "NEXCY conçoit et développe des sites web sur mesure, quelle que soit leur nature : vitrine, corporate, e-commerce, landing page, expérience très interactive. Création complète, refonte ou optimisation d'un site existant, avec la même rigueur.",
    audience:
      "Dirigeants, indépendants et équipes dont le site doit crédibiliser l'activité, convaincre et générer des demandes : hôtellerie-restauration, immobilier, conseil, professions libérales, structures en phase de crédibilisation, marques qui veulent une présence à la hauteur de leur exigence.",
    result:
      "Un site rapide, clair, accessible et trouvable, qui présente l'activité avec justesse et transforme une visite en prise de contact ou en commande.",
    summary:
      "Création, refonte et optimisation de sites : vitrine, corporate, e-commerce, landing pages, sites éditoriaux et expériences interactives.",
    scopeTitle: "Les sites que nous réalisons",
    scope: [
      {
        title: "Sites vitrines",
        description: "Présenter une activité, un lieu ou une offre avec clarté et crédibilité.",
      },
      {
        title: "Sites corporate",
        description: "Structurer une entreprise, ses métiers et ses équipes sur plusieurs pages et rubriques.",
      },
      {
        title: "Sites e-commerce",
        description: "Un catalogue, un parcours d'achat et des paiements pensés pour la conversion.",
      },
      {
        title: "Landing pages",
        description: "Une page, un objectif : lancer une offre, un produit ou une campagne.",
      },
      {
        title: "Sites éditoriaux et événementiels",
        description: "Contenus, publications, programmes et temps forts, administrables au quotidien.",
      },
      {
        title: "Expériences web haut de gamme",
        description: "Interactions, mouvement et mise en scène, sans sacrifier la lisibilité ni la vitesse.",
      },
      {
        title: "Refonte complète ou partielle",
        description: "Repartir de l'existant : nouvelle architecture, nouveau design, nouveau socle technique.",
      },
      {
        title: "Optimisation d'un site existant",
        description: "Performance, responsive, UI/UX, accessibilité et corrections techniques, sans tout refaire.",
      },
    ],
    steps: [
      { title: "Diagnostic", description: "Objectifs, audience, existant et contraintes. Ce qui doit être conservé, ce qui doit changer." },
      { title: "Architecture et contenu", description: "Arborescence, parcours, hiérarchie des messages et trame rédactionnelle." },
      { title: "Design", description: "Direction artistique, UX/UI et système visuel, validés avec vous avant le code." },
      { title: "Développement", description: "Intégration soignée, interactions, intégrations nécessaires au projet et administration." },
      { title: "Performance et recette", description: "Vitesse, responsive, accessibilité, SEO technique, sécurité de base, tests sur appareils." },
      { title: "Mise en ligne et suivi", description: "Déploiement, prise en main documentée, puis accompagnement si vous le souhaitez." },
    ],
    includedTitle: "Inclus lorsque le projet le nécessite",
    included: [
      { title: "Direction artistique et UX/UI", description: "Un design conçu pour votre identité, pas adapté d'un modèle." },
      { title: "Performance et responsive", description: "Core Web Vitals maîtrisés, mobile d'abord, accessibilité intégrée." },
      { title: "SEO technique", description: "Structure, métadonnées, données structurées et indexation, dès la conception." },
      { title: "Intégrations", description: "Paiement, formulaires, e-mails, prise de rendez-vous, outils existants." },
      { title: "Identité visuelle", description: "Logotype, palette et typographie lorsque le site en a besoin pour exister." },
      { title: "Sécurité et hébergement", description: "Bonnes pratiques, en-têtes, sauvegardes, déploiement maîtrisé." },
      { title: "Suivi après livraison", description: "Mises à jour, corrections et évolutions du site livré." },
    ],
    technologies:
      "Next.js, TypeScript et Tailwind CSS pour le sur-mesure ; WordPress lorsque l'autonomie éditoriale prime. Pour l'e-commerce, la solution est choisie avec vous selon le catalogue, le volume et l'autonomie souhaitée. Le choix est dicté par le projet, pas par une mode.",
    criteria:
      "Temps de chargement maîtrisé, site administrable si besoin, base SEO saine et une base technique propre, documentée et reprenable.",
    limit:
      "Nous ne livrons pas de site que nous ne pourrions pas maintenir proprement, et nous ne promettons ni position ni résultat commercial que nous ne maîtrisons pas.",
    nextStep:
      "Décrivez votre projet, ou l'adresse de votre site actuel s'il existe : nous revenons vers vous sous 48 heures ouvrées avec des questions de cadrage, puis une proposition écrite détaillée ligne par ligne.",
    ctaLabel: "Parler de votre site",
    metaTitle: "Création et refonte de site internet à Bordeaux | NEXCY",
    metaDescription:
      "Création de site internet sur mesure à Bordeaux : vitrine, corporate, e-commerce, landing pages, refonte et optimisation. Studio web NEXCY, interlocuteur unique.",
    serviceType: "Création et refonte de sites web",
  },
  {
    index: "02",
    slug: "applications",
    name: "Applications",
    title: "Applications",
    hook: "D'un besoin métier ou d'une idée à un produit digital qui fonctionne, évolue et tient dans le temps.",
    intro:
      "NEXCY conçoit et développe des applications sur mesure : applications web, SaaS, plateformes métier, outils internes, dashboards, portails clients. Du cadrage au déploiement, un seul studio transforme un besoin réel en produit qui fonctionne.",
    audience:
      "Entreprises dont les outils actuels ne suivent plus (tableurs, logiciels mal adaptés, processus manuels), équipes qui veulent un outil interne ou un portail clients, porteurs de projet qui veulent valider un produit avec un MVP, structures qui font évoluer une application existante.",
    result:
      "Une application fiable, claire à utiliser, sécurisée et documentée, qui remplace des contournements par un outil adapté à votre activité et capable d'évoluer avec elle.",
    summary:
      "Applications web, SaaS, plateformes métier, outils internes, dashboards, portails clients et MVP, conçus et développés sur mesure.",
    scopeTitle: "Les applications que nous réalisons",
    scope: [
      { title: "Applications web", description: "Des outils accessibles depuis un navigateur, rapides et soignés, sur ordinateur comme sur mobile." },
      { title: "SaaS et MVP", description: "Un produit à lancer ou à valider : périmètre resserré, base solide, évolutivité prévue." },
      { title: "Plateformes métier", description: "Les processus propres à une activité, réunis dans un outil unique et cohérent." },
      { title: "Outils internes", description: "Suivi, gestion, validation, planification : remplacer tableurs et circuits manuels." },
      { title: "Dashboards", description: "Des données lisibles, des indicateurs utiles, des décisions plus rapides." },
      { title: "Extranets et portails clients", description: "Un espace dédié à vos clients, partenaires ou collaborateurs, avec accès maîtrisés." },
      { title: "Interfaces d'administration", description: "Gérer contenus, utilisateurs et données sans toucher au code." },
      { title: "Produits digitaux complexes", description: "Applications sur mesure à plusieurs rôles, flux et intégrations." },
    ],
    steps: [
      { title: "Cadrage du besoin", description: "Utilisateurs, cas d'usage, contraintes, priorités. Ce qui entre dans la première version, et ce qui attend." },
      { title: "Conception UX/UI", description: "Parcours, maquettes et système d'interface validés avant le développement." },
      { title: "Architecture technique", description: "Modèle de données, rôles et droits, intégrations, sécurité et hébergement." },
      { title: "Développement itératif", description: "Livraisons par étapes, démonstrations régulières, ajustements en cours de route." },
      { title: "Recette et déploiement", description: "Tests, sécurité, mise en production maîtrisée, documentation." },
      { title: "Évolution", description: "Corrections, nouvelles fonctionnalités et montée en charge, au rythme du produit." },
    ],
    includedTitle: "Ce que couvre la conception d'une application",
    included: [
      { title: "UX/UI", description: "Une interface claire, cohérente avec votre marque, pensée pour l'usage quotidien." },
      { title: "Architecture et évolutivité", description: "Une base propre, prête à accueillir de nouvelles fonctionnalités." },
      { title: "Authentification et droits", description: "Comptes, rôles, permissions et accès par profil." },
      { title: "Données", description: "Modèle de données, import et export, historique, sauvegardes." },
      { title: "Intégrations", description: "API, outils existants, paiement, messagerie, comptabilité." },
      { title: "Dashboards et reporting", description: "Indicateurs et vues de pilotage adaptés à chaque rôle." },
      { title: "Automatisations", description: "Tâches répétitives, notifications et flux entre outils, intégrés à l'application." },
      { title: "IA, si elle apporte un gain réel", description: "Assistants ou agents intégrés au produit, avec périmètre et garde-fous définis." },
      { title: "Sécurité et déploiement", description: "Protection des données, déploiement et supervision maîtrisés." },
    ],
    technologies:
      "TypeScript et frameworks web modernes (dont Next.js) pour l'interface et l'API, bases de données adaptées au besoin, intégrations par API. Le socle est choisi pour la durée de vie du produit et la facilité de reprise, pas pour la nouveauté.",
    criteria:
      "Un périmètre écrit et validé, des livraisons régulières, une application documentée, testée et reprenable par une autre équipe.",
    limit:
      "Nous ne lançons pas un développement sans périmètre de départ validé : un MVP sert à apprendre vite, pas à tout faire. Et pas d'IA gadget sans gain réel.",
    nextStep:
      "Décrivez le besoin, les utilisateurs concernés et l'outil actuel s'il existe : nous revenons vers vous sous 48 heures ouvrées avec des questions de cadrage, puis une proposition écrite par étapes.",
    ctaLabel: "Parler de votre application",
    metaTitle: "Développement d'applications web et SaaS sur mesure | NEXCY",
    metaDescription:
      "Applications web, SaaS, plateformes métier, outils internes et dashboards sur mesure : du besoin au produit, de la conception au déploiement. Studio NEXCY, Bordeaux.",
    serviceType: "Développement d'applications web sur mesure",
  },
];

export function getOffer(slug: string): Offer | undefined {
  return offers.find((o) => o.slug === slug);
}

/**
 * Capacités transversales : réunies lorsque le projet l'exige, jamais vendues
 * comme services indépendants. Utilisées en bandeau d'accueil et sur /services.
 */
export const capabilities: { title: string; description: string }[] = [
  { title: "Direction artistique", description: "Une identité visuelle cohérente, au service de l'interface." },
  { title: "UX/UI", description: "Parcours, maquettes et systèmes d'interface." },
  { title: "Développement", description: "Front-end avancé, back-end, intégrations." },
  { title: "Performance", description: "Vitesse, Core Web Vitals, accessibilité." },
  { title: "SEO technique", description: "Structure, indexation, données structurées." },
  { title: "Automatisation", description: "Flux et tâches répétitives intégrés au produit." },
  { title: "IA", description: "Assistants et agents, lorsqu'ils apportent un gain réel." },
  { title: "Sécurité", description: "Protection des données, accès, bonnes pratiques." },
  { title: "Infrastructure", description: "Hébergement, déploiement, supervision, sauvegardes." },
];
