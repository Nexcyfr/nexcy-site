import type { Metadata } from "next";
import { ServicesHero } from "@/components/services/ServicesHero";
import { OfferBlock } from "@/components/services/OfferBlock";
import { CapabilitiesSection } from "@/components/services/CapabilitiesSection";
import { CtaSection } from "@/components/ui/CtaSection";
import { offers } from "@/data/services";
import { buildMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Services — création de sites web et d'applications sur mesure | NEXCY",
  description:
    "NEXCY, studio digital à Bordeaux, conçoit et développe des sites web et des applications sur mesure : e-commerce, SaaS, plateformes métier, outils internes.",
  path: "/services",
  ogImage: "/assets/og/og-services.png",
});

/**
 * JSON-LD : liste ordonnée des deux offres (chacune renvoie vers sa page, qui
 * porte son propre schéma Service) + fil d'Ariane. Aucun prix, note, avis ni
 * durée non vérifié.
 */
const servicesLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      name: "Offres NEXCY",
      itemListElement: offers.map((o, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: o.title,
        url: `${SITE_URL}/services/${o.slug}`,
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
      {offers.map((offer, i) => (
        <OfferBlock key={offer.slug} offer={offer} reversed={i % 2 === 1} />
      ))}
      <CapabilitiesSection index="03" />
      <CtaSection
        title="Un site ou une application à concevoir ?"
        subtitle="Décrivez votre projet. Nous vous disons franchement si nous sommes le bon interlocuteur, et comment nous procéderions."
        buttonLabel="Démarrer un projet"
        buttonHref="/contact"
        note="Réponse sous 48 heures ouvrées · Aucun engagement"
      />
    </>
  );
}
