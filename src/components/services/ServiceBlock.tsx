import Link from "next/link";
import { TextReveal } from "@/components/animations/TextReveal";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Button } from "@/components/ui/Button";
import type { ServiceDetail } from "@/data/services";
import { cn } from "@/lib/utils";

/**
 * Bloc de service de la page /services — la synthèse.
 *
 * Deux colonnes : l'argument à gauche (accroche, pour qui, résultat visé,
 * méthode en une ligne), ce qui est livré à droite. La position s'inverse d'un
 * bloc à l'autre pour donner du rythme sans illustration. Le détail complet
 * (problème, méthode pas à pas, technologies, critères, limites) vit sur la
 * page dédiée /services/[slug] : aucun contenu n'est dupliqué.
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
      id={titleId}
      aria-labelledby={`${titleId}-title`}
      className={cn(
        "section-y border-t border-border",
        // Alternance de fond : la lecture progresse par paliers, pas par images.
        reversed ? "bg-surface" : "bg-black",
      )}
    >
      <div className="container-site">
        <div
          className={cn(
            "grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20",
            reversed && "lg:[&>*:first-child]:order-2",
          )}
        >
          {/* Colonne argument */}
          <div>
            <div className="plan-rule pt-6">
              <p aria-hidden="true" className="t-tech text-accent">
                {service.index}
              </p>
            </div>

            <TextReveal
              as="h2"
              id={`${titleId}-title`}
              className="t-h2 mt-6 text-text-primary"
            >
              {service.title}
            </TextReveal>

            <MotionReveal delay={0.08}>
              <p className="t-lead measure mt-7 text-text-primary">{service.hook}</p>

              <dl className="measure mt-8 flex flex-col gap-6">
                <div>
                  <dt className="t-tech text-text-muted">Pour qui</dt>
                  <dd className="t-body mt-3 text-text-secondary">{service.audience}</dd>
                </div>
                <div>
                  <dt className="t-tech text-text-muted">Résultat visé</dt>
                  <dd className="t-body mt-3 text-text-primary">{service.result}</dd>
                </div>
                <div>
                  <dt className="t-tech text-text-muted">Méthode</dt>
                  <dd className="t-body mt-3 text-text-secondary">{service.method}</dd>
                </div>
              </dl>
            </MotionReveal>
          </div>

          {/* Colonne livrables */}
          <MotionReveal delay={0.14}>
            <div className="border border-border bg-card p-8 md:p-10">
              <p className="t-tech text-text-muted">{service.deliverablesTitle}</p>
              <span aria-hidden="true" className="mt-4 block h-px w-12 bg-accent" />

              <ul className="mt-7 flex flex-col gap-4">
                {service.deliverables.map((item) => (
                  <li key={item} className="t-body flex gap-4 text-text-secondary">
                    <span
                      aria-hidden="true"
                      className="mt-[0.7em] h-px w-4 shrink-0 bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-6">
                <Button href={`/services/${service.slug}`} variant="secondary">
                  Voir le détail
                </Button>
                <Link
                  href="/contact"
                  className="t-tech inline-flex min-h-[44px] items-center gap-3 text-text-secondary transition-colors duration-200 hover:text-accent"
                >
                  {service.ctaLabel}
                  <span aria-hidden="true" className="block h-px w-8 bg-current" />
                </Link>
              </div>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
