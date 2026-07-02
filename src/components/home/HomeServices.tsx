import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { servicePreviews } from "@/data/services";

/**
 * Section « Ce que nous construisons » — Master Brief §13 (Section 2).
 * 5 blocs, numéro doré, séparateurs, décalage horizontal au hover (desktop).
 */
export function HomeServices() {
  return (
    <section
      aria-labelledby="home-services-title"
      className="section-y border-t border-border bg-black"
    >
      <div className="container-site">
        <SectionLabel label="01 / Expertises" />

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-16">
          <TextReveal
            as="h2"
            id="home-services-title"
            className="text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl"
          >
            Cinq expertises. Un système cohérent.
          </TextReveal>
          <FadeIn>
            <p className="max-w-md text-base leading-relaxed text-text-secondary lg:mt-2">
              Agence web premium à Bordeaux, NEXCY articule chaque service autour
              d&apos;un objectif commun : construire un écosystème digital précis,
              durable et performant.
            </p>
          </FadeIn>
        </div>

        <ul className="mt-16 border-t border-border">
          {servicePreviews.map((service) => (
            <li key={service.index}>
              <FadeIn as="div" y={16}>
                <Link
                  href="/services"
                  className="group flex flex-col gap-4 border-b border-border py-8 transition-[border-color] duration-300 hover:border-l-2 hover:border-l-accent md:flex-row md:items-baseline md:gap-10 md:py-10"
                >
                  <span
                    aria-hidden="true"
                    className="text-4xl font-semibold text-accent/30 md:text-5xl md:transition-transform md:duration-300 md:ease-premium md:group-hover:translate-x-2"
                  >
                    {service.index}
                  </span>
                  <div className="md:transition-transform md:duration-300 md:ease-premium md:group-hover:translate-x-2">
                    <h3 className="text-xl font-medium text-text-primary md:text-2xl">
                      {service.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-base leading-relaxed text-text-secondary">
                      {service.description}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
