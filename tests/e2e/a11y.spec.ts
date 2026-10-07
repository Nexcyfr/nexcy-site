import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PUBLIC_ROUTES } from "./_utils";

// Les révélations au scroll sont des animations CSS : axe mesurerait les
// contrastes sur des états intermédiaires. On les neutralise, comme le fait un
// utilisateur qui demande « réduire les animations » — et c'est aussi le cas à tester.
test.use({ reducedMotion: "reduce" });

test.describe("Accessibilité (axe-core, WCAG 2.2 AA)", () => {
  for (const route of [...PUBLIC_ROUTES, "/cette-page-n-existe-pas"]) {
    test(`${route} : aucune violation`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
        .analyze();
      const summary = results.violations.map(
        (v) => `${v.id} [${v.impact}] ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" ; ")}`,
      );
      expect(summary, summary.join("\n")).toEqual([]);
    });
  }

  test("formulaire : état d'erreur sans violation", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Envoyer ma demande" }).click();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test("menu mobile ouvert sans violation", async ({ page, isMobile }) => {
    test.skip(!isMobile, "menu mobile uniquement");
    await page.goto("/");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test("zones cliquables d'au moins 24 px (WCAG 2.5.8)", async ({ page }) => {
    for (const route of ["/", "/services", "/contact"]) {
      await page.goto(route);
      const small = await page.evaluate(() =>
        [...document.querySelectorAll("a, button, summary, select, textarea, input")]
          .filter((el) => {
            const b = el.getBoundingClientRect();
            const hidden = getComputedStyle(el).visibility === "hidden" || el.closest("[aria-hidden='true'], [inert]");
            return !hidden && b.width > 0 && b.height > 0 && !el.classList.contains("sr-only") && (b.height < 24 || b.width < 24);
          })
          .map((el) => `${el.tagName} ${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30)}`),
      );
      expect(small, `${route} : ${small.join(", ")}`).toEqual([]);
    }
  });
});
