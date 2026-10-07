import { PageHero } from "@/components/ui/PageHero";

/** Ouverture de la page Services. */
export function ServicesHero() {
  return (
    <PageHero
      index="01"
      kicker="Expertises"
      titleId="services-hero-title"
      title="Cinq domaines, une seule exigence."
      lead={
        <p>
          Création web, branding, référencement, automatisation et intelligence
          artificielle, accompagnement continu. Chaque domaine se prend seul ;
          ensemble, ils forment un système cohérent.
        </p>
      }
      facts={[
        { label: "Domaines", value: "Cinq" },
        { label: "Base technique", value: "Documentée, reprenable" },
        { label: "Délai de réponse", value: "48 heures ouvrées" },
        { label: "Zone d'intervention", value: "France entière" },
      ]}
    />
  );
}
