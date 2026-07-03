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

  // ─── Lot 3 — Hero hybride ──────────────────────────────────────────────────

  test("hero : scène codée SVG présente et décorative", async ({ page, viewport }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const isDesktop = (viewport?.width ?? 0) >= 1024;
    if (isDesktop) {
      // La scène SVG doit être dans le DOM, aria-hidden (décoration pure)
      const scene = page.locator("[data-hero-visual] svg[aria-hidden='true']");
      await expect(scene).toBeAttached();
    }
  });

  test("hero : colonne visuelle présente et visible (desktop)", async ({ page, viewport }) => {
    const isDesktop = (viewport?.width ?? 0) >= 1024;
    if (!isDesktop) return; // mobile : seule la colonne texte est rendue
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const visual = page.locator("[data-hero-visual]");
    await expect(visual).toBeVisible({ timeout: 5_000 });
  });

  test("hero : vidéo muted, playsInline et poster si présente (desktop)", async ({
    page,
    viewport,
  }) => {
    const isDesktop = (viewport?.width ?? 0) >= 1024;
    if (!isDesktop) return;

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const video = page.locator("[data-hero-visual] video");
    const count = await video.count();
    // La vidéo peut ne pas être montée si le pointer:fine n'est pas détecté en headless
    // On vérifie les propriétés de sécurité si elle est présente
    if (count > 0) {
      // React 18 ne sérialise pas l'attribut HTML `muted` — on vérifie la propriété DOM
      const isMuted = await page.evaluate(() => {
        const v = document.querySelector<HTMLVideoElement>("[data-hero-visual] video");
        return v ? v.muted : true;
      });
      expect(isMuted).toBe(true);
      await expect(video.first()).toHaveAttribute("playsinline", "");
      const loop = await video.first().getAttribute("loop");
      expect(loop).not.toBeNull();
    }
  });

  test("hero : pas de texte essentiel uniquement dans le visuel", async ({ page }) => {
    await page.goto("/");
    // Le H1, tagline, description et CTAs doivent être dans le DOM texte réel
    const h1 = await page.locator("h1").first().textContent();
    expect(h1).toBeTruthy();
    const desc = page.locator("[data-hero-desc]");
    await expect(desc).toBeAttached();
  });

  test("hero : route publique sans dépendance à /render", async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (req) => {
      if (req.url().includes("/render/")) requests.push(req.url());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(requests, "La page publique ne doit pas requêter /render/").toHaveLength(0);
  });

  test("hero : aucun logo N codé détecté", async ({ page }) => {
    await page.goto("/");
    // Vérifie que data-mono (monogramme généré) n'existe pas dans le DOM
    const monoEl = await page.locator("[data-mono]").count();
    expect(monoEl).toBe(0);
  });

  test("hero reduced-motion : colonne visuelle immédiatement visible (desktop)", async ({
    page,
    viewport,
  }) => {
    const isDesktop = (viewport?.width ?? 0) >= 1024;
    if (!isDesktop) return;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    const visual = page.locator("[data-hero-visual]");
    // En reduced-motion, GSAP met autoAlpha: 1 immédiatement → visible
    await expect(visual).toBeVisible({ timeout: 3_000 });
  });
});
