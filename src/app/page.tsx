import type { Metadata } from "next";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeServices } from "@/components/home/HomeServices";
import { HomeShowcase } from "@/components/home/HomeShowcase";
import { HomeMethod } from "@/components/home/HomeMethod";
import { HomeReassurance } from "@/components/home/HomeReassurance";
import { HomeCTA } from "@/components/home/HomeCTA";
import { ImmersiveBand } from "@/components/ui/ImmersiveBand";
import { buildMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/utils";
import { CONTACT_EMAIL } from "@/data/navigation";

export const metadata: Metadata = buildMetadata({
  title: "NEXCY — Agence Web Premium à Bordeaux | Precision in Motion",
  description:
    "NEXCY conçoit des sites web, identités visuelles et systèmes digitaux d'un niveau rare pour les entreprises exigeantes. Basée à Bordeaux. Réponse sous 48h.",
  path: "/",
  ogImage: "/assets/og/og-home.png",
});

/** JSON-LD LocalBusiness — page Accueil (Master Brief §21). */
const localBusinessLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "NEXCY",
  url: SITE_URL,
  description: "Agence web premium à Bordeaux",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bordeaux",
    addressRegion: "Nouvelle-Aquitaine",
    addressCountry: "FR",
  },
  email: CONTACT_EMAIL,
  priceRange: "€€€",
  openingHours: "Mo-Fr 09:00-18:00",
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
      />
      <HomeHero />
      <HomeServices />
      <HomeShowcase />
      <ImmersiveBand
        src="/assets/home/immersive-light.avif"
        alt="Traînées de lumière sur fond noir"
        statement="Precision in Motion"
      />
      <HomeMethod />
      <HomeReassurance />
      <HomeCTA />
    </>
  );
}
