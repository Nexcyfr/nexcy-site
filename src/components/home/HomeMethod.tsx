import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { methodSteps } from "@/data/method";

/**
 * Section « Méthode » — Master Brief §13 (Section 4).
 * 4 étapes, numéros dorés larges (opacité réduite), 2 colonnes desktop.
 */
export function HomeMethod() {
  return (
    <section
      aria-labelledby="home-method-title"
      className="section-y border-t border-border bg-black"
    >
      <div className="container-site">
        <SectionLabel label="03 / Méthode" />

        <TextReveal
          as="h2"
          id="home-method-title"
          className="mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl"
        >
          Un processus en quatre étapes, sans surprise.
        </TextReveal>

        <div className="mt-16 grid gap-x-16 gap-y-12 md:grid-cols-2">
          {methodSteps.map((step, i) => (
            <FadeIn key={step.index} delay={i * 0.05} y={20}>
              <div className="flex gap-6">
                <span
                  aria-hidden="true"
                  className="text-5xl font-bold leading-none text-accent/20 md:text-6xl"
                >
                  {step.index}
                </span>
                <div className="pt-1">
                  <h3 className="text-xl font-medium text-text-primary md:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
