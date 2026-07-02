/** @type {import('next').NextConfig} */

// Master Brief §26 — En-têtes de sécurité. Content-Security-Policy incluse.
// (Next 14 ne supporte pas next.config.ts natif → fichier .mjs.)

// En développement, webpack charge les modules via `eval` (source maps/HMR) :
// 'unsafe-eval' est requis UNIQUEMENT en dev (jamais embarqué en production).
// La CSP de production reste stricte (moindre privilège).
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = [
  "script-src 'self' 'unsafe-inline'",
  isDev ? "'unsafe-eval'" : "",
  "https://challenges.cloudflare.com https://plausible.io",
]
  .filter(Boolean)
  .join(" ");

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      // Vidéos auto-hébergées (public/assets) — moindre privilège.
      "media-src 'self'",
      "font-src 'self'",
      "connect-src 'self' https://plausible.io https://challenges.cloudflare.com",
      "frame-src https://challenges.cloudflare.com",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join("; "),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Tous les médias sont locaux (public/assets) : aucun domaine distant requis.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
