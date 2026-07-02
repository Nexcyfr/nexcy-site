import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TestScene } from "@/components/media/render/TestScene";
import { HeroRenderTarget } from "@/components/media/render/HeroRenderTarget";
import { AmbientMediaDemo } from "@/components/media/render/AmbientMediaDemo";
import { MotionScene } from "@/components/media/render/MotionScene";

/**
 * Harnais de rendu média — DEV UNIQUEMENT (§2 Lot 1).
 * - `notFound()` avant tout rendu si `NODE_ENV === "production"`.
 * - Liste blanche explicite de scènes ; identifiant inconnu → 404.
 * - `robots: noindex/nofollow`, hors sitemap, dynamique (jamais prérendu).
 * - Aucune clé, donnée privée ni appel réseau externe.
 * Jamais utilisée par le site public.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "render",
  robots: { index: false, follow: false },
};

// Liste blanche EXPLICITE de la route (§2). "test"/"hero" = scènes capturables ;
// "ambient" = démo AmbientMedia ; "motion" = vitrine du Motion System V3 (2e).
const SCENES = ["test", "hero", "ambient", "motion"] as const;
type Scene = (typeof SCENES)[number];

function isScene(value: string): value is Scene {
  return (SCENES as readonly string[]).includes(value);
}

export default function RenderScenePage({ params }: { params: { scene: string } }) {
  if (process.env.NODE_ENV === "production") notFound();
  if (!isScene(params.scene)) notFound();

  // Démo AmbientMedia : page défilable (tests scroll-in / pause hors-viewport).
  if (params.scene === "ambient") return <AmbientMediaDemo />;
  // Vitrine Motion System V3 : page défilable (tests des primitives et hooks).
  if (params.scene === "motion") return <MotionScene />;

  // Scènes de capture : plein cadre fixe pour le rendu frame par frame.
  return (
    <main className="fixed inset-0 h-screen w-screen overflow-hidden bg-black">
      {params.scene === "test" ? <TestScene /> : null}
      {params.scene === "hero" ? <HeroRenderTarget /> : null}
    </main>
  );
}
