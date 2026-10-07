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

  // ─── Lot 4 — Pages internes cinématiques ─────────────────────────────────

  test("hero : label section '03 / Contact' présent", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
    // Scoper à la section principale — le lien nav "Contact" est hors de cette zone
    const section = page.locator("[aria-labelledby='contact-hero-title']");
    // La SectionLabel contient "03" (préfixe doré) visible dans la section
    await expect(section.locator("p").filter({ hasText: "03" }).first()).toBeVisible();
  });

  test("hero : motif de convergence présent et décoratif", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForLoadState("networkidle");
    const scene = page.locator("[data-contact-scene]");
    await expect(scene).toBeAttached();
    await expect(scene).toHaveAttribute("aria-hidden", "true");
  });

  test("hero : aucun logo N codé dans le motif contact", async ({ page }) => {
    await page.goto("/contact");
    const monoEl = await page.locator("[data-mono]").count();
    expect(monoEl).toBe(0);
  });

  test("reduced-motion : hero contact visible immédiatement", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/contact");
    await page.waitForLoadState("domcontentloaded");
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 3_000 });
  });
});
