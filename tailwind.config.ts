import type { Config } from "tailwindcss";
import { cssEase } from "./src/lib/motion/easing";

/**
 * NEXCY — Design tokens (Master Brief §7).
 * Palette entièrement sombre, accent ambre #D9913D (jamais d'aplat). Aucune couleur froide.
 * L'échelle typographique (xs → 9xl) correspond déjà aux défauts Tailwind.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
    },
    extend: {
      colors: {
        void: "#080808",
        black: "#0A0A0A",
        surface: "#111111",
        card: "#161616",
        white: "#FFFFFF",
        "text-primary": "#F0F0F0",
        "text-secondary": "#9A9A9A",
        "text-muted": "#808080",
        "warm-white": "#F4F1EB",
        stone: "#99958F",
        danger: "#F0907E",
        border: "#222222",
        line: "rgba(153,149,143,0.14)",
        "line-strong": "rgba(153,149,143,0.30)",
        accent: {
          DEFAULT: "#D9913D",
          light: "#E7AA62",
          dark: "#B96E27",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "1440px",
        prose: "720px",
      },
      spacing: {
        // py-30 = 120px (padding vertical de section desktop, Brief §7)
        "30": "7.5rem",
        // Échelle d'espacements centralisée (source : --space-* dans globals.css).
        // Utilitaires : p-space-6, gap-space-4, py-space-8, mt-space-5, …
        "space-1": "var(--space-1)",
        "space-2": "var(--space-2)",
        "space-3": "var(--space-3)",
        "space-4": "var(--space-4)",
        "space-5": "var(--space-5)",
        "space-6": "var(--space-6)",
        "space-7": "var(--space-7)",
        "space-8": "var(--space-8)",
        "space-9": "var(--space-9)",
      },
      borderRadius: {
        card: "4px",
        btn: "6px",
        pill: "9999px",
      },
      letterSpacing: {
        widest2: "0.2em",
      },
      transitionTimingFunction: {
        // Motion System V3 — source unique : src/lib/motion/easing.ts (EASE_POINTS).
        cinematic: cssEase("cinematic"),
        standard: cssEase("standard"),
        snappy: cssEase("snappy"),
        media: cssEase("media"),
        // @deprecated — alias de `standard`, conservé pour les usages ease-premium existants.
        premium: cssEase("standard"),
      },
    },
  },
  plugins: [],
};
export default config;
