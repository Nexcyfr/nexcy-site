import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/SectionHead";
import { CtaSection } from "@/components/ui/CtaSection";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { offers, getOffer } from "@/data/services";
import { buildMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/utils";

/** Deux pages dédiées, pré-rendues : aucune route dynamique à l'exécution. */
export const dynamicParams = false;

export function generateStaticParams() {
  return offers.map((o) => ({ slug: o.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer) return {};
  return buildMetadata({
    title: offer.metaTitle,
    description: offer.metaDescription,
    path: `/services/${offer.slug}`,
    ogImage: `/assets/og/og-service-${offer.slug}.png`,
  });
}

export default async function OfferPage({ params }: Props) {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer) notFound();

  const other = offers.find((o) => o.slug !== offer.slug)!;
  const url = `${SITE_URL}/services/${offer.slug}`;

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: offer.title,
        serviceType: offer.serviceType,
        description: offer.metaDescription,
        url,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: [
          { "@type": "City", name: "Bordeaux" },
          { "@type": "Country", name: "France" },
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
          { "@type": "ListItem", position: 3, name: offer.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />

      <PageHero
        index={offer.index}
        kicker="Services"
        titleId="offer-hero-title"
        title={offer.title}
        lead={<p>{offer.intro}</p>}
        facts={[
          { label: "Interlocuteur", value: "Un seul, du début à la fin" },
          { label: "Base", value: "Bordeaux, France" },
          { label: "Zone d'intervention", value: "France entière" },
          { label: "Délai de réponse", value: "48 heures ouvrées" },
        ]}
      />

      {/* Ce que nous réalisons */}
      <section aria-labelledby="offer-scope-title" className="section-y border-t border-border bg-black">
        <div className="container-site">
          <SectionHead
            index="01"
            kicker="Périmètre"
            titleId="offer-scope-title"
            title={offer.scopeTitle + "."}
            lead={<p>{offer.hook}</p>}
          />
          <ul className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
            {offer.scope.map((item, i) => (
              <li key={item.title} className="bg-black">
                <MotionReveal delay={Math.min(i, 5) * 0.04} className="h-full">
                  <div className="flex h-full flex-col gap-3 p-7">
                    <span aria-hidden="true" className="block h-px w-8 bg-accent" />
                    <h3 className="t-h3 text-text-primary">{item.title}</h3>
                    <p className="t-body text-text-secondary">{item.description}</p>
                  </div>
                </MotionReveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pour qui, pour quel résultat */}
      <section aria-labelledby="offer-audience-title" className="section-y border-t border-border bg-surface">
        <div className="container-site">
          <SectionHead
            index="02"
            kicker="Pour qui"
            titleId="offer-audience-title"
            title="À qui cela s'adresse, et ce que vous en attendez."
          />
          <div className="mt-16 grid gap-x-16 gap-y-10 lg:mt-24 lg:grid-cols-2">
            <MotionReveal>
              <div className="plan-rule pt-6">
                <h3 className="t-tech text-accent">Pour quel type de client</h3>
                <p className="t-body-lg measure mt-5 text-text-primary">{offer.audience}</p>
              </div>
            </MotionReveal>
            <MotionReveal delay={0.06}>
              <div className="plan-rule pt-6">
                <h3 className="t-tech text-accent">Résultat attendu</h3>
                <p className="t-body-lg measure mt-5 text-text-primary">{offer.result}</p>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* Méthode */}
      <section aria-labelledby="offer-method-title" className="section-y border-t border-border bg-black">
        <div className="container-site">
          <SectionHead
            index="03"
            kicker="Méthode"
            titleId="offer-method-title"
            title="Comment nous procédons."
          />
          <ol className="mt-16 grid gap-x-10 lg:mt-24 lg:grid-cols-3">
            {offer.steps.map((step, i) => (
              <li key={step.title} className="border-t border-border py-7 lg:pt-8">
                <MotionReveal delay={Math.min(i, 2) * 0.05}>
                  <p className="t-tech text-accent">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="t-h3 mt-4 text-text-primary">{step.title}</h3>
                  <p className="t-body mt-3 text-text-secondary">{step.description}</p>
                </MotionReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Inclus lorsque le projet le nécessite */}
      <section aria-labelledby="offer-included-title" className="section-y border-t border-border bg-surface">
        <div className="container-site">
          <SectionHead
            index="04"
            kicker="Capacités"
            titleId="offer-included-title"
            title={offer.includedTitle + "."}
            lead={<p>{offer.technologies}</p>}
          />
          <ul className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
            {offer.included.map((item, i) => (
              <li key={item.title} className="bg-surface">
                <MotionReveal delay={Math.min(i, 5) * 0.04} className="h-full">
                  <div className="flex h-full flex-col gap-3 p-7">
                    <h3 className="t-h3 text-text-primary">{item.title}</h3>
                    <p className="t-body text-text-secondary">{item.description}</p>
                  </div>
                </MotionReveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cadre : critères et limite */}
      <section aria-labelledby="offer-frame-title" className="section-y border-t border-border bg-black">
        <div className="container-site">
          <SectionHead
            index="05"
            kicker="Cadre"
            titleId="offer-frame-title"
            title="Ce que nous mesurons, ce que nous refusons."
          />
          <div className="mt-16 grid gap-x-16 gap-y-10 lg:mt-24 lg:grid-cols-2">
            <MotionReveal>
              <div className="plan-rule pt-6">
                <h3 className="t-tech text-accent">Critères de réussite</h3>
                <p className="t-body-lg measure mt-5 text-text-primary">{offer.criteria}</p>
              </div>
            </MotionReveal>
            <MotionReveal delay={0.06}>
              <div className="plan-rule pt-6">
                <h3 className="t-tech text-text-muted">Notre limite</h3>
                <p className="t-body-lg measure mt-5 text-text-secondary">{offer.limit}</p>
              </div>
            </MotionReveal>
          </div>

          <MotionReveal className="mt-16">
            <Link
              href={`/services/${other.slug}`}
              className="group inline-flex min-h-[44px] items-center gap-4 border-t border-border pt-6 text-text-secondary transition-colors duration-200 hover:text-accent"
            >
              <span className="t-tech">Autre métier du studio</span>
              <span className="t-h3 text-text-primary group-hover:text-accent">{other.name}</span>
              <span aria-hidden="true" className="block h-px w-8 bg-current" />
            </Link>
          </MotionReveal>
        </div>
      </section>

      <CtaSection
        title="Prochaine étape."
        subtitle={offer.nextStep}
        buttonLabel="Démarrer un projet"
        buttonHref="/contact"
        note="Réponse sous 48 heures ouvrées · Aucun engagement"
      />
    </>
  );
}
