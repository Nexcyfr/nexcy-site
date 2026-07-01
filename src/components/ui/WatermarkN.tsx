import { Monogram } from "@/components/ui/Monogram";
import { cn } from "@/lib/utils";

/**
 * Monogramme N en filigrane décoratif (opacité 5 %) — Master Brief §6 / §13.
 * Positionné en absolu par le parent (qui doit être relative + overflow-hidden).
 */
export function WatermarkN({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute select-none watermark-n", className)}
    >
      <Monogram className="h-full w-full" strokeWidth={6} />
    </div>
  );
}
