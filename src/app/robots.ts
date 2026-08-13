import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";

/** robots.txt — Master Brief §19. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /render/ est un harnais de rendu réservé au dev : il renvoie 404 en
      // production, mais on l'exclut aussi explicitement du crawl.
      disallow: ["/api/", "/render/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
