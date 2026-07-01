import { Divider } from "@/components/ui/Divider";
import { CONTACT_EMAIL } from "@/data/navigation";

const CAL_URL = process.env.NEXT_PUBLIC_CAL_URL;

/** Bloc informations de contact — Master Brief §16. */
export function ContactInfo() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-lg font-medium text-text-primary">NEXCY</p>
        <p className="mt-1 text-base text-text-secondary">Bordeaux, France</p>
      </div>

      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="w-fit text-base text-accent transition-colors hover:text-accent-light"
      >
        {CONTACT_EMAIL}
      </a>

      <Divider className="my-2" />

      <div>
        <p className="text-base text-text-secondary">
          Préférez-vous un échange direct ?
        </p>
        {CAL_URL ? (
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex min-h-[44px] items-center rounded-btn border border-border px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-text-primary"
          >
            Réserver un créneau de 30 minutes
          </a>
        ) : (
          <p className="mt-3 text-sm text-text-muted">
            Réservation en ligne disponible prochainement.
          </p>
        )}
      </div>
    </div>
  );
}
