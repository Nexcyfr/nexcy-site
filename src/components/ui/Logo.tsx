import Image from "next/image";
import { cn } from "@/lib/utils";

// Logotype NEXCY réel (trait fin) — ratio 900×199 ≈ 4.52:1.
const RATIO = 900 / 199;

interface LogoProps {
  /** Largeur de rendu en px. La hauteur est déduite du ratio. */
  width?: number;
  className?: string;
  priority?: boolean;
}

/** Logotype NEXCY (version blanche, pour fond sombre). */
export function Logo({ width = 118, className, priority = false }: LogoProps) {
  const height = Math.round(width / RATIO);
  return (
    <Image
      src="/assets/brand/logo-nexcy-blanc.png"
      alt="NEXCY"
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto select-none", className)}
      sizes={`${width}px`}
    />
  );
}
