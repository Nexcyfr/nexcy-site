import type { Metadata } from "next";
import { StudioHero } from "@/components/studio/StudioHero";
import { StudioHistory } from "@/components/studio/StudioHistory";
import { StudioTimeline } from "@/components/studio/StudioTimeline";
import { StudioManifesto } from "@/components/studio/StudioManifesto";
import { StudioValues } from "@/components/studio/StudioValues";
import { StudioMethod } from "@/components/studio/StudioMethod";
import { StudioStandards } from "@/components/studio/StudioStandards";
import { CtaSection } from "@/components/ui/CtaSection";
import { buildMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Le studio NEXCY — vision, méthode et standards à Bordeaux",
  description:
    "L'histoire, la vision, la méthode et les standards de NEXCY, studio digital indépendant à Bordeaux. Un interlocuteur unique, une exigence assumée.",
  path: "/studio",
  ogImage: "/assets/og/og-studio.png",
});

/**
 * JSON-LD AboutPage — référence l'Organization globale par @id (pas de
 * duplication de l'objet Organization défini dans le layout).
 */
const aboutLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Studio NEXCY",
  url: `${SITE_URL}/studio`,
  about: { "@id": `${SITE_URL}/#organization` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Studio", item: `${SITE_URL}/studio` },
    ],
  },
};

export default function StudioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutLd) }}
      />
      <StudioHero />
      <StudioHistory />
      <StudioTimeline />
      <StudioManifesto />
      <StudioValues />
      <StudioMethod />
      <StudioStandards />
      <CtaSection
        title="Travaillons ensemble."
        subtitle="Dites-nous où vous en êtes. Nous vous dirons franchement si nous sommes le bon interlocuteur."
        buttonLabel="Démarrer un projet"
        buttonHref="/contact"
      />
    </>
  );
}
