import type { ReactNode } from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { DemoBranding } from "@/components/home/demonstrations/DemoBranding";
import { DemoResponsive } from "@/components/home/demonstrations/DemoResponsive";
import { DemoSeo } from "@/components/home/demonstrations/DemoSeo";
import { DemoWorkflow } from "@/components/home/demonstrations/DemoWorkflow";

interface DemoRowProps {
  id: string;
  title: string;
  value: string;
  description: string;
  reversed?: boolean;
  children: ReactNode;
}

function DemoRow({ id, title, value, description, reversed, children }: DemoRowProps) {
  return (
    <div
      className={cn(
        "grid items-center gap-8 lg:grid-cols-2 lg:gap-16",
        reversed && "lg:[&>*:first-child]:order-2",
      )}
    >
      {/* Colonne texte */}
      <div>
        <p className="text-xs uppercase tracking-widest2 text-accent">
          Démonstration NEXCY
        </p>
        <TextReveal
          as="h3"
          id={id}
          className="mt-4 text-2xl font-bold leading-tight tracking-tight text-text-primary md:text-3xl"
        >
          {title}
        </TextReveal>
        <p className="mt-4 text-lg font-light leading-relaxed text-text-primary">
          {value}
        </p>
        <p className="mt-3 max-w-md text-base leading-relaxed text-text-secondary">
          {description}
        </p>
      </div>

      {/* Colonne module interactif */}
      <FadeIn y={20}>
        <div aria-labelledby={id}>{children}</div>
      </FadeIn>
    </div>
  );
}

/**
 * Section « Savoir-faire en action » — démonstrations client-facing (audit V2 P1-2).
 * Composition éditoriale alternée (pas une grille de cartes identiques).
 * Chaque module est une « Démonstration NEXCY » (jamais un projet client).
 */
export function HomeDemonstrations() {
  return (
    <section
      aria-labelledby="home-demo-title"
      className="section-y border-t border-border bg-surface"
    >
      <div className="container-site">
        <SectionLabel label="02 / Démonstration" />
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-16">
          <TextReveal
            as="h2"
            id="home-demo-title"
            className="text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl"
          >
            Ce site est notre démonstration.
          </TextReveal>
          <FadeIn>
            <p className="max-w-md text-base leading-relaxed text-text-secondary lg:mt-2">
              Ces modules illustrent notre méthode — ils ne représentent pas des
              projets clients, mais montrent comment nous pensons chaque système :
              identité, interface, structure et automatisation.
            </p>
          </FadeIn>
        </div>

        <div className="mt-20 flex flex-col gap-24">
          <DemoRow
            id="demo-branding"
            title="Identité → système"
            value="D'une identité dispersée à un système cohérent."
            description="Un logo, des couleurs, une typographie et des composants qui s'alignent en un système réutilisable."
          >
            <DemoBranding />
          </DemoRow>

          <DemoRow
            id="demo-web"
            title="Une interface, chaque écran"
            value="Une expérience cohérente sur chaque écran."
            description="La navigation, la hiérarchie et les cartes se recomposent du desktop au mobile — pas une simple réduction."
            reversed
          >
            <DemoResponsive />
          </DemoRow>

          <DemoRow
            id="demo-seo"
            title="Architecture SEO"
            value="Une architecture pensée pour être comprise et trouvée."
            description="Une page pilier, des pages d'expertise et un maillage interne clair — pour les visiteurs comme pour les moteurs."
          >
            <DemoSeo />
          </DemoRow>

          <DemoRow
            id="demo-auto"
            title="Workflow automatisé"
            value="Des outils connectés, moins de tâches manuelles."
            description="Un enchaînement où l'IA assiste et où la décision reste humaine — ce qui est automatisé est clairement distingué."
            reversed
          >
            <DemoWorkflow />
          </DemoRow>
        </div>

        <FadeIn className="mt-24 text-center">
          <Button href="/contact" variant="primary">
            Démarrer un projet
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
