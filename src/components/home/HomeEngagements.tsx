import { SectionHead } from "@/components/ui/SectionHead";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { reassurancePoints } from "@/data/method";

/**
 * Engagements — la crédibilité sans preuve sociale.
 *
 * NEXCY n'affiche ni logo client, ni témoignage, ni statistique : rien de tout
 * cela n'est vérifiable aujourd'hui. À la place, deux colonnes qui engagent
 * réellement — ce que nous tenons, et ce que nous refusons — puis la preuve
 * par l'exemple : ce que ce site applique lui-même, et que chacun peut contrôler.
 */
const COMMITMENTS = [
  "Une réponse sous 48 heures ouvrées.",
  "Un interlocuteur unique du premier échange à la mise en ligne.",
  "Un devis détaillé, ligne par ligne, avant tout engagement.",
  "Une base technique documentée, que vous pouvez reprendre sans nous.",
  "Performance, accessibilité et référencement traités dès la conception.",
  "Un accompagnement disponible après la mise en ligne.",
];

/** Faits vérifiables sur ce site — chacun peut être contrôlé avec des outils publics. */
const PROOFS = [
  "Pages pré-rendues, servies en statique : le contenu est lisible avant tout script.",
  "Navigation complète au clavier, contrastes conformes WCAG AA, mouvement réduit respecté.",
  "Aucun cookie publicitaire ni traceur tiers : mesure d'audience sans cookie.",
  "Données structurées et métadonnées sur chaque page, plan du site déclaré.",
];

export function HomeEngagements() {
  return (
    <section
      aria-labelledby="home-engagements-title"
      className="section-y border-t border-border bg-black"
    >
      <div className="container-site">
        <SectionHead
          index="04"
          kicker="Engagements"
          titleId="home-engagements-title"
          title="Des engagements, noir sur blanc."
          lead={
            <p>
              NEXCY est un studio récent. Plutôt que d&apos;emprunter la crédibilité
              d&apos;autres marques, nous écrivons ce sur quoi vous pouvez nous
              tenir — et nous vous laissons le vérifier.
            </p>
          }
        />

        <div className="mt-16 grid gap-x-16 gap-y-14 lg:mt-24 lg:grid-cols-2">
          {/* Ce que nous tenons */}
          <div>
            <h3 className="t-tech text-accent">Ce que nous tenons</h3>
            <ul className="mt-8 flex flex-col">
              {COMMITMENTS.map((item, i) => (
                <li key={item} className="border-t border-border">
                  <MotionReveal delay={Math.min(i, 5) * 0.05}>
                    <p className="t-body-lg measure py-5 text-text-primary">
                      {item}
                    </p>
                  </MotionReveal>
                </li>
              ))}
            </ul>
          </div>

          {/* Ce que nous refusons — aussi engageant que la colonne de gauche */}
          <div>
            <h3 className="t-tech text-text-muted">Ce que nous ne faisons pas</h3>
            <ul className="mt-8 flex flex-col">
              {reassurancePoints.map((point, i) => (
                <li key={point} className="border-t border-border">
                  <MotionReveal delay={Math.min(i, 5) * 0.05}>
                    <p className="t-body-lg measure py-5 text-text-secondary">
                      {point}
                    </p>
                  </MotionReveal>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Preuve par l'exemple : ce site est la première démonstration. */}
        <div className="mt-20 grid gap-x-16 gap-y-8 border-t border-border pt-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h3 className="t-tech text-accent">Preuve par l&apos;exemple</h3>
            <p className="t-h3 mt-6 max-w-[22ch] text-text-primary">
              Ce site applique ce que nous promettons.
            </p>
            <p className="t-body mt-4 max-w-[40ch] text-text-muted">
              Vérifiable avec Lighthouse, axe ou le test des résultats enrichis de
              Google — sans nous croire sur parole.
            </p>
          </div>
          <ul className="flex flex-col">
            {PROOFS.map((item, i) => (
              <li key={item} className="border-t border-border first:border-t-0">
                <MotionReveal delay={Math.min(i, 4) * 0.05}>
                  <p className="t-body-lg flex gap-4 py-4 text-text-secondary">
                    <span aria-hidden="true" className="mt-[0.8em] h-px w-5 shrink-0 bg-accent" />
                    {item}
                  </p>
                </MotionReveal>
              </li>
            ))}
          </ul>
        </div>

        <MotionReveal className="mt-16">
          <p className="t-body measure border-t border-border pt-8 text-text-muted">
            NEXCY s&apos;adresse notamment aux entreprises de
            l&apos;hôtellerie-restauration, de l&apos;immobilier, du conseil, aux
            professions libérales et aux structures en phase de crédibilisation.
          </p>
        </MotionReveal>
      </div>
    </section>
  );
}
