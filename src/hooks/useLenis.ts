"use client";

import { createContext, useContext } from "react";
import type Lenis from "lenis";

/** Contexte exposant l'instance Lenis unique du site. */
export const LenisContext = createContext<Lenis | null>(null);

/** Accès à l'instance Lenis (peut être null en SSR / reduced-motion). */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}
