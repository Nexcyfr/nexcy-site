import type { Metadata } from "next";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServiceBlock } from "@/components/services/ServiceBlock";
import { ServicesMaintenanceBlock } from "@/components/services/ServicesMaintenanceBlock";
import { CtaSection } from "@/components/ui/CtaSection";
import { serviceDetails } from "@/data/services";
import { buildMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Création de sites web sur mesure — NEXCY",
  description:
    "Création de sites web sur mesure, branding, SEO et automatisation. NEXCY accompagne les entreprises exigeantes dans la durée.",
  path: "/services",
  ogImage: "/assets/og/og-services.png",
});

/**
 * JSON-LD Service ×4 (les 4 services détaillés dans le contenu visible ;
 * maintenance exclue) + BreadcrumbList. `provider` référence l'Organization
 * globale par @id (pas de duplication). Aucun prix/note/avis/durée non vérifié.
 */
const servicesLd = {
  "@context": "https://schema.org",
  "@graph": [
    ...serviceDetails.map((s) => ({
      "@type": "Service",
      "@id": `${SITE_URL}/services#${s.slug}`,
      name: s.title,
      description: s.hook,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "France" },
    })),
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: `${SITE_URL}/services`,
        },
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
