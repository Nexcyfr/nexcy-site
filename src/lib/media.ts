/**
 * Utilitaires de sourcing média (Master Brief §34).
 * Usage : scripts de build/dev côté serveur uniquement — jamais côté client
 * (les clés API n'ont pas de préfixe NEXT_PUBLIC_).
 *
 * Règles appliquées : licence vérifiable, source_url conservée, pas de
 * photographie de personnes, pas de stock générique, univers sombre/architectural.
 */

export interface MediaAsset {
  id: string;
  url: string;
  width: number;
  height: number;
  license: string;
  sourceUrl: string;
  attribution: string | null;
  provider: "pexels" | "unsplash" | "pixabay";
}

/** Recherche Pexels (pas d'attribution obligatoire, licence Pexels). */
export async function searchPexels(
  query: string,
  perPage = 5,
): Promise<MediaAsset[]> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];

  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("orientation", "landscape");

  const res = await fetch(url, { headers: { Authorization: key } });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    photos?: Array<{
      id: number;
      width: number;
      height: number;
      url: string;
      photographer: string;
      src: { large2x: string };
    }>;
  };

  return (data.photos ?? []).map((p) => ({
    id: `pexels-${p.id}`,
    url: p.src.large2x,
    width: p.width,
    height: p.height,
    license: "Pexels License",
    sourceUrl: p.url,
    attribution: p.photographer,
    provider: "pexels",
  }));
}

/** Recherche Unsplash (attribution recommandée). */
export async function searchUnsplash(
  query: string,
  perPage = 5,
): Promise<MediaAsset[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return [];

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("orientation", "landscape");

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}` },
  });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    results?: Array<{
      id: string;
      width: number;
      height: number;
      links: { html: string };
      user: { name: string };
      urls: { regular: string };
    }>;
  };

  return (data.results ?? []).map((p) => ({
    id: `unsplash-${p.id}`,
    url: p.urls.regular,
    width: p.width,
    height: p.height,
    license: "Unsplash License",
    sourceUrl: p.links.html,
    attribution: p.user.name,
    provider: "unsplash",
  }));
}
