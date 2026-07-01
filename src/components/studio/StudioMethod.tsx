import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";

/** Section « Comment nous travaillons » — Master Brief §15. */
export function StudioMethod() {
  return (
    <section
      aria-labelledby="studio-method-title"
      className="section-y border-t border-border bg-surface"
    >
      <div className="container-site grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionLabel label="Notre fonctionnement" />
          <TextReveal
            as="h2"
            id="studio-method-title"
            className="mt-6 text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl"
          >
            Un interlocuteur unique. Un réseau d&apos;experts sélectionnés.
          </TextReveal>
        </div>
        <FadeIn delay={0.1}>
          <div className="flex flex-col gap-6">
            <p className="text-lg leading-relaxed text-text-secondary">
              NEXCY fonctionne comme une structure agile : un interlocuteur unique
              qui porte la vision de votre projet de bout en bout.
            </p>
            <p className="text-lg leading-relaxed text-text-secondary">
              Selon la nature et l&apos;envergure de chaque mission, nous mobilisons
              des experts partenaires sélectionnés — développeurs, designers,
              consultants SEO, spécialistes IA — pour garantir le niveau
              d&apos;exécution que vous méritez.
            </p>
            <p className="text-lg leading-relaxed text-text-secondary">
              Pas de hiérarchie inutile. Pas d&apos;intermédiaires qui diluent la
              qualité. La bonne expertise, au bon moment.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
