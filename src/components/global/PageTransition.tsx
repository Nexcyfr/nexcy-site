"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

/** Routes sans transition animée (Master Brief §12). */
const NO_TRANSITION = ["/mentions-legales", "/politique-de-confidentialite"];

/**
 * Transition de page à l'entrée (fade + translateY) — Master Brief §12.
 * Monté via app/template.tsx : remonte à chaque navigation App Router.
 * Entrée : opacity 0→1 + y 20→0, 400ms ease-out. Reduced-motion : instantané.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const skip = NO_TRANSITION.some((r) => pathname.startsWith(r));

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (skip || reduce) {
        gsap.set(el, { opacity: 1, y: 0, clearProps: "transform" });
        return;
      }

      // will-change posé uniquement pendant l'animation, puis retiré : on évite
      // de promouvoir toute la page en couche compositeur en permanence.
      gsap.fromTo(
        el,
        { opacity: 0, y: 20, willChange: "opacity, transform" },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          clearProps: "transform,opacity",
          onComplete: () => {
            gsap.set(el, { willChange: "auto" });
            ScrollTrigger.refresh();
          },
        },
      );
    },
    { dependencies: [pathname], scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
