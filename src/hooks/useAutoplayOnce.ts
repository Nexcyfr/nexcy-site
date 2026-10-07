"use client";

import { useEffect, useRef, type RefObject } from "react";
import { ScrollTrigger } from "@/lib/gsap";

interface UseAutoplayOnceOptions {
  /** Élément déclencheur (souvent le scope `useGSAP` du composant). */
  target: RefObject<Element>;
  /** Appelé UNE fois à l'entrée dans le viewport (et ré-appelable via le composant). */
  onEnter: () => void;
  /** Désactive le hook (reduced-motion / mobile faible) — aucun ScrollTrigger créé. */
  disabled?: boolean;
  /** Point de départ ScrollTrigger. */
  start?: string;
}

/**
 * Déclenche `onEnter` UNE seule fois à l'entrée dans le viewport (Motion V3).
 * Responsabilité unique et minimale : créer un seul ScrollTrigger `once`,
 * l'appeler une fois, le tuer au démontage. Aucun state, aucun rendu React
 * (le hook ne retourne rien). Le `once:true` garantit l'appel unique ; le ref
 * interne ne sert qu'à garder la callback fraîche sans recréer le ScrollTrigger.
 * Le hook NE crée/possède aucune timeline et N'EXPOSE PAS
 * play/pause/restart/reverse/replay — timeline & « Rejouer » restent au composant.
 */
export function useAutoplayOnce({
  target,
  onEnter,
  disabled = false,
  start = "top 80%",
}: UseAutoplayOnceOptions): void {
  const onEnterRef = useRef(onEnter);
  onEnterRef.current = onEnter;

  useEffect(() => {
    if (disabled) return;
    const el = target.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => onEnterRef.current(),
    });

    return () => trigger.kill();
  }, [target, disabled, start]);
}
