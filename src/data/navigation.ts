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
export const FOUNDING_YEAR = 2019;
export const CURRENT_YEAR = 2025;
