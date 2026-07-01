import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";

/** Sitemap dynamique — Master Brief §19. Pages légales en priorité 0.3. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (
    path: string,
    priority: number,
    frequency: "monthly" | "yearly",
  ): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: frequency,
    priority,
  });

  return [
    page("/", 1, "monthly"),
    page("/services", 0.8, "monthly"),
    page("/studio", 0.7, "monthly"),
    page("/contact", 0.8, "monthly"),
    page("/mentions-legales", 0.3, "yearly"),
    page("/politique-de-confidentialite", 0.3, "yearly"),
  ];
}
