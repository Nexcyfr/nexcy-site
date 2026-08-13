import { SectionHead } from "@/components/ui/SectionHead";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { LineReveal } from "@/components/animations/LineReveal";
import { methodSteps } from "@/data/method";

/**
 * Méthode — une ligne de cote, quatre repères.
 *
 * Reprend le vocabulaire du Hero : un trait de mesure gradué, sur lequel les
 * quatre étapes sont posées comme des points de contrôle. La ligne se dessine
 * à l'entrée dans le viewport — la seule animation de la section.
 *
 * Composée en une hauteur d'écran plutôt qu'en colonne collante : quatre
 * phrases courtes ne justifient pas trois écrans de défilement.
 */
export function HomeMethod() {
  return (
    <section
      aria-labelledby="home-method-title"
      className="section-y border-t border-border bg-black"
    >
      <div className="container-site">
        <SectionHead
          index="03"
          kicker="Méthode"
          titleId="home-method-title"
          title="Quatre étapes, aucune surprise."
          lead={
            <p>
              Vous savez à chaque instant où en est le projet, ce qui a été
              décidé et ce qui reste à trancher. Rien n&apos;avance sans votre
              validation explicite.
            </p>
          }
        />

        <div className="mt-16 lg:mt-24">
          {/* La ligne de cote — horizontale en desktop, portée à gauche sinon. */}
          <div className="relative hidden lg:block">
            <LineReveal color="bg-line-strong" />
            <div className="absolute inset-x-0 top-0 grid grid-cols-4">
              {methodSteps.map((step, i) => (
                <span
                  key={step.index}
                  aria-hidden="true"
                  className={`block h-2.5 w-px ${i === 0 ? "bg-accent" : "bg-line-strong"}`}
                />
              ))}
            </div>
          </div>

          <ol className="grid gap-x-10 gap-y-0 lg:grid-cols-4">
            {methodSteps.map((step, i) => (
              <li
                key={step.index}
                className="relative border-t border-border py-8 pl-8 lg:border-t-0 lg:pl-0 lg:pt-8"
              >
                {/* Repère de cote en mobile : la ligne passe à la verticale. */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-full w-px bg-border lg:hidden"
                />
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-8 w-px bg-accent lg:hidden"
                />

                <MotionReveal delay={i * 0.08}>
                  <p className="t-tech text-accent">{step.index}</p>
                  <h3 className="t-h3 mt-5 text-text-primary">{step.title}</h3>
                  <p className="t-body mt-3 text-text-secondary">
                    {step.description}
                  </p>
                </MotionReveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
