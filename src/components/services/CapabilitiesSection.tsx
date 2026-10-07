import { SectionHead } from "@/components/ui/SectionHead";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { capabilities } from "@/data/services";

/**
 * Capacités transversales — ce que le studio réunit lorsque le projet l'exige.
 * Présentées comme un socle commun aux deux offres, jamais comme des services
 * à part : aucune ne porte de lien, de tarif ni de CTA propre.
 */
export function CapabilitiesSection({ index = "03" }: { index?: string }) {
  return (
    <section
      aria-labelledby="capabilities-title"
      className="section-y border-t border-border bg-surface"
    >
      <div className="container-site">
        <SectionHead
          index={index}
          kicker="Un socle commun"
          titleId="capabilities-title"
          title="Un seul studio réunit ce que votre projet exige."
          lead={
            <p>
              Ces expertises ne se vendent pas séparément : elles servent un
              site web ou une application, et s&apos;ajoutent au projet
              lorsqu&apos;il en a besoin.
            </p>
          }
        />
        <ul className="mt-16 grid gap-px border border-border bg-border sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <li key={c.title} className="bg-surface">
              <MotionReveal delay={Math.min(i, 5) * 0.04} className="h-full">
                <div className="flex h-full flex-col gap-3 p-7">
                  <h3 className="t-h3 text-text-primary">{c.title}</h3>
                  <p className="t-body text-text-secondary">{c.description}</p>
                </div>
              </MotionReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
