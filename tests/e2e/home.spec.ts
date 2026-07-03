import { test, expect } from "@playwright/test";
import {
  collectConsoleErrors,
  hasHorizontalOverflow,
  hasHydrationError,
} from "./_utils";

test.describe("Page d'accueil", () => {
  test("charge sans erreur console ni page error", async ({ page }) => {
    const getErrors = collectConsoleErrors(page);
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    const errors = getErrors();
    expect(errors, `Erreurs console : ${errors.join(" | ")}`).toHaveLength(0);
  });

  test("aucune erreur d'hydratation React", async ({ page }) => {
    const getErrors = collectConsoleErrors(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(
      hasHydrationError(getErrors()),
      "Erreur d'hydratation détectée",
    ).toBe(false);
  });

  test("H1 visible après animation", async ({ page }) => {
    await page.goto("/");
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 5_000 });
    // textContent() concatène les <span> sans espaces — on vérifie les mots clés
    const text = await h1.textContent();
    expect(text).toContain("Systèmes");
    expect(text).toContain("digitaux");
  });

  test("boutons CTA héro présents et bien liés", async ({ page }) => {
    await page.goto("/");
    // Scope sur le hero pour éviter la violation de mode strict (liens dans header/footer)
    const hero = page.locator("section[aria-label='Introduction']");
    const ctaProject = hero
      .getByRole("link", { name: /Démarrer un projet/i })
      .first();
    const ctaServices = hero
      .getByRole("link", { name: /Découvrir nos services/i })
      .first();
    await expect(ctaProject).toBeVisible({ timeout: 5_000 });
    await expect(ctaServices).toBeVisible();
    expect(await ctaProject.getAttribute("href")).toBe("/contact");
    expect(await ctaServices.getAttribute("href")).toBe("/services");
  });

  test("aucun overflow horizontal", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });

  test("reduced-motion : hero immédiatement visible, aucune animation de chargement", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 3_000 });
    const hero = page.locator("section[aria-label='Introduction']");
    await expect(
      hero.getByRole("link", { name: /Démarrer un projet/i }).first(),
    ).toBeVisible();
  });

  test("navigation clavier : Tab focalise un élément visible", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });

  test("navigation header : présente et accessible sur tous les appareils", async ({
    page,
    viewport,
  }) => {
    await page.goto("/");
    const isDesktop = (viewport?.width ?? 0) >= 1024;
    if (isDesktop) {
      // Desktop : nav pill fixe présente dans le DOM
      await expect(
        page.getByRole("navigation", { name: "Navigation principale" }),
      ).toBeAttached();
    }
    // Desktop et mobile : un lien Services existe (nav desktop ou footer)
    await expect(
      page.getByRole("link", { name: /services/i }).first(),
    ).toBeVisible();
  });

  test("récupération après resize : H1 et liens visibles", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Resize vers desktop large → tablet → retour desktop
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(500);
    await expect(page.locator("h1").first()).toBeVisible();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(300);
    await expect(page.locator("h1").first()).toBeVisible();
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });
});
