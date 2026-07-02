import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";

/** Engagements vérifiables (audit V2 P1-3) — aucune statistique, aucun label. */
const engagements = [
  "Une réponse sous 48 heures ouvrées.",
  "Un interlocuteur unique tout au long du projet.",
  "Une base technique documentée et maintenable.",
  "Une conception intégrant performance, accessibilité et SEO.",
  "Un accompagnement disponible après la mise en ligne.",
];

/**
 * Bloc « Preuves et engagements » — Accueil (audit V2 P1-3).
 * Crédibilité honnête : engagements vérifiables + secteurs adressés (cibles,
 * pas des références clients). Aucun client, chiffre, avis, label ni logo.
 */
export function HomeProof() {
  return (
    <section
      aria-labelledby="home-proof-title"
      className="section-y border-t border-border bg-black"
    >
      <div className="container-site">
        <SectionLabel label="05 / Engagements" />

        <div className="mt-6 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <TextReveal
            as="h2"
            id="home-proof-title"
            className="text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl"
          >
            Des engagements vérifiables.
          </TextReveal>

          <ul className="flex flex-col gap-5">
            {engagements.map((item, i) => (
              <li key={item}>
                <FadeIn delay={i * 0.05} y={14}>
                  <p className="flex gap-4 text-lg leading-relaxed text-text-primary">
                    <span
                      aria-hidden="true"
                      className="mt-3 h-px w-6 shrink-0 bg-accent"
                    />
                    {item}
                  </p>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>

        <FadeIn className="mt-16">
          <p className="max-w-3xl border-t border-border pt-8 text-base leading-relaxed text-text-secondary">
            NEXCY s&apos;adresse notamment aux entreprises de
            l&apos;hôtellerie-restauration, de l&apos;immobilier, du conseil, aux
            professions libérales et aux startups en phase de crédibilisation.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
