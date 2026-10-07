"use client";

import { useEffect, useRef, type RefObject } from "react";
import { MQ } from "@/lib/motion/mediaQueries";

interface UsePointerMotionOptions {
  /** Désactive le suivi (reduced-motion, etc.). */
  disabled?: boolean;
}

/**
 * Suit le pointeur au-dessus d'un élément — desktop + pointeur fin UNIQUEMENT.
 * Appelle `onMove(nx, ny)` avec des coordonnées normalisées **-1..1** relatives
 * au centre de l'élément (centre = 0, bord gauche/haut = -1, bord droit/bas = 1).
 * L'amplitude visuelle est appliquée par le CONSOMMATEUR, jamais encodée ici.
 * Reset à (0, 0) sur `pointerleave`.
 *
 * Plomberie mutualisée pour MagneticTarget et la parallaxe pointeur du hero :
 * - gating desktop/pointeur-fin ;
 * - throttle rAF (rAF planifié uniquement sur mouvement, aucune boucle permanente) ;
 * - listeners + rAF nettoyés au démontage.
 * Le comportement (pull magnétique / décalage de couches) reste chez le consommateur.
 */
export function usePointerMotion(
  target: RefObject<HTMLElement>,
  onMove: (nx: number, ny: number) => void,
  { disabled = false }: UsePointerMotionOptions = {},
) {
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  useEffect(() => {
    if (disabled) return;
    const el = target.current;
    if (!el) return;
    if (!window.matchMedia(MQ.pointerFine).matches) return;

    let raf = 0;
    const onPointerMove = (event: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
        onMoveRef.current(nx, ny);
      });
    };
    const onPointerLeave = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      onMoveRef.current(0, 0);
    };

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);
    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, disabled]);
}
