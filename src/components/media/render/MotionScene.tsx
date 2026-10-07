"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { MotionReveal } from "@/components/animations/MotionReveal";
import { TextReveal } from "@/components/animations/TextReveal";
import { MediaReveal } from "@/components/animations/MediaReveal";
import { MagneticTarget } from "@/components/animations/MagneticTarget";
import { useAutoplayOnce } from "@/hooks/useAutoplayOnce";
import { usePointerMotion } from "@/hooks/usePointerMotion";
import { useAmbientMotion } from "@/hooks/useAmbientMotion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EASE, DURATION, STAGGER, AMPLITUDE } from "@/lib/motion/tokens";

/** Bloc graphique abstrait (aucun logo, aucun N). */
function Block({ label, className }: { label?: string; className?: string }) {
  return (
    <div
      className={
        "flex h-full w-full items-center justify-center rounded border border-border bg-gradient-to-br from-card to-surface text-xs text-text-muted " +
        (className ?? "")
      }
    >
      {label}
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="border-t border-border py-16">
      <div className="container-site">
        <p className="mb-8 text-xs uppercase tracking-widest2 text-accent">{title}</p>
        {children}
      </div>
    </section>
  );
}

/* useAutoplayOnce : timeline pausée, jouée 1× à l'entrée, replay par le composant. */
function AutoplayDemo() {
  const scope = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      const bars = scope.current?.querySelectorAll<HTMLElement>("[data-bar]");
      if (!bars) return;
      if (reduce) {
        gsap.set(bars, { scaleX: 1 });
        return;
      }
      gsap.set(bars, { scaleX: 0, transformOrigin: "left center" });
      timelineRef.current = gsap.timeline({ paused: true });
      timelineRef.current.to(bars, {
        scaleX: 1,
        duration: DURATION.reveal,
        stagger: STAGGER.list,
        ease: EASE.cinematic,
      });
    },
    { scope, dependencies: [reduce] },
  );

  useAutoplayOnce({
    target: scope,
    onEnter: () => timelineRef.current?.play(),
    disabled: reduce,
    start: "top 85%",
  });

  return (
    <div ref={scope} data-autoplay>
      <div className="flex flex-col gap-3">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} data-bar className="block h-1.5 w-full rounded bg-accent" />
        ))}
      </div>
      <button
        type="button"
        onClick={() => timelineRef.current?.restart()}
        className="mt-6 rounded-btn border border-accent px-5 py-2 text-sm text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Rejouer
      </button>
    </div>
  );
}

/* usePointerMotion : point qui suit le pointeur, lecture −1..1, aucun state React. */
function PointerDemo() {
  const box = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLPreElement>(null);
  const reduce = useReducedMotion();
  const setX = useRef<((v: number) => void) | null>(null);
  const setY = useRef<((v: number) => void) | null>(null);

  useGSAP(
    () => {
      if (!dot.current) return;
      setX.current = gsap.quickTo(dot.current, "x", { duration: 0.2, ease: EASE.standard });
      setY.current = gsap.quickTo(dot.current, "y", { duration: 0.2, ease: EASE.standard });
    },
    { scope: box },
  );

  usePointerMotion(
    box,
    (nx, ny) => {
      setX.current?.(nx * 90);
      setY.current?.(ny * 90);
      if (readout.current) readout.current.textContent = `nx ${nx.toFixed(2)}  ny ${ny.toFixed(2)}`;
    },
    { disabled: reduce },
  );

  return (
    <div
      ref={box}
      data-pointer-box
      className="relative flex h-52 items-center justify-center overflow-hidden rounded border border-border bg-card"
    >
      <div ref={dot} data-pointer-dot className="h-4 w-4 rounded-full bg-accent" />
      <pre ref={readout} data-pointer-readout className="absolute bottom-2 left-2 text-[11px] text-text-muted">
        nx 0.00  ny 0.00
      </pre>
    </div>
  );
}

/* useAmbientMotion : halo lent + pause hors viewport, statique en reduced-motion. */
function AmbientDemo() {
  const scope = useRef<HTMLDivElement>(null);

  useAmbientMotion({
    target: scope,
    buildTimeline: () => {
      const halo = scope.current?.querySelector("[data-halo]");
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      if (halo) {
        tl.to(halo, { opacity: 0.3, scale: 1.18, duration: DURATION.ambientMin, ease: EASE.standard });
      }
      return tl;
    },
  });

  return (
    <div
      ref={scope}
      data-ambient
      className="relative flex h-40 items-center justify-center overflow-hidden rounded border border-border bg-card"
    >
      <span className="h-px w-48 bg-border" />
      <span
        data-halo
        className="absolute h-16 w-16 rounded-full bg-accent/20 opacity-60"
      />
    </div>
  );
}

/** Instrumentation DEV (jamais publique) : compteur de ScrollTriggers pour les tests. */
declare global {
  interface Window {
    __stCount?: () => number;
  }
}

/** Scène DEV du Motion System V3 — développement uniquement, jamais publique. */
export function MotionScene() {
  useEffect(() => {
    window.__stCount = () => ScrollTrigger.getAll().length;
    return () => {
      window.__stCount = undefined;
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-text-primary">
      <div className="container-site py-16">
        <h1 className="text-2xl font-bold tracking-tight">Motion System V3 — DEV</h1>
        <p className="mt-2 text-sm text-text-muted">
          Scène de démonstration et de test (accessible uniquement en développement).
        </p>
      </div>

      <Section id="tokens" title="Tokens & easings">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {(["cinematic", "standard", "snappy", "linear", "media"] as const).map((name) => (
            <MotionReveal key={name} variant="rise" className="rounded border border-border p-4">
              <p className="text-sm font-medium">{name}</p>
              <p className="mt-1 text-[11px] text-text-muted">reveal {DURATION.reveal}s</p>
            </MotionReveal>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-text-muted">
          amplitudes : revealY {AMPLITUDE.revealY} · parallax {AMPLITUDE.parallax} · magnetic {AMPLITUDE.magnetic}
        </p>
      </Section>

      <Section id="motionreveal" title="MotionReveal">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {(["fade", "rise", "slide", "scale"] as const).map((v) => (
            <MotionReveal key={v} variant={v} className="h-28">
              <Block label={v} />
            </MotionReveal>
          ))}
        </div>
      </Section>

      <Section id="textreveal" title="TextReveal">
        <TextReveal as="h2" mode="words" className="text-3xl font-bold md:text-4xl">
          Mode words mot par mot.
        </TextReveal>
        <TextReveal as="h2" mode="container" className="mt-6 text-3xl font-bold md:text-4xl">
          Mode container en bloc.
        </TextReveal>
      </Section>

      <Section id="mediareveal" title="MediaReveal">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {(["vertical", "horizontal", "editorial", "fullscreen", "light"] as const).map((v) => (
            <MediaReveal key={v} variant={v} className="h-40">
              <Block label={v} className="from-surface to-black" />
            </MediaReveal>
          ))}
        </div>
      </Section>

      <Section id="magnetic" title="MagneticTarget (DEV only)">
        <div className="flex flex-wrap items-center gap-8">
          <MagneticTarget>
            <button
              type="button"
              data-magnetic-default
              className="rounded-btn bg-accent px-6 py-3 text-sm font-medium text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Amplitude 8 px
            </button>
          </MagneticTarget>
          <MagneticTarget strength={0.5}>
            <button
              type="button"
              data-magnetic-weak
              className="rounded-btn border border-accent px-6 py-3 text-sm font-medium text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              strength 0.5
            </button>
          </MagneticTarget>
        </div>
      </Section>

      <Section id="autoplay" title="useAutoplayOnce">
        <AutoplayDemo />
      </Section>

      <Section id="pointer" title="usePointerMotion">
        <PointerDemo />
      </Section>

      <Section id="ambient" title="useAmbientMotion">
        <AmbientDemo />
      </Section>
    </main>
  );
}
