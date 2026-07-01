import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TextLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}

/**
 * Lien texte avec underline doré animé (scaleX 0→1) — Master Brief §7.
 * L'animation repose sur transform (GPU) et un pseudo-élément.
 */
export function TextLink({ href, children, className, external }: TextLinkProps) {
  const classes = cn(
    "group relative inline-block text-text-secondary transition-colors duration-200 hover:text-text-primary",
    "after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left",
    "after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-premium",
    "hover:after:scale-x-100 focus-visible:after:scale-x-100",
    className,
  );

  if (external || href.startsWith("http") || href.startsWith("mailto:")) {
    const rel = href.startsWith("mailto:") ? undefined : "noopener noreferrer";
    const target = href.startsWith("mailto:") ? undefined : "_blank";
    return (
      <a href={href} className={classes} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
