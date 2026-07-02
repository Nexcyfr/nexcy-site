"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** Se déclenche une seule fois puis se déconnecte (autoplay). */
  once?: boolean;
  /** Marge de pré-déclenchement (chargement anticipé). */
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * Observe l'entrée/sortie d'un élément dans le viewport (§ infra média).
 * Réutilisable pour l'autoplay des démonstrations et la pause hors-viewport.
 * SSR-safe : `inView` = false au 1ᵉʳ rendu. Nettoie l'observer au démontage.
 */
export function useInView<T extends Element = HTMLDivElement>({
  once = false,
  rootMargin = "0px",
  threshold = 0,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true); // fallback : contenu visible sans observer
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin, threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [once, rootMargin, threshold]);

  return { ref, inView } as const;
}
