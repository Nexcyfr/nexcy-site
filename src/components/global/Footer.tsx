import Image from "next/image";
import { Logo } from "@/components/ui/Logo";
import { TextLink } from "@/components/ui/TextLink";
import {
  legalLinks,
  CONTACT_EMAIL,
  BRAND_TAGLINE,
  NEXCY_FOUNDING_YEAR,
} from "@/data/navigation";

/**
 * Footer (Master Brief §5 / §11).
 * Logo + tagline + e-mail + liens légaux · skyline Bordeaux à droite (opacité 15 %).
 */
export function Footer() {
  return (
    <footer className="relative border-t border-border bg-black">
      <div className="container-site relative py-12 md:py-16">
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

        <div className="relative grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-6">
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

          <nav
            aria-label="Navigation du pied de page"
            className="flex flex-col gap-4 md:items-end md:text-right"
          >
            <ul className="flex flex-col gap-3 text-sm md:items-end">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <TextLink href={link.href}>{link.label}</TextLink>
                </li>
              ))}
              <li>
                <TextLink href="/contact">Contact</TextLink>
              </li>
            </ul>
          </nav>
        </div>

        <div className="relative mt-12 border-t border-border pt-6">
          <p className="text-xs text-text-muted">
            © {NEXCY_FOUNDING_YEAR}–{new Date().getFullYear()} NEXCY. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
