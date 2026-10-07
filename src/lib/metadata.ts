import type { Metadata } from "next";
import { SITE_URL } from "@/lib/utils";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noindex?: boolean;
}

/**
 * Construit un objet Metadata Next.js cohérent (canonical, OpenGraph, Twitter).
 * Master Brief §19 / §20.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage = "/assets/og/og-home.png",
  noindex = false,
}: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    // Titre absolu : évite que le title.template du layout (« %s | NEXCY »)
    // s'ajoute à un titre qui contient déjà la marque (Master Brief §20).
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url,
      siteName: "NEXCY",
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: ogImage, alt: title }],
    },
  };
}
