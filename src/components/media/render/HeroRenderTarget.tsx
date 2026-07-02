import { HeroScene } from "@/components/home/HeroScene";

/**
 * Cible de rendu du hero (DEV uniquement, jamais publique).
 * Placeholder du Lot 1 : réutilise la scène codée existante en plein cadre.
 * La version pilotable frame par frame (timeline seekable + `window.__seek`)
 * sera finalisée au Lot 3 (production de la boucle vidéo hero).
 */
export function HeroRenderTarget() {
  return (
    <div className="h-full w-full bg-black">
      <HeroScene className="h-full w-full" />
    </div>
  );
}
