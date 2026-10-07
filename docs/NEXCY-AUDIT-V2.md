# NEXCY — Audit contradictoire V2

> Rôles mobilisés : Directeur de création, UX/UI Lead, Architecte Web Senior, Expert SEO,
> Expert conversion B2B, Ingénieur Next.js senior.
> Référence de niveau : terminal-industries.com (jamais copiée).
> **Statut : audit — aucune modification de design/contenu effectuée. En attente de validation.**
>
> Point de restauration : branche `refactor/international-premium-v2`, tag
> `restore-point-v2-pre-refactor`, hash `1e21097eb0a1520e76c07fad3a6628387e147440`.
> Captures « avant » : `shots/before/` (6 pages × 4 résolutions, 24 fichiers, non versionnées).

Chaque constat : **Constat · Preuve · Fichier · Impact · Correction · Risque de régression · Critère de validation.**

---

## 0. Comparaison au niveau Terminal Industries (écart d'exigence)

| Dimension | Terminal Industries | NEXCY actuel | Écart |
|---|---|---|---|
| Narration | thèse produit déroulée, preuve sociale réelle (clients, investisseurs, témoignage nommé) | affirmations abstraites, **aucune preuve** | fort |
| Densité média | médias **explicatifs** (produit, computer-vision, témoignage) | textures abstraites **décoratives** de banques | fort |
| Hero | scène produit en mouvement | photo abstraite derrière texte + faisceaux codés | moyen |
| Démonstration | valeur métier | 4 micro-effets + légendes identiques « Composant / Animation » | fort |
| Crédibilité | logos, chiffres, citations vérifiables | claims non étayés (« niveau rare ») | fort |
| Finition technique | élevée | élevée (build propre) mais **incohérences de confiance** | ciblé |

**Synthèse** : le site est techniquement propre mais **ne démontre pas la valeur** et repose sur une
DA de textures interchangeables. L'écart n'est pas « visuel » mais **narratif et probatoire**.

---

## P0 — Erreurs, incohérences, sécurité, légalité, confiance

### P0-1 · Incohérence de date de création (2019 vs 2025)
- **Constat** : le site affiche/encode « 2019 » comme année de création ; les mentions légales indiquent une **immatriculation RNE le 21 février 2025** et un **début d'activité le 1er février 2025**.
- **Preuve** : `src/app/layout.tsx:55` (`foundingDate: "2019"`), `src/app/studio/page.tsx:29`, `src/data/navigation.ts:26` (`FOUNDING_YEAR = 2019`) ; `src/content/legal/mentions-legales.txt` (« Date de commencement d'activité : 1er février 2025 »).
- **Fichier** : layout.tsx, studio/page.tsx, navigation.ts, footer, JSON-LD.
- **Impact** : risque de **confiance et juridique** (donnée structurée `foundingDate` non vérifiée exposée aux moteurs ; incohérence public/légal).
- **Correction proposée** : ne rien trancher seul. Distinguer explicitement ce qui a commencé en 2019 (expérience/pratique de Matéo ?) de la **création juridique de NEXCY (2025)**. En données structurées : n'exposer **aucune** `foundingDate` non confirmée (ou 2025, la seule vérifiable). En éditorial : formulation honnête type « une expérience construite depuis 2019, une structure NEXCY lancée en 2025 » **uniquement si 2019 est vérifiable**.
- **Risque de régression** : faible (textuel + JSON-LD).
- **Validation** : Matéo confirme la signification de 2019 ; `foundingDate` retiré ou = valeur confirmée ; footer/legal cohérents.

### P0-2 · Année du footer codée en dur
- **Constat** : `© 2019–2025` avec **2025 en dur**.
- **Preuve** : `src/data/navigation.ts:27` (`CURRENT_YEAR = 2025`), utilisé dans `Footer.tsx`.
- **Impact** : obsolescence automatique au changement d'année (confiance).
- **Correction** : remplacer par `new Date().getFullYear()` (année de fin dynamique) ; l'année de début reste conditionnée à P0-1.
- **Risque** : nul.
- **Validation** : le footer affiche l'année courante calculée dynamiquement.

### P0-3 · JSON-LD LocalBusiness non justifié
- **Constat** : `LocalBusiness` avec `openingHours: "Mo-Fr 09:00-18:00"`, `priceRange: "€€€"`, `foundingDate: "2019"`, adresse limitée à « Bordeaux ». NEXCY est une **micro-entreprise** (pas d'établissement de réception du public vérifié). Duplication partielle avec `Organization`.
- **Preuve** : `src/app/page.tsx` (bloc `localBusinessLd`), `src/app/layout.tsx` (`organizationLd`).
- **Impact** : **données structurées non vérifiées** (horaires/prix/local) → risque de crédibilité et de rich-result trompeur.
- **Correction** : remplacer `LocalBusiness` par **`Organization` + `ProfessionalService`** (sans horaires ni priceRange non vérifiés), ou `LocalBusiness` **uniquement** si adresse + horaires + accueil public sont réels. Dédupliquer Organization/LocalBusiness.
- **Risque** : faible (SEO structuré).
- **Validation** : test Rich Results Google sans avertissement ; aucune donnée non vérifiée.

### P0-4 · Turnstile fail-open en production
- **Constat** : la vérification anti-robot **retourne `true` si la clé secrète est absente**.
- **Preuve** : `src/app/api/contact/route.ts:31` (`if (!secret) return true;`).
- **Impact** : si mal configuré en prod (clé oubliée), **le formulaire accepte les robots silencieusement** (sécurité).
- **Correction** : **fail-closed** en production — valider les variables d'env au démarrage ; si `NODE_ENV=production` et clé absente → refuser/loguer explicitement (pas de bypass silencieux). Bypass toléré uniquement hors production, documenté.
- **Risque** : moyen (peut bloquer le formulaire si mal déployé → d'où la validation d'env au boot).
- **Validation** : en prod sans clé, l'API renvoie une erreur explicite ; avec clé, le flux fonctionne.

### P0-5 · Rate limiting en mémoire (inefficace en serverless)
- **Constat** : compteur `Map` en mémoire de process.
- **Preuve** : `src/app/api/contact/route.ts:12` (`const hits = new Map(...)`).
- **Impact** : sur Vercel (fonctions éphémères/multi-instances), le rate-limit **ne persiste pas** → protection illusoire.
- **Correction** : soit une solution durable compatible Vercel (**Upstash Redis**), soit documenter que Turnstile + honeypot suffisent au risque réel et **retirer** le faux rate-limit trompeur. Décision à valider (coût vs risque).
- **Risque** : faible.
- **Validation** : décision documentée ; si Upstash, test de dépassement ; sinon, code trompeur retiré.

### P0-6 · Bannière cookies cosmétique
- **Constat** : Accepter/Refuser **ne pilote techniquement aucun service**. Plausible est sans cookie ; Turnstile ne charge que sur `/contact`.
- **Preuve** : `src/components/global/CookieBanner.tsx` (pose seulement un cookie `nexcy-consent`, sans effet sur le chargement des services).
- **Impact** : **non-conformité de façade** (consentement sans effet) → risque juridique/confiance.
- **Correction** : **Option A** (recommandée si Plausible cookieless + Turnstile strictement nécessaire au formulaire) : supprimer la bannière, documenter dans la politique de confidentialité. **Option B** : gating réel + preuve de consentement + possibilité de modifier le choix. À trancher.
- **Risque** : faible (retrait) / moyen (gating).
- **Validation** : comportement synchronisé avec la politique de confidentialité ; refus techniquement appliqué OU bannière retirée avec justification.

### P0-7 · CSP trop large (unsafe-eval + domaines média inutiles)
- **Constat** : `script-src` contient `'unsafe-eval'` ; `connect-src`/`img-src` autorisent Pexels/Unsplash/Pixabay/Openverse/Iconify alors que **tous les médias sont désormais locaux**.
- **Preuve** : `next.config.mjs` (securityHeaders → CSP).
- **Impact** : surface d'attaque élargie sans nécessité.
- **Correction** : retirer les domaines média ; tester la suppression d'`'unsafe-eval'` en prod (GSAP/Next 14 ne l'exigent pas en prod — à valider par test) ; conserver challenges.cloudflare.com + plausible + resend.
- **Risque** : moyen (peut casser un chargement si mal testé) → durcir + tester chaque étape.
- **Validation** : build + toutes pages OK, 0 violation CSP console, en-têtes vérifiés (securityheaders.com).

### P0-8 · Affirmations commerciales à étayer
- **Constat** : « Systèmes digitaux **d'un niveau rare** », « Ce site est **notre meilleure démonstration** », « niveau esthétique des **meilleures structures internationales** ».
- **Preuve** : `src/components/home/HomeHero.tsx`, `HomeShowcase.tsx`, `src/components/studio/StudioHero.tsx`.
- **Impact** : promesses non étayées pour une structure créée en 2025 → **crédibilité/prudence juridique**.
- **Correction** : conserver uniquement les formulations démontrables ; remplacer les superlatifs par des affirmations vérifiables (méthode, standards, exigences). **Textes du Master Brief → modification soumise à validation** (règle « textes intégrés tels quels »).
- **Risque** : faible (textuel) mais **touche des textes validés** → validation obligatoire.
- **Validation** : chaque claim conservé est démontrable ; Matéo valide les reformulations.

### P0-9 · `lib/media.ts` mort au runtime + clés média en config prod
- **Constat** : `src/lib/media.ts` (lecture des clés Pexels/Unsplash) **n'est importé nulle part** dans l'app.
- **Preuve** : grep — aucun import de `lib/media` dans `src/`.
- **Impact** : code mort + incitation à mettre des clés média en env de production inutilement.
- **Correction** : supprimer `lib/media.ts` ; ne pas configurer les clés média sur Vercel (elles ne servent qu'au sourcing local, hors runtime).
- **Risque** : nul.
- **Validation** : build OK sans `lib/media.ts` ; aucune clé média requise au runtime.

---

## P1 — UX, conversion, SEO, architecture, contenu

### P1-1 · Incohérence des libellés de CTA
- **Constat** : 6 formulations : « Démarrer un projet », « Parlez-nous de votre projet », « Parler de votre projet », « Discuter de votre projet », « Parler de votre identité », « Démarrer une conversation ».
- **Preuve** : header, home CTA, services (blocs + CTA finale), studio CTA.
- **Impact** : dispersion du parcours, charge cognitive, dilution du CTA principal.
- **Correction** : hiérarchiser — **1 CTA primaire unique** (« Démarrer un projet » → /contact) répété ; CTA contextuels secondaires assumés comme tels. Uniformiser sans multiplier.
- **Risque** : faible.
- **Validation** : 1 libellé primaire dominant ; parcours vers /contact évident sur chaque page.

### P1-2 · Démonstration « savoir-faire » sans valeur métier
- **Constat** : grille de 4 micro-effets (révélation, parallaxe, bouton, ligne) avec **légendes identiques « Composant / Animation »**.
- **Preuve** : `src/components/home/HomeShowcase.tsx`, `ShowcaseWidgets.tsx`.
- **Impact** : lu comme une **démonstration technique sans valeur commerciale** (exactement ce que l'on veut éviter).
- **Correction** : remplacer par 3–4 démonstrations **client-facing** liées aux services (ex. avant/après identité, desktop→responsive, architecture SEO/maillage, workflow automatisation/IA), chacune nommée, explicable, accessible clavier, avec alternative reduced-motion et fonctionnement mobile.
- **Risque** : moyen (nouveau composant interactif à tester a11y/mobile).
- **Validation** : chaque démo a un nom + une valeur claire, clavier/mobile/reduced-motion OK.

### P1-3 · Absence de preuve / crédibilité sur l'Accueil
- **Constat** : aucune preuve réelle (le brief §51 l'assume). Le site compense par des superlatifs.
- **Impact** : conversion B2B faible (le décideur cherche des preuves).
- **Correction** : intégrer des **preuves réelles disponibles** sans inventer : méthode, livrables types, secteurs maîtrisés, engagements vérifiables, prototypes internes **clairement identifiés comme tels**. Jamais un concept présenté comme un client.
- **Risque** : faible.
- **Validation** : présence de crédibilité vérifiable ; aucun faux client/chiffre/avis.

### P1-4 · Sitemap `lastModified` non fiable
- **Constat** : `lastModified: new Date()` → change **à chaque build**.
- **Preuve** : `src/app/sitemap.ts:6,13`.
- **Impact** : signal de fraîcheur SEO trompeur/bruité.
- **Correction** : dates de dernière modification **stables** (constante par page ou date de commit), pas `new Date()` au build.
- **Risque** : nul.
- **Validation** : sitemap stable entre deux builds sans changement de contenu.

### P1-5 · Métadonnées & données structurées (matrice à refaire)
- **Constat** : Titles longs possibles, `sameAs: []` vide, Organization/LocalBusiness dupliqués, absence de matrice SEO formelle.
- **Preuve** : `src/lib/metadata.ts`, pages, `layout.tsx`.
- **Impact** : SEO sous-optimal, données non vérifiées.
- **Correction** : produire `docs/NEXCY-SEO-MATRIX.md` (intention, mots-clés, Title, meta, H1/H2, liens internes, canonical, OG, schéma) ; retirer `sameAs` vide ; schémas vérifiés (voir P0-3).
- **Risque** : faible.
- **Validation** : matrice complète ; test Rich Results sans erreur ; Titles ≤ ~60 car.

### P1-6 · Préloader : attente artificielle + faux compteur
- **Constat** : préloader ~1,8 s avec **compteur 0→100 % factice** ; le contenu attend ~2 s à la 1re visite.
- **Preuve** : `src/components/global/Preloader.tsx` (timeline 1,2 s tracé + compteur 1 s + exit 0,4 s).
- **Impact** : **retard artificiel** du contenu (UX/perf/conversion). Le faux compteur n'a pas de valeur.
- **Correction** : supprimer le préloader **ou** le réduire à une transition de marque < 600 ms **sans compteur factice** ; ne jamais retarder le contenu principal.
- **Risque** : faible.
- **Validation** : contenu visible immédiatement ; si transition, < 600 ms, sans faux compteur.

### P1-7 · Formulaire de contact — friction & complétude
- **Constat** : 8 questions ; fourchette « Moins de 2 000 € » ; pas d'explication du « après envoi ».
- **Preuve** : `src/components/contact/ContactForm.tsx`, `src/data/contact.ts`.
- **Impact** : friction ; fourchette basse **incohérente avec un positionnement premium** ; manque de réassurance post-envoi.
- **Correction** : ajouter (si pertinent) le déroulé après envoi, types de projets acceptés, délai de réponse honnête, alternative de contact directe. **La fourchette « Moins de 2 000 € » : présenter l'impact commercial et attendre validation avant de la modifier.**
- **Risque** : faible (hors changement de budget → validation requise).
- **Validation** : parcours clair, friction réduite, budget inchangé sans validation.

### P1-7bis · Annonce accessible des états du formulaire
- **Constat** : le succès (`role="status"`) et l'erreur serveur (`role="alert"`) existent ; les **erreurs de champ** reposent sur focus + `aria-describedby` (déjà correct) mais pourraient être renforcées.
- **Fichier** : `ContactForm.tsx`.
- **Correction** : conserver focus-first-error + `aria-describedby` ; vérifier annonce lecteur d'écran à la soumission.
- **Risque** : nul.
- **Validation** : test lecteur d'écran (erreur + succès annoncés).

### P1-8 · Contenu Services — problème/résultat/méthode/limites
- **Constat** : structure orientée « accroche + livrables » ; manque **problème client / résultat visé / méthode / critères de réussite / limites**. Mention WordPress + liste d'outils à cadrer.
- **Fichier** : `src/data/services.ts`, `ServiceBlock.tsx`.
- **Correction** : enrichir chaque service (problème→résultat→méthode→livrables→critères→limites→CTA) ; garder les technologies mais **expliquer les critères de choix** (ne rien retirer pour « paraître premium »). Hiérarchie confirmée : Création web (principal) > Branding > SEO > Automatisation & IA > Maintenance.
- **Risque** : moyen (réécriture de contenu → validation).
- **Validation** : chaque service lisible sans texture ; Matéo valide les textes.

### P1-9 · Contenu Studio — démontrer, pas déclarer
- **Constat** : suite de déclarations abstraites ; formulation « équipe » potentiellement trompeuse pour une micro-structure.
- **Fichier** : pages/composants studio.
- **Correction** : présenter honnêtement le fonctionnement (interlocuteur unique + réseau d'experts mobilisés), la méthode, les standards, les critères d'acceptation d'un projet, la relation client. Ne pas suggérer une grande équipe permanente.
- **Risque** : moyen (contenu → validation).
- **Validation** : représentation honnête de la structure ; Matéo valide.

---

## P2 — Direction artistique, médias, animation, finition

### P2-1 · DA trop dépendante de textures de banques
- **Constat** : les visuels sont des **photos abstraites** (Pexels/Unsplash) gradées, décoratives, sans rôle explicatif.
- **Preuve** : `public/assets/{home,services,studio,contact}/*.avif`, intégrations récentes.
- **Impact** : « assemblage d'images stock » — non propriétaire, non NEXCY.
- **Correction** : direction **« L'architecture invisible en mouvement »** — visuels **produits pour NEXCY** : compositions codées, SVG animés, **interfaces fictives réalistes**, séquences de transformation, diagrammes de systèmes/maillage/flux. Médias **explicatifs**, pas décoratifs. Détail dans `docs/NEXCY-CREATIVE-DIRECTION-V2.md`.
- **Risque** : élevé (refonte visuelle → validation + tests perf/a11y).
- **Validation** : chaque média a un rôle narratif ; aucune texture répétée ; rendu propriétaire.

### P2-2 · Hero = photo abstraite derrière le texte
- **Constat** : hero = image abstraite + faisceaux codés.
- **Correction** : scène **propriétaire** montrant « un système digital en mouvement » (composition codée/SVG/interface fictive/séquence), pas une nouvelle photo.
- **Risque** : moyen/élevé (nouveau composant animé → perf/a11y).
- **Validation** : message compris < 3 s (quoi/pour qui/différence/action) ; hero singulier.

### P2-3 · Compression média possiblement excessive
- **Constat** : certains AVIF à 8–12 Ko (hero, création, seo, IA) → **risque de banding/perte sur Retina** sur aplats sombres.
- **Preuve** : `public/assets/*` (tailles), `docs/NEXCY-ASSETS-MANIFEST.md`.
- **Impact** : rendu dégradé sur grands écrans/Retina.
- **Correction** : réévaluer qualité par image ; **ne pas viser 8–12 Ko au détriment du rendu** ; conserver/retravailler/remplacer/supprimer chaque asset (audit dans `docs/NEXCY-ASSETS-MANIFEST-V2.md`).
- **Risque** : faible.
- **Validation** : aucun banding visible à 200 % / Retina ; poids justifié par le rendu.

### P2-4 · Répétition de matières entre sections
- **Constat** : mêmes images réutilisées (ex. minéral doré en branding + bande studio ; fluide en réassurance + contact).
- **Impact** : sensation de remplissage.
- **Correction** : une matière = un emplacement ; sinon média codé/narratif distinct.
- **Risque** : faible.
- **Validation** : aucune image identique sur deux sections perçues.

### P2-5 · Coût des animations à mesurer réellement
- **Constat** : GSAP + ScrollTrigger + Lenis + préloader + animation infinie (DemoLine, désormais gatée) + images plein-cadre.
- **Impact** : TBT/INP potentiels sur mobile bas de gamme (non mesurés en conditions réelles).
- **Correction** : mesurer en **preview Vercel / réseau mobile simulé / cache froid** (Lighthouse mobile) ; documenter le coût de chaque brique ; `docs/NEXCY-PERFORMANCE-REPORT.md`.
- **Risque** : faible (mesure).
- **Validation** : Perf mobile ≥ 90 réaliste, INP/TBT sains, 0 erreur console.

### P2-6 · Manifest PWA / display standalone à justifier
- **Constat** : `manifest.ts` avec `display: standalone` sans besoin PWA réel.
- **Correction** : simplifier ou retirer après validation si aucun usage PWA.
- **Risque** : nul.
- **Validation** : décision documentée.

---

## Synthèse & séquencement proposé

| Lot | Contenu | Nb constats | Nature |
|---|---|---|---|
| **Lot 1 — P0** | dates, footer dynamique, JSON-LD, Turnstile fail-closed, rate-limit, cookies, CSP, claims, media.ts mort | 9 | sécurité / légal / confiance |
| **Lot 2 — P1** | CTA, démonstration client-facing, preuves, sitemap, matrice SEO, préloader, formulaire, contenu Services/Studio | 10 | UX / conversion / SEO / contenu |
| **Lot 3 — P2** | DA propriétaire, hero codé, compression, répétitions, coût animations, manifest | 6 | DA / médias / finition |

**Points nécessitant explicitement la validation de Matéo avant exécution :**
1. Signification de **2019** vs création légale **2025** (P0-1).
2. Reformulation des **claims** (textes du Master Brief) (P0-8).
3. Choix **cookies Option A vs B** (P0-6).
4. **Rate-limit** : Upstash vs retrait documenté (P0-5).
5. Fourchette **« Moins de 2 000 € »** (impact commercial) (P1-7).
6. Réécriture des **contenus Services/Studio** (P1-8/9).
7. Ampleur de la **refonte DA/hero/démonstrations** (P2-1/2/3).

Aucune de ces modifications n'est appliquée à ce stade.
