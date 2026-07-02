import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { WatermarkN } from "@/components/ui/WatermarkN";

/** Hero de la page Studio — Master Brief §15. */
export function StudioHero() {
  return (
    <section
      aria-labelledby="studio-hero-title"
      className="relative overflow-hidden border-b border-border bg-black pb-16 pt-40 md:pb-24 md:pt-48"
    >
      <WatermarkN className="left-[-6%] top-[-10%] h-[130%] w-[50%]" />

      <div className="container-site relative z-10">
        <TextReveal
          as="h1"
          id="studio-hero-title"
          className="max-w-4xl text-5xl font-bold leading-[1.02] tracking-tight text-text-primary md:text-7xl"
        >
          Une agence conçue pour l&apos;exigence.
        </TextReveal>
        <FadeIn delay={0.15}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary">
            NEXCY est née d&apos;un constat simple : le marché digital français
            manque d&apos;agences capables de combiner la précision technique, la
            rigueur stratégique et une exigence esthétique de premier plan.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
