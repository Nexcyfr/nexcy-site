import type { MetadataRoute } from "next";

/** manifest.json — Master Brief §98. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NEXCY — Studio web à Bordeaux",
    short_name: "NEXCY",
    description:
      "Studio digital à Bordeaux. Création de sites web et développement d'applications sur mesure.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    lang: "fr",
    icons: [
      { src: "/assets/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/assets/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
