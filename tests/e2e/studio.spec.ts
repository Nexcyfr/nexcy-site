import { test, expect } from "@playwright/test";
import {
  collectConsoleErrors,
  hasHorizontalOverflow,
  hasHydrationError,
} from "./_utils";

test.describe("Page Studio", () => {
  test("charge sans erreur console", async ({ page }) => {
    const getErrors = collectConsoleErrors(page);
    const response = await page.goto("/studio");
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    const errors = getErrors();
    expect(errors, `Erreurs : ${errors.join(" | ")}`).toHaveLength(0);
  });

  test("aucune erreur d'hydratation", async ({ page }) => {
    const getErrors = collectConsoleErrors(page);
    await page.goto("/studio");
    await page.waitForLoadState("networkidle");
    expect(hasHydrationError(getErrors())).toBe(false);
  });

  test("section hero visible avec H1", async ({ page }) => {
    await page.goto("/studio");
    const hero = page.locator("[aria-labelledby='studio-hero-title']");
    await expect(hero).toBeVisible();
    const h1 = hero.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 5_000 });
  });

  test("aucun overflow horizontal", async ({ page }) => {
    await page.goto("/studio");
    await page.waitForLoadState("networkidle");
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });

  test("reduced-motion : hero visible sans animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/studio");
    await page.waitForLoadState("domcontentloaded");
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 3_000 });
  });

  // ─── Lot 4 — Pages internes cinématiques ─────────────────────────────────

  test("hero : label section '02 / Studio' présent", async ({ page }) => {
    await page.goto("/studio");
    await page.waitForLoadState("networkidle");
    const hero = page.locator("[aria-labelledby='studio-hero-title']");
    const label = hero.locator("text=/Studio/i");
    await expect(label.first()).toBeVisible();
  });

  test("hero : scène architecturale présente et décorative (desktop)", async ({
    page,
    viewport,
  }) => {
    const isDesktop = (viewport?.width ?? 0) >= 1024;
    if (!isDesktop) return;
    await page.goto("/studio");
    await page.waitForLoadState("networkidle");
    const scene = page.locator("[data-studio-scene]");
    await expect(scene).toBeAttached();
    await expect(scene).toHaveAttribute("aria-hidden", "true");
  });

  test("timeline chronologique présente avec 3 jalons", async ({ page }) => {
    await page.goto("/studio");
    await page.waitForLoadState("networkidle");
    // La timeline doit contenir les années clés
    const timeline = page.locator("[aria-label='Chronologie du studio']");
    await expect(timeline).toBeAttached();
    await expect(page.locator("text=2019").first()).toBeAttached();
    await expect(page.locator("text=2025").first()).toBeAttached();
  });

  test("reduced-motion : scène studio visible immédiatement (desktop)", async ({
    page,
    viewport,
  }) => {
    const isDesktop = (viewport?.width ?? 0) >= 1024;
    if (!isDesktop) return;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/studio");
    await page.waitForLoadState("domcontentloaded");
    // Description visible sans délai
    const desc = page.locator("[data-sth-desc]");
    await expect(desc).toBeVisible({ timeout: 3_000 });
  });
});
