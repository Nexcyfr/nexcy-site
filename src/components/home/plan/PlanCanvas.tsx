"use client";

import { useEffect, useRef } from "react";
import { buildPlan } from "./system";
import { drawPlan } from "./render";

/**
 * Cadence de repeinte (ms entre deux images).
 *
 * - `scrub` : la progression de scroll change → on suit l'écran (desktop 60 Hz,
 *   mobile plafonné à ~30 Hz : l'œil ne distingue pas la différence sur un plan
 *   filaire, le coût CPU est divisé par deux).
 * - `idle` : la progression est stable, seules la respiration et les impulsions
 *   du réseau évoluent. Leur mouvement est lent : ~20 Hz suffit amplement.
 */
const FRAME_MS = {
  full: { scrub: 0, idle: 50 },
  compact: { scrub: 32, idle: 80 },
} as const;

/** DPR maximal : le coût de remplissage croît avec le carré du DPR. */
const DPR_CAP = { full: 2, compact: 1.5 } as const;

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
 * La boucle ne tourne que si le plan est réellement visible : elle s'arrête hors
 * viewport (IntersectionObserver) et quand l'onglet est caché (visibilitychange).
 * Le chemin immédiat reste le filet de sécurité : si rAF est bridé ou si le plan
 * revient dans le viewport, une image est repeinte tout de suite. Un Hero noir
 * n'est jamais acceptable.
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

    const density = compact ? "compact" : "full";
    const cadence = FRAME_MS[density];
    const dprCap = DPR_CAP[density];

    const model = buildPlan(density);
    let width = 0;
    let height = 0;
    let raf = 0;
    let startedAt = 0;
    let lastPaintAt = 0;
    let smoothed = reduced ? staticProgress : getProgressRef.current();
    let disposed = false;
    let inView = true;
    let tabVisible = !document.hidden;

    /** Redimensionne le buffer. Réinitialise le contexte, donc impose une repeinte. */
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = (progress: number, time: number) => {
      lastPaintAt = performance.now();
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
     * Court-circuitée quand la boucle rAF vient de peindre : elle a la main.
     */
    const requestPaint = () => {
      if (disposed || reduced || !inView || !tabVisible) return;
      if (performance.now() - lastPaintAt < 120) return;
      smoothed = getProgressRef.current();
      paint(smoothed, elapsed());
    };
    onReadyRef.current?.(requestPaint);

    const frame = (now: number) => {
      raf = 0;
      if (disposed || !inView || !tabVisible) return;

      // Amortissement vers la cible : lissage sans dérive — on interpole vers
      // une valeur absolue, jamais de façon cumulative.
      const target = getProgressRef.current();
      const scrubbing = Math.abs(target - smoothed) >= 0.0004;
      const minGap = scrubbing ? cadence.scrub : cadence.idle;

      if (now - lastPaintAt >= minGap) {
        if (scrubbing) smoothed += (target - smoothed) * 0.16;
        else smoothed = target;
        paint(smoothed, elapsed());
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (reduced || disposed || raf || !inView || !tabVisible) return;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // Pause hors viewport : le Hero est sticky dans une section haute, mais
    // une fois dépassé il n'a plus aucune raison de consommer du CPU.
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        inView = entry.isIntersecting;
        if (inView) {
          smoothed = reduced ? staticProgress : getProgressRef.current();
          paint(smoothed, elapsed());
          start();
        } else {
          stop();
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    // Onglet caché : on s'arrête, on reprend sur une image à jour.
    const onVisibility = () => {
      tabVisible = !document.hidden;
      if (tabVisible) {
        if (inView) {
          smoothed = reduced ? staticProgress : getProgressRef.current();
          paint(smoothed, elapsed());
          start();
        }
      } else {
        stop();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    start();

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
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
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
