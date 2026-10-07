import { test, expect } from "@playwright/test";
import { jumpTo } from "./_utils";

test.describe("Header et navigation", () => {
  test("le lien d'évitement mène au contenu principal", async ({ page }) => {
    await page.goto("/services");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Aller au contenu principal" });
    await expect(skip).toBeFocused();
    await expect(skip).toHaveAttribute("href", "#main");
  });

  test("la barre se masque entièrement en descendant et revient en remontant", async ({ page }) => {
    await page.goto("/services");
    await page.waitForLoadState("networkidle");
    const header = page.locator("header");

    await jumpTo(page, 1600);
    // Masquée d'un bloc : plus aucun pixel (logo compris) dans le viewport.
    await expect.poll(async () => (await header.boundingBox())!.y + (await header.boundingBox())!.height).toBeLessThanOrEqual(1);

    await page.evaluate(() => window.scrollBy({ top: -200, behavior: "instant" }));
    await expect.poll(async () => (await header.boundingBox())!.y).toBeGreaterThanOrEqual(-1);

    await jumpTo(page, 0);
    await expect(header).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  });

  test("les liens principaux mènent aux bonnes pages", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    const scope = isMobile ? page.locator("#mobile-menu") : page.getByRole("navigation", { name: "Navigation principale" });

    await scope.getByRole("link", { name: "Studio" }).click();
    await expect(page).toHaveURL(/\/studio$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("menu mobile : ouverture, Échap, retour du focus, inert", async ({ page, isMobile }) => {
    test.skip(!isMobile, "menu mobile uniquement");
    await page.goto("/");
    const menu = page.locator("#mobile-menu");
    const button = page.getByRole("button", { name: "Ouvrir le menu" });

    await expect(menu).toHaveAttribute("inert", "");
    await button.click();
    await expect(menu).toBeVisible();
    await expect(menu).not.toHaveAttribute("inert", /.*/);
    await expect(page.getByRole("button", { name: "Fermer le menu" })).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    await expect(page.getByRole("button", { name: "Ouvrir le menu" })).toBeFocused();
    await expect(menu).toHaveAttribute("inert", "");
  });

  test("menu mobile : la navigation ferme le menu", async ({ page, isMobile }) => {
    test.skip(!isMobile, "menu mobile uniquement");
    await page.goto("/");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    await page.locator("#mobile-menu").locator("a[href='/contact']").first().click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.locator("#mobile-menu")).toBeHidden();
  });

  test("pied de page : liens légaux et e-mail", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "Mentions légales" })).toHaveAttribute("href", "/mentions-legales");
    await expect(footer.getByRole("link", { name: "Politique de confidentialité" })).toHaveAttribute("href", "/politique-de-confidentialite");
    await expect(footer.getByRole("link", { name: /contact\.agency@nexcy\.fr/ })).toHaveAttribute("href", /^mailto:/);
  });
});
