"use client";

import { createElement, useRef, type CSSProperties, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, DURATION, STAGGER } from "@/lib/motion/tokens";
import { MQ } from "@/lib/motion/mediaQueries";

interface TextRevealProps {
  children: string;
  as?: ElementType;
  className?: string;
  /** id transmis à l'élément racine (ex. cible d'aria-labelledby). */
  id?: string;
  /** Décalage de départ du ScrollTrigger. */
  start?: string;
  delay?: number;
  /**
   * `words` (défaut) : masque + décalage mot par mot (staggé) — comportement
   * historique. `container` : un seul masque pour tout le bloc (signature V3).
   */
  mode?: "words" | "container";
}

/** Masque bas de ligne : les jambages ne sont pas rognés (compensé par marge). */
const MASK_STYLE: CSSProperties = { paddingBottom: "0.12em", marginBottom: "-0.12em" };

/**
 * Révélation de texte au scroll — wrappers React déterministes (aucun découpage
 * DOM non déterministe avant hydratation, pas de SplitText).
 * Le texte reste présent et lisible dans le DOM (SEO / lecteurs d'écran).
 * prefers-reduced-motion : apparition directe, aucune transformation.
 */
export function TextReveal({
  children,
  as = "p",
  className,
  id,
  start = "top 85%",
  delay = 0,
  mode = "words",
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const words = children.split(" ");

  useGSAP(
    () => {
      const inners = ref.current?.querySelectorAll<HTMLElement>("[data-reveal-inner]");
      if (!inners || inners.length === 0) return;

      if (window.matchMedia(MQ.reduce).matches) {
        gsap.set(inners, { yPercent: 0, opacity: 1 });
        return;
      }

      gsap.set(inners, { yPercent: 110, willChange: "transform" });
      gsap.to(inners, {
        yPercent: 0,
        duration: mode === "words" ? 0.6 : DURATION.reveal,
        ease: mode === "words" ? "power3.out" : EASE.cinematic,
        stagger: mode === "words" ? STAGGER.uiGroup : 0,
        delay,
        scrollTrigger: { trigger: ref.current, start, once: true },
        onComplete: () => gsap.set(inners, { willChange: "auto" }),
      });
    },
    { scope: ref },
  );

  if (mode === "container") {
    return createElement(
      as,
      { ref, id, className },
      <span className="inline-block overflow-hidden align-bottom" style={MASK_STYLE}>
        <span data-reveal-inner className="inline-block">
          {children}
        </span>
      </span>,
    );
  }

  return createElement(
    as,
    { ref, id, className },
    words.map((word, i) => (
      <span
        key={i}
        className="inline-block overflow-hidden align-bottom"
        style={{ ...MASK_STYLE, marginRight: i < words.length - 1 ? "0.26em" : undefined }}
      >
        <span data-reveal-inner className="inline-block">
          {word}
        </span>
      </span>
    )),
  );
}
