import { test, expect } from "@playwright/test";
import { jumpTo } from "./_utils";

test.describe("Accueil", () => {
  test("le hero porte le message, les deux actions et le plan", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("La complexité, mise en ordre.");
    const hero = page.locator("section[aria-labelledby='hero-title']");
    await expect(hero.getByRole("link", { name: "Démarrer un projet" })).toHaveAttribute("href", "/contact");
    await expect(hero.getByRole("link", { name: "Voir les expertises" })).toHaveAttribute("href", "/services");
    await expect(hero.locator("canvas")).toHaveCount(1);
    await expect(hero.locator("canvas")).toHaveAttribute("aria-hidden", "true");
  });

  test("le récit du hero progresse avec le scroll", async ({ page, isMobile }) => {
    test.skip(isMobile, "vérifié sur desktop (le rail de phases est masqué en mobile)");
    await page.goto("/");
    const caption = page.locator("section[aria-labelledby='hero-title'] p[aria-hidden='true']").first();
    const first = await caption.textContent();
    const travel = await page.evaluate(() => {
      const s = document.querySelector("section[aria-labelledby='hero-title']") as HTMLElement;
      return s.offsetHeight - window.innerHeight;
    });
    await jumpTo(page, Math.round(travel * 0.6));
    await expect.poll(async () => caption.textContent()).not.toBe(first);
  });

  test("mouvement réduit : hero d'une hauteur d'écran, aucun débordement", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto("/");
    const hero = page.locator("section[aria-labelledby='hero-title']");
    // L'état « mouvement réduit » est posé après hydratation : on attend qu'il s'applique.
    await expect
      .poll(async () => hero.evaluate((el) => el.getBoundingClientRect().height))
      .toBeLessThanOrEqual(801);
    await ctx.close();
  });

  test("les expertises renvoient vers les pages dédiées et la maintenance", async ({ page }) => {
    await page.goto("/");
    const list = page.locator("section[aria-labelledby='home-expertise-title']");
    for (const slug of ["creation-web", "branding", "seo", "automatisation-ia"]) {
      await expect(list.locator(`a[href='/services/${slug}']`)).toHaveCount(1);
    }
    await expect(list.locator("a[href='/services#maintenance']")).toHaveCount(1);
  });

  test("aucun lien promet un créneau tant que Cal.com n'est pas configuré", async ({ page }) => {
    test.skip(!!process.env.NEXT_PUBLIC_CAL_URL, "Cal.com configuré");
    await page.goto("/contact");
    await expect(page.getByText(/30 minutes/)).toHaveCount(0);
    await expect(page.locator("a[href*='cal.com']")).toHaveCount(0);
  });
});

test.describe("Services", () => {
  test("la page liste les quatre expertises et la maintenance", async ({ page }) => {
    await page.goto("/services");
    for (const slug of ["creation-web", "branding", "seo", "automatisation-ia"]) {
      const block = page.locator(`#service-${slug}`);
      await expect(block).toHaveCount(1);
      await expect(block.getByRole("link", { name: "Voir le détail" })).toHaveAttribute("href", `/services/${slug}`);
    }
    await expect(page.locator("#maintenance")).toHaveCount(1);
  });

  for (const slug of ["creation-web", "branding", "seo", "automatisation-ia"]) {
    test(`/services/${slug} : constat, méthode, livrables, cadre, prochaine étape`, async ({ page }) => {
      await page.goto(`/services/${slug}`);
      for (const id of ["service-context-title", "service-method-title", "service-deliverables-title", "service-frame-title"]) {
        await expect(page.locator(`h2#${id}`)).toHaveCount(1);
      }
      await expect(page.locator("section[aria-labelledby='cta-title']").getByRole("link", { name: "Démarrer un projet" })).toHaveAttribute("href", "/contact");
      // Chaque page renvoie vers les autres expertises (maillage interne).
      await expect(page.locator("section[aria-labelledby='service-others-title'] a")).toHaveCount(3);
    });
  }

  test("un slug inconnu renvoie 404", async ({ page }) => {
    const res = await page.goto("/services/inconnu");
    expect(res?.status()).toBe(404);
  });
});

test.describe("Studio et pages légales", () => {
  test("Studio : message cohérent, sans contradiction sur l'équipe", async ({ page }) => {
    await page.goto("/studio");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("studio indépendant");
    await expect(page.locator("body")).not.toContainText("sous-traitance opaque");
    await expect(page.locator("body")).not.toContainText("réseau d'experts");
  });

  test("pages légales : sommaire cliquable vers les sections", async ({ page, isMobile }) => {
    await page.goto("/mentions-legales");
    if (isMobile) await page.getByText("Sommaire", { exact: true }).first().click();
    const nav = page.getByRole("navigation", { name: "Sommaire" }).filter({ visible: true });
    const link = nav.getByRole("link", { name: /Hébergement/ });
    await link.click();
    await expect(page.locator("#section-5")).toBeInViewport();
  });
});
