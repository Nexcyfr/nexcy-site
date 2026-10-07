"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useMediaCapability } from "@/hooks/useMediaCapability";

interface AmbientMediaProps {
  /** MP4 obligatoire (fallback Safari/iOS) ; WebM optionnel (source primaire). */
  sources: { webm?: string; mp4: string };
  /** Poster AVIF = 1ʳᵉ frame de la vidéo (visible tant que la vidéo n'est pas prête). */
  poster?: string;
  /** Scène codée : rendue au SSR, en reduced-motion, en erreur et si vidéo refusée. */
  fallback: ReactNode;
  /** Le conteneur DOIT imposer un ratio fixe (aspect-*) → zéro CLS. */
  className?: string;
  /** Vidéo purement décorative → aria-hidden (défaut true). */
  decorative?: boolean;
  /** Marge de chargement anticipé avant l'entrée réelle dans le viewport. */
  rootMargin?: string;
}

/**
 * Média d'ambiance hybride (Lot 1 — Infrastructure média).
 *
 * États (§5) : SSR = fallback codé + poster ; hydratation = aucune requête vidéo ;
 * capacité OK + proximité viewport = montage/chargement ; `loadeddata` = fondu ;
 * hors-viewport = pause ; retour = reprise ; erreur/refus autoplay = retour
 * silencieux au poster/fallback ; reduced-motion = aucune requête vidéo.
 *
 * La scène codée (`fallback`) est TOUJOURS présente sous les autres couches :
 * elle sert d'état initial, de fallback et de version reduced-motion.
 */
export function AmbientMedia({
  sources,
  poster,
  fallback,
  className,
  decorative = true,
  rootMargin = "200px",
}: AmbientMediaProps) {
  const allowVideo = useMediaCapability();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [shouldMount, setShouldMount] = useState(false); // proche viewport (sticky)
  const [visible, setVisible] = useState(false); // dans le viewport → play/pause
  const [loaded, setLoaded] = useState(false); // canplay/loadeddata
  const [failed, setFailed] = useState(false); // 404 / erreur / autoplay refusé

  const useVideo = allowVideo && !failed;

  // Observer : monte la vidéo à l'approche du viewport, pilote play/pause.
  useEffect(() => {
    if (!useVideo) return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) setShouldMount(true);
        setVisible(entry.isIntersecting);
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [useVideo, rootMargin]);

  // Lecture / pause réelle selon la visibilité (aucune boucle rAF permanente).
  // play() est appelé dès que le média est visible : sur une vidéo muette c'est
  // autorisé et cela DÉCLENCHE le chargement (preload="none" sans autoplay ne
  // charge rien sinon). `loaded` ne pilote que le fondu poster → vidéo.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !useVideo || !shouldMount) return;
    if (visible) {
      const p = video.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => setFailed(true)); // autoplay/chargement refusé → fallback silencieux
      }
    } else {
      video.pause();
    }
  }, [visible, useVideo, shouldMount]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {/* Couche fallback codée — toujours présente */}
      <div className="absolute inset-0">{fallback}</div>

      {/* Poster — masqué en fondu une fois la vidéo prête */}
      {poster ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
            useVideo && loaded ? "opacity-0" : "opacity-100",
          )}
        />
      ) : null}

      {/* Vidéo — montée uniquement si capable ET proche du viewport */}
      {useVideo && shouldMount ? (
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
          aria-hidden={decorative ? "true" : undefined}
          onLoadedData={() => setLoaded(true)}
          onError={() => setFailed(true)}
        >
          {/* Le navigateur télécharge UNE seule source compatible (WebM sinon MP4). */}
          {sources.webm ? <source src={sources.webm} type="video/webm" /> : null}
          <source src={sources.mp4} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
