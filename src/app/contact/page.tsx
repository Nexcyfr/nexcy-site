import type { Metadata } from "next";
import Image from "next/image";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { buildMetadata } from "@/lib/metadata";
import { SITE_URL } from "@/lib/utils";
import { CONTACT_EMAIL } from "@/data/navigation";

export const metadata: Metadata = buildMetadata({
  title: "Contact — Démarrez votre projet avec NEXCY",
  description:
    "Décrivez votre projet à NEXCY. Réponse sous 48 heures ouvrées. Bordeaux, France.",
  path: "/contact",
  ogImage: "/assets/og/og-contact.png",
});

/** JSON-LD ContactPage — Master Brief §20. */
const contactLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact — NEXCY",
  url: `${SITE_URL}/contact`,
  mainEntity: {
    "@type": "Organization",
    name: "NEXCY",
    email: CONTACT_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bordeaux",
      addressCountry: "FR",
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }}
      />
      <section
        aria-labelledby="contact-hero-title"
        className="relative min-h-screen overflow-hidden border-b border-border bg-black pb-24 pt-40 md:pt-48"
      >
        {/* Matière discrète à gauche, fondue vers le noir (préserve la lisibilité du formulaire) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 hidden h-full w-1/2 lg:block"
        >
          <Image
            src="/assets/contact/bg.avif"
            alt=""
            fill
            loading="lazy"
            sizes="50vw"
            className="object-cover opacity-[0.12]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black" />
        </div>

        <div className="container-site relative z-10 grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          {/* Colonne gauche : intro + infos (sticky desktop) */}
          <div className="flex flex-col gap-12 lg:sticky lg:top-32 lg:h-fit">
            <ContactHero />
            <ContactInfo />
          </div>

          {/* Colonne droite : formulaire */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
