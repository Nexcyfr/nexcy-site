import type { ReactNode } from "react";
import { TextReveal } from "@/components/animations/TextReveal";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { cn } from "@/lib/utils";

interface SectionHeadProps {
  /** Index à deux chiffres — la numérotation continue du récit de la page. */
  index: string;
  /** Nom de la section, en voix « plan ». */
  kicker: string;
  title: string;
  /** id du titre, cible d'aria-labelledby sur la section. */
  titleId: string;
  /** Paragraphe d'appui, colonne de droite en desktop. */
  lead?: ReactNode;
  className?: string;
}

/**
 * Ouverture de section — le même geste sur toute la page.
 *
 * Cote à gauche (index + nom), titre, appui à droite. Un filet ambre marque le
 * début de chaque section : c'est le trait du plan, repris en typographie.
 */
export function SectionHead({
  index,
  kicker,
  title,
  titleId,
  lead,
  className,
}: SectionHeadProps) {
  return (
    <div className={cn("plan-rule pt-8", className)}>
      <p className="t-tech text-text-muted">
        <span className="text-accent">{index}</span>
        <span className="px-2 text-border" aria-hidden="true">
          /
        </span>
        {kicker}
      </p>

      <div className="mt-8 grid gap-x-16 gap-y-6 lg:grid-cols-[1.15fr_1fr]">
        <TextReveal as="h2" id={titleId} className="t-h2 text-text-primary">
          {title}
        </TextReveal>
        {lead ? (
          <MotionReveal>
            <div className="t-lead measure lg:pt-1">{lead}</div>
          </MotionReveal>
        ) : null}
      </div>
    </div>
  );
}
