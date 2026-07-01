import { CtaSection } from "@/components/ui/CtaSection";

/** CTA final de la page d'accueil — Master Brief §13 (Section 6). */
export function HomeCTA() {
  return (
    <CtaSection
      title="Votre projet mérite mieux que la moyenne."
      buttonLabel="Parlez-nous de votre projet"
      buttonHref="/contact"
      note="Réponse sous 48 heures. Aucun engagement."
    />
  );
}
