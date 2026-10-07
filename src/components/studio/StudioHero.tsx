import { PageHero } from "@/components/ui/PageHero";

/** Ouverture de la page Studio. */
export function StudioHero() {
  return (
    <PageHero
      index="02"
      kicker="Studio"
      titleId="studio-hero-title"
      title="Un studio indépendant, à Bordeaux."
      lead={
        <p>
          NEXCY est un studio volontairement compact. Pas d&apos;intermédiaire
          commercial : vous échangez avec la personne qui conçoit et pilote
          votre projet, de la première discussion à la mise en ligne, puis dans
          la durée.
        </p>
      }
      facts={[
        { label: "Forme", value: "Entrepreneur individuel" },
        { label: "Activité depuis", value: "Février 2025" },
        { label: "Base", value: "Bordeaux, France" },
        { label: "Interlocuteur", value: "Un seul, du début à la fin" },
      ]}
    />
  );
}
