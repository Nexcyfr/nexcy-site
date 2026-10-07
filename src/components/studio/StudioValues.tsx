import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { values } from "@/data/values";

/** Section « Valeurs » — Master Brief §15 (5 valeurs). */
export function StudioValues() {
  return (
    <section
      aria-labelledby="studio-values-title"
      className="section-y border-t border-border bg-black"
    >
      <div className="container-site">
        <SectionLabel label="Ce qui nous guide" />
        <TextReveal
          as="h2"
          id="studio-values-title"
          className="mt-6 max-w-2xl t-h2 text-text-primary"
        >
          Cinq valeurs. Pas davantage.
        </TextReveal>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-card border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, i) => (
            <li key={value.index} className="bg-black">
              <FadeIn as="div" delay={i * 0.04} y={16} className="h-full">
                <div className="flex h-full flex-col gap-4 p-8">
                  <span
                    aria-hidden="true"
                    className="text-sm font-medium text-accent"
                  >
                    {value.index}
                  </span>
                  <h3 className="t-h3 text-text-primary">
                    {value.title}
                  </h3>
                  <p className="text-base leading-relaxed text-text-secondary">
                    {value.description}
                  </p>
                </div>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
