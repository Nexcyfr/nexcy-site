"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface CountUpProps {
  /** Valeur cible. */
  value: number;
  /** Nombre de chiffres (zero-pad). Ex. 2 → "01". */
  pad?: number;
  className?: string;
  duration?: number;
}

/**
 * Compteur 0→N au scroll (Master Brief §12).
 * Décoratif : marqué aria-hidden, valeur finale exposée en fallback statique.
 */
export function CountUp({ value, pad = 2, className, duration = 1 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const format = (n: number) => String(Math.round(n)).padStart(pad, "0");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        el.textContent = format(value);
        return;
      }

      const counter = { n: 0 };
      gsap.to(counter, {
        n: value,
        duration,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = format(counter.n);
        },
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} aria-hidden="true" className={cn("tabular-nums", className)}>
      {String(value).padStart(pad, "0")}
    </span>
  );
}
