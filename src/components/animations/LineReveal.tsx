"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface LineRevealProps {
  className?: string;
  /** Orientation de la ligne. */
  orientation?: "horizontal" | "vertical";
  /** Couleur de la ligne (classe Tailwind bg-*). */
  color?: string;
  start?: string;
  delay?: number;
}

/**
 * Ligne qui se dessine (scaleX/scaleY 0→1) au scroll — Master Brief §28.
 * Usage : séparateurs animés, underlines de titre, détails dorés.
 * GPU uniquement (transform). Reduced-motion : ligne affichée directement.
 */
export function LineReveal({
  className,
  orientation = "horizontal",
  color = "bg-accent",
  start = "top 90%",
  delay = 0,
}: LineRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isH = orientation === "horizontal";

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const prop = isH ? "scaleX" : "scaleY";

      if (reduce) {
        gsap.set(el, { [prop]: 1 });
        return;
      }

      gsap.fromTo(
        el,
        { [prop]: 0, willChange: "transform" },
        {
          [prop]: 1,
          duration: 0.9,
          ease: "power3.inOut",
          delay,
          scrollTrigger: { trigger: el, start, once: true },
          onComplete: () => gsap.set(el, { willChange: "auto" }),
        },
      );
    },
    { scope: ref },
  );

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(
        "block",
        color,
        isH ? "h-px w-full origin-left" : "w-px h-full origin-top",
        className,
      )}
    />
  );
}
