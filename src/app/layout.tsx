import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

import { SmoothScroll } from "@/components/global/SmoothScroll";
import { Preloader } from "@/components/global/Preloader";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { SITE_URL } from "@/lib/utils";
import { CONTACT_EMAIL } from "@/data/navigation";

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NEXCY — Agence Web Premium à Bordeaux | Precision in Motion",
    template: "%s | NEXCY",
  },
  description:
    "NEXCY conçoit des sites web, identités visuelles et systèmes d'automatisation conçus avec précision pour les entreprises exigeantes. Basée à Bordeaux. Réponse sous 48h.",
  applicationName: "NEXCY",
  authors: [{ name: "NEXCY" }],
  creator: "NEXCY",
  publisher: "NEXCY",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "NEXCY",
    url: SITE_URL,
    images: [{ url: "/assets/og/og-home.png", width: 1200, height: 630, alt: "NEXCY" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
};

/** JSON-LD global — Organization + WebSite (Master Brief §21). */
const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NEXCY",
  url: SITE_URL,
  logo: `${SITE_URL}/assets/brand/logo-nexcy.svg`,
  description:
    "Agence digitale premium spécialisée en création de sites web, branding, SEO et automatisation. Basée à Bordeaux, France.",
  foundingDate: "2025",
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
  name: "NEXCY",
  url: SITE_URL,
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

        <Preloader />
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
