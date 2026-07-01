import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import {
  DemoCell,
  DemoButton,
  DemoParallaxCard,
  DemoLine,
} from "@/components/home/ShowcaseWidgets";

/**
 * « Savoir-faire en action » — vitrine technique live (Master Brief §13 Section 3).
 * Le site lui-même est la démonstration : 4 micro-composants animés dans une grille fine.
 */
export function HomeShowcase() {
  return (
    <section
      aria-labelledby="home-showcase-title"
      className="section-y border-t border-border bg-surface"
    >
      <div className="container-site">
        <SectionLabel label="02 / Démonstration" />

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-16">
          <TextReveal
            as="h2"
            id="home-showcase-title"
            className="text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl"
          >
            Ce site est notre démonstration.
          </TextReveal>
          <FadeIn>
            <p className="max-w-md text-base leading-relaxed text-text-secondary lg:mt-2">
              Pas de portfolio, pas de promesses. Chaque animation que vous
              observez, chaque interaction que vous vivez, chaque détail que vous
              percevez — c&apos;est le niveau que nous livrons à nos clients.
            </p>
          </FadeIn>
        </div>

        {/* Grille de démonstration — bordures fines, légendes dorées */}
        <FadeIn className="mt-16">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            <DemoCell caption="Composant / Animation">
              <TextReveal
                as="p"
                className="text-center text-lg font-medium text-text-primary"
              >
                Precision in Motion
              </TextReveal>
            </DemoCell>

            <DemoCell caption="Composant / Animation">
              <DemoParallaxCard />
            </DemoCell>

            <DemoCell caption="Composant / Animation">
              <DemoButton />
            </DemoCell>

            <DemoCell caption="Composant / Animation">
              <DemoLine />
            </DemoCell>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
