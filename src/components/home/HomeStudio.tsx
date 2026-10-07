import Link from "next/link";
import { SectionHead } from "@/components/ui/SectionHead";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { values } from "@/data/values";

/**
 * Studio — qui exécute, et selon quels principes.
 *
 * Sur une page sans références clients, la crédibilité vient de là : dire
 * précisément comment on travaille et ce qu'on refuse de faire.
 */
export function HomeStudio() {
  return (
    <section
      aria-labelledby="home-studio-title"
      className="section-y relative overflow-hidden border-t border-border bg-surface"
    >
      {/* Trame de plan, très basse intensité — le lien visuel avec le Hero. */}
      <div
        aria-hidden="true"
        className="plan-grid plan-grid-fade pointer-events-none absolute inset-0 opacity-60"
      />

      <div className="container-site relative">
        <SectionHead
          index="05"
          kicker="Studio"
          titleId="home-studio-title"
          title="Une équipe restreinte, un interlocuteur unique."
          lead={
            <p>
              NEXCY est un studio indépendant basé à Bordeaux. Pas de couche
              commerciale entre vous et la personne qui construit : vous parlez
              à celui qui écrit le code et qui répondra dans six mois.
            </p>
          }
        />

        <ul className="mt-16 grid gap-x-16 gap-y-10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {values.map((value, i) => (
            <li key={value.index}>
              <MotionReveal delay={Math.min(i, 4) * 0.06}>
                <div className="plan-rule pt-5">
                  <h3 className="t-h3 text-text-primary">{value.title}</h3>
                  <p className="t-body measure mt-3 text-text-secondary">
                    {value.description}
                  </p>
                </div>
              </MotionReveal>
            </li>
          ))}
        </ul>

        <MotionReveal className="mt-14">
          <Link
            href="/studio"
            className="t-tech inline-flex items-center gap-3 text-text-secondary transition-colors duration-200 hover:text-accent"
          >
            Découvrir le studio
            <span aria-hidden="true" className="block h-px w-8 bg-current" />
          </Link>
        </MotionReveal>
      </div>
    </section>
  );
}
