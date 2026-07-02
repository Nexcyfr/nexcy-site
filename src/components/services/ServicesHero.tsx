import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { WatermarkN } from "@/components/ui/WatermarkN";

/** Hero de la page Services — Master Brief §14. */
export function ServicesHero() {
  return (
    <section
      aria-labelledby="services-hero-title"
      className="relative overflow-hidden border-b border-border bg-black pb-16 pt-40 md:pb-24 md:pt-48"
    >
      <WatermarkN className="right-[-8%] top-0 h-[120%] w-[55%]" />

      <div className="container-site relative z-10">
        <TextReveal
          as="h1"
          id="services-hero-title"
          className="text-5xl font-bold leading-[1.02] tracking-tight text-text-primary md:text-7xl"
        >
          Nos expertises.
        </TextReveal>
        <FadeIn delay={0.15}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary">
            De la création de sites web sur mesure au branding, au SEO et à
            l&apos;automatisation &amp; IA : cinq domaines, une même exigence —
            concevoir des systèmes digitaux qui performent dans la durée.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
