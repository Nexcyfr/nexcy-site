import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 text-sm font-medium tracking-wide " +
  "rounded-btn px-7 py-3 transition-colors duration-[250ms] ease-standard " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-accent disabled:opacity-50 disabled:pointer-events-none " +
  "min-h-[44px]"; // cible tactile ≥ 44px

const variants: Record<Variant, string> = {
  // Bordure dorée → fond doré au hover (Brief §7 bouton primaire)
  primary:
    "border border-accent text-accent hover:bg-accent hover:text-black",
  // Bordure discrète → bordure claire au hover (bouton secondaire)
  secondary:
    "border border-border text-text-primary hover:border-text-primary",
  // Texte seul
  ghost: "text-text-secondary hover:text-text-primary px-0 py-0 min-h-0",
};

interface CommonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

/** Bouton polymorphe : rend un lien Next si `href`, sinon un `<button>`. */
export function Button(props: ButtonProps) {
  const { variant = "primary", className, children } = props;
  const classes = cn(base, variants[variant], className);

  if (props.href !== undefined) {
    const { href, variant: _v, className: _c, children: _ch, ...rest } = props;
    const isExternal = href.startsWith("http") || href.startsWith("mailto:");
    if (isExternal) {
      return (
        <a href={href} className={classes} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, className: _c, children: _ch, type, ...rest } = props;
  return (
    <button type={type ?? "button"} className={classes} {...rest}>
      {children}
    </button>
  );
}
