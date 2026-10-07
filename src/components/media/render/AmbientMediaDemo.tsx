"use client";

import { AmbientMedia } from "@/components/media/AmbientMedia";

/** Fallback codé minimal pour la démo (tient lieu de scène du hero). */
function CodedFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black to-surface">
      <span className="text-sm uppercase tracking-widest2 text-text-muted">
        scène codée (fallback)
      </span>
    </div>
  );
}

/**
 * Démo DEV de `AmbientMedia` (§11 Lot 1) — jamais publique.
 * Page défilable : le média est sous la ligne de flottaison pour tester
 * chargement à l'approche, lecture en vue, pause hors-viewport, fallback 404.
 * Les sources pointent vers des fichiers d'exemple (présents ou 404 → fallback).
 */
export function AmbientMediaDemo() {
  return (
    <div className="min-h-[300vh] bg-black text-text-primary">
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm uppercase tracking-widest2 text-text-secondary">
          Défilez ↓ — la vidéo se charge à l&apos;approche du viewport
        </p>
      </div>

      <section className="mx-auto max-w-4xl px-6">
        <AmbientMedia
          className="aspect-video w-full rounded-card border border-border"
          sources={{
            webm: "/assets/video/ambient-sample.webm",
            mp4: "/assets/video/ambient-sample.mp4",
          }}
          poster="/assets/posters/ambient-sample.avif"
          fallback={<CodedFallback />}
        />
      </section>

      <div className="h-screen" />
    </div>
  );
}
