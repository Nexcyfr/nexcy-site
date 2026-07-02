import Image from "next/image";
import { Logo } from "@/components/ui/Logo";
import { TextLink } from "@/components/ui/TextLink";
import {
  navLinks,
  legalLinks,
  CONTACT_EMAIL,
  BRAND_TAGLINE,
  NEXCY_FOUNDING_YEAR,
} from "@/data/navigation";

/** Navigation interne du footer : Accueil + les liens de nav principaux. */
const footerNav = [{ label: "Accueil", href: "/" }, ...navLinks];

/**
 * Footer (Master Brief §5 / §11).
 * Trois colonnes équilibrées : identité (logo + tagline + e-mail) · navigation
 * interne · informations légales. Skyline Bordeaux décorative à droite (15 %).
 * Aucun réseau social non vérifié — e-mail réel uniquement.
 */
export function Footer() {
  return (
    <footer className="relative border-t border-border bg-black">
      <div className="container-site relative py-space-6 md:py-space-7">
        {/* Skyline Bordeaux — décoratif, masqué sur mobile (Brief §29) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-4 hidden w-[46%] max-w-[600px] opacity-[0.15] md:block lg:right-20"
        >
          <Image
            src="/assets/brand/bordeaux-skyline.png"
            alt=""
            width={600}
            height={200}
            className="h-auto w-full select-none"
            sizes="46vw"
          />
        </div>

        <div className="relative grid gap-space-6 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-space-5">
          {/* Colonne identité */}
          <div className="flex flex-col gap-space-4">
            <Logo width={150} />
            <p className="text-sm font-light uppercase tracking-widest2 text-accent">
              {BRAND_TAGLINE}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="w-fit text-base text-text-secondary transition-colors hover:text-text-primary"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          {/* Colonne navigation interne */}
          <nav aria-label="Navigation du site">
            <p className="mb-space-4 text-xs uppercase tracking-widest2 text-text-muted">
              Navigation
            </p>
            <ul className="flex flex-col gap-space-3 text-sm">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <TextLink href={link.href}>{link.label}</TextLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Colonne informations légales */}
          <nav aria-label="Informations légales">
            <p className="mb-space-4 text-xs uppercase tracking-widest2 text-text-muted">
              Informations
            </p>
            <ul className="flex flex-col gap-space-3 text-sm">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <TextLink href={link.href}>{link.label}</TextLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="relative mt-space-7 border-t border-border pt-space-4">
          <p className="text-xs text-text-muted">
            © {NEXCY_FOUNDING_YEAR}–{new Date().getFullYear()} NEXCY. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
