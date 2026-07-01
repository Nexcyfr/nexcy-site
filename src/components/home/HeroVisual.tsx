import { cn } from "@/lib/utils";

/**
 * Visuel hero abstrait généré en code (Master Brief §30 — priorité au code).
 * Surfaces géométriques sombres + faisceaux ambrés. Aucun téléchargement,
 * peint instantanément (bon pour le LCP), aucun CLS. Décoratif.
 */
export function HeroVisual({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      className={cn("block", className)}
      role="img"
      aria-label="Composition abstraite — surfaces géométriques et lumière ambrée"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="hero-glow" cx="62%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#C8883A" stopOpacity="0.28" />
          <stop offset="45%" stopColor="#A06428" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-plane" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#161616" />
          <stop offset="100%" stopColor="#0A0A0A" />
        </linearGradient>
        <linearGradient id="hero-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E4A85B" stopOpacity="0" />
          <stop offset="55%" stopColor="#E4A85B" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#E4A85B" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="600" height="600" fill="#0A0A0A" />
      <rect width="600" height="600" fill="url(#hero-glow)" />

      {/* Plans en perspective */}
      <g opacity="0.9">
        <polygon points="60,520 300,470 300,600 60,600" fill="url(#hero-plane)" />
        <polygon points="300,470 540,520 540,600 300,600" fill="#111111" />
        <polygon points="300,120 470,190 300,270 130,190" fill="url(#hero-plane)" />
      </g>

      {/* Lignes fines convergentes (architecture invisible) */}
      <g stroke="#222222" strokeWidth="1" fill="none">
        {Array.from({ length: 9 }).map((_, i) => {
          const x = 60 + i * 60;
          return <line key={`v${i}`} x1={x} y1="120" x2={300} y2="470" />;
        })}
        {Array.from({ length: 6 }).map((_, i) => {
          const y = 200 + i * 55;
          return <line key={`h${i}`} x1="60" y1={y} x2="540" y2={y} opacity="0.5" />;
        })}
      </g>

      {/* Faisceaux ambrés */}
      <rect x="120" y="250" width="360" height="2" fill="url(#hero-beam)" />
      <rect x="180" y="330" width="300" height="1.5" fill="url(#hero-beam)" opacity="0.7" />
      <circle cx="372" cy="252" r="3" fill="#E4A85B" />
    </svg>
  );
}
