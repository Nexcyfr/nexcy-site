import { z } from "zod";
import { projectTypes } from "@/data/contact";

/**
 * Schéma de validation du formulaire de contact — Master Brief §16 / §22.
 * Partagé client (React Hook Form) et serveur (API Route).
 */
export const contactSchema = z.object({
  name: z.string().min(2, "Nom requis").max(120),
  email: z.string().email("E-mail invalide").max(160),
  company: z.string().min(1, "Entreprise requise").max(160),
  projectType: z.enum(projectTypes, { message: "Type de projet requis" }),
  budget: z.string().min(1, "Budget requis"),
  deadline: z.string().min(1, "Délai requis"),
  message: z
    .string()
    .min(20, "Message trop court (20 caractères minimum)")
    .max(4000),
  consent: z.boolean().refine((v) => v === true, "Consentement requis"),
  // Honeypot anti-spam — accepte n'importe quelle valeur au niveau du schéma ;
  // la vérification « champ vide » est faite côté serveur pour renvoyer un
  // succès silencieux si un robot le remplit (Brief §16 / §22).
  website: z.string().max(200).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
