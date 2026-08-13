"use client";

import { useEffect, useRef } from "react";
import { buildPlan } from "./system";
import { drawPlan } from "./render";

/**
 * Surface de rendu du plan.
 *
 * Séparation stricte des responsabilités :
 *   – `getProgress` est la seule entrée de scroll (le contrôleur vit dans HomeHero) ;
 *   – `system.ts` produit la géométrie ;
 *   – `render.ts` dessine ;
 *   – ce composant ne fait que la plomberie : taille, DPR, cadence, nettoyage.
 *
 * Deux chemins de peinture, qui appellent la même fonction pure :
 *   1. immédiat — au montage, au redimensionnement, et sur demande du scroll ;
 *   2. continu — une boucle rAF, uniquement pour l'amortissement et les impulsions.
 *
 * Le chemin immédiat est le filet de sécurité : si rAF est bridé (onglet en
 * arrière-plan, économie d'énergie, restauration depuis le bfcache), le plan
 * reste peint. Un Hero noir n'est jamais acceptable.
 */
export function PlanCanvas({
  getProgress,
  compact,
  reduced,
  staticProgress = 0.82,
  onPhaseChange,
  onReady,
}: {
  getProgress: () => number;
  compact: boolean;
  reduced: boolean;
  staticProgress?: number;
  onPhaseChange?: (progress: number) => void;
  /** Reçoit un déclencheur de repeinte immédiate, à appeler depuis le scroll. */
  onReady?: (requestPaint: () => void) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Refs plutôt que state : la boucle lit les valeurs courantes sans re-render.
  const getProgressRef = useRef(getProgress);
  const onPhaseChangeRef = useRef(onPhaseChange);
  const onReadyRef = useRef(onReady);
  getProgressRef.current = getProgress;
  onPhaseChangeRef.current = onPhaseChange;
  onReadyRef.current = onReady;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const model = buildPlan(compact ? "compact" : "full");
    let width = 0;
    let height = 0;
    let raf = 0;
    let startedAt = 0;
    let lastFrameAt = 0;
    let smoothed = reduced ? staticProgress : getProgressRef.current();
    let disposed = false;

    /** Redimensionne le buffer. Réinitialise le contexte, donc impose une repeinte. */
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // DPR plafonné à 2 : au-delà, le coût de remplissage double sans gain visible.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = (progress: number, time: number) => {
      drawPlan(ctx, { model, progress, time, width, height, compact });
      onPhaseChangeRef.current?.(progress);
    };

    const elapsed = () =>
      startedAt ? (performance.now() - startedAt) / 1000 : 0;

    resize();
    startedAt = performance.now();
    // Première image peinte tout de suite : jamais une frame de noir.
    paint(smoothed, 0);

    /**
     * Repeinte immédiate, appelée par le contrôleur de scroll.
     * Court-circuitée quand la boucle rAF tourne : elle a déjà la main.
     */
    const requestPaint = () => {
      if (disposed || reduced) return;
      if (performance.now() - lastFrameAt < 120) return;
      smoothed = getProgressRef.current();
      paint(smoothed, elapsed());
    };
    onReadyRef.current?.(requestPaint);

    if (!reduced) {
      const frame = (now: number) => {
        if (disposed) return;
        lastFrameAt = now;

        // Amortissement vers la cible : lissage sans dérive — on interpole vers
        // une valeur absolue, jamais de façon cumulative.
        const target = getProgressRef.current();
        smoothed += (target - smoothed) * 0.16;
        if (Math.abs(target - smoothed) < 0.0004) smoothed = target;

        paint(smoothed, elapsed());
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    }

    // ResizeObserver plutôt que l'événement window : capte aussi les changements
    // de mise en page (barres dynamiques Safari, rotation, split view).
    let lastW = width;
    let lastH = height;
    const ro = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (!box) return;
      const w = Math.round(box.width);
      const h = Math.round(box.height);
      // Ignore les micro-variations de hauteur (barre d'URL mobile) : elles
      // provoqueraient un recadrage permanent sans rien changer à la composition.
      if (w === lastW && Math.abs(h - lastH) < 60) return;
      lastW = w;
      lastH = h;
      resize();
      // Le buffer vient d'être vidé : on repeint sans attendre la frame suivante.
      paint(reduced ? staticProgress : smoothed, elapsed());
    });
    ro.observe(canvas);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [compact, reduced, staticProgress]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="block h-full w-full"
      style={{ background: "#080808" }}
    />
  );
}
