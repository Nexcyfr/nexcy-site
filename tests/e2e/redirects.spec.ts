import { test, expect } from "@playwright/test";

// Anciennes URLs de l'offre (cinq services) : redirections permanentes (308),
// jamais de 404, vers la page qui reprend le sujet.
const REDIRECTS: [string, string][] = [
  ["/services/creation-web", "/services/sites-web"],
  ["/services/branding", "/services/sites-web"],
  ["/services/seo", "/services/sites-web"],
  ["/services/referencement", "/services/sites-web"],
  ["/services/automatisation-ia", "/services/applications"],
  ["/services/automatisation", "/services/applications"],
  ["/services/ia", "/services/applications"],
  ["/services/agents-ia", "/services/applications"],
  ["/services/maintenance", "/services"],
];

test.describe("Redirections des anciennes URLs", () => {
  for (const [from, to] of REDIRECTS) {
    test(`${from} → ${to} (308)`, async ({ request }) => {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status()).toBe(308);
      expect(new URL(res.headers()["location"], "http://x").pathname).toBe(to);
    });
  }

  test("la destination finale répond 200 dans le navigateur", async ({ page }) => {
    const res = await page.goto("/services/seo");
    expect(res?.status()).toBe(200);
    await expect(page).toHaveURL(/\/services\/sites-web$/);
  });
});
