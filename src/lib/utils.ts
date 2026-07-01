import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Fusionne des classes Tailwind en résolvant les conflits. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** URL publique du site, sans slash final. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexcy.fr"
).replace(/\/$/, "");
