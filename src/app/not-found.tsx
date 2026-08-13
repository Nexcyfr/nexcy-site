import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Page introuvable",
  robots: { index: false, follow: false },
};

/** Page 404 personnalisée — Master Brief §12/§97. */
export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <Logo width={120} />
      <p className="mt-8 text-sm font-medium uppercase tracking-widest2 text-text-muted">
        Erreur 404
      </p>
      <h1 className="mt-4 t-h1 text-text-primary">
        Cette page n&apos;existe pas.
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-text-secondary">
        Le lien est peut-être obsolète ou l&apos;adresse incorrecte. Revenons à
        l&apos;essentiel.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Button href="/" variant="primary">
          Retour à l&apos;accueil
        </Button>
        <Button href="/contact" variant="secondary">
          Nous contacter
        </Button>
      </div>
    </section>
  );
}
