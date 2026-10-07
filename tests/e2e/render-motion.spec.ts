import { test, expect } from "@playwright/test";
import { collectConsoleErrors } from "./_utils";

// Cette suite s'exécute uniquement sur le projet desktop (1440×900).
// La route /render/motion est DEV-uniquement et retourne 404 en production.
test.describe("/render/motion — Motion System V3 (DEV)", () => {
  test("page accessible en mode développement", async ({ page }) => {
    const response = await page.goto("/render/motion");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1").first()).toContainText("Motion System V3");
  });

  test("sections MotionReveal, TextReveal, MediaReveal visibles", async ({
    page,
  }) => {
    await page.goto("/render/motion");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("#motionreveal")).toBeVisible();
    await expect(page.locator("#textreveal")).toBeVisible();
    await expect(page.locator("#mediareveal")).toBeVisible();
  });

  test("section tokens et easings visible", async ({ page }) => {
    await page.goto("/render/motion");
    await expect(page.locator("#tokens")).toBeVisible();
    const text = await page.locator("#tokens").textContent();
    expect(text).toMatch(/cinematic|standard|snappy/);
  });

  test("ScrollTrigger counter exposé via window.__stCount", async ({
    page,
  }) => {
    await page.goto("/render/motion");
    await page.waitForLoadState("networkidle");
    const count = await page.evaluate(
      () => (window as Window & { __stCount?: () => number }).__stCount?.() ?? -1,
    );
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("aucune erreur console critique", async ({ page }) => {
    const getErrors = collectConsoleErrors(page);
    await page.goto("/render/motion");
    await page.waitForLoadState("networkidle");
    const errors = getErrors();
    expect(errors, `Erreurs : ${errors.join(" | ")}`).toHaveLength(0);
  });

  test("reduced-motion : éléments immédiatement visibles", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/render/motion");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("#tokens")).toBeVisible({ timeout: 3_000 });
  });
});
