import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";
import { offers } from "@/data/services";

/**
 * Sitemap — Master Brief §19. Pages légales en priorité 0.3.
 * `lastModified` = dates STABLES (pas `new Date()` au build, qui produirait un
 * signal de fraîcheur bruité à chaque déploiement). À mettre à jour manuellement
 * lorsqu'une page change réellement.
 */
const LAST_MODIFIED: Record<string, string> = {
  "/": "2026-10-07",
  "/services": "2026-10-07",
  "/services/sites-web": "2026-10-07",
  "/services/applications": "2026-10-07",
  "/studio": "2026-10-07",
  "/contact": "2026-10-07",
  "/mentions-legales": "2026-06-25",
  "/politique-de-confidentialite": "2026-06-25",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (
    path: string,
    priority: number,
    frequency: "monthly" | "yearly",
  ): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${path}`,
    lastModified: LAST_MODIFIED[path],
    changeFrequency: frequency,
    priority,
  });

  return [
    page("/", 1, "monthly"),
    page("/services", 0.8, "monthly"),
    ...offers.map((o) => page(`/services/${o.slug}`, 0.8, "monthly")),
    page("/studio", 0.7, "monthly"),
    page("/contact", 0.8, "monthly"),
    page("/mentions-legales", 0.3, "yearly"),
    page("/politique-de-confidentialite", 0.3, "yearly"),
  ];
}
