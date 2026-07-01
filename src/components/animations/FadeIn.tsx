"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance de translation verticale initiale (px). */
  y?: number;
  /** Applique un léger scale (images — Brief §12 FadeIn). */
  scale?: boolean;
  start?: string;
  as?: "div" | "section" | "article" | "li" | "span";
}

/**
 * Révélation opacity + translateY (+ scale optionnel) au scroll.
 * GPU uniquement. prefers-reduced-motion : simple fondu, sans transform.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = 24,
  scale = false,
  start = "top 88%",
  as = "div",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.4,
            delay,
            scrollTrigger: { trigger: el, start, once: true },
          },
        );
        return;
      }

      gsap.fromTo(
        el,
        { opacity: 0, y, scale: scale ? 1.04 : 1 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          delay,
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    },
    { scope: ref },
  );

  const Tag = as;
  return (
    <Tag ref={ref as never} className={cn("will-change-transform", className)}>
      {children}
    </Tag>
  );
}
