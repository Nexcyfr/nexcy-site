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
 * Footer — dernier acte, pas un dépotoir d'utilitaires.
 *
 * L'e-mail est traité comme l'élément principal : c'est la seule action qui
 * compte ici. La trame de plan relie visuellement le pied de page au Hero, à la
 * place de l'ancienne skyline décorative — un dessin d'illustration sans
 * rapport avec le propos, qui débordait par ailleurs sous la ligne de copyright.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-black">
      <div
        aria-hidden="true"
        className="plan-grid plan-grid-fade pointer-events-none absolute inset-0 opacity-50"
      />

      <div className="container-site relative py-space-7 md:py-space-8">
        {/* Adresse de contact — traitée comme le titre du footer */}
        <div className="plan-rule pt-8">
          <p className="t-tech text-text-muted">Écrire à NEXCY</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-5 inline-block break-all text-[clamp(1.375rem,1rem+1.7vw,2.75rem)] font-medium leading-tight tracking-[-0.02em] text-text-primary underline-offset-[0.18em] transition-colors duration-200 hover:text-accent hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="t-body mt-4 text-text-secondary">
            Réponse sous 48 heures ouvrées.
          </p>
        </div>

        <div className="mt-16 grid gap-space-6 sm:grid-cols-2 lg:mt-24 lg:grid-cols-[1.6fr_1fr_1fr]">
          {/* Colonne identité */}
          <div className="flex flex-col items-start gap-space-4">
            <Logo width={132} />
            <p className="t-tech text-accent">{BRAND_TAGLINE}</p>
            <p className="t-body measure-tight text-text-secondary">
              Studio digital indépendant à Bordeaux. Sites web sur mesure,
              identité de marque, référencement, automatisation et intelligence
              artificielle.
            </p>
          </div>

          <nav aria-label="Navigation du site">
            <p className="t-tech mb-space-4 text-text-muted">Navigation</p>
            <ul className="flex flex-col gap-space-3 text-sm">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <TextLink href={link.href}>{link.label}</TextLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Informations légales">
            <p className="t-tech mb-space-4 text-text-muted">Informations</p>
            <ul className="flex flex-col gap-space-3 text-sm">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <TextLink href={link.href}>{link.label}</TextLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Barre de pied — cote de fin, reprise des coordonnées du Hero */}
        <div className="mt-space-7 flex flex-col gap-3 border-t border-border pt-space-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-tech text-text-muted">
            © {NEXCY_FOUNDING_YEAR}–{new Date().getFullYear()} NEXCY
          </p>
          <p className="t-tech text-text-muted">
            Bordeaux · 44.8378° N — 0.5792° O
          </p>
        </div>
      </div>
    </footer>
  );
}
