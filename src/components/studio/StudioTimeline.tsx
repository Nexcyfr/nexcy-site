import { SectionLabel } from "@/components/ui/SectionLabel";
import { LineReveal } from "@/components/animations/LineReveal";
import { MotionReveal } from "@/components/animations/MotionReveal";

const MILESTONES = [
  { year: "2019", label: "Début de pratique", detail: "Premier projet digital professionnel." },
  { year: "2025", label: "Création de NEXCY", detail: "Structuration sous la marque NEXCY." },
  { year: "Aujourd'hui", label: "En activité", detail: "Bordeaux, France." },
];

/**
 * Frise chronologique visuelle — page Studio.
 * Mobile : colonne verticale (flex-col, pas de scroll horizontal).
 * Desktop (lg+) : rangée horizontale avec ligne animée.
 * Révélation CSS (voir globals.css) ; mouvement réduit : tout visible d'emblée.
 */
export function StudioTimeline() {
  return (
    <section
      aria-label="Chronologie du studio"
      className="section-y border-t border-border bg-surface"
    >
      <div className="container-site">
        <SectionLabel label="Chronologie" />

        <div className="relative mt-10 py-2 lg:py-8">
          {/* Ligne horizontale — desktop uniquement, aria-hidden car décorative */}
          <div className="absolute hidden lg:left-0 lg:right-0 lg:top-[calc(2.5rem+10px)] lg:block">
            <LineReveal color="bg-border" />
          </div>

          {/* Jalons — colonne sur mobile, grille 3 colonnes sur desktop */}
          <div className="flex flex-col gap-10 lg:grid lg:grid-cols-3">
            {MILESTONES.map((m, i) => (
              <MotionReveal
                key={m.year}
                delay={i * 0.06}
                className={[
                  "flex items-start gap-4",
                  "lg:flex-col lg:gap-3",
                  i === 1 ? "lg:items-center" : i === 2 ? "lg:items-end" : "",
                ].join(" ")}
              >
                {/* Nœud diamant */}
                <div aria-hidden="true" className="relative z-10 flex flex-shrink-0 items-center justify-center">
                  <svg viewBox="0 0 18 18" width="18" height="18">
                    <rect
                      x="2" y="2"
                      width="14" height="14"
                      transform="rotate(45 9 9)"
                      fill="var(--color-surface)"
                      stroke="var(--color-accent)"
                      strokeWidth="1.5"
                    />
                    <circle cx="9" cy="9" r="2.5" fill="var(--color-accent)" />
                  </svg>
                </div>

                {/* Labels */}
                <div
                  className={[
                    "flex flex-col gap-1",
                    i === 1 ? "lg:items-center lg:text-center" : i === 2 ? "lg:items-end lg:text-right" : "",
                  ].join(" ")}
                >
                  <span className="t-h3 text-text-primary">
                    {m.year}
                  </span>
                  <span className="text-sm font-medium text-text-secondary">
                    {m.label}
                  </span>
                  <span className="text-xs leading-relaxed text-text-muted">
                    {m.detail}
                  </span>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
