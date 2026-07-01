import type { Metadata } from "next";
import { ServicesHero } from "@/components/services/ServicesHero";
import { ServiceBlock } from "@/components/services/ServiceBlock";
import { ServicesMaintenanceBlock } from "@/components/services/ServicesMaintenanceBlock";
import { CtaSection } from "@/components/ui/CtaSection";
import { serviceDetails } from "@/data/services";
import { buildMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Services — Création Web, Branding, SEO & IA | NEXCY Bordeaux",
  description:
    "Création de sites web sur mesure, branding, SEO et automatisation IA. NEXCY accompagne les entreprises exigeantes dans la durée.",
  path: "/services",
  ogImage: "/assets/og/og-services.png",
});

/** JSON-LD Service (×5) + BreadcrumbList — Master Brief §20 / §21. */
const servicesLd = {
  "@context": "https://schema.org",
  "@graph": [
    ...serviceDetails.map((s) => ({
      "@type": "Service",
      name: s.title,
      description: s.hook,
      provider: { "@type": "Organization", name: "NEXCY", url: SITE_URL },
      areaServed: "FR",
    })),
    {
      "@type": "Service",
      name: "Accompagnement continu",
      description: "Abonnement mensuel d'accompagnement et de maintenance.",
      provider: { "@type": "Organization", name: "NEXCY", url: SITE_URL },
      areaServed: "FR",
    },
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
        title="Un projet en tête ? Parlons-en."
        buttonLabel="Discuter de votre projet"
        buttonHref="/contact"
        note="Réponse sous 48 heures. Aucun engagement."
      />
    </>
  );
}
