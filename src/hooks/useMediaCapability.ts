"use client";

import { useEffect, useState } from "react";

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

/**
 * Détermine si l'on peut charger une vidéo décorative (§3/§4 Lot 1).
 * Défaut prudent : `false` au SSR et au 1ᵉʳ rendu → aucune requête vidéo avant
 * vérification côté client.
 *
 * Refuse la vidéo si :
 * - `prefers-reduced-motion: reduce` ;
 * - `<video>` non supporté ;
 * - viewport < 1024px OU pointeur non précis / pas de hover (tablette/tactile) ;
 * - `navigator.connection.saveData === true` ;
 * - `effectiveType` ∈ {slow-2g, 2g, 3g}.
 *
 * L'ABSENCE de `navigator.connection` (Safari macOS…) ne bloque JAMAIS la vidéo.
 * Toute la logique est encapsulée dans un try/catch : aucune erreur non capturée.
 */
export function useMediaCapability(): boolean {
  const [allow, setAllow] = useState(false);

  useEffect(() => {
    const compute = (): boolean => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

      // Support réel de HTMLVideoElement
      const probe = document.createElement("video");
      if (typeof probe.canPlayType !== "function") return false;

      // Desktop + pointeur précis (exclut tablette/tactile)
      if (!window.matchMedia("(min-width: 1024px)").matches) return false;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return false;

      // Connexion — sans bloquer si l'API est absente
      const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
      if (conn) {
        if (conn.saveData === true) return false;
        if (conn.effectiveType && ["slow-2g", "2g", "3g"].includes(conn.effectiveType)) {
          return false;
        }
      }
      return true;
    };

    const update = () => {
      try {
        setAllow(compute());
      } catch {
        setAllow(false);
      }
    };

    update();

    const queries = [
      window.matchMedia("(min-width: 1024px)"),
      window.matchMedia("(hover: hover) and (pointer: fine)"),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
    ];
    queries.forEach((q) => q.addEventListener("change", update));
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, []);

  return allow;
}
