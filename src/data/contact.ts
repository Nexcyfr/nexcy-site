/** Options du formulaire de contact — Master Brief §16 / §9. */

export const projectTypes = [
  "Site web",
  "Branding",
  "SEO",
  "Automatisation & IA",
  "Autre",
] as const;

export const budgetRanges = [
  "2 000 – 5 000 €",
  "5 000 – 10 000 €",
  "10 000 – 20 000 €",
  "Plus de 20 000 €",
  "Budget à définir",
] as const;

export const deadlineOptions = [
  "Moins d'un mois",
  "1 à 3 mois",
  "3 à 6 mois",
  "Pas de contrainte",
] as const;

export type ProjectType = (typeof projectTypes)[number];
export type BudgetRange = (typeof budgetRanges)[number];
export type DeadlineOption = (typeof deadlineOptions)[number];
