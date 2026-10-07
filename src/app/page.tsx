import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { HomePosition } from "@/components/home/HomePosition";
import { HomeExpertise } from "@/components/home/HomeExpertise";
import { HomeMethod } from "@/components/home/HomeMethod";
import { HomeEngagements } from "@/components/home/HomeEngagements";
import { HomeStudio } from "@/components/home/HomeStudio";
import { HomeCTA } from "@/components/home/HomeCTA";
import { buildMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/utils";
import { CONTACT_EMAIL } from "@/data/navigation";

export const metadata: Metadata = buildMetadata({
  title: "NEXCY — Agence web premium à Bordeaux",
  description:
    "NEXCY conçoit des sites web, identités visuelles et systèmes d'automatisation conçus avec précision pour les entreprises exigeantes. Basée à Bordeaux. Réponse sous 48h.",
  path: "/",
  ogImage: "/assets/og/og-home.png",
});

/**
 * JSON-LD ProfessionalService — page Accueil.
 * Remplace LocalBusiness : uniquement des champs vérifiés (pas d'horaires ni de
 * priceRange non confirmés ; NEXCY n'est pas un établissement recevant du public).
 */
const professionalServiceLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#professionalservice`,
  name: "NEXCY",
  url: SITE_URL,
  description:
    "Agence digitale premium à Bordeaux — création de sites web, branding, SEO et automatisation.",
  areaServed: { "@type": "Country", name: "France" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bordeaux",
    addressRegion: "Nouvelle-Aquitaine",
    addressCountry: "FR",
  },
  email: CONTACT_EMAIL,
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceLd) }}
      />
      <HomeHero />
      <HomePosition />
      <HomeExpertise />
      <HomeMethod />
      <HomeEngagements />
      <HomeStudio />
      <HomeCTA />
    </>
  );
}
