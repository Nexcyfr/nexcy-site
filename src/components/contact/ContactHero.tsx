import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";

/** Hero de la page Contact — Master Brief §16. */
export function ContactHero() {
  return (
    <div>
      <TextReveal
        as="h1"
        id="contact-hero-title"
        className="text-5xl font-bold leading-[1.02] tracking-tight text-text-primary md:text-7xl"
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
  );
}
