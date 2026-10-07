import { test, expect } from "@playwright/test";
import { jumpTo } from "./_utils";

test.describe("Accueil", () => {
  test("le hero porte le message, les deux actions et le plan", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sites web et applications sur mesure.");
    const hero = page.locator("section[aria-labelledby='hero-title']");
    await expect(hero.getByRole("link", { name: "Démarrer un projet" })).toHaveAttribute("href", "/contact");
    await expect(hero.getByRole("link", { name: "Voir les services" })).toHaveAttribute("href", "/services");
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

  test("l'accueil présente deux offres, et seulement deux", async ({ page }) => {
    await page.goto("/");
    const offers = page.locator("section[aria-labelledby='home-offers-title']");
    await expect(offers.locator("a[href='/services/sites-web']")).toHaveCount(1);
    await expect(offers.locator("a[href='/services/applications']")).toHaveCount(1);
    await expect(offers.locator("a[href^='/services/']")).toHaveCount(2);
    // Les anciens services ne sont plus des offres.
    const body = (await page.locator("main").innerText()).toLowerCase();
    for (const old of ["branding", "maintenance", "automatisation & ia", "référencement naturel"]) {
      expect(body, old).not.toContain(old);
    }
  });

  test("aucun lien promet un créneau tant que Cal.com n'est pas configuré", async ({ page }) => {
    test.skip(!!process.env.NEXT_PUBLIC_CAL_URL, "Cal.com configuré");
    await page.goto("/contact");
    await expect(page.getByText(/30 minutes/)).toHaveCount(0);
    await expect(page.locator("a[href*='cal.com']")).toHaveCount(0);
  });
});

test.describe("Services", () => {
  test("/services présente Sites web et Applications, rien d'autre", async ({ page }) => {
    await page.goto("/services");
    for (const slug of ["sites-web", "applications"]) {
      const block = page.locator(`#offre-${slug}`);
      await expect(block).toHaveCount(1);
      await expect(block.getByRole("link", { name: "Voir le détail" })).toHaveAttribute("href", `/services/${slug}`);
    }
    await expect(page.locator("section[id^='offre-']")).toHaveCount(2);
    await expect(page.locator("#capabilities-title")).toHaveCount(1);
    const body = (await page.locator("main").innerText()).toLowerCase();
    expect(body).not.toContain("accompagnement continu");
    expect(body).not.toContain("abonnement");
  });

  for (const slug of ["sites-web", "applications"]) {
    test(`/services/${slug} : périmètre, public, méthode, capacités, cadre, prochaine étape`, async ({ page }) => {
      await page.goto(`/services/${slug}`);
      for (const id of ["offer-scope-title", "offer-audience-title", "offer-method-title", "offer-included-title", "offer-frame-title"]) {
        await expect(page.locator(`h2#${id}`)).toHaveCount(1);
      }
      await expect(page.locator("section[aria-labelledby='cta-title']").getByRole("link", { name: "Démarrer un projet" })).toHaveAttribute("href", "/contact");
      await expect(page.getByRole("link", { name: /Autre métier du studio/ })).toHaveCount(1);
    });
  }

  test("Sites web : couvre création, refonte, e-commerce et expériences interactives", async ({ page }) => {
    await page.goto("/services/sites-web");
    const text = await page.locator("main").innerText();
    for (const k of ["Sites vitrines", "Sites corporate", "Sites e-commerce", "Landing pages", "Refonte complète ou partielle", "Optimisation d'un site existant", "Expériences web haut de gamme"]) {
      expect(text).toContain(k);
    }
  });

  test("Applications : couvre applications web, SaaS, plateformes métier, outils internes, dashboards, portails", async ({ page }) => {
    await page.goto("/services/applications");
    const text = await page.locator("main").innerText();
    for (const k of ["Applications web", "SaaS et MVP", "Plateformes métier", "Outils internes", "Dashboards", "Extranets et portails clients", "Authentification et droits"]) {
      expect(text).toContain(k);
    }
  });

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
