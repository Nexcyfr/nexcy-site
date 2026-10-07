import type { Metadata } from "next";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServiceBlock } from "@/components/services/ServiceBlock";
import { ServicesMaintenanceBlock } from "@/components/services/ServicesMaintenanceBlock";
import { CtaSection } from "@/components/ui/CtaSection";
import { serviceDetails } from "@/data/services";
import { buildMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Services — sites web, SEO, automatisation et IA à Bordeaux | NEXCY",
  description:
    "Création de sites web, branding, SEO, automatisation et agents IA, plus un accompagnement continu. Studio digital à Bordeaux, interventions dans toute la France.",
  path: "/services",
  ogImage: "/assets/og/og-services.png",
});

/**
 * JSON-LD : liste ordonnée des expertises (chacune renvoie vers sa page, qui
 * porte son propre schéma Service) + fil d'Ariane. Aucun prix, note, avis ni
 * durée non vérifié.
 */
const servicesLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      name: "Expertises NEXCY",
      itemListElement: serviceDetails.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.title,
        url: `${SITE_URL}/services/${s.slug}`,
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
      ],
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesLd) }}
      />
      <ServicesHero />
      {serviceDetails.map((service, i) => (
        <ServiceBlock key={service.slug} service={service} reversed={i % 2 === 1} />
      ))}
      <ServicesMaintenanceBlock />
      <CtaSection
        title="Un projet à faire avancer ?"
        subtitle="Parlons de vos objectifs et construisons une réponse digitale à la hauteur de vos ambitions."
        buttonLabel="Démarrer un projet"
        buttonHref="/contact"
      />
    </>
  );
}
