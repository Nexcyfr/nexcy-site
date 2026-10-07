import { cn } from "@/lib/utils";

interface SectionLabelProps {
  /** Ex. "01 / Expertises". La partie numérique est colorée en doré. */
  label: string;
  className?: string;
}

/**
 * Libellé de section — 11px uppercase tracking large, gris.
 * Le préfixe numérique (avant « / ») est mis en doré (Master Brief §28).
 */
export function SectionLabel({ label, className }: SectionLabelProps) {
  const [num, ...rest] = label.split("/");
  const hasNumber = rest.length > 0;

  return (
    <p
      className={cn(
        "flex items-center gap-2 text-[11px] font-medium uppercase tracking-widest2 text-text-muted",
        className,
      )}
    >
      {hasNumber ? (
        <>
          <span className="text-accent">{num.trim()}</span>
          <span aria-hidden="true" className="text-text-muted">
            /
          </span>
          <span>{rest.join("/").trim()}</span>
        </>
      ) : (
        <span>{label}</span>
      )}
    </p>
  );
}
