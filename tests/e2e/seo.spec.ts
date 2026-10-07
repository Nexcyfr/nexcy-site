import { test, expect } from "@playwright/test";
import { PUBLIC_ROUTES } from "./_utils";

test.describe("SEO et métadonnées", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route} : title, description, canonical, Open Graph, JSON-LD`, async ({ page, request }) => {
      await page.goto(route);

      const title = await page.title();
      expect(title.length).toBeGreaterThan(10);
      expect(title.length).toBeLessThanOrEqual(75);

      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description!.length).toBeGreaterThan(50);
      expect(description!.length).toBeLessThanOrEqual(165);

      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toMatch(/^https?:\/\/[^/]+(\/.*)?$/);
      expect(new URL(canonical!).pathname).toBe(route);

      await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");

      // L'image Open Graph existe réellement et fait 1200 x 630.
      const og = await page.locator('meta[property="og:image"]').getAttribute("content");
      const res = await request.get(new URL(og!).pathname);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("image/png");

      // Chaque bloc JSON-LD est un JSON valide.
      const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(blocks.length).toBeGreaterThan(0);
      for (const b of blocks) expect(() => JSON.parse(b)).not.toThrow();
    });
  }

  test("titres uniques sur tout le site", async ({ page }) => {
    const titles = new Set<string>();
    for (const route of PUBLIC_ROUTES) {
      await page.goto(route);
      titles.add(await page.title());
    }
    expect(titles.size).toBe(PUBLIC_ROUTES.length);
  });

  test("robots.txt déclare le sitemap et bloque l'API", async ({ request }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const txt = await res.text();
    expect(txt).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);
    expect(txt).toContain("Disallow: /api/");
  });

  test("sitemap.xml liste toutes les pages publiques", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const route of PUBLIC_ROUTES) {
      const loc = route === "/" ? /<loc>https?:\/\/[^<]+\/<\/loc>/ : new RegExp(`<loc>https?://[^<]+${route}</loc>`);
      expect(xml, route).toMatch(loc);
    }
  });

  test("les pages de service portent un fil d'Ariane et un schéma Service", async ({ page }) => {
    await page.goto("/services/seo");
    const blocks = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((b) => JSON.parse(b));
    const ld = blocks.find((b) => Array.isArray(b["@graph"]))!;
    const types = ld["@graph"].map((n: { "@type": string }) => n["@type"]);
    expect(types).toEqual(expect.arrayContaining(["Service", "BreadcrumbList"]));
  });

  test("en-têtes de sécurité présents", async ({ request }) => {
    const res = await request.get("/");
    const h = res.headers();
    expect(h["x-content-type-options"]).toBe("nosniff");
    expect(h["x-frame-options"]).toBe("DENY");
    expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(h["strict-transport-security"]).toContain("max-age=");
    expect(h["x-powered-by"]).toBeUndefined();
    const csp = h["content-security-policy"];
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).not.toContain("wasm-unsafe-eval");
    expect(csp).not.toMatch(/https:\/\/(?!challenges\.cloudflare\.com|plausible\.io)[a-z.]+/);
  });
});
