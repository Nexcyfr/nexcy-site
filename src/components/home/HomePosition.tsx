import { SectionHead } from "@/components/ui/SectionHead";
import { MotionReveal } from "@/components/animations/MotionReveal";

/**
 * Position — ce que NEXCY fait différemment.
 *
 * Trois affirmations vérifiables, pas trois arguments de vente. Chacune engage
 * l'agence sur une pratique observable par le client.
 */
const STATEMENTS = [
  {
    index: "A",
    title: "On part de ce qui se mesure",
    body: "Trafic, taux de contact, temps passé sur une tâche interne. Le cahier des charges se déduit des chiffres de départ, pas d'une maquette approuvée en réunion.",
  },
  {
    index: "B",
    title: "Le code vous appartient",
    body: "Base documentée, dépendances à jour, aucun verrou propriétaire. Vous pouvez reprendre le projet en interne ou le confier à quelqu'un d'autre — sans nous demander l'autorisation.",
  },
  {
    index: "C",
    title: "La mise en ligne n'est pas la fin",
    body: "Un système qu'on abandonne cesse d'en être un. Nous restons joignables, nous mesurons ce qui tourne, et nous corrigeons ce qui dérive.",
  },
];

export function HomePosition() {
  return (
    <section
      aria-labelledby="home-position-title"
      className="section-y border-t border-border bg-black"
    >
      <div className="container-site">
        <SectionHead
          index="01"
          kicker="Position"
          titleId="home-position-title"
          title="Un site n'est pas un livrable. C'est un système qui doit tourner."
          lead={
            <p>
              La plupart des projets digitaux s&apos;arrêtent le jour de la mise
              en ligne : plus personne ne les mesure, plus personne ne les fait
              évoluer, plus personne n&apos;en répond. Nous travaillons dans
              l&apos;autre sens.
            </p>
          }
        />

        <ul className="mt-16 grid gap-px border-t border-border bg-border lg:mt-24 lg:grid-cols-3">
          {STATEMENTS.map((s, i) => (
            <li key={s.index} className="bg-black">
              <MotionReveal delay={i * 0.08} className="h-full">
                {/* La première colonne reste calée sur la marge du conteneur :
                    son texte doit s'aligner au titre de section, pas au filet. */}
                <div
                  className={`flex h-full flex-col py-8 lg:py-10 ${
                    i === 0 ? "lg:pr-8" : "lg:px-8"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="t-tech text-accent"
                  >
                    {s.index}
                  </span>
                  <h3 className="t-h3 mt-6 text-text-primary">{s.title}</h3>
                  <p className="t-body measure mt-4 text-text-secondary">
                    {s.body}
                  </p>
                </div>
              </MotionReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
