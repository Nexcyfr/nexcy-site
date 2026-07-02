import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
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
      <div className="container-site relative z-10 flex flex-col items-center">
        <TextReveal
          as="h2"
          id="cta-title"
          className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl"
        >
          {title}
        </TextReveal>

        {subtitle ? (
          <FadeIn className="mt-6">
            <p className="mx-auto max-w-xl text-lg leading-relaxed text-text-secondary">
              {subtitle}
            </p>
          </FadeIn>
        ) : null}

        <FadeIn className="mt-10">
          <Button href={buttonHref} variant="primary">
            {buttonLabel}
          </Button>
        </FadeIn>

        {note ? (
          <p className="mt-6 text-xs text-text-muted">{note}</p>
        ) : null}
      </div>
    </section>
  );
}
