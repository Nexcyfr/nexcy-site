import type { Page } from "@playwright/test";

/** Pages publiques indexables (hors 404). */
export const PUBLIC_ROUTES = [
  "/",
  "/services",
  "/services/sites-web",
  "/services/applications",
  "/studio",
  "/contact",
  "/mentions-legales",
  "/politique-de-confidentialite",
] as const;

// Bruits bénins à filtrer des erreurs console :
// - dev Next.js (HMR, Fast Refresh, DevTools) ;
// - services tiers pouvant être injoignables hors ligne (Plausible, Turnstile).
const BENIGN_PATTERNS = [
  /favicon/,
  /hot-update/,
  /Download the React DevTools/,
  /\[HMR\]/,
  /\[Fast Refresh\]/,
  /plausible\.io/,
  /challenges\.cloudflare\.com/,
  /ERR_INTERNET_DISCONNECTED/,
  /ERR_NAME_NOT_RESOLVED/,
  /ERR_NETWORK_CHANGED/,
];

export function collectConsoleErrors(page: Page): () => string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (!BENIGN_PATTERNS.some((re) => re.test(text))) errors.push(text);
    }
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return () => errors;
}

export async function hasHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
}

/** Saute instantanément à une position (Lenis suit le scroll natif). */
export async function jumpTo(page: Page, top: number) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);
  await page.waitForTimeout(700);
}

export const HYDRATION_RE = /hydration failed|did not match|Server Error/i;
