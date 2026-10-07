import type { Metadata } from "next";
import { LegalContent } from "@/components/legal/LegalContent";
import { loadLegal } from "@/lib/legal";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Mentions légales — NEXCY",
  description: "Mentions légales de NEXCY, agence digitale basée à Bordeaux.",
  path: "/mentions-legales",
});

export default function MentionsLegalesPage() {
  const blocks = loadLegal("mentions-legales");
  return (
    <section className="border-b border-border bg-black pb-24 pt-[calc(var(--header-h)+4rem)] md:pt-[calc(var(--header-h)+6rem)]">
      <div className="container-site">
        <LegalContent blocks={blocks} />
      </div>
    </section>
  );
}
