import { cn } from "@/lib/utils";

type Variant = "creation-web" | "branding" | "seo" | "automatisation-ia";

/**
 * Motif codé par service (DA P2) — même langage graphique que le hero et les
 * démonstrations : fond sombre, lignes fines, nœuds, accent cuivré parcimonieux.
 * SVG vectoriel (net Retina, zéro banding), décoratif → aria-hidden.
 */
export function ServiceMotif({
  variant,
  className,
}: {
  variant: Variant;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-card border border-border bg-card",
        className,
      )}
    >
      <svg viewBox="0 0 400 300" fill="none" className="h-full w-full">
        {/* grille de fond commune */}
        <g stroke="var(--color-border)" strokeWidth="1" opacity="0.5">
          {[80, 160, 240, 320].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="300" />
          ))}
          {[75, 150, 225].map((y) => (
            <line key={y} x1="0" y1={y} x2="400" y2={y} />
          ))}
        </g>
        {variant === "creation-web" && <CreationWeb />}
        {variant === "branding" && <Branding />}
        {variant === "seo" && <Seo />}
        {variant === "automatisation-ia" && <AutoIA />}
      </svg>
    </div>
  );
}

/* Interface qui se structure : cadre, nav, hero, cartes. */
function CreationWeb() {
  return (
    <g>
      <rect x="70" y="60" width="260" height="180" rx="6" fill="var(--color-surface)" stroke="var(--color-border)" />
      <line x1="70" y1="88" x2="330" y2="88" stroke="var(--color-border)" />
      <circle cx="84" cy="74" r="3" fill="var(--color-text-muted)" />
      <circle cx="96" cy="74" r="3" fill="var(--color-text-muted)" />
      <rect x="250" y="70" width="70" height="9" rx="2" fill="var(--color-accent)" />
      <rect x="86" y="104" width="120" height="8" rx="2" fill="var(--color-text-secondary)" />
      <rect x="86" y="120" width="90" height="6" rx="2" fill="var(--color-text-muted)" />
      <rect x="86" y="140" width="60" height="14" rx="3" fill="var(--color-accent)" />
      {[86, 170, 254].map((x) => (
        <rect key={x} x={x} y="176" width="60" height="44" rx="3" fill="var(--color-card)" stroke="var(--color-border)" />
      ))}
    </g>
  );
}

/* Système de marque : mark central + modules alignés reliés. */
function Branding() {
  return (
    <g>
      <g stroke="var(--color-border)" strokeWidth="1.25">
        <line x1="200" y1="150" x2="110" y2="90" />
        <line x1="200" y1="150" x2="290" y2="90" />
        <line x1="200" y1="150" x2="110" y2="210" />
        <line x1="200" y1="150" x2="290" y2="210" />
      </g>
      <rect x="176" y="126" width="48" height="48" rx="6" fill="var(--color-card)" stroke="var(--color-accent)" />
      <path d="M188 165 V135 L212 165 V135" stroke="var(--color-accent)" strokeWidth="3" />
      {/* modules */}
      <rect x="86" y="72" width="48" height="36" rx="3" fill="var(--color-accent)" />
      <rect x="266" y="72" width="48" height="36" rx="3" fill="var(--color-surface)" stroke="var(--color-border)" />
      <text x="278" y="96" fill="var(--color-text-primary)" style={{ fontSize: 18, fontWeight: 700 }}>Aa</text>
      <rect x="86" y="192" width="48" height="36" rx="3" fill="var(--color-text-primary)" opacity="0.5" />
      <rect x="266" y="192" width="48" height="36" rx="6" fill="var(--color-surface)" stroke="var(--color-border)" />
    </g>
  );
}

/* Architecture / maillage : pilier + pages + liens. */
function Seo() {
  return (
    <g>
      <g stroke="var(--color-accent)" strokeWidth="1.25" opacity="0.7">
        <line x1="200" y1="88" x2="110" y2="170" />
        <line x1="200" y1="88" x2="200" y2="170" />
        <line x1="200" y1="88" x2="290" y2="170" />
        <line x1="110" y1="196" x2="200" y2="240" />
        <line x1="290" y1="196" x2="200" y2="240" />
      </g>
      <rect x="164" y="66" width="72" height="26" rx="4" fill="var(--color-accent)" />
      {[74, 164, 254].map((x) => (
        <rect key={x} x={x} y="170" width="72" height="26" rx="4" fill="var(--color-card)" stroke="var(--color-border)" />
      ))}
      <rect x="164" y="240" width="72" height="26" rx="4" fill="var(--color-card)" stroke="var(--color-border)" />
    </g>
  );
}

/* Workflow : étapes reliées, une validation humaine accentuée. */
function AutoIA() {
  return (
    <g>
      <g stroke="var(--color-border)" strokeWidth="1.25">
        <line x1="96" y1="150" x2="150" y2="150" />
        <line x1="204" y1="150" x2="150" y2="150" />
        <line x1="204" y1="150" x2="258" y2="150" />
        <line x1="312" y1="150" x2="258" y2="150" />
      </g>
      {[60, 168, 276].map((x, i) => (
        <rect
          key={x}
          x={x}
          y="128"
          width="44"
          height="44"
          rx="4"
          fill="var(--color-card)"
          stroke={i === 1 ? "var(--color-accent)" : "var(--color-border)"}
          strokeWidth={i === 1 ? 2 : 1}
        />
      ))}
      {/* nœud IA + résultat */}
      <circle cx="228" cy="150" r="10" fill="var(--color-surface)" stroke="var(--color-border)" />
      <circle cx="334" cy="150" r="8" fill="var(--color-accent)" />
      <rect x="176" y="180" width="28" height="8" rx="2" fill="var(--color-accent)" opacity="0.7" />
    </g>
  );
}
