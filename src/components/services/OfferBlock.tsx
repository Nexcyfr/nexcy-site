import Link from "next/link";
import { TextReveal } from "@/components/animations/TextReveal";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Button } from "@/components/ui/Button";
import type { Offer } from "@/data/services";
import { cn } from "@/lib/utils";

/**
 * Bloc d'offre de la page /services — la synthèse d'un des deux métiers.
 *
 * Argument à gauche (accroche, pour qui, résultat visé), périmètre à droite.
 * La position s'inverse d'un bloc à l'autre pour donner du rythme. Le détail
 * (méthode, inclus, cadre) vit sur la page dédiée /services/[slug].
 */
export function OfferBlock({
  offer,
  reversed = false,
}: {
  offer: Offer;
  reversed?: boolean;
}) {
  const id = `offre-${offer.slug}`;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        "section-y border-t border-border",
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
          <div>
            <div className="plan-rule pt-6">
              <p aria-hidden="true" className="t-tech text-accent">
                {offer.index}
              </p>
            </div>

            <TextReveal as="h2" id={`${id}-title`} className="t-h2 mt-6 text-text-primary">
              {offer.title}
            </TextReveal>

            <MotionReveal delay={0.08}>
              <p className="t-lead measure mt-7 text-text-primary">{offer.hook}</p>

              <dl className="measure mt-8 flex flex-col gap-6">
                <div>
                  <dt className="t-tech text-text-muted">Pour qui</dt>
                  <dd className="t-body mt-3 text-text-secondary">{offer.audience}</dd>
                </div>
                <div>
                  <dt className="t-tech text-text-muted">Résultat visé</dt>
                  <dd className="t-body mt-3 text-text-primary">{offer.result}</dd>
                </div>
              </dl>
            </MotionReveal>
          </div>

          <MotionReveal delay={0.14}>
            <div className="border border-border bg-card p-8 md:p-10">
              <p className="t-tech text-text-muted">{offer.scopeTitle}</p>
              <span aria-hidden="true" className="mt-4 block h-px w-12 bg-accent" />

              <ul className="mt-7 flex flex-col gap-4">
                {offer.scope.map((item) => (
                  <li key={item.title} className="t-body flex gap-4 text-text-secondary">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-4 shrink-0 bg-accent" />
                    {item.title}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-6">
                <Button href={`/services/${offer.slug}`} variant="secondary">
                  Voir le détail
                </Button>
                <Link
                  href="/contact"
                  className="t-tech inline-flex min-h-[44px] items-center gap-3 text-text-secondary transition-colors duration-200 hover:text-accent"
                >
                  {offer.ctaLabel}
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
