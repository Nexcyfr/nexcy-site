import { test, expect } from "@playwright/test";
import {
  collectConsoleErrors,
  hasHorizontalOverflow,
  hasHydrationError,
} from "./_utils";

test.describe("Page Services", () => {
  test("charge sans erreur console", async ({ page }) => {
    const getErrors = collectConsoleErrors(page);
    const response = await page.goto("/services");
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    const errors = getErrors();
    expect(errors, `Erreurs : ${errors.join(" | ")}`).toHaveLength(0);
  });

  test("aucune erreur d'hydratation", async ({ page }) => {
    const getErrors = collectConsoleErrors(page);
    await page.goto("/services");
    await page.waitForLoadState("networkidle");
    expect(hasHydrationError(getErrors())).toBe(false);
  });

  test("section hero visible avec H1", async ({ page }) => {
    await page.goto("/services");
    const hero = page.locator("[aria-labelledby='services-hero-title']");
    await expect(hero).toBeVisible();
    const h1 = hero.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 5_000 });
  });

  test("aucun overflow horizontal", async ({ page }) => {
    await page.goto("/services");
    await page.waitForLoadState("networkidle");
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });

  test("lien CTA contact présent", async ({ page }) => {
    await page.goto("/services");
    await page.waitForLoadState("networkidle");
    const ctaContact = page
      .getByRole("link", { name: /contact|projet|démarrer/i })
      .first();
    await expect(ctaContact).toBeVisible();
  });

  test("reduced-motion : hero visible sans animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/services");
    await page.waitForLoadState("domcontentloaded");
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 3_000 });
  });
});
