import { cn } from "@/lib/utils";

interface MonogramProps {
  className?: string;
  /** Épaisseur du tracé. */
  strokeWidth?: number;
  title?: string;
}

/**
 * Monogramme N inline (hérite de currentColor) — Master Brief §6/§21.
 * Réutilisé : header, footer, filigranes, préloader.
 */
export function Monogram({ className, strokeWidth = 11, title }: MonogramProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={cn("block", className)}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M26 78 V22 L74 78 V22"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
