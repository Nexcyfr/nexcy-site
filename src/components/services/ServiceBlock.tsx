import { TextReveal } from "@/components/animations/TextReveal";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Button } from "@/components/ui/Button";
import type { ServiceDetail } from "@/data/services";
import { cn } from "@/lib/utils";

/**
 * Bloc de service pleine largeur.
 *
 * Deux colonnes : l'argument à gauche, ce qui est livré à droite. La position
 * s'inverse d'un bloc à l'autre pour donner du rythme sans recourir à des
 * illustrations.
 *
 * Les anciens « motifs » SVG par service (schéma arborescent, maquette de
 * navigateur factice) ont été retirés : décoratifs, sans rapport avec le
 * langage du plan, et le faux chrome de navigateur relevait du visuel
 * d'interface fictive. Le rythme vient désormais de la structure elle-même.
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

            <TextReveal as="h2" id={titleId} className="t-h2 mt-6 text-text-primary">
              {service.title}
            </TextReveal>

            <MotionReveal delay={0.08}>
              <p className="t-lead measure mt-7 text-text-primary">
                {service.hook}
              </p>

              {service.problem ? (
                <p className="t-body measure mt-6 text-text-secondary">
                  {service.problem}
                </p>
              ) : null}

              <p className="t-body measure mt-6 flex gap-4 text-text-primary">
                <span
                  aria-hidden="true"
                  className="mt-[0.7em] h-px w-4 shrink-0 bg-accent"
                />
                <span>
                  <span className="text-text-muted">Résultat visé — </span>
                  {service.result}
                </span>
              </p>

              <div className="measure mt-10 border-t border-border pt-6">
                <p className="t-tech text-text-muted">Méthode</p>
                <p className="t-body mt-4 text-text-secondary">{service.method}</p>
              </div>
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

              {service.technologies ? (
                <p className="t-body mt-8 border-t border-border pt-6 text-text-muted">
                  <span className="text-text-secondary">Technologies : </span>
                  {service.technologies}
                </p>
              ) : null}

              <div className="mt-6 border-t border-border pt-6">
                <p className="t-body text-text-secondary">
                  <span className="text-text-muted">Critères de réussite — </span>
                  {service.criteria}
                </p>
                <p className="t-body mt-3 text-text-muted">
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
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
