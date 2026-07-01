import type { Metadata } from "next";
import { LegalContent } from "@/components/legal/LegalContent";
import { loadLegal } from "@/lib/legal";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Politique de confidentialité | NEXCY",
  description:
    "Politique de confidentialité et traitement des données de NEXCY.",
  path: "/politique-de-confidentialite",
  noindex: true,
});

export default function PolitiqueConfidentialitePage() {
  const blocks = loadLegal("politique-de-confidentialite");
  return (
    <section className="border-b border-border bg-black pb-24 pt-40 md:pt-48">
      <div className="container-site">
        <LegalContent blocks={blocks} />
      </div>
    </section>
  );
}
