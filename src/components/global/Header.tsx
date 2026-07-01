"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navLinks, headerCta } from "@/data/navigation";

/**
 * Header (Master Brief §5 / §11).
 * - Logo NEXCY fixe à gauche (lien vers /).
 * - Pilule flottante centrée : liens + CTA doré.
 * - Masqué en descendant (translateY -120 %), réapparaît en remontant (seuil 80px).
 * - Menu mobile plein écran.
 */
export function Header() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname],
  );

  // Détection de direction de scroll (natif → compatible Lenis et reduced-motion).
  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        if (y > lastY.current && y > 80) {
          setHidden(true);
        } else if (y < lastY.current) {
          setHidden(false);
        }
        lastY.current = y;
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Verrou de scroll quand le menu mobile est ouvert.
  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", menuOpen);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [menuOpen]);

  // Ferme le menu à chaque changement de route.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Échap ferme le menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      {/* Logo fixe à gauche */}
      <Link
        href="/"
        aria-label="NEXCY — Accueil"
        className={cn(
          "fixed left-4 top-4 z-50 text-lg font-bold tracking-tight text-text-primary transition-transform duration-300 ease-premium lg:left-6 lg:top-6",
          hidden && !menuOpen && "-translate-y-[150%]",
        )}
      >
        NEXCY
      </Link>

      {/* Pilule de navigation — desktop */}
      <nav
        aria-label="Navigation principale"
        className={cn(
          "fixed left-1/2 top-6 z-50 hidden -translate-x-1/2 transition-transform duration-300 ease-premium md:block",
          hidden && "-translate-y-[180%]",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-1 rounded-pill border py-2.5 pl-5 pr-2.5 backdrop-blur-md transition-colors duration-300",
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
                    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200",
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

      {/* Bouton hamburger — mobile */}
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        className="fixed right-4 top-4 z-[60] flex h-11 w-11 items-center justify-center md:hidden"
      >
        <span className="relative block h-4 w-6" aria-hidden="true">
          <span
            className={cn(
              "absolute left-0 top-0 h-0.5 w-6 bg-text-primary transition-transform duration-300 ease-premium",
              menuOpen && "top-1/2 -translate-y-1/2 rotate-45",
            )}
          />
          <span
            className={cn(
              "absolute bottom-0 left-0 h-0.5 w-6 bg-text-primary transition-transform duration-300 ease-premium",
              menuOpen && "bottom-1/2 translate-y-1/2 -rotate-45",
            )}
          />
        </span>
      </button>

      {/* Menu mobile plein écran */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-50 flex flex-col justify-center bg-black px-8 transition-opacity duration-300 md:hidden",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "text-4xl font-semibold tracking-tight transition-colors",
                  isActive(link.href) ? "text-accent" : "text-text-primary",
                )}
                tabIndex={menuOpen ? 0 : -1}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-12">
          <Link
            href={headerCta.href}
            tabIndex={menuOpen ? 0 : -1}
            className="inline-flex min-h-[44px] items-center rounded-btn bg-accent px-7 py-3 text-sm font-medium text-black"
          >
            {headerCta.label}
          </Link>
        </div>
      </div>
    </>
  );
}
