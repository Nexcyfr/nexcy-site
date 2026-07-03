import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ContactScene } from "@/components/contact/ContactScene";

/** Hero de la page Contact — Master Brief §16. */
export function ContactHero() {
  return (
    <div className="flex flex-col gap-8">
      <SectionLabel label="03 / Contact" />
      <div>
        <TextReveal
          as="h1"
          id="contact-hero-title"
          className="text-5xl font-bold leading-[1.02] tracking-tight text-text-primary md:text-6xl"
        >
          Parlons de votre projet.
        </TextReveal>
        <FadeIn delay={0.15}>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-text-secondary">
            Décrivez votre projet, vos objectifs, vos contraintes. Nous vous
            répondons sous 48 heures ouvrées.
          </p>
        </FadeIn>
      </div>
      {/* Motif de convergence — signature visuelle page Contact */}
      <FadeIn delay={0.3} y={12}>
        <ContactScene />
      </FadeIn>
    </div>
  );
}
