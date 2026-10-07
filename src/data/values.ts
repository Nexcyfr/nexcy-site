/** Valeurs NEXCY — Master Brief §15 (page Studio). */

export interface Value {
  index: string;
  title: string;
  description: string;
}

export const values: Value[] = [
  {
    index: "01",
    title: "Précision",
    description:
      "Chaque détail est une décision. Rien n'est laissé au hasard dans ce que nous concevons.",
  },
  {
    index: "02",
    title: "Exigence",
    description:
      "Nous refusons le standard par défaut. Pour vous, comme pour nous-mêmes.",
  },
  {
    index: "03",
    title: "Clarté",
    description:
      "La complexité se résout, elle ne se cache pas. Nous traduisons la technique en décisions claires.",
  },
  {
    index: "04",
    title: "Mouvement",
    description:
      "Un système digital doit évoluer avec votre activité. Nous construisons pour durer et s'adapter.",
  },
  {
    index: "05",
    title: "Confiance",
    description:
      "Nous nous engageons sur ce que nous livrons. Pas de surprises, pas de dérive.",
  },
];
