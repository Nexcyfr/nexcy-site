import type { Metadata } from "next";
import { LegalContent } from "@/components/legal/LegalContent";
import { loadLegal } from "@/lib/legal";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Mentions légales | NEXCY",
  description: "Mentions légales de NEXCY, agence digitale basée à Bordeaux.",
  path: "/mentions-legales",
  noindex: true,
});

export default function MentionsLegalesPage() {
  const blocks = loadLegal("mentions-legales");
  return (
    <section className="border-b border-border bg-black pb-24 pt-40 md:pt-48">
      <div className="container-site">
        <LegalContent blocks={blocks} />
      </div>
    </section>
  );
}
