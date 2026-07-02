"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Démonstration NEXCY — SEO « Architecture SEO ».
 * Graphe simplifié (page pilier + pages services + Contact + liens internes).
 * Bascule structuré / désorganisé pour illustrer la LISIBILITÉ de la structure.
 * Libellés génériques, aucun faux résultat Google, aucune promesse de position.
 * Le markup rend l'état STRUCTURÉ par défaut (contenu signifiant non masqué).
 */
export function DemoSeo() {
  const [structured, setStructured] = useState(true);

  const Node = ({ x, y, label, pilier }: { x: number; y: number; label: string; pilier?: boolean }) => (
    <g transform={`translate(${x} ${y})`}>
      <rect
        width="78"
        height="26"
        rx="4"
        className={cn(pilier ? "fill-accent" : "fill-card", "stroke-border")}
        strokeWidth="1"
      />
      <text
        x="39"
        y="17"
        textAnchor="middle"
        className={cn("text-[11px]", pilier ? "fill-black" : "fill-text-secondary")}
        style={{ fontWeight: pilier ? 600 : 400 }}
      >
        {label}
      </text>
    </g>
  );

  return (
    <div>
      <div className="rounded-card border border-border bg-card p-4">
        <div className="relative aspect-[320/210] w-full">
          {/* Couche STRUCTURÉE */}
          <svg
            viewBox="0 0 320 210"
            aria-hidden="true"
            className={cn(
              "absolute inset-0 h-full w-full transition-opacity duration-500",
              structured ? "opacity-100" : "opacity-0",
            )}
          >
            <g className="stroke-accent/50" strokeWidth="1.5">
              <line x1="160" y1="34" x2="47" y2="92" />
              <line x1="160" y1="34" x2="121" y2="92" />
              <line x1="160" y1="34" x2="199" y2="92" />
              <line x1="160" y1="34" x2="273" y2="92" />
              <line x1="86" y1="118" x2="160" y2="168" />
              <line x1="160" y1="118" x2="160" y2="168" />
              <line x1="234" y1="118" x2="160" y2="168" />
            </g>
            <Node x={121} y={8} label="Accueil" pilier />
            <Node x={8} y={92} label="Création" />
            <Node x={82} y={92} label="Branding" />
            <Node x={160} y={92} label="SEO" />
            <Node x={234} y={92} label="Auto & IA" />
            <Node x={121} y={168} label="Contact" />
          </svg>

          {/* Couche DÉSORGANISÉE */}
          <svg
            viewBox="0 0 320 210"
            aria-hidden="true"
            className={cn(
              "absolute inset-0 h-full w-full transition-opacity duration-500",
              structured ? "opacity-0" : "opacity-100",
            )}
          >
            <g className="stroke-text-muted/60" strokeWidth="1">
              <line x1="40" y1="30" x2="250" y2="150" />
              <line x1="230" y1="20" x2="60" y2="160" />
              <line x1="150" y1="90" x2="20" y2="40" />
              <line x1="280" y1="120" x2="120" y2="30" />
              <line x1="70" y1="140" x2="260" y2="60" />
            </g>
            <Node x={20} y={20} label="Accueil" />
            <Node x={220} y={12} label="Création" />
            <Node x={12} y={130} label="Branding" />
            <Node x={240} y={140} label="SEO" />
            <Node x={130} y={80} label="Auto & IA" />
            <Node x={200} y={95} label="Contact" />
          </svg>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setStructured((s) => !s)}
        aria-pressed={structured}
        className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-btn border border-accent px-6 py-2.5 text-sm font-medium text-accent transition-colors duration-200 hover:bg-accent hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {structured ? "Voir une structure désorganisée" : "Voir une architecture structurée"}
      </button>
      <p className="mt-3 text-xs text-text-muted">
        Illustration de la <strong className="font-medium text-text-secondary">structure</strong> et
        du maillage interne — pas une prédiction de position ni de trafic.
      </p>
    </div>
  );
}
