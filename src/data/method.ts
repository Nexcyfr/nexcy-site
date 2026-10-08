/** Méthode de travail en 4 étapes — Master Brief §13 (section Méthode). */

export interface MethodStep {
  index: string;
  title: string;
  description: string;
}

export const methodSteps: MethodStep[] = [
  {
    index: "01",
    title: "Diagnostic",
    description:
      "Nous analysons votre situation, vos objectifs et vos contraintes avant de proposer quoi que ce soit.",
  },
  {
    index: "02",
    title: "Conception",
    description:
      "Architecture, design, copywriting — chaque choix est justifié et validé avec vous.",
  },
  {
    index: "03",
    title: "Développement",
    description:
      "Exécution précise, tests rigoureux, aucun raccourci technique.",
  },
  {
    index: "04",
    title: "Lancement & suivi",
    description:
      "Mise en ligne, optimisation et accompagnement dans la durée si vous le souhaitez.",
  },
];

/** Section « Réassurance » — ce que NEXCY ne fait pas (Accueil §5). */
export const reassurancePoints: string[] = [
  "Nous ne prenons pas de projets que nous ne pouvons pas bien faire.",
  "Nous ne promettons pas des résultats que nous ne maîtrisons pas.",
  "Nous n'utilisons pas de solutions génériques quand du sur-mesure s'impose.",
  "Nous ne disparaissons pas après la livraison.",
];
