import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/Button";
import { LineReveal } from "@/components/animations/LineReveal";
import { maintenanceService } from "@/data/services";

/**
 * Bloc « Accompagnement continu » — abonnement, présenté à part (Master Brief §14).
 */
export function ServicesMaintenanceBlock() {
  const m = maintenanceService;
  return (
    <section
      aria-labelledby="service-maintenance"
      className="section-y border-t border-border bg-surface"
    >
      <div className="container-site">
        <p className="text-xs uppercase tracking-widest2 text-accent">{m.eyebrow}</p>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <TextReveal
              as="h2"
              id="service-maintenance"
              className="t-h2 text-text-primary"
            >
              {m.title}
            </TextReveal>
            <FadeIn delay={0.1}>
              <p className="mt-8 max-w-md t-lead text-text-primary">
                {m.hook}
              </p>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-text-muted">
                {m.note}
              </p>
              <div className="mt-8">
                <Button href="/contact" variant="primary">
                  {m.ctaLabel}
                </Button>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.15} y={20}>
            <div className="rounded-card border border-border bg-card p-8 md:p-10">
              <p className="text-xs uppercase tracking-widest2 text-text-muted">
                {m.deliverablesTitle}
              </p>
              <LineReveal className="mt-4 w-16" />
              <ul className="mt-6 flex flex-col gap-4">
                {m.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-base leading-relaxed text-text-secondary"
                  >
                    <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
