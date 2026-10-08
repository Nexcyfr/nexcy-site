import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/animations/TextReveal";
import { MotionReveal } from "@/components/animations/MotionReveal";

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
            className="mt-6 t-h2 text-text-primary"
          >
            Un interlocuteur unique. Les bons spécialistes, au bon moment.
          </TextReveal>
        </div>
        <MotionReveal delay={0.1}>
          <div className="flex flex-col gap-6">
            <p className="t-body-lg text-text-secondary">
              NEXCY fonctionne comme un studio compact : un interlocuteur unique porte
              la vision de votre projet de bout en bout, de l&apos;audit à la mise
              en ligne.
            </p>
            <p className="t-body-lg text-text-secondary">
              Selon la nature de chaque mission, le studio peut s&apos;appuyer sur
              des spécialistes — design, développement, référencement, IA —
              choisis pour le besoin et coordonnés par NEXCY. Vous gardez un
              seul point de contact et un seul responsable de la qualité.
            </p>
            <p className="t-body-lg text-text-secondary">
              Pas de hiérarchie inutile, pas d&apos;intermédiaires qui diluent la
              qualité.
            </p>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
