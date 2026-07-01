/** Navigation globale — Master Brief §5 / §11. */

export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "/contact" },
];

export const headerCta: NavLink = {
  label: "Démarrer un projet",
  href: "/contact",
};

export const legalLinks: NavLink[] = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
];

export const CONTACT_EMAIL = "contact.agency@nexcy.fr";
export const BRAND_TAGLINE = "Precision in Motion";
/**
 * Année de création juridique de NEXCY (immatriculation RNE, 2025) — seule date
 * vérifiable, utilisée pour le copyright et les données structurées.
 * L'« expérience depuis 2019 » relève de l'éditorial (page Studio), pas d'une
 * date d'entité.
 */
export const NEXCY_FOUNDING_YEAR = 2025;
