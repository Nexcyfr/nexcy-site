import { PageHero } from "@/components/ui/PageHero";

/** Ouverture de la page Services : deux métiers, un seul niveau d'exigence. */
export function ServicesHero() {
  return (
    <PageHero
      index="01"
      kicker="Services"
      titleId="services-hero-title"
      title="Deux métiers. Un seul niveau d'exigence."
      lead={
        <p>
          NEXCY conçoit et développe des sites web et des applications sur
          mesure. Design, développement, performance et sécurité sont réunis
          dans un même studio, du premier échange à la mise en ligne.
        </p>
      }
      facts={[
        { label: "Offres", value: "Sites web · Applications" },
        { label: "Interlocuteur", value: "Un seul, du début à la fin" },
        { label: "Délai de réponse", value: "48 heures ouvrées" },
        { label: "Zone d'intervention", value: "Bordeaux, France entière" },
      ]}
    />
  );
}
