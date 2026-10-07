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
          NEXCY est une structure volontairement petite. Pas d&apos;intermédiaire
          commercial, pas de sous-traitance opaque : la personne qui conçoit est
          celle qui construit, et celle qui répondra dans six mois.
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
