import type { Config } from "tailwindcss";

/**
 * NEXCY — Design tokens (Master Brief §7).
 * Palette entièrement sombre, accent doré cuivré #C8883A. Aucune couleur bleue.
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
        black: "#0A0A0A",
        surface: "#111111",
        card: "#161616",
        white: "#FFFFFF",
        "text-primary": "#F0F0F0",
        "text-secondary": "#9A9A9A",
        "text-muted": "#808080",
        border: "#222222",
        accent: {
          DEFAULT: "#C8883A",
          light: "#E4A85B",
          dark: "#A06428",
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
        premium: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
