import Image from "next/image";
import { Monogram } from "@/components/ui/Monogram";
import { TextLink } from "@/components/ui/TextLink";
import {
  legalLinks,
  CONTACT_EMAIL,
  BRAND_TAGLINE,
  FOUNDING_YEAR,
  CURRENT_YEAR,
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
            <div className="flex items-center gap-3">
              <Monogram className="h-7 w-7 text-text-primary" strokeWidth={12} />
              <span className="text-lg font-bold tracking-tight text-text-primary">
                NEXCY
              </span>
            </div>
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
            aria-label="Liens légaux"
            className="flex flex-col gap-4 md:items-end md:text-right"
          >
            <ul className="flex flex-col gap-3 text-sm md:items-end">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <TextLink href={link.href}>{link.label}</TextLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="relative mt-12 border-t border-border pt-6">
          <p className="text-xs text-text-muted">
            © {FOUNDING_YEAR}–{CURRENT_YEAR} NEXCY. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
