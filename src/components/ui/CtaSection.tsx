import { TextReveal } from "@/components/animations/TextReveal";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface CtaSectionProps {
  title: string;
  /** Paragraphe descriptif optionnel, entre le titre et le bouton. */
  subtitle?: string;
  buttonLabel: string;
  buttonHref: string;
  /** Ligne de réassurance sous le bouton (optionnelle). */
  note?: string;
  className?: string;
}

/** Bande CTA finale réutilisable (Home / Services / Studio). */
export function CtaSection({
  title,
  subtitle,
  buttonLabel,
  buttonHref,
  note,
  className,
}: CtaSectionProps) {
  return (
    <section
      aria-labelledby="cta-title"
      className={cn(
        "section-y relative overflow-hidden border-t border-border bg-black text-center",
        className,
      )}
    >
      {/* Trame de plan — la bande de conversion appartient au même système. */}
      <div
        aria-hidden="true"
        className="plan-grid plan-grid-fade pointer-events-none absolute inset-0 opacity-70"
      />
      <div className="container-site relative z-10 flex flex-col items-center">
        <TextReveal
          as="h2"
          id="cta-title"
          className="t-h2 max-w-3xl text-text-primary"
        >
          {title}
        </TextReveal>

        {subtitle ? (
          <MotionReveal className="mt-6">
            <p className="t-lead measure mx-auto">{subtitle}</p>
          </MotionReveal>
        ) : null}

        <MotionReveal className="mt-10">
          <Button href={buttonHref} variant="primary">
            {buttonLabel}
          </Button>
        </MotionReveal>

        {note ? (
          <p className="t-tech mt-6 text-text-muted">{note}</p>
        ) : null}
      </div>
    </section>
  );
}
