import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

// Axe scans run with reducedMotion:reduce to avoid false positives from
// mid-animation GSAP states (elements at partial opacity). Aria-hidden
// decorative elements (numbered accents, parallax layers) are excluded from
// contrast checks — they carry no information and their low opacity is
// intentional (design token text-accent/20 and /30).
const AXE_EXCLUDE_ARIA_HIDDEN = ["[aria-hidden='true']"];

const PAGES = [
  { name: "accueil", path: "/" },
  { name: "services", path: "/services" },
  { name: "studio", path: "/studio" },
  { name: "contact", path: "/contact" },
];

for (const { name, path } of PAGES) {
  test(`${name} : aucune violation WCAG 2.1 AA`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "best-practice"])
      .exclude(AXE_EXCLUDE_ARIA_HIDDEN)
      .analyze();

    expect(
      results.violations,
      results.violations
        .map((v) => `[${v.impact}] ${v.id}: ${v.description}`)
        .join("\n"),
    ).toHaveLength(0);
  });
}

test("accueil mobile : aucune violation WCAG 2.1 AA", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .exclude(AXE_EXCLUDE_ARIA_HIDDEN)
    .analyze();

  expect(
    results.violations,
    results.violations.map((v) => `${v.id}: ${v.description}`).join("\n"),
  ).toHaveLength(0);
});
