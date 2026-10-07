import { Divider } from "@/components/ui/Divider";
import { CONTACT_EMAIL } from "@/data/navigation";
import { CAL_URL } from "@/lib/site-config";

/**
 * Bloc informations de contact.
 * Le bloc de réservation n'apparaît que si NEXT_PUBLIC_CAL_URL est une URL https
 * valide : aucun lien factice, aucune promesse de créneau sans calendrier réel.
 */
export function ContactInfo() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-lg font-medium text-text-primary">NEXCY</p>
        <p className="mt-1 text-base text-text-secondary">Bordeaux, France</p>
      </div>

      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="inline-flex min-h-[44px] w-fit items-center text-base text-accent transition-colors hover:text-accent-light"
      >
        {CONTACT_EMAIL}
      </a>

      {/* Bloc « échange direct » optionnel : affiché uniquement si Cal.com est
          configuré (Master Brief §68 — lien optionnel), sans copie inventée. */}
      {CAL_URL ? (
        <>
          <Divider className="my-2" />
          <div>
            <p className="text-base text-text-secondary">
              Préférez-vous un échange direct ?
            </p>
            <a
              href={CAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-[48px] items-center rounded-btn border border-accent px-6 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-black"
            >
              Réserver un créneau de 30 minutes
            </a>
          </div>
        </>
      ) : null}
    </div>
  );
}
