/**
 * Configuration publique du site (variables NEXT_PUBLIC_*, lisibles côté client).
 * Aucune valeur secrète ici — les secrets vivent uniquement dans les variables
 * d'environnement serveur (voir .env.example).
 */

/**
 * Lien de prise de rendez-vous Cal.com (optionnel).
 * N'est retenu que s'il s'agit d'une URL https valide : une valeur mal saisie
 * désactive simplement le bloc de réservation, sans lien cassé.
 */
function readCalUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_CAL_URL?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export const CAL_URL = readCalUrl();
