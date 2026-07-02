import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/Button";
import { LineReveal } from "@/components/animations/LineReveal";
import { ServiceMotif } from "@/components/services/ServiceMotif";
import type { ServiceDetail } from "@/data/services";
import { cn } from "@/lib/utils";

type MotifVariant = "creation-web" | "branding" | "seo" | "automatisation-ia";
const MOTIF_SLUGS: MotifVariant[] = ["creation-web", "branding", "seo", "automatisation-ia"];

/**
 * Bloc de service pleine largeur — Master Brief §14.
 * Alternance de disposition gauche/droite sur desktop (Brief §29).
 */
export function ServiceBlock({
  service,
  reversed = false,
}: {
  service: ServiceDetail;
  reversed?: boolean;
}) {
  const titleId = `service-${service.slug}`;

  return (
    <section
      aria-labelledby={titleId}
      className="section-y border-t border-border bg-black"
    >
      <div className="container-site">
        <div
          className={cn(
            "grid gap-10 lg:grid-cols-2 lg:gap-20",
            reversed && "lg:[&>*:first-child]:order-2",
          )}
        >
          {/* Colonne titre + accroche */}
          <div>
            <div className="flex items-baseline gap-4">
              <span
                aria-hidden="true"
                className="text-4xl font-semibold text-accent/30"
              >
                {service.index}
              </span>
              <TextReveal
                as="h2"
                id={titleId}
                className="text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl"
              >
                {service.title}
              </TextReveal>
            </div>
            <FadeIn delay={0.1}>
              <p className="mt-8 max-w-md text-xl font-light leading-relaxed text-text-primary">
                {service.hook}
              </p>
              {service.problem ? (
                <p className="mt-6 max-w-md text-base leading-relaxed text-text-secondary">
                  {service.problem}
                </p>
              ) : null}

              {/* Résultat visé */}
              <p className="mt-6 flex max-w-md gap-3 text-base leading-relaxed text-text-primary">
                <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-accent" />
                <span>
                  <span className="text-text-muted">Résultat visé — </span>
                  {service.result}
                </span>
              </p>

              {/* Méthode */}
              <div className="mt-8 max-w-md">
                <p className="text-xs uppercase tracking-widest2 text-text-muted">
                  Méthode
                </p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {service.method}
                </p>
              </div>
            </FadeIn>

            {MOTIF_SLUGS.includes(service.slug as MotifVariant) ? (
              <FadeIn delay={0.2} y={16} className="mt-10">
                <ServiceMotif variant={service.slug as MotifVariant} />
              </FadeIn>
            ) : null}
          </div>

          {/* Colonne livrables */}
          <FadeIn delay={0.15} y={20}>
            <div className="rounded-card border border-border bg-card p-8 md:p-10">
              <p className="text-xs uppercase tracking-widest2 text-text-muted">
                {service.deliverablesTitle}
              </p>
              <LineReveal className="mt-4 w-16" />
              <ul className="mt-6 flex flex-col gap-4">
                {service.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-base leading-relaxed text-text-secondary"
                  >
                    <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>

              {service.technologies ? (
                <p className="mt-8 border-t border-border pt-6 text-sm leading-relaxed text-text-muted">
                  <span className="text-text-secondary">Technologies : </span>
                  {service.technologies}
                </p>
              ) : null}

              <div className="mt-6 border-t border-border pt-6">
                <p className="text-sm leading-relaxed text-text-secondary">
                  <span className="text-text-muted">Critères de réussite — </span>
                  {service.criteria}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">
                  <span className="text-text-secondary">Notre limite — </span>
                  {service.limit}
                </p>
              </div>

              <div className="mt-8">
                <Button href="/contact" variant="secondary">
                  {service.ctaLabel}
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
