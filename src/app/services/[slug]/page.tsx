import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHead } from "@/components/ui/SectionHead";
import { CtaSection } from "@/components/ui/CtaSection";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { serviceDetails } from "@/data/services";
import { buildMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/utils";

/** Pages dédiées par expertise — pré-rendues, aucune route dynamique à l'exécution. */
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceDetails.map((s) => ({ slug: s.slug }));
}

function getService(slug: string) {
  return serviceDetails.find((s) => s.slug === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = getService(params.slug);
  if (!service) return {};
  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
    ogImage: `/assets/og/og-service-${service.slug}.png`,
  });
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = getService(params.slug);
  if (!service) notFound();

  const url = `${SITE_URL}/services/${service.slug}`;
  const steps = service.method.split("→").map((step) => step.trim().replace(/\.$/, ""));
  const others = serviceDetails.filter((s) => s.slug !== service.slug);

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.title,
        description: service.metaDescription,
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
          { "@type": "ListItem", position: 3, name: service.title, item: url },
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
        index={service.index}
        kicker="Expertise"
        titleId="service-hero-title"
        title={service.title}
        lead={<p>{service.hook}</p>}
        facts={[
          { label: "Interlocuteur", value: "Un seul, du début à la fin" },
          { label: "Base", value: "Bordeaux, France" },
          { label: "Zone d'intervention", value: "France entière" },
          { label: "Délai de réponse", value: "48 heures ouvrées" },
        ]}
      />

      {/* Constat · pour qui · résultat */}
      <section
        aria-labelledby="service-context-title"
        className="section-y border-t border-border bg-black"
      >
        <div className="container-site">
          <SectionHead
            index="01"
            kicker="Constat"
            titleId="service-context-title"
            title="Le problème, le public, le résultat."
          />
          <ul className="mt-16 grid gap-px border-t border-border bg-border lg:mt-24 lg:grid-cols-3">
            {[
              { label: "Le constat", text: service.problem ?? service.hook },
              { label: "Pour qui", text: service.audience },
              { label: "Résultat visé", text: service.result },
            ].map((item, i) => (
              <li key={item.label} className="bg-black">
                <MotionReveal delay={i * 0.06} className="h-full">
                  <div className={`flex h-full flex-col py-8 lg:py-10 ${i === 0 ? "lg:pr-8" : "lg:px-8"}`}>
                    <h3 className="t-tech text-accent">{item.label}</h3>
                    <p className="t-body measure mt-5 text-text-secondary">{item.text}</p>
                  </div>
                </MotionReveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Méthode */}
      <section
        aria-labelledby="service-method-title"
        className="section-y border-t border-border bg-surface"
      >
        <div className="container-site">
          <SectionHead
            index="02"
            kicker="Méthode"
            titleId="service-method-title"
            title="Comment nous procédons."
          />
          <ol className="mt-16 grid gap-x-10 lg:mt-24 lg:grid-cols-5">
            {steps.map((step, i) => (
              <li key={step} className="border-t border-border py-6 lg:pt-8">
                <MotionReveal delay={i * 0.05}>
                  <p className="t-tech text-accent">{String(i + 1).padStart(2, "0")}</p>
                  <p className="t-body-lg mt-4 text-text-primary">{step}</p>
                </MotionReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Livrables */}
      <section
        aria-labelledby="service-deliverables-title"
        className="section-y border-t border-border bg-black"
      >
        <div className="container-site">
          <SectionHead
            index="03"
            kicker="Livrables"
            titleId="service-deliverables-title"
            title={service.deliverablesTitle + "."}
            lead={service.technologies ? <p>{service.technologies}</p> : undefined}
          />
          <ul className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2 lg:mt-24">
            {service.deliverables.map((item) => (
              <li key={item} className="bg-black">
                <MotionReveal className="h-full">
                  <div className="t-body-lg flex h-full items-start gap-4 p-7 text-text-primary">
                    <span aria-hidden="true" className="mt-[0.75em] h-px w-5 shrink-0 bg-accent" />
                    {item}
                  </div>
                </MotionReveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Cadre : critères et limite */}
      <section
        aria-labelledby="service-frame-title"
        className="section-y border-t border-border bg-surface"
      >
        <div className="container-site">
          <SectionHead
            index="04"
            kicker="Cadre"
            titleId="service-frame-title"
            title="Ce que nous mesurons, ce que nous refusons."
          />
          <div className="mt-16 grid gap-x-16 gap-y-10 lg:mt-24 lg:grid-cols-2">
            <MotionReveal>
              <div className="plan-rule pt-6">
                <h3 className="t-tech text-accent">Critères de réussite</h3>
                <p className="t-body-lg measure mt-5 text-text-primary">{service.criteria}</p>
              </div>
            </MotionReveal>
            <MotionReveal delay={0.06}>
              <div className="plan-rule pt-6">
                <h3 className="t-tech text-text-muted">Notre limite</h3>
                <p className="t-body-lg measure mt-5 text-text-secondary">{service.limit}</p>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* Autres expertises */}
      <section
        aria-labelledby="service-others-title"
        className="section-y border-t border-border bg-black"
      >
        <div className="container-site">
          <SectionHead
            index="05"
            kicker="Expertises liées"
            titleId="service-others-title"
            title="Chaque domaine se prend seul. Ensemble, ils se renforcent."
          />
          <ul className="mt-16 border-t border-border lg:mt-24">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/services/${o.slug}`}
                  className="group grid min-h-[44px] gap-x-10 gap-y-2 border-b border-border py-6 transition-colors duration-300 hover:bg-surface/40 lg:grid-cols-[2.5rem_1fr_1.05fr] lg:items-baseline lg:py-8"
                >
                  <span aria-hidden="true" className="t-tech text-accent/80 group-hover:text-accent">
                    {o.index}
                  </span>
                  <span className="t-h3 text-text-primary">{o.title}</span>
                  <span className="t-body text-text-secondary">{o.result}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaSection
        title="Prochaine étape."
        subtitle={service.nextStep}
        buttonLabel="Démarrer un projet"
        buttonHref="/contact"
        note="Réponse sous 48 heures ouvrées · Aucun engagement"
      />
    </>
  );
}
