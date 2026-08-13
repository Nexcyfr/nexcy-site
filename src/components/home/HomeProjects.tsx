"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TextReveal } from "@/components/animations/TextReveal";

/**
 * Projets conceptuels NEXCY — jamais des clients réels.
 * Trois univers, trois compositions différentes.
 * Sur hover : image secondaire crossfade + zoom subtil.
 */

const PROJECTS = [
  {
    id: "01",
    name: "Maison Aurore",
    category: "Identité de luxe & Packaging",
    description:
      "Création d'un système d'identité complet pour une maison cosmétique premium. Typographie sur-mesure, packaging éditorial, présence digitale cohérente.",
    image: "/assets/projects/luxury/cover-1.jpg",
    imageHover: "/assets/projects/luxury/cover-2.jpg",
    imageAlt: "Packaging de parfum de luxe sur fond sombre",
    layout: "right" as const,
  },
  {
    id: "02",
    name: "Comptoir 1924",
    category: "Expérience gastronomique",
    description:
      "Refonte complète de l'identité et de la présence digitale d'un restaurant gastronomique. Site sur-mesure, réservation en ligne, ambiance visuelle.",
    image: "/assets/projects/hospitality/cover-1.jpg",
    imageHover: "/assets/projects/hospitality/cover-2.jpg",
    imageAlt: "Intérieur de restaurant gastronomique de luxe",
    layout: "left" as const,
  },
  {
    id: "03",
    name: "Nexum AI",
    category: "Interface & Intelligence artificielle",
    description:
      "Conception de l'interface d'une plateforme d'IA. Architecture de l'information, design système, expérience utilisateur exigeante.",
    image: "/assets/projects/technology/cover-1.jpg",
    imageHover: "/assets/projects/technology/cover-2.jpg",
    imageAlt: "Interface technologique cinématique",
    layout: "full" as const,
  },
] as const;

type Project = (typeof PROJECTS)[number];

function ProjectItem({
  project,
  index,
  reduced,
}: {
  project: Project;
  index: number;
  reduced: boolean;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const hoverImgRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = itemRef.current;
      const imgWrap = imgWrapRef.current;
      if (!el || !imgWrap) return;

      const title = el.querySelector("[data-proj-title]");
      const meta = el.querySelector("[data-proj-meta]");
      const desc = el.querySelector("[data-proj-desc]");

      if (reduced) {
        gsap.set([title, meta, desc, imgWrap], { autoAlpha: 1, y: 0, clipPath: "none", scale: 1 });
        return;
      }

      gsap.set(imgWrap, { clipPath: "inset(100% 0 0 0)", scale: 1.06 });
      gsap.set([meta, title, desc], { autoAlpha: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 78%", once: true },
      });

      tl.to(imgWrap, {
        clipPath: "inset(0% 0 0 0)",
        scale: 1,
        duration: 1.0,
        ease: "power3.inOut",
        onComplete: () => gsap.set(imgWrap, { clearProps: "clipPath,willChange" }),
      })
        .to(meta, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.5")
        .to(title, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
        .to(desc, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.3");

      return () => {
        ScrollTrigger.getAll()
          .filter((t) => t.vars.trigger === el)
          .forEach((t) => t.kill());
      };
    },
    { scope: itemRef, dependencies: [reduced] },
  );

  const onEnter = useCallback(() => {
    if (reduced) return;
    if (hoverImgRef.current) gsap.to(hoverImgRef.current, { autoAlpha: 1, duration: 0.55, ease: "power2.inOut" });
    if (imgWrapRef.current) gsap.to(imgWrapRef.current.querySelector("img"), { scale: 1.04, duration: 0.8, ease: "power2.out" });
  }, [reduced]);

  const onLeave = useCallback(() => {
    if (reduced) return;
    if (hoverImgRef.current) gsap.to(hoverImgRef.current, { autoAlpha: 0, duration: 0.45, ease: "power2.inOut" });
    if (imgWrapRef.current) gsap.to(imgWrapRef.current.querySelector("img"), { scale: 1, duration: 0.8, ease: "power2.out" });
  }, [reduced]);

  // Projet 3 : plein écran avec texte overlay
  if (project.layout === "full") {
    return (
      <div
        ref={itemRef}
        className="relative min-h-[70vh] overflow-hidden"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        <div ref={imgWrapRef} className="absolute inset-0">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div
            ref={hoverImgRef}
            className="absolute inset-0"
            style={{ opacity: 0 }}
            aria-hidden="true"
          >
            <Image
              src={project.imageHover}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.96) 0%, rgba(10,10,10,0.4) 55%, rgba(10,10,10,0.1) 100%)",
            }}
          />
        </div>

        <div className="container-site relative z-10 flex h-full flex-col justify-end pb-16 pt-24">
          <p data-proj-meta className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-accent/70">
            {project.id} — Concept NEXCY &nbsp;·&nbsp; {project.category}
          </p>
          <h3
            data-proj-title
            className="text-[clamp(2.4rem,5.5vw,7rem)] font-bold leading-[0.9] tracking-tighter text-white"
          >
            {project.name}
          </h3>
          <p data-proj-desc className="mt-5 max-w-[42ch] text-sm leading-relaxed text-white/55 lg:text-base">
            {project.description}
          </p>
        </div>
      </div>
    );
  }

  // Projets 1 & 2 : bicolonne asymétrique alternée (desktop) / empilée (mobile)
  const isRight = project.layout === "right";

  return (
    <div
      ref={itemRef}
      className={`relative flex flex-col overflow-hidden lg:min-h-[65vh] ${isRight ? "lg:flex-row" : "lg:flex-row-reverse"}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Image — pleine largeur mobile / 62% desktop */}
      <div
        ref={imgWrapRef}
        className="relative aspect-[3/2] w-full flex-shrink-0 overflow-hidden lg:aspect-auto lg:w-[62%] lg:self-stretch"
      >
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 65vw"
        />
        <div
          ref={hoverImgRef}
          className="absolute inset-0"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          <Image
            src={project.imageHover}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 65vw"
          />
        </div>
        {/* Gradient mobile : fondu bas vers texte */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{ background: "linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 55%)" }}
        />
        {/* Gradient desktop : fondu latéral vers colonne texte */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background: isRight
              ? "linear-gradient(to left, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.1) 40%, transparent 100%)"
              : "linear-gradient(to right, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.1) 40%, transparent 100%)",
          }}
        />
      </div>

      {/* Texte — pleine largeur mobile / 38% desktop */}
      <div
        className="relative z-10 flex w-full flex-col justify-center bg-surface px-8 py-10 lg:w-[38%] lg:px-12 lg:py-14"
      >
        {/* Numéro watermark */}
        <span
          aria-hidden="true"
          className="absolute text-[clamp(6rem,9vw,12rem)] font-bold leading-none tracking-tighter text-white/[0.04] select-none"
          style={{ [isRight ? "right" : "left"]: "-0.1em", top: "50%", transform: "translateY(-50%)" }}
        >
          {project.id}
        </span>

        <p data-proj-meta className="mb-4 text-[10px] font-medium uppercase tracking-[0.25em] text-accent/70">
          {project.id} — Concept NEXCY
        </p>
        <h3
          data-proj-title
          className="text-[clamp(1.8rem,3vw,3.5rem)] font-bold leading-[0.92] tracking-tighter text-text-primary"
        >
          {project.name}
        </h3>
        <p data-proj-meta className="mt-1 text-xs font-medium text-text-secondary">
          {project.category}
        </p>
        <p data-proj-desc className="mt-6 text-sm leading-relaxed text-text-secondary lg:text-base">
          {project.description}
        </p>
      </div>
    </div>
  );
}

export function HomeProjects() {
  const reduced = useReducedMotion();

  return (
    <section
      aria-labelledby="home-projects-title"
      className="border-t border-border bg-black"
    >
      <div className="container-site pb-6 pt-16 lg:pt-20">
        <SectionLabel label="02 / Projets" />
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <TextReveal
            as="h2"
            id="home-projects-title"
            className="text-3xl font-bold leading-tight tracking-tight text-text-primary md:text-4xl"
          >
            Trois visions, trois univers.
          </TextReveal>
          <p className="max-w-md text-base leading-relaxed text-text-secondary lg:mt-2">
            Ces projets sont des concepts NEXCY. Ils illustrent notre approche
            par univers — jamais des références clients.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        {PROJECTS.map((project, i) => (
          <ProjectItem key={project.id} project={project} index={i} reduced={reduced} />
        ))}
      </div>

      <div className="container-site pb-16 pt-12 text-center">
        <Link
          href="/contact"
          className="inline-flex min-h-[52px] items-center rounded-btn border border-border px-8 py-3 text-sm font-medium text-text-secondary transition-colors duration-200 hover:border-accent/50 hover:text-text-primary"
        >
          Démarrer votre projet
        </Link>
      </div>
    </section>
  );
}
