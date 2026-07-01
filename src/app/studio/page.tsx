import type { Metadata } from "next";
import { StudioHero } from "@/components/studio/StudioHero";
import { StudioManifesto } from "@/components/studio/StudioManifesto";
import { StudioValues } from "@/components/studio/StudioValues";
import { StudioMethod } from "@/components/studio/StudioMethod";
import { CtaSection } from "@/components/ui/CtaSection";
import { ImmersiveBand } from "@/components/ui/ImmersiveBand";
import { buildMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Studio — NEXCY, Agence Digitale Premium à Bordeaux",
  description:
    "L'histoire, la vision et les valeurs de NEXCY. Une agence digitale conçue pour l'exigence, basée à Bordeaux.",
  path: "/studio",
  ogImage: "/assets/og/og-studio.png",
});

/** JSON-LD AboutPage + Organization — Master Brief §20. */
const aboutLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Studio — NEXCY",
  url: `${SITE_URL}/studio`,
  about: {
    "@type": "Organization",
    name: "NEXCY",
    url: SITE_URL,
    foundingDate: "2019",
    description:
      "Agence digitale premium à Bordeaux, conçue pour l'exigence.",
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
      <StudioManifesto />
      <ImmersiveBand
        src="/assets/studio/precision-band.avif"
        alt="Matière minérale noire aux veines dorées"
      />
      <StudioValues />
      <StudioMethod />
      <CtaSection
        title="Un projet. Une vision. Une seule question : êtes-vous prêt à exiger davantage ?"
        buttonLabel="Démarrer une conversation"
        buttonHref="/contact"
      />
    </>
  );
}
