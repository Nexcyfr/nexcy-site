import Image from "next/image";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/animations/TextReveal";
import { FadeIn } from "@/components/animations/FadeIn";
import { reassurancePoints } from "@/data/method";

/**
 * Section « Réassurance » — Master Brief §13 (Section 5).
 * Ce qui distingue NEXCY : ce qu'elle ne fait pas. Chaque ligne : barre dorée à gauche.
 */
export function HomeReassurance() {
  return (
    <section
      aria-labelledby="home-reassurance-title"
      className="relative overflow-hidden border-t border-border bg-surface section-y"
    >
      {/* Fond matière très discret */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image
          src="/assets/home/reassurance-bg.avif"
          alt=""
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover opacity-[0.10]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </div>

      <div className="container-site relative z-10">
        <SectionLabel label="04 / Pourquoi NEXCY" />

        <TextReveal
          as="h2"
          id="home-reassurance-title"
          className="mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl"
        >
          Ce qui nous distingue, c&apos;est ce que nous ne faisons pas.
        </TextReveal>

        <ul className="mt-14 flex flex-col gap-8">
          {reassurancePoints.map((point, i) => (
            <li key={i}>
              <FadeIn delay={i * 0.05} y={16}>
                <p className="border-l-2 border-accent pl-6 text-lg font-medium leading-relaxed text-text-primary md:text-xl">
                  {point}
                </p>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
