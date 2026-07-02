# NEXCY — Direction artistique V2

**Concept : « L'architecture invisible en mouvement ».**
Une DA propriétaire, premium, immédiatement identifiable NEXCY — sobre, précise,
construite en code plutôt qu'assemblée à partir de banques d'images.

## Principes
- **Noir profond** (`#0A0A0A`) dominant · blanc / gris · **accent doré cuivré `#C8883A` parcimonieux**.
- **Lignes fines**, **grilles architecturales**, **nœuds**, **trajectoires de lumière**.
- **Interfaces codées** (SVG) plutôt que photos décoratives — chaque visuel a un rôle narratif.
- **Lumière contrôlée**, espaces généreux, mouvement lent et maîtrisé (jamais agressif).
- **Geist** unique ; monogramme **N** comme ancrage récurrent (filigrane, hero, préloader supprimé).
- **Alternance de rythme** : sections codées ↔ respirations ↔ blocs éditoriaux ↔ démonstrations ↔ 1-2 respirations matière **maximum**.

## Langage graphique partagé (hero ↔ démonstrations ↔ motifs services)
- Épaisseur de trait : ~1–1,25 px (lignes/liens), 2 px (trajectoire de lumière).
- Nœuds : cercles r≈4,5, fond noir, contour gris.
- Accent : réservé à **une** trajectoire/élément par composition (jamais en aplat).
- Fragments d'interface : rectangles arrondis `--color-card` + lignes `--color-border`.
- Grille de fond : lignes `--color-border` à faible opacité.

## Hero — scène codée « système en assemblage »
SVG + GSAP (aucun Canvas/WebGL, aucune lib ajoutée). Grille → nœuds → liens →
fragments d'interface → **ligne de lumière cuivrée** (trajectoire) → **monogramme N**
en ancrage. Assemblage **une fois** au chargement puis **repos** (pas de boucle
permanente). Parallaxe pointeur subtile (desktop, `hover:hover`, transforms, rAF
throttlé, nettoyée). Le **message texte prime** ; la scène est subordonnée et
`aria-hidden`. Coordonnées **déterministes** (hydratation SSR stable).

### Comportement responsive
- **Desktop** : scène complète + parallaxe pointeur.
- **Tablette** : scène simplifiée, pas de pointeur.
- **Mobile** : structure majoritairement statique, animation légère, aucun Canvas.
- **reduced-motion** : scène **100 % statique** (état final assemblé), aucun mouvement.

## Préloader — décision
**Supprimé.** Il disparaissait en ~107 ms (imperceptible, sans valeur) ; l'assemblage
codé du hero **est** désormais le moment de marque. Aucun faux chargement, aucun
compteur, aucun retard du H1/CTA.

## Textures matière (respiration) — maximum 2, aucune répétition
1. `home/immersive-light.avif` — bande plein-cadre « Precision in Motion » (Accueil).
2. `studio/precision-band.avif` — bande plein-cadre matière (Studio).
Toutes les autres surfaces sont **codées** (hero, motifs services, filigranes) ou retirées.

## Interdits (rappel)
Galaxie · réseau neuronal générique · circuit imprimé cliché · interface sci-fi ·
animation crypto · fond abstrait décoratif sans sens · photo de banque identifiable ·
copie de Terminal Industries · animation permanente inutile · texte essentiel masqué
derrière une animation.

## Cohérence pages
Accueil (hero codé + démonstrations + 1 respiration matière) · Services (motifs codés
par expertise) · Studio (filigrane N + 1 respiration matière) · Contact (sobre, sans
fond décoratif) — même palette, mêmes traits, même usage de l'accent.
