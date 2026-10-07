/** @type {import('next').NextConfig} */
import withBundleAnalyzerInit from "@next/bundle-analyzer";
import { PHASE_PRODUCTION_BUILD } from "next/constants.js";
import { missingEnv } from "./config/required-env.mjs";

const withBundleAnalyzer = withBundleAnalyzerInit({
  enabled: process.env.ANALYZE === "true",
});

// ── Configuration de production explicite ───────────────────────────────────
// Un déploiement de production sans formulaire fonctionnel est un échec, pas
// un état dégradé silencieux. Le build échoue donc, en nommant les variables
// manquantes (jamais leurs valeurs), dès que NEXCY_STRICT_ENV=1 ou que la
// plateforme indique un déploiement de production (VERCEL_ENV=production).
const strictEnv =
  process.env.NEXCY_STRICT_ENV === "1" || process.env.VERCEL_ENV === "production";

/** Lève une erreur explicite si la configuration de production est incomplète. */
function assertProductionEnv() {
  if (!strictEnv) return;
  const missing = missingEnv();
  if (missing.length > 0) {
    throw new Error(
      `[NEXCY] Configuration de production incomplète. Variables manquantes : ${missing.join(", ")}. ` +
        "Voir .env.example et docs/DEPLOYMENT.md.",
    );
  }
}

// ── En-têtes de sécurité ────────────────────────────────────────────────────
// La CSP est réduite aux besoins réels du site :
//  - scripts : le site, les scripts inline de Next (sans nonce → 'unsafe-inline',
//    contrepartie assumée du rendu statique), Turnstile et Plausible ;
//  - styles : le site + attributs style de React ;
//  - images : le site + data: ; polices : le site (Geist auto-hébergée) ;
//  - connexions : le site, Plausible (mesure), Turnstile (défi) ;
//  - frames : Turnstile uniquement ; aucune intégration tierce.
// 'unsafe-eval' n'est ajouté qu'en développement (HMR de webpack).
const isDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  [
    "script-src 'self' 'unsafe-inline'",
    isDev ? "'unsafe-eval'" : "",
    "https://challenges.cloudflare.com https://plausible.io",
  ]
    .filter(Boolean)
    .join(" "),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://plausible.io https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  isDev ? "" : "upgrade-insecure-requests",
]
  .filter(Boolean)
  .join("; ");

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Pas de `preload` : l'inscription à la liste de préchargement HSTS est un
  // engagement quasi irréversible, à décider consciemment après le lancement.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Tous les médias sont locaux (public/assets) : aucun domaine distant requis.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        // Visuels statiques (logo, OG) : cache long côté navigateur et CDN.
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default function config(phase) {
  if (phase === PHASE_PRODUCTION_BUILD) assertProductionEnv();
  return withBundleAnalyzer(nextConfig);
}
