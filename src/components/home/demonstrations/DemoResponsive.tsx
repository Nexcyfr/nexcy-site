"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Viewport = "desktop" | "tablet" | "mobile";

const VIEWPORTS: { id: Viewport; label: string; frame: string }[] = [
  { id: "desktop", label: "Desktop", frame: "max-w-full" },
  { id: "tablet", label: "Tablette", frame: "max-w-[460px]" },
  { id: "mobile", label: "Mobile", frame: "max-w-[280px]" },
];

/**
 * Démonstration NEXCY — Web « Une interface, chaque écran ».
 * UI fictive crédible (marque « NOVA ») qui se recompose desktop→tablette→mobile
 * via de vrais boutons (état CSS ; les transitions sont neutralisées par
 * prefers-reduced-motion). Recomposition réelle : nav → menu, multi-colonnes →
 * colonne, hiérarchie et CTA adaptés. Aucun drag requis.
 */
export function DemoResponsive() {
  const [vp, setVp] = useState<Viewport>("desktop");
  const isMobile = vp === "mobile";
  const isDesktop = vp === "desktop";

  return (
    <div>
      {/* Contrôles */}
      <div
        role="group"
        aria-label="Choisir la taille d'écran"
        className="mb-6 flex gap-2"
      >
        {VIEWPORTS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setVp(v.id)}
            aria-pressed={vp === v.id}
            className={cn(
              "min-h-[44px] rounded-btn border px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              vp === v.id
                ? "border-accent bg-accent text-black"
                : "border-border text-text-secondary hover:border-text-primary hover:text-text-primary",
            )}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* Cadre appareil */}
      <div className="rounded-card border border-border bg-surface p-4">
        <div
          className={cn(
            "mx-auto overflow-hidden rounded border border-border bg-card transition-all duration-500 ease-premium",
            VIEWPORTS.find((v) => v.id === vp)?.frame,
          )}
          aria-hidden="true"
        >
          {/* Barre de nav */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="text-sm font-semibold tracking-tight text-text-primary">
              NOVA
            </span>
            {isMobile ? (
              <span className="flex flex-col gap-1">
                <span className="h-0.5 w-5 bg-text-primary" />
                <span className="h-0.5 w-5 bg-text-primary" />
              </span>
            ) : (
              <span className="flex items-center gap-3 text-[11px] text-text-secondary">
                <span>Produit</span>
                <span>Tarifs</span>
                <span>Contact</span>
                <span className="rounded bg-accent px-2 py-1 text-[10px] font-medium text-black">
                  Essayer
                </span>
              </span>
            )}
          </div>

          {/* Hero */}
          <div
            className={cn(
              "gap-4 px-4 py-5",
              isDesktop ? "grid grid-cols-[1.3fr_1fr] items-center" : "flex flex-col",
            )}
          >
            <div>
              <div className="h-2.5 w-4/5 rounded bg-text-primary/80" />
              <div className="mt-2 h-2.5 w-3/5 rounded bg-text-primary/50" />
              <div className="mt-3 h-1.5 w-full rounded bg-text-muted/50" />
              <div className="mt-1.5 h-1.5 w-5/6 rounded bg-text-muted/50" />
              <span className="mt-4 inline-block rounded bg-accent px-3 py-1.5 text-[10px] font-medium text-black">
                Commencer
              </span>
            </div>
            <div className="h-20 rounded bg-gradient-to-br from-accent/25 to-surface" />
          </div>

          {/* Cartes */}
          <div
            className={cn(
              "grid gap-3 px-4 pb-5",
              isDesktop ? "grid-cols-3" : isMobile ? "grid-cols-1" : "grid-cols-2",
            )}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  "rounded border border-border bg-surface p-3",
                  isMobile && i > 0 && "hidden",
                  vp === "tablet" && i > 1 && "hidden",
                )}
              >
                <div className="h-6 w-6 rounded bg-accent/30" />
                <div className="mt-2 h-1.5 w-full rounded bg-text-primary/40" />
                <div className="mt-1 h-1.5 w-2/3 rounded bg-text-muted/50" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-text-muted">
        Aperçu simplifié — la navigation, la hiérarchie et les cartes se
        recomposent selon l&apos;écran.
      </p>
    </div>
  );
}
