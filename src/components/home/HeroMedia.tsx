"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMediaCapability } from "@/hooks/useMediaCapability";

interface HeroMediaProps {
  mp4: string;
  webm?: string;
  poster?: string;
  className?: string;
  /** Marque AVIF chargé prioritairement si dans le viewport initial. */
  priority?: boolean;
}

/**
 * Couche vidéo ambiante du hero (Lot 3 — Couche 3).
 *
 * Présuppose que la scène codée (HeroScene) est rendue SOUS cette couche.
 * Ne contient donc aucun fallback codé — si la vidéo est indisponible, la
 * scène codée est déjà visible en dessous.
 *
 * Comportement :
 * - SSR / réduit / mobile / tactile / connexion lente → composant non monté.
 * - Approche viewport → vidéo montée (preload="none") et lecture déclenchée.
 * - `loadeddata` → fondu poster → vidéo.
 * - Hors viewport → pause ; retour → reprise.
 * - Erreur / autoplay refusé → démontage silencieux (scène codée reste visible).
 * - Aucune boucle rAF, aucun listener global non nettoyé.
 */
export function HeroMedia({ mp4, webm, poster, className, priority = false }: HeroMediaProps) {
  const allowVideo = useMediaCapability();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [shouldMount, setShouldMount] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const active = allowVideo && !failed;

  // IntersectionObserver : monte la vidéo à l'approche du viewport, pilote play/pause.
  useEffect(() => {
    if (!active) return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) setShouldMount(true);
        setVisible(entry.isIntersecting);
      },
      { rootMargin: priority ? "0px" : "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [active, priority]);

  // Lecture / pause selon visibilité.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !active || !shouldMount) return;
    if (visible) {
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => setFailed(true));
      }
    } else {
      video.pause();
    }
  }, [visible, active, shouldMount]);

  // Si useMediaCapability passe à false après montage, on démonte.
  if (!active) return null;

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden="true"
    >
      {/* Poster — visible tant que la vidéo n'est pas prête */}
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            loaded ? "opacity-0" : "opacity-100",
          )}
        />
      ) : null}

      {/* Vidéo — montée uniquement une fois le viewport approché */}
      {shouldMount ? (
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            loaded ? "opacity-100" : "opacity-0",
          )}
          muted
          playsInline
          loop
          preload="none"
          aria-hidden="true"
          onLoadedData={() => setLoaded(true)}
          onError={() => setFailed(true)}
        >
          {webm ? <source src={webm} type="video/webm" /> : null}
          <source src={mp4} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
