import type { ReactNode } from "react";
import { TextReveal } from "@/components/animations/TextReveal";
import { MotionReveal } from "@/components/animations/MotionReveal";

interface PageHeroProps {
  index: string;
  kicker: string;
  title: string;
  titleId: string;
  lead: ReactNode;
  /**
   * Bandeau de cotes en pied de hero : deux à quatre faits courts et vrais.
   * Remplace les vignettes décoratives — un fait vaut mieux qu'un diagramme.
   */
  facts?: { label: string; value: string }[];
}

/**
 * Ouverture des pages internes — une seule composition pour Services, Studio
 * et Contact.
 *
 * Remplace les trois « scènes » SVG encadrées qui ouvraient auparavant chaque
 * page : des diagrammes abstraits, différents à chaque fois, sans lien avec le
 * propos de la page ni avec le plan du Hero. Ici, la page s'ouvre sur ce
 * qu'elle a à dire, et se referme sur une ligne de cotes factuelle.
 */
export function PageHero({
  index,
  kicker,
  title,
  titleId,
  lead,
  facts,
}: PageHeroProps) {
  return (
    <section
      aria-labelledby={titleId}
      className="relative overflow-hidden border-b border-border bg-black"
    >
      <div
        aria-hidden="true"
        className="plan-grid plan-grid-fade pointer-events-none absolute inset-0 opacity-70"
      />

      <div className="container-site relative pb-16 pt-[calc(var(--header-h)+4rem)] md:pb-20 md:pt-[calc(var(--header-h)+6rem)]">
        <div className="plan-rule pt-8">
          <p className="t-tech text-text-muted">
            <span className="text-accent">{index}</span>
            <span className="px-2 text-border" aria-hidden="true">
              /
            </span>
            {kicker}
          </p>
        </div>

        <div className="mt-10 grid gap-x-16 gap-y-8 lg:grid-cols-[1.15fr_1fr] lg:items-end">
          <TextReveal as="h1" id={titleId} className="t-h1 text-text-primary">
            {title}
          </TextReveal>
          <MotionReveal>
            <div className="t-lead measure">{lead}</div>
          </MotionReveal>
        </div>

        {facts?.length ? (
          <MotionReveal delay={0.1}>
            <dl className="mt-14 grid gap-px border-t border-border bg-border sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
              {facts.map((fact) => (
                <div key={fact.label} className="bg-black pt-5 sm:px-6 sm:first:pl-0">
                  <dt className="t-tech text-text-muted">{fact.label}</dt>
                  <dd className="t-body-lg mt-3 pb-5 text-text-primary">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </MotionReveal>
        ) : null}
      </div>
    </section>
  );
}
