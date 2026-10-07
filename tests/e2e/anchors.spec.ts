import { test, expect } from "@playwright/test";

const ANCHORS = [
  "/services#offre-sites-web",
  "/services#offre-applications",
  "/mentions-legales#section-5",
  "/politique-de-confidentialite#section-3",
];

test.describe("Ancres", () => {
  for (const url of ANCHORS) {
    test(`${url} existe et atterrit sous le header`, async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(1200); // fin du défilement fluide
      const id = url.split("#")[1];
      const target = page.locator(`#${id}`);
      await expect(target).toHaveCount(1);
      const top = await target.evaluate((el) => el.getBoundingClientRect().top);
      // Sous la barre fixe (≈ 73 px) et bien visible, sans offset ad hoc.
      expect(top).toBeGreaterThanOrEqual(60);
      expect(top).toBeLessThan(220);
    });
  }

  test("tous les liens internes avec ancre pointent vers un id existant", async ({ page }) => {
    for (const route of ["/", "/services", "/studio", "/contact"]) {
      await page.goto(route);
      const hrefs = await page.locator('a[href*="#"]').evaluateAll((as) =>
        as.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""),
      );
      for (const href of hrefs) {
        const [path, hash] = href.split("#");
        if (!hash || (path && path !== route)) continue;
        await expect(page.locator(`[id="${hash}"]`), `${route} → #${hash}`).toHaveCount(1);
      }
    }
  });
});
