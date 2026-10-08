import { TextReveal } from "@/components/animations/TextReveal";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { CAL_URL } from "@/lib/site-config";

/**
 * En-tête de la page Contact.
 *
 * Composée pour la colonne de gauche (collante en desktop) : cote, titre,
 * puis ce que le visiteur veut savoir avant d'écrire — ce qui se passe ensuite.
 */
export function ContactHero() {
  return (
    <div className="flex flex-col">
      <div className="plan-rule pt-8">
        <p className="t-tech text-text-muted">
          <span className="text-accent">03</span>
          <span className="px-2 text-border" aria-hidden="true">
            /
          </span>
          Contact
        </p>
      </div>

      <TextReveal
        as="h1"
        id="contact-hero-title"
        className="t-h1 mt-10 text-text-primary"
      >
        Parlons de votre projet.
      </TextReveal>

      <MotionReveal delay={0.1}>
        <p className="t-lead measure mt-7">
          Décrivez votre situation, vos objectifs et vos contraintes. Plus
          c&apos;est concret, plus notre réponse le sera.
        </p>
      </MotionReveal>

      {/* Ce qui se passe après l'envoi — la seule question que se pose
          réellement quelqu'un devant un formulaire. */}
      <MotionReveal delay={0.18}>
        <ol className="mt-10 flex flex-col border-t border-border">
          {[
            "Nous lisons votre message et revenons vers vous sous 48 heures ouvrées.",
            CAL_URL
              ? "Un échange de 30 minutes pour cadrer le besoin, que vous pouvez réserver en ligne. Sans engagement."
              : "Un premier échange pour cadrer le besoin, sans engagement.",
            "Une proposition écrite, détaillée ligne par ligne.",
          ].map((step, i) => (
            <li
              key={step}
              className="flex gap-5 border-b border-border py-4 text-sm leading-relaxed text-text-secondary"
            >
              <span aria-hidden="true" className="t-tech shrink-0 pt-1 text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </MotionReveal>
    </div>
  );
}
