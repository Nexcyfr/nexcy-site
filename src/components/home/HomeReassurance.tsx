import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { reassurancePoints } from "@/data/method";

/**
 * Section « Réassurance » — Master Brief §13 (Section 5).
 * Ce qui distingue NEXCY : ce qu'elle ne fait pas. Chaque ligne : barre dorée à gauche.
 */
export function HomeReassurance() {
  return (
    <section
      aria-labelledby="home-reassurance-title"
      className="section-y border-t border-border bg-surface"
    >
      <div className="container-site">
        <SectionLabel label="04 / Pourquoi NEXCY" />

        <TextReveal
          as="h2"
          id="home-reassurance-title"
          className="mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl"
        >
          Ce qui nous distingue, c&apos;est ce que nous ne faisons pas.
        </TextReveal>

        <ul className="mt-14 flex flex-col gap-8">
          {reassurancePoints.map((point, i) => (
            <li key={i}>
              <FadeIn delay={i * 0.05} y={16}>
                <p className="border-l-2 border-accent pl-6 text-lg font-medium leading-relaxed text-text-primary md:text-xl">
                  {point}
                </p>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
