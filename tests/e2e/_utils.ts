import type { Page } from "@playwright/test";

// Patterns bénins à filtrer des erreurs console :
// - bruits dev/HMR Next.js
// - erreurs réseau sur services tiers (Plausible analytics, Cloudflare Turnstile)
//   qui peuvent être indisponibles dans les environnements de test hors-ligne.
const BENIGN_PATTERNS = [
  /favicon/,
  /hot-update/,
  /Download the React DevTools/,
  /ReactDOM\.render/,
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
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
}

export const HYDRATION_RE = /hydration failed|did not match|Server Error/i;

export function hasHydrationError(errors: string[]): boolean {
  return errors.some((e) => HYDRATION_RE.test(e));
}
