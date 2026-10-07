/**
 * Contrôle de la configuration de production du formulaire.
 * Les noms de variables vivent dans config/required-env.mjs (source unique,
 * partagée avec next.config.mjs, qui fait échouer le build s'il en manque).
 */
export { REQUIRED_PRODUCTION_ENV, missingEnv } from "../../config/required-env.mjs";
