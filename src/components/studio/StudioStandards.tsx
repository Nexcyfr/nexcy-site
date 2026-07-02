import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";

const standards = [
  "Performance (Core Web Vitals)",
  "Accessibilité (WCAG AA)",
  "Une base technique propre, documentée et maintenable",
  "SEO intégré dès la conception",
  "Sécurité et confidentialité par défaut",
];

/**
 * Bloc « Nos standards » + « Notre cadre » — page Studio.
 * Preuve par la méthode : standards vérifiables + critères d'acceptation honnêtes.
 */
export function StudioStandards() {
  return (
    <section
      aria-labelledby="studio-standards-title"
      className="section-y border-t border-border bg-surface"
    >
      <div className="container-site">
        <SectionLabel label="Nos standards" />
        <TextReveal
          as="h2"
          id="studio-standards-title"
          className="mt-6 max-w-2xl text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl"
        >
          Ce sur quoi nous ne transigeons pas.
        </TextReveal>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-card border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {standards.map((item, i) => (
            <li key={item} className="bg-black">
              <FadeIn as="div" delay={i * 0.04} y={16} className="h-full">
                <div className="flex h-full items-start gap-4 p-8">
                  <span aria-hidden="true" className="mt-3 h-px w-5 shrink-0 bg-accent" />
                  <p className="text-lg font-medium leading-snug text-text-primary">
                    {item}
                  </p>
                </div>
              </FadeIn>
            </li>
          ))}
        </ul>

        {/* Notre cadre — critères d'acceptation */}
        <FadeIn delay={0.1} className="mt-16">
          <div className="max-w-3xl border-l-2 border-accent pl-6">
            <p className="text-2xl font-medium leading-snug tracking-tight text-text-primary md:text-3xl">
              Nous choisissons les projets sur lesquels nous pouvons créer une
              réelle valeur.
            </p>
            <p className="mt-5 text-base leading-relaxed text-text-secondary">
              Nous privilégions les missions où l&apos;exigence est partagée et où
              nous pouvons livrer un travail dont nous sommes fiers. Si ce n&apos;est
              pas le cas, nous le disons.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
