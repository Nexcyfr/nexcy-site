import Link from "next/link";
import { SectionHead } from "@/components/ui/SectionHead";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { serviceDetails, maintenanceService } from "@/data/services";

/**
 * Expertises — un index éditorial, pas une grille de cartes.
 *
 * Chaque ligne annonce le domaine et, en regard, le résultat visé. C'est la
 * seule information qui décide un lecteur à ce niveau de lecture ; le détail
 * vit sur /services. La ligne entière est cliquable et mène à l'ancre du service.
 */
const ROWS = [
  ...serviceDetails.map((s) => ({
    index: s.index,
    title: s.title,
    result: s.result,
    href: `/services#service-${s.slug}`,
  })),
  {
    index: maintenanceService.index,
    title: maintenanceService.title,
    result:
      "Un site qui reste rapide, sûr et à jour, avec un rapport mensuel et un interlocuteur joignable.",
    href: "/services#maintenance",
  },
];

export function HomeExpertise() {
  return (
    <section
      aria-labelledby="home-expertise-title"
      className="section-y border-t border-border bg-black"
    >
      <div className="container-site">
        <SectionHead
          index="02"
          kicker="Expertises"
          titleId="home-expertise-title"
          title="Cinq domaines. Un seul système."
          lead={
            <p>
              Chacun se prend séparément. Ensemble, ils composent l&apos;écosystème
              digital d&apos;une entreprise : ce que l&apos;on voit, ce que
              l&apos;on trouve, et ce qui tourne en arrière-plan.
            </p>
          }
        />

        <ul className="mt-16 border-t border-border lg:mt-24">
          {ROWS.map((row, i) => (
            <li key={row.index}>
              <MotionReveal delay={Math.min(i, 4) * 0.05}>
                <Link
                  href={row.href}
                  className="group relative grid gap-x-10 gap-y-3 border-b border-border py-7 transition-colors duration-300 hover:bg-surface/40 lg:grid-cols-[2.5rem_1fr_1.05fr] lg:items-baseline lg:gap-x-12 lg:py-9"
                >
                  {/* Le filet ambre se déploie depuis la gauche — le trait du plan. */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-px w-0 bg-accent transition-[width] duration-500 ease-cinematic group-hover:w-full"
                  />

                  <span
                    aria-hidden="true"
                    className="t-tech text-accent/50 transition-colors duration-300 group-hover:text-accent"
                  >
                    {row.index}
                  </span>

                  <h3 className="t-h3 text-text-primary transition-transform duration-500 ease-cinematic lg:group-hover:translate-x-2">
                    {row.title}
                  </h3>

                  <p className="t-body measure text-text-secondary">
                    {row.result}
                  </p>
                </Link>
              </MotionReveal>
            </li>
          ))}
        </ul>

        <MotionReveal className="mt-12">
          <Link
            href="/services"
            className="t-tech inline-flex items-center gap-3 text-text-secondary transition-colors duration-200 hover:text-accent"
          >
            Voir le détail des expertises
            <span aria-hidden="true" className="block h-px w-8 bg-current" />
          </Link>
        </MotionReveal>
      </div>
    </section>
  );
}
