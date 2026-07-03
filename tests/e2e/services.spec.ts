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

  // ─── Lot 4 — Pages internes cinématiques ─────────────────────────────────

  test("hero : label section '01 / Expertises' présent", async ({ page }) => {
    await page.goto("/services");
    await page.waitForLoadState("networkidle");
    const hero = page.locator("[aria-labelledby='services-hero-title']");
    const label = hero.locator("text=/Expertises/i");
    await expect(label.first()).toBeVisible();
  });

  test("hero : scène réseau présente et décorative (desktop)", async ({
    page,
    viewport,
  }) => {
    const isDesktop = (viewport?.width ?? 0) >= 1024;
    if (!isDesktop) return;
    await page.goto("/services");
    await page.waitForLoadState("networkidle");
    const scene = page.locator("[data-services-scene]");
    await expect(scene).toBeAttached();
    await expect(scene).toHaveAttribute("aria-hidden", "true");
  });

  test("hero : aucun logo N codé dans la scène services", async ({ page }) => {
    await page.goto("/services");
    const monoEl = await page.locator("[data-mono]").count();
    expect(monoEl).toBe(0);
  });

  test("reduced-motion : scène services visible immédiatement (desktop)", async ({
    page,
    viewport,
  }) => {
    const isDesktop = (viewport?.width ?? 0) >= 1024;
    if (!isDesktop) return;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/services");
    await page.waitForLoadState("domcontentloaded");
    // La zone sous le titre doit être visible sans délai
    const desc = page.locator("[data-sh-below]");
    await expect(desc).toBeVisible({ timeout: 3_000 });
  });
});
