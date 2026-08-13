import { CtaSection } from "@/components/ui/CtaSection";

/** CTA final de la page d'accueil — Master Brief §13 (Section 6). */
export function HomeCTA() {
  return (
    <CtaSection
      title="Dites-nous où vous en êtes."
      subtitle="Un échange de trente minutes suffit pour savoir si nous sommes le bon interlocuteur — et pour vous le dire franchement si ce n'est pas le cas."
      buttonLabel="Démarrer un projet"
      buttonHref="/contact"
      note="Réponse sous 48 heures ouvrées · Aucun engagement"
    />
  );
}
