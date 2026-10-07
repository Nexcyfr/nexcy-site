import { cn } from "@/lib/utils";

interface LineRevealProps {
  className?: string;
  /** Orientation de la ligne. */
  orientation?: "horizontal" | "vertical";
  /** Couleur de la ligne (classe Tailwind bg-*). */
  color?: string;
}

/**
 * Ligne qui se dessine au scroll — CSS pur (transform uniquement).
 * Sans scroll-driven animations ou en mouvement réduit : ligne affichée telle quelle.
 */
export function LineReveal({
  className,
  orientation = "horizontal",
  color = "bg-accent",
}: LineRevealProps) {
  const isH = orientation === "horizontal";
  return (
    <span
      aria-hidden="true"
      className={cn(
        "nx-line block",
        isH ? "nx-line-x h-px w-full origin-left" : "nx-line-y h-full w-px origin-top",
        color,
        className,
      )}
    />
  );
}
