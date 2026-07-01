"use client";

import { createElement, useRef, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface TextRevealProps {
  children: string;
  as?: ElementType;
  className?: string;
  /** id transmis à l'élément racine (ex. cible d'aria-labelledby). */
  id?: string;
  /** Décalage de départ du ScrollTrigger. */
  start?: string;
  delay?: number;
}

/**
 * Révélation de texte mot par mot (Master Brief §12 / §28).
 * - Split manuel par mots (pas de plugin SplitText payant).
 * - Chaque mot : masque overflow-hidden + translate y 110%→0 (GPU).
 * - Le texte reste présent dans le DOM (SEO / lecteurs d'écran).
 * - prefers-reduced-motion : apparition directe, aucune transformation.
 */
export function TextReveal({
  children,
  as = "p",
  className,
  id,
  start = "top 85%",
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const words = children.split(" ");

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const inners = ref.current?.querySelectorAll<HTMLElement>("[data-word-inner]");
      if (!inners || inners.length === 0) return;

      if (reduce) {
        gsap.set(inners, { yPercent: 0, opacity: 1 });
        return;
      }

      gsap.set(inners, { yPercent: 110 });
      gsap.to(inners, {
        yPercent: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.06,
        delay,
        scrollTrigger: {
          trigger: ref.current,
          start,
          once: true,
        },
      });
    },
    { scope: ref },
  );

  return createElement(
    as,
    { ref, id, className },
    words.map((word, i) => (
      <span
        key={i}
        className="inline-block overflow-hidden align-bottom"
        style={{ marginRight: i < words.length - 1 ? "0.26em" : undefined }}
      >
        <span data-word-inner className="inline-block will-change-transform">
          {word}
        </span>
      </span>
    )),
  );
}
