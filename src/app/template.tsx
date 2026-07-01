import { PageTransition } from "@/components/global/PageTransition";

/**
 * template.tsx remonte à chaque navigation (App Router) : idéal pour la
 * transition de page à l'entrée. Master Brief §12.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
