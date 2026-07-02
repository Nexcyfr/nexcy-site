import type { Metadata } from "next";
import { StudioHero } from "@/components/studio/StudioHero";
import { StudioHistory } from "@/components/studio/StudioHistory";
import { StudioManifesto } from "@/components/studio/StudioManifesto";
import { StudioValues } from "@/components/studio/StudioValues";
import { StudioMethod } from "@/components/studio/StudioMethod";
import { StudioStandards } from "@/components/studio/StudioStandards";
import { CtaSection } from "@/components/ui/CtaSection";
import { ImmersiveBand } from "@/components/ui/ImmersiveBand";
import { buildMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Studio NEXCY — Vision, méthode et standards",
  description:
    "L'histoire, la vision, les standards et le fonctionnement de NEXCY. Une agence conçue pour l'exigence.",
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
      <StudioManifesto />
      <ImmersiveBand
        src="/assets/studio/precision-band.avif"
        alt="Matière minérale noire aux veines dorées"
      />
      <StudioValues />
      <StudioMethod />
      <StudioStandards />
      <CtaSection
        title="Un projet. Une vision. Une seule question : êtes-vous prêt à exiger davantage ?"
        buttonLabel="Démarrer un projet"
        buttonHref="/contact"
      />
    </>
  );
}
