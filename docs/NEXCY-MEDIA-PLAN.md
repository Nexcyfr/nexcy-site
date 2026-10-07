# NEXCY — Plan média & direction créative

> Objectif : hisser NEXCY au niveau d'immersion visuelle d'une agence internationale
> (référence d'exigence : terminal-industries.com — **jamais copiée**), sans sacrifier
> la performance ni l'accessibilité. Statut : **proposition — en attente de validation.**

---

## 1. Direction créative « Precision in Motion »

**Métaphore visuelle NEXCY** : l'**architecture invisible**. Là où Terminal met en scène
des cours logistiques réelles (caméras, camions, computer-vision), NEXCY met en scène des
**systèmes abstraits** : la lumière traverse la matière sombre avec une précision maîtrisée.

**Univers (moodboard verbal)**
- Matière noire minérale, surfaces profondes, arêtes nettes.
- Faisceaux et filaments de **lumière ambrée** qui suivent des trajectoires précises.
- Géométrie architecturale, lignes fines, perspectives, grilles.
- Sensation : contenu dense + respiration + mouvement contrôlé.

**Interdits (charte + brief §28/§34)** : aucune photo d'équipe, aucun stock générique
(bureaux, poignées de main, ordinateurs), aucune personne, pas de grain, pas de bleu,
pas de WebGL lourd, pas de curseur custom. Doré **avec parcimonie**.

**Rythme cible** (ce qui manque aujourd'hui) : alterner
`plein-cadre cinématique → respiration/vide → bloc éditorial dense → média → respiration`.
Aujourd'hui le site enchaîne uniformément `label + H2 + liste` → effet catalogue.

**Typographie** : ⚠️ **point à trancher** — la consigne mentionne *Neue Montreal*, mais le
Master Brief v2 (§16) impose **Geist Sans** (open-source), sur laquelle tout le site est
validé. Neue Montreal est une **police commerciale payante** (non téléchargeable librement,
interdite par les règles d'assets). → **Recommandation : conserver Geist.** Si Neue Montreal
est souhaitée, il faut fournir une licence achetée (les fichiers seront alors intégrés via
`next/font/local`). *Aucun changement de police tant que ce point n'est pas validé.*

**Logos fournis (à intégrer)** : le vrai logotype NEXCY (trait fin, chasse large) remplace
le texte « NEXCY » en Geist Bold actuel.
- `logo-nexcy-blanc.(svg/png)` → header, footer, OG, menus (fond sombre).
- `logo-nexcy-noir.(svg/png)` → contextes clairs éventuels (favicon déjà mis à jour par toi).
- Fichiers actuellement dans `src/app/` → à déplacer vers `public/assets/brand/` + rognage
  du canvas transparent + optimisation.

---

## 2. Sources & formats

| Source API | Usage | Licence | Attribution |
|---|---|---|---|
| **Pexels** (images + vidéos) | priorité 1 — abstrait sombre, lumière, matière | Pexels License (libre, comm. OK) | non obligatoire (créditée dans le manifest) |
| **Unsplash** | priorité 2 — qualité premium | Unsplash License | recommandée (dans le manifest) |
| **Pixabay** (images + vidéos) | priorité 3 — textures, complément | Pixabay License | non obligatoire |
| **Openverse** | secours (CC) | CC (vérifiée par item) | selon licence |
| **Code (SVG/Canvas GSAP)** | priorité absolue pour l'abstrait unique | — (produit maison) | — |

**Formats de livraison** : images → **AVIF** (+ fallback WebP via `next/image`) ; vidéos →
**MP4 (H.264)** + **WebM (VP9)** + **poster AVIF** ; SVG pour le vectoriel.
**Règle** : aucune URL externe dans le site final — tout est téléchargé, optimisé, versionné
localement sous `public/assets/`.

---

## 3. Plan média par page / section

Légende type : `IMG` image · `VID` vidéo · `SEQ` séquence · `SVG` vectoriel ·
`CODE` généré en code · `TEX` texture · `MOCK` mockup.

### 3.1 Global / marque

| Slot | Type | Rôle | Ratio | Dim. | Desktop | Mobile | Animation | Poids max | Alt | Source | Recherche / prompt |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Logotype NEXCY | SVG/PNG | identité header/footer/OG | ~5:1 | h. 22–28px rendu | vectoriel | vectoriel | — | < 15 Ko | « NEXCY » | fourni | (rognage + optim.) |
| Monogramme N | SVG | filigranes, préloader, favicon | 1:1 | variable | code | code | tracé | < 3 Ko | décoratif | fourni | — |

### 3.2 Accueil `/`

| Slot | Type | Rôle narratif | Ratio | Dim. | Desktop | Mobile | Animation | Poids max | Alt | Source | Recherche / prompt |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Hero — visuel (LCP)** | IMG (+CODE overlay) | 1re impression : matière sombre traversée de lumière | 1:1 / 4:5 | 1200×1200 | image nette + faisceaux code superposés | image portrait allégée | fade+scale à l'entrée, parallaxe légère | **≤ 180 Ko** (AVIF) | « Composition abstraite — surfaces géométriques et lumière ambrée » | Pexels/Unsplash | `dark abstract architecture amber light`, `black geometric light beams`, `dark structure light rays minimal` |
| **Hero — ambiance (option)** | VID | profondeur cinématique derrière le texte | 16:9 | 1920×1080 | boucle muette, **lazy après LCP**, poster | **désactivée** (poster statique) | boucle lente | **≤ 2,5 Mo** MP4/WebM | décoratif (poster a un alt) | Pexels Video | `dark abstract motion light`, `slow light particles black`, `ink flow dark macro` |
| **Bande immersive (nouvelle)** | IMG plein-cadre | respiration + rupture de rythme avant « Méthode » | 21:9 | 2400×1028 | plein-cadre, parallaxe, overlay dégradé | 16:9 recadré | parallaxe Y légère | ≤ 220 Ko | « Surface sombre et trait de lumière précis » | Unsplash/Pexels | `dark minimal architecture light line`, `long exposure light dark` |
| Showcase — carte parallaxe | TEX | remplace le dégradé CSS par une vraie matière | 3:2 | 800×534 | parallaxe au survol | statique | parallaxe pointeur | ≤ 90 Ko | décoratif | Pexels/Pixabay | `dark stone macro gold`, `brushed metal dark macro` |
| Réassurance — fond | IMG | densité subtile derrière le texte | 21:9 | 2400×1028 | très faible opacité, fixe | masqué | — | ≤ 160 Ko | décoratif | Unsplash | `dark texture subtle light gradient` |

### 3.3 Services `/services`

| Slot | Type | Rôle | Ratio | Dim. | Desktop | Mobile | Animation | Poids max | Alt | Source | Recherche / prompt |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Service 01 — Création web | IMG | illustrer sans cliché (écrans/lumière abstraite) | 4:3 | 1200×900 | colonne alternée | empilé, allégé | fade+scale au scroll | ≤ 140 Ko | « Interfaces et lumière — abstraction » | Unsplash/Pexels | `dark UI abstract light`, `screen glow dark minimal` |
| Service 02 — Branding | IMG | matière / encre / identité | 4:3 | 1200×900 | colonne alternée | empilé | fade au scroll | ≤ 140 Ko | « Matière et pigment — abstraction sombre » | Pexels | `black ink macro`, `dark paint texture gold` |
| Service 03 — SEO | IMG/CODE | réseau / trajectoires de lumière | 4:3 | 1200×900 | colonne alternée | empilé | tracé animé | ≤ 130 Ko | « Réseau de lumière sur fond noir » | code + Unsplash | `light network dark`, `nodes light black` |
| Service 04 — Automatisation & IA | IMG/CODE | flux de données / filaments | 4:3 | 1200×900 | colonne alternée | empilé | flux code | ≤ 130 Ko | « Flux lumineux — systèmes automatisés » | code + Pexels | `data light streaks dark`, `flowing light lines black` |

### 3.4 Studio `/studio`

| Slot | Type | Rôle | Ratio | Dim. | Desktop | Mobile | Animation | Poids max | Alt | Source | Recherche / prompt |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Hero / Manifeste** (IMG-02 brief) | IMG | matière minérale noire, traits dorés gravés | 4:3 | 1600×1200 | plein-cadre latéral, parallaxe | 4:5 recadré | fade+scale | ≤ 190 Ko | « Surface minérale noire avec traces lumineuses précises » | Unsplash/Pexels | `dark mineral stone gold veins macro`, `black marble gold light` |
| Bande « Precision in Motion » | VID (option) | mouvement maîtrisé de lumière | 16:9 | 1920×1080 | boucle muette lazy, poster | poster statique | boucle | ≤ 2 Mo | décoratif | Pexels Video | `slow motion light dark elegant`, `precise light movement black` |

### 3.5 Contact `/contact`

| Slot | Type | Rôle | Ratio | Dim. | Desktop | Mobile | Animation | Poids max | Alt | Source | Recherche / prompt |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Colonne gauche — fond | TEX | profondeur discrète (garde la lisibilité du form.) | 3:4 | 900×1200 | très faible opacité | masqué | — | ≤ 110 Ko | décoratif | Unsplash | `dark subtle texture vertical light` |

### 3.6 Open Graph (régénération avec vrai logo)

| Slot | Type | Rôle | Ratio | Dim. | Poids max | Source |
|---|---|---|---|---|---|---|
| OG × 4 (home/services/studio/contact) | IMG | partage social avec logotype réel | 1.91:1 | 1200×630 | ≤ 150 Ko (PNG/JPG) | composé (logo fourni + fond charte) |

---

## 4. Budget performance (cible)

| Vue | Poids média ajouté (cible) | LCP | CLS |
|---|---|---|---|
| Accueil desktop (avec 1 vidéo option) | ≤ ~1,3 Mo | < 2,5 s (hero AVIF `priority`) | < 0,1 (dim. explicites) |
| Accueil desktop (images seules) | ≤ ~600 Ko | < 2,0 s | < 0,1 |
| Accueil mobile (images allégées, **0 vidéo**) | ≤ ~350 Ko | < 2,2 s | < 0,1 |
| Services / Studio desktop | ≤ ~700 Ko | < 2,5 s | < 0,1 |

**Règles d'intégration** : `next/image` partout · `priority` sur le seul visuel LCP (hero) ·
`loading="lazy"` sur tout le reste · `sizes` adaptés · dimensions explicites (0 CLS) ·
vidéo `muted playsInline preload="none"` + `poster` + `<source>` WebM/MP4 + **fallback image
statique** si `prefers-reduced-motion` ou mobile · aucun script tiers bloquant · budget
respecté ou l'asset est recompressé/abandonné.

---

## 5. Ce qui reste généré en code (pas de média externe)
Préloader (tracé N), grille de démonstration live, faisceaux/halos du hero, filigranes N,
underlines dorés, révélations de texte. Le média sourcé **complète** le code, il ne le remplace pas.
