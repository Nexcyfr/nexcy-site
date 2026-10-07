import { test, expect } from "@playwright/test";
import {
  PUBLIC_ROUTES,
  collectConsoleErrors,
  hasHorizontalOverflow,
  HYDRATION_RE,
} from "./_utils";

test.describe("Routes publiques", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route} : 200, un seul h1, aucune erreur, aucun débordement`, async ({ page }) => {
      const getErrors = collectConsoleErrors(page);
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.waitForLoadState("networkidle");

      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main#main")).toHaveCount(1);
      expect(await hasHorizontalOverflow(page)).toBe(false);

      const errors = getErrors();
      expect(errors, errors.join(" | ")).toHaveLength(0);
      expect(errors.some((e) => HYDRATION_RE.test(e))).toBe(false);
    });
  }

  test("404 : page personnalisée, noindex, statut 404", async ({ page }) => {
    const response = await page.goto("/cette-page-n-existe-pas");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("n'existe pas");
    const robots = await page.locator('meta[name="robots"]').evaluateAll((els) => els.map((e) => e.getAttribute("content")));
    expect(robots.length).toBeGreaterThan(0);
    for (const r of robots) expect(r).toContain("noindex");
    await expect(page.getByRole("link", { name: "Retour à l'accueil" })).toBeVisible();
  });

  test("/render n'existe plus (harnais supprimé)", async ({ request }) => {
    const res = await request.get("/render/test");
    expect(res.status()).toBe(404);
  });
});
