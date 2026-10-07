import Link from "next/link";
import { SectionHead } from "@/components/ui/SectionHead";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { offers, capabilities } from "@/data/services";

/**
 * Offres — deux métiers, présentés comme deux grandes entrées éditoriales.
 *
 * Le studio se positionne en spécialiste : sites web d'un côté, applications de
 * l'autre. Les autres expertises (SEO technique, automatisation, IA, sécurité…)
 * n'apparaissent qu'en bas de section, comme un socle commun, jamais comme des
 * services vendus à part.
 */
export function HomeOffers() {
  return (
    <section
      aria-labelledby="home-offers-title"
      className="section-y border-t border-border bg-black"
    >
      <div className="container-site">
        <SectionHead
          index="02"
          kicker="Services"
          titleId="home-offers-title"
          title="Deux métiers. Un seul niveau d'exigence."
          lead={
            <p>
              NEXCY conçoit et développe des sites web et des applications sur
              mesure, de la conception à la mise en ligne.
            </p>
          }
        />

        <ul className="mt-16 grid gap-px border border-border bg-border lg:mt-24 lg:grid-cols-2">
          {offers.map((offer, i) => (
            <li key={offer.slug} className="bg-black">
              <MotionReveal delay={i * 0.06} className="h-full">
                <Link
                  href={`/services/${offer.slug}`}
                  className="group relative flex h-full flex-col p-8 transition-colors duration-300 hover:bg-surface/40 md:p-10 lg:p-12"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-px w-0 bg-accent transition-[width] duration-500 ease-cinematic group-hover:w-full"
                  />
                  <span aria-hidden="true" className="t-tech text-accent">
                    {offer.index}
                  </span>
                  <h3 className="t-h2 mt-8 text-text-primary">{offer.title}</h3>
                  <p className="t-body-lg measure mt-5 text-text-secondary">{offer.summary}</p>

                  <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                    {offer.scope.slice(0, 5).map((s) => (
                      <li key={s.title} className="t-tech text-text-muted">
                        {s.title}
                      </li>
                    ))}
                  </ul>

                  <span className="t-tech mt-10 inline-flex items-center gap-3 text-text-secondary transition-colors duration-200 group-hover:text-accent">
                    Découvrir {offer.name === "Applications" ? "les applications" : "les sites web"}
                    <span aria-hidden="true" className="block h-px w-8 bg-current" />
                  </span>
                </Link>
              </MotionReveal>
            </li>
          ))}
        </ul>

        <MotionReveal className="mt-12">
          <p className="t-body measure border-t border-border pt-6 text-text-muted">
            <span className="text-text-secondary">Réunis lorsque le projet l&apos;exige : </span>
            {capabilities.map((c) => c.title.toLowerCase()).join(", ")}.
          </p>
        </MotionReveal>
      </div>
    </section>
  );
}
