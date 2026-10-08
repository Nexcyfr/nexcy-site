"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { navLinks, headerCta, CONTACT_EMAIL } from "@/data/navigation";

/** Seuil (px) à partir duquel la barre prend un fond et peut se masquer. */
const SCROLLED_AT = 24;
const HIDE_AFTER = 120;
/** Mouvement minimal (px) pour changer de direction — évite le clignotement. */
const DIRECTION_DEADZONE = 6;

/**
 * Header.
 *
 * Une seule barre fixe (logo · pilule de navigation · hamburger) qui se masque
 * et réapparaît d'un bloc : le logo n'est jamais laissé seul ni rogné.
 *
 * - Haut de page : transparente, posée sur le hero.
 * - Après 24 px : fond noir translucide + flou + filet, pour qu'aucun contenu
 *   ne passe sous le logo ou le bouton.
 * - Défilement vers le bas : la barre sort entièrement (translateY -100 %).
 *   Vers le haut, au clavier (focus dans la barre) ou menu ouvert : elle revient.
 * - Menu mobile : calque plein écran hors de la barre (pas d'ancêtre transformé),
 *   `inert` + invisible quand fermé, piège de focus, Échap, safe areas.
 */
export function Header() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname],
  );

  // Direction de scroll (natif → compatible Lenis et mouvement réduit).
  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = Math.max(0, window.scrollY);
        const delta = y - lastY.current;
        setScrolled(y > SCROLLED_AT);
        if (y <= HIDE_AFTER) {
          setHidden(false);
        } else if (delta > DIRECTION_DEADZONE) {
          setHidden(true);
        } else if (delta < -DIRECTION_DEADZONE) {
          setHidden(false);
        }
        if (Math.abs(delta) > DIRECTION_DEADZONE || y <= HIDE_AFTER) lastY.current = y;
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Verrou de scroll quand le menu mobile est ouvert.
  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", menuOpen);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [menuOpen]);

  // Ferme le menu à chaque changement de route, et réaffiche la barre.
  useEffect(() => {
    setMenuOpen(false);
    setHidden(false);
  }, [pathname]);

  // Ferme le menu si l'on repasse en desktop (rotation, redimensionnement).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Échap ferme le menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Focus du menu mobile : piège de focus + retour au bouton à la fermeture.
  useEffect(() => {
    if (!menuOpen) return;
    const menu = menuRef.current;
    const hamburger = hamburgerRef.current;
    if (!menu || !hamburger) return;

    const focusables = [
      hamburger,
      ...Array.from(menu.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")),
    ];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    // Le focus passe au premier lien du menu (le bouton reste le premier du cycle).
    focusables[1]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      hamburger.focus();
    };
  }, [menuOpen]);

  const barHidden = hidden && !menuOpen;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60] pt-[env(safe-area-inset-top)] transition-[transform,background-color,border-color,backdrop-filter] duration-300 ease-standard",
          barHidden && "-translate-y-full focus-within:translate-y-0",
          scrolled && !menuOpen
            ? "border-b border-white/[0.07] bg-black/75 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="relative mx-auto flex h-[var(--header-h)] w-full max-w-site items-center justify-between px-4 lg:px-6">
          <Link
            href="/"
            aria-label="NEXCY — Accueil"
            className="relative z-10 -mx-1 flex min-h-[44px] items-center px-1"
          >
            <Logo width={104} priority />
          </Link>

          {/* Pilule de navigation — desktop */}
          <nav
            aria-label="Navigation principale"
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
          >
            <div
              className={cn(
                "flex items-center gap-1 rounded-pill border py-2 pl-5 pr-2 backdrop-blur-md transition-colors duration-300",
                scrolled
                  ? "border-white/10 bg-surface/90"
                  : "border-white/[0.06] bg-surface/70",
              )}
            >
              <ul className="flex items-center gap-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={isActive(link.href) ? "page" : undefined}
                      className={cn(
                        "relative rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200",
                        // Soulignement discret (scaleX) — survol, focus clavier, page active.
                        "after:pointer-events-none after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-200 after:ease-snappy after:content-['']",
                        "hover:after:scale-x-100 focus-visible:after:scale-x-100 aria-[current=page]:after:scale-x-100",
                        isActive(link.href)
                          ? "text-text-primary"
                          : "text-text-secondary hover:text-text-primary",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={headerCta.href}
                className="ml-1 rounded-pill bg-accent px-5 py-2 text-sm font-medium text-black transition-colors duration-200 hover:bg-accent-light"
              >
                {headerCta.label}
              </Link>
            </div>
          </nav>

          {/* Bouton hamburger — mobile et tablette */}
          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="relative z-10 -mr-2 flex h-12 w-12 items-center justify-center lg:hidden"
          >
            <span className="relative block h-4 w-6" aria-hidden="true">
              <span
                className={cn(
                  "absolute left-0 top-0 h-0.5 w-6 bg-text-primary transition-transform duration-300 ease-standard",
                  menuOpen && "top-1/2 -translate-y-1/2 rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-0.5 w-6 bg-text-primary transition-transform duration-300 ease-standard",
                  menuOpen && "bottom-1/2 translate-y-1/2 -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Menu mobile plein écran — hors de la barre, pour ne dépendre d'aucun
          ancêtre transformé. Sous la barre (z-55) : logo et bouton restent visibles. */}
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        inert={!menuOpen}
        className={cn(
          "fixed inset-0 z-[55] flex flex-col justify-between bg-void px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(var(--header-h)+env(safe-area-inset-top)+1.5rem)] transition-[opacity,visibility] duration-300 md:px-10 lg:hidden",
          menuOpen ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        {/* Même trame que le Hero : le menu appartient au système. */}
        <div
          aria-hidden="true"
          className="plan-grid plan-grid-fade pointer-events-none absolute inset-0"
        />

        <p className="t-tech relative text-stone">44.8378° N — 0.5792° O</p>

        <nav aria-label="Menu mobile" className="relative">
          <ul className="flex flex-col">
            {navLinks.map((link, i) => (
              <li key={link.href} className="border-t border-border last:border-b">
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "flex min-h-[64px] items-baseline gap-5 py-5 transition-colors",
                    isActive(link.href) ? "text-accent" : "text-text-primary",
                  )}
                >
                  <span aria-hidden="true" className="t-tech text-accent/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="t-h2">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href={headerCta.href}
            className="mt-10 inline-flex min-h-[52px] items-center rounded-btn bg-accent px-7 text-sm font-medium text-black"
          >
            {headerCta.label}
          </Link>
        </nav>

        <div className="relative">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex min-h-[44px] items-center break-all text-sm text-text-secondary transition-colors hover:text-accent"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="t-tech mt-1 text-text-muted">Réponse sous 48 h ouvrées</p>
        </div>
      </div>
    </>
  );
}
