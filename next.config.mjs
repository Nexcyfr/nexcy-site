/** @type {import('next').NextConfig} */
import withBundleAnalyzerInit from "@next/bundle-analyzer";

const withBundleAnalyzer = withBundleAnalyzerInit({
  enabled: process.env.ANALYZE === "true",
});

// Master Brief §26 — En-têtes de sécurité. Content-Security-Policy incluse.
// (Next 14 ne supporte pas next.config.ts natif → fichier .mjs.)

// En développement, webpack charge les modules via `eval` (source maps/HMR) :
// 'unsafe-eval' est requis UNIQUEMENT en dev (jamais embarqué en production).
// La CSP de production reste stricte (moindre privilège).
//
// 'wasm-unsafe-eval' (dev + prod) : directive dédiée, distincte de 'unsafe-eval'
// — autorise uniquement WebAssembly.instantiate/compile, pas eval()/Function()
// arbitraire. Nécessaire pour le décodeur Draco (glTF) qui compile un module WASM
// dans son Worker ; sans elle le décodeur échoue silencieusement en production
// (bloqué au chargement, jamais d'erreur explicite avant ce diagnostic CSP).
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = [
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
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
      // Décodeur Draco (glTF/GLB) : tourne dans un Worker instancié depuis un blob.
      "worker-src 'self' blob:",
      // blob: nécessaire : three.js ImageBitmapLoader charge les textures glTF
      // embarquées via fetch(blobURL), régi par connect-src (pas img-src).
      "connect-src 'self' blob: https://plausible.io https://challenges.cloudflare.com",
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

export default withBundleAnalyzer(nextConfig);
