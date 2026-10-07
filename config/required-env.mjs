/**
 * Variables d'environnement indispensables en production.
 * Aucune valeur ici : uniquement des noms. Source unique, partagée par
 * `next.config.mjs` (échec du build) et `src/lib/env.ts` (réponse API).
 */
export const REQUIRED_PRODUCTION_ENV = [
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "RESEND_TO_EMAIL",
  "TURNSTILE_SECRET_KEY",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "NEXT_PUBLIC_SITE_URL",
];

/** Noms des variables requises absentes ou vides. */
export function missingEnv(env = process.env) {
  return REQUIRED_PRODUCTION_ENV.filter((name) => !String(env[name] ?? "").trim());
}
