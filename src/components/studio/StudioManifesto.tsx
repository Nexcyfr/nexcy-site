import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { cn } from "@/lib/utils";

interface ManifestoBlockProps {
  label: string;
  title: string;
  titleId: string;
  paragraphs: string[];
  surface?: boolean;
}

function ManifestoBlock({
  label,
  title,
  titleId,
  paragraphs,
  surface,
}: ManifestoBlockProps) {
  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        "section-y border-t border-border",
        surface ? "bg-surface" : "bg-black",
      )}
    >
      <div className="container-site grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionLabel label={label} />
          <TextReveal
            as="h2"
            id={titleId}
            className="mt-6 t-h2 text-text-primary"
          >
            {title}
          </TextReveal>
        </div>
        <FadeIn delay={0.1}>
          <div className="flex flex-col gap-6">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="t-body-lg text-text-secondary"
              >
                {p}
              </p>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/**
 * Blocs manifeste de la page Studio — Master Brief §15.
 * « L'excellence invisible. » puis « Precision in Motion. »
 */
export function StudioManifesto() {
  return (
    <>
      <ManifestoBlock
        label="Notre philosophie"
        title="L'excellence invisible."
        titleId="studio-manifesto"
        paragraphs={[
          "Ce que nous construisons ne cherche pas à impressionner par l'ostentation. Il cherche à fonctionner avec une précision telle que l'expérience semble évidente, fluide, naturelle.",
          "C'est cela, l'excellence invisible : quand tout est si bien pensé que personne ne voit l'effort — seulement le résultat.",
        ]}
      />
      <ManifestoBlock
        label="Notre expression"
        title="Precision in Motion."
        titleId="studio-precision"
        surface
        paragraphs={[
          "La précision sans le mouvement est de la rigidité. Le mouvement sans la précision est du chaos.",
          "Nous travaillons dans l'espace entre les deux — là où les systèmes digitaux deviennent vivants sans jamais perdre leur maîtrise.",
        ]}
      />
    </>
  );
}
