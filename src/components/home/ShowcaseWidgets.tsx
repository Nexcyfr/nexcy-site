"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Cellule de la grille de démonstration, avec légende dorée. */
export function DemoCell({
  caption,
  children,
  className,
}: {
  caption: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-[180px] flex-col justify-between border-border bg-surface/40 p-6",
        className,
      )}
    >
      <div className="flex flex-1 items-center justify-center">{children}</div>
      <p className="mt-4 text-[10px] uppercase tracking-widest2 text-accent/70">
        {caption}
      </p>
    </div>
  );
}

/** Démo 1 — bouton à micro-états (idle → chargement → confirmation). */
export function DemoButton() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  const run = () => {
    if (state !== "idle") return;
    setState("loading");
    window.setTimeout(() => setState("done"), 900);
    window.setTimeout(() => setState("idle"), 2200);
  };

  return (
    <button
      type="button"
      onClick={run}
      aria-label="Démonstration d'un bouton à états"
      className={cn(
        "inline-flex min-h-[44px] min-w-[150px] items-center justify-center gap-2 rounded-btn border px-6 py-3 text-sm font-medium transition-colors duration-300",
        state === "done"
          ? "border-accent bg-accent text-black"
          : "border-accent text-accent hover:bg-accent hover:text-black",
      )}
    >
      {state === "idle" && "Envoyer"}
      {state === "loading" && (
        <span className="h-4 w-4 animate-spin rounded-full border border-current border-t-transparent" />
      )}
      {state === "done" && (
        <>
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden="true">
            <path
              d="M5 10l3.5 3.5L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Confirmé
        </>
      )}
    </button>
  );
}

/** Démo 2 — carte à parallaxe légère sur le visuel au survol. */
export function DemoParallaxCard() {
  const ref = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const inner = layer.current;
      if (!el || !inner) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const move = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(inner, { x: x * 16, y: y * 16, duration: 0.5, ease: "power2.out" });
      };
      const reset = () => gsap.to(inner, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", reset);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", reset);
      };
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className="relative h-24 w-full overflow-hidden rounded-card border border-border"
      aria-label="Carte à parallaxe"
    >
      <div
        ref={layer}
        className="absolute inset-[-12px] will-change-transform"
        style={{
          background:
            "radial-gradient(circle at 60% 40%, color-mix(in srgb, var(--color-accent) 35%, transparent), transparent 55%), linear-gradient(135deg, var(--color-card), var(--color-black))",
        }}
      />
    </div>
  );
}

/** Démo 4 — ligne qui se dessine en boucle douce (pause au reduced-motion). */
export function DemoLine() {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { scaleX: 1 });
        return;
      }
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power2.inOut",
          repeat: -1,
          repeatDelay: 0.6,
          yoyo: true,
          transformOrigin: "left center",
        },
      );
    },
    { scope: ref },
  );

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="block h-px w-full bg-accent will-change-transform"
    />
  );
}
