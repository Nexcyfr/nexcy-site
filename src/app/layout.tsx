import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

import { SmoothScroll } from "@/components/global/SmoothScroll";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { SITE_URL } from "@/lib/utils";
import { CONTACT_EMAIL } from "@/data/navigation";

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NEXCY — Studio digital à Bordeaux : sites web, IA et automatisation",
    template: "%s | NEXCY",
  },
  description:
    "NEXCY, studio digital à Bordeaux : sites web, SEO, automatisation et agents IA pour entreprises exigeantes. Un interlocuteur unique, réponse sous 48 h.",
  applicationName: "NEXCY",
  authors: [{ name: "NEXCY" }],
  creator: "NEXCY",
  publisher: "NEXCY",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "NEXCY",
    url: SITE_URL,
    images: [
      { url: "/assets/og/og-home.png", width: 1200, height: 630, alt: "NEXCY — Studio digital à Bordeaux" },
    ],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
  viewportFit: "cover",
};

/** JSON-LD global — Organization + WebSite (Master Brief §21). */
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "NEXCY",
  url: SITE_URL,
  logo: `${SITE_URL}/assets/brand/icon-512.png`,
  description:
    "Studio digital basé à Bordeaux : création de sites web, branding, SEO, automatisation et agents IA.",
  foundingDate: "2025-02-01",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bordeaux",
    addressCountry: "FR",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: CONTACT_EMAIL,
    contactType: "customer service",
  },
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "NEXCY",
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={GeistSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </head>
      <body className="bg-black text-text-primary antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-btn focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
        >
          Aller au contenu principal
        </a>

        <SmoothScroll>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScroll>

        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
