import { test, expect } from "@playwright/test";
import {
  collectConsoleErrors,
  hasHorizontalOverflow,
  hasHydrationError,
} from "./_utils";

test.describe("Page Contact", () => {
  test("charge sans erreur console", async ({ page }) => {
    const getErrors = collectConsoleErrors(page);
    const response = await page.goto("/contact");
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    const errors = getErrors();
    expect(errors, `Erreurs : ${errors.join(" | ")}`).toHaveLength(0);
  });

  test("aucune erreur d'hydratation", async ({ page }) => {
    const getErrors = collectConsoleErrors(page);
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
    expect(hasHydrationError(getErrors())).toBe(false);
  });

  test("formulaire de contact présent", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("form").first()).toBeVisible();
  });

  test("champs de formulaire focusables (accessibilité clavier)", async ({
    page,
  }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
    const inputs = page.locator("input, textarea").first();
    await expect(inputs).toBeVisible();
    await inputs.focus();
    await expect(inputs).toBeFocused();
  });

  test("bouton de soumission présent et accessible", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
    const submit = page.locator('[type="submit"]').first();
    await expect(submit).toBeVisible();
    await expect(submit).toBeEnabled();
  });

  test("aucun overflow horizontal", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });

  test("section hero visible avec titre", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
    const hero = page.locator("[aria-labelledby='contact-hero-title']");
    await expect(hero).toBeVisible();
  });
});
