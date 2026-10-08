import { cn } from "@/lib/utils";

/** Séparateur horizontal fin — 1px solid border (Master Brief §28). */
export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-border", className)} />;
}
