import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/animations/TextReveal";
import { MotionReveal } from "@/components/animations/MotionReveal";

/**
 * Bloc « Notre histoire » — page Studio.
 * Distinction validée : expérience depuis 2019 / création juridique NEXCY en 2025.
 * NEXCY n'est jamais présentée comme juridiquement créée en 2019.
 */
export function StudioHistory() {
  return (
    <section
      aria-labelledby="studio-history-title"
      className="section-y border-t border-border bg-black"
    >
      <div className="container-site grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionLabel label="Notre histoire" />
          <TextReveal
            as="h2"
            id="studio-history-title"
            className="mt-6 t-h2 text-text-primary"
          >
            Une pratique affinée, une structure dédiée.
          </TextReveal>
        </div>
        <MotionReveal delay={0.1}>
          <div className="flex flex-col gap-6">
            <p className="t-body-lg text-text-secondary">
              NEXCY s&apos;appuie sur une expérience du digital construite depuis
              2019. En 2025, cette pratique s&apos;est structurée sous la marque
              NEXCY.
            </p>
            <p className="t-body-lg text-text-secondary">
              Un haut niveau d&apos;exigence, de la stratégie à l&apos;exécution.
            </p>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
