# NEXCY — Matrice SEO (6 pages)

> Sous-lot 2. **Aucune modification de code** à ce stade — document de validation.
> Méthode : analyse SERP réelle (WebSearch, juillet 2026) + un fetch concurrent.
> **Aucun volume inventé** : toutes les données de volume/CPC/difficulté sont
> marquées « non vérifié » (aucune source fiable — Keyword Planner/Semrush/Ahrefs —
> n'était accessible). Les conclusions reposent sur le **type de SERP observé** et
> l'**intention**, pas sur des volumes fabriqués.

## Synthèse stratégique (issue des SERP observées)

| Requête | Intention | SERP dominée par | Difficulté (qualitative) | Verdict pour NEXCY |
|---|---|---|---|---|
| agence web Bordeaux | commerciale + locale | annuaires (Sortlist) + agences 18–25 ans (Appalga, Sympozium, Natural-net) + listicles | **très élevée** | secondaire (aspirationnel), pas de bataille frontale |
| **agence web premium Bordeaux** | commerciale + locale, premium | cluster premium (LATOUTFRANCAIS, Beaucoup, ITS ARTY, Socreativ') — **moins annuairisé** | moyenne | **principal Accueil** — aligné positionnement |
| création site web Bordeaux | locale/commerciale | pages service locales + accueils + annuaires | élevée | secondaire Services (local) |
| création site web sur mesure | commerciale + informationnelle (nationale) | pages « sur mesure » d'agences + offres à prix + blogs | moyenne/élevée | **principal Services** |
| agence digitale Bordeaux | commerciale + locale | **annuaires + listicles massifs** | **très élevée** | à éviter en principal (cannibaliserait l'Accueil) |
| studio digital Bordeaux | commerciale + brand/niche | homepages de studios créatifs (peu d'annuaires) | moyenne | secondaire doux (Accueil/Studio) |
| agence SEO Bordeaux | commerciale + locale | agences SEO spécialisées (Première Page, Eskimoz, Keyweo, depuis 2012) | **très élevée** | secondaire Services uniquement |
| automatisation PME / IA entreprise | commerciale (nationale) | agences IA spécialisées (ISIIA, NeoAI, Kayro) + listicles (Codeur, Impli) | moyenne, en croissance | secondaire Services |

**Décision d'architecture (anti-cannibalisation)** :
- **Accueil = « agence »** (qui est NEXCY, premium, Bordeaux).
- **Services = « création site web sur mesure »** (ce que fait NEXCY).
- **Studio = intention de marque** (vision/méthode) — **ne cible PAS** « agence digitale Bordeaux ».
- **Contact = intention de contact/devis.**

---

## Matrice par page

### 1. Accueil `/`
- **Intention** : commerciale à forte composante locale (chercher une agence premium à Bordeaux).
- **Mot-clé principal** : `agence web premium Bordeaux`.
- **Secondaires** : agence digitale premium Bordeaux · studio digital premium · agence web Bordeaux (aspirationnel).
- **Justification** : le générique « agence web Bordeaux » est saturé (annuaires + agences établies 18–25 ans) — irréaliste à court terme pour une structure lancée en 2025. Le cluster « premium » est différencié, moins annuairisé, et **cohérent avec le positionnement réel**.
- **Title** (≤60) : `NEXCY — Agence web premium à Bordeaux` *(37 car.)*
- **Meta** : Sites web, identités et systèmes digitaux conçus avec précision pour les entreprises exigeantes. Bordeaux — réponse sous 48h.
- **H1** : Systèmes digitaux conçus avec précision. *(H1 de marque ; le mot-clé vit dans Title/meta/corps — arbitrage assumé, voir plus bas.)*
- **H2 recommandés** : Cinq expertises · Ce site est notre démonstration · Un processus en quatre étapes · Nos engagements · Ce qui nous distingue.
- **Liens internes** : /services, /studio, /contact.
- **Canonical** : https://nexcy.fr/
- **OG** : og-home.png
- **JSON-LD** : Organization + WebSite (global) + ProfessionalService.
- **Risque de cannibalisation** : avec Studio (tous deux « agence ») → **neutralisé** en réservant Studio à l'intention de marque.
- **Confiance données** : types SERP = **élevée** ; volumes = **non vérifié**.

### 2. Services `/services`
- **Intention** : transactionnelle/commerciale (faire réaliser un site sur mesure) + expertises.
- **Mot-clé principal** : `création site web sur mesure`.
- **Secondaires** : création site web Bordeaux · agence création site web · refonte site web · agence branding Bordeaux · agence SEO Bordeaux · automatisation PME. *(chacun porté naturellement par son bloc de service)*
- **Justification** : la page couvre les 5 expertises, création web en tête. « Sur mesure » (national) est **distinct** de « agence premium Bordeaux » (Accueil) → pas de cannibalisation. SEO/branding/automatisation restent secondaires (marchés très concurrentiels en principal).
- **Title** (≤60) : `Création web sur mesure, branding, SEO & IA — NEXCY` *(51 car.)*
- **Meta** : Création de sites web sur mesure, branding, SEO et automatisation. Une base technique propre, un accompagnement dans la durée.
- **H1** : Nos expertises.
- **H2 recommandés** : Création de sites web · Branding · SEO — Référencement naturel · Automatisation & Intelligence artificielle · Accompagnement continu.
- **Liens internes** : /, /studio, /contact.
- **Canonical** : https://nexcy.fr/services
- **OG** : og-services.png
- **JSON-LD** : **Service ×4** (les 4 services au contenu désormais détaillé : problème/résultat/méthode/livrables/critères) **+ BreadcrumbList**. *(Maintenance = offre d'abonnement, exclue du Service schema — voir arbitrage.)*
- **Risque de cannibalisation** : avec Accueil → **faible** (sur-mesure vs agence premium).
- **Confiance données** : types SERP = **élevée** ; volumes = **non vérifié**.

### 3. Studio `/studio`
- **Intention** : **marque / institutionnelle / navigationnelle** (qui est NEXCY, vision, méthode, standards).
- **Mot-clé principal** : marque — `NEXCY studio` / `à propos NEXCY` (navigationnel).
- **Secondaires** : studio digital premium · vision agence digitale · méthode agence web *(naturels, non commerciaux)*.
- **Justification** : **ne cible pas** « agence digitale Bordeaux » (SERP saturé d'annuaires **et** cannibaliserait l'Accueil). Le Studio sert la confiance/marque, pas une bataille de requête commerciale.
- **Title** (≤60) : `Studio — NEXCY | Vision & méthode` *(33 car.)* *(volontairement sans « agence digitale Bordeaux »)*
- **Meta** : L'histoire, la vision, les standards et le fonctionnement de NEXCY. Une agence conçue pour l'exigence.
- **H1** : Une agence conçue pour l'exigence.
- **H2 recommandés** : Une pratique affinée, une structure dédiée · L'excellence invisible · Precision in Motion · Cinq valeurs · Un interlocuteur unique · Ce sur quoi nous ne transigeons pas.
- **Liens internes** : /, /services, /contact.
- **Canonical** : https://nexcy.fr/studio
- **OG** : og-studio.png
- **JSON-LD** : AboutPage + Organization.
- **Risque de cannibalisation** : avec Accueil → **neutralisé** (intention de marque, Title sans requête locale commerciale).
- **Confiance données** : **élevée** (choix d'intention, peu dépendant du volume).

### 4. Contact `/contact`
- **Intention** : transactionnelle (contact / devis).
- **Mot-clé principal** : `contact agence web Bordeaux`.
- **Secondaires** : devis création site web Bordeaux · devis site internet.
- **Justification** : page de conversion, intention claire ; peu de volume mais forte valeur.
- **Title** (≤60) : `Contact — Démarrez votre projet avec NEXCY` *(42 car.)*
- **Meta** : Décrivez votre projet. Réponse sous 48 heures ouvrées. Bordeaux, France.
- **H1** : Parlons de votre projet.
- **H2 recommandés** : *(formulaire — pas de H2 commercial nécessaire)*.
- **Liens internes** : /, /services, /studio.
- **Canonical** : https://nexcy.fr/contact
- **OG** : og-contact.png
- **JSON-LD** : ContactPage.
- **Risque de cannibalisation** : nul.
- **Confiance données** : élevée.

### 5–6. Pages légales `/mentions-legales` & `/politique-de-confidentialite`
- **Intention** : légale — **aucune stratégie commerciale**.
- **Mots-clés** : aucun (pas d'optimisation commerciale).
- **Title** : `Mentions légales — NEXCY` / `Politique de confidentialité — NEXCY`.
- **Meta** : descriptives et sobres.
- **H1** : Mentions légales / Politique de confidentialité.
- **Canonical** : self.
- **JSON-LD** : aucun.
- **Recommandation d'indexation** : **INDEXABLES** (retirer le `noindex` posé au Lot 1). Justification : sur un site de 6 pages, il n'y a **aucun enjeu de budget de crawl** ; des pages légales accessibles et indexées sont un **signal de transparence/E-E-A-T** ; aucune raison technique claire de les exclure. Elles ne doivent simplement **pas** être optimisées comme des pages commerciales.
- **Risque de cannibalisation** : nul.
- **Confiance** : élevée (décision éditoriale).

---

## SEO local — évaluation
- **Bordeaux dans Title/H1** : pertinent pour **Accueil** (agence premium locale) ; en **secondaire** pour Services (création site web Bordeaux). Pas pertinent pour « sur mesure » / « automatisation » (intention nationale).
- **Variations** : `Bordeaux` (local principal) · `Gironde` / `Nouvelle-Aquitaine` (secondaires, naturels dans le corps) · `France` (portée nationale pour sur-mesure & automatisation).
- **Local vs national** : **hybride** — local premium sur les requêtes d'agence, national sur « sur mesure » et « automatisation ».
- **Cohérence sans local recevant du public** : NEXCY est une micro-entreprise (adresse légale réelle, mais **pas d'établissement recevant du public**). → **Pas de LocalBusiness, pas d'horaires, pas de priceRange** (déjà corrigé au Lot 1 : ProfessionalService). **Aucune fausse adresse/horaire/avis.** Une fiche Google Business *pourrait* être créée si Matéo le souhaite (décision hors site).

---

## Données structurées — recommandations
| Page | Schéma | État |
|---|---|---|
| Global (layout) | Organization + WebSite | ✅ exact (Lot 1) |
| Accueil | ProfessionalService | ✅ exact (Lot 1, sans horaires/prix) |
| Services | **Service ×4** + BreadcrumbList | 🔧 ajuster : passer de ×5 à ×4 (exclure la maintenance, qui est une offre d'abonnement, pas un service détaillé distinct) |
| Studio | AboutPage + Organization | ✅ en place |
| Contact | ContactPage | ✅ en place |
| Légales | aucun | ✅ |

Conformité Schema.org/Google : pas de duplication Organization/LocalBusiness (LocalBusiness retiré) ; à **tester via Rich Results Test** après intégration.

---

## Concurrents étudiés (deep-dive complété)
> Deep-dive relancé après la limite de session. Analyse Title/H1/angle/preuves/local/
> données structurées/profondeur sur les **peers premium réels** (identifiés via SERP)
> + généraliste établi + leader SEO. **Note** : la liste de concurrents du Master Brief
> (Konvict, Humana Studio, Tiz, Karussel) est **obsolète/inexacte** — « Humana Studio »
> ne ressort pas comme agence web bordelaise (résultats = « HUMAN Immobilier », sans
> rapport). Les concurrents pertinents réels sont ci-dessous.

| Concurrent | Title / H1 | Angle | Preuves | Local | JSON-LD | Profondeur |
|---|---|---|---|---|---|---|
| **LATOUTFRANCAIS** | « Agence web premium à Bordeaux \| Stratégie, Design, Développement » | premium 3 piliers | non visibles (home JS) | Bordeaux (title) | aucun détecté | faible (crawlable) |
| **Beaucoup** | T: « Agence web Bordeaux \| Devenez unique » · H1: « Agence Web Bordeaux » | studio premium design | **Awwwards « Studio of the Year » ×2**, 7 experts, portfolio nommé (Caeli, Anima, Oakame), **prix ~25 k€ / 7,5 k€**, délais 2–4 mois, FAQ | Bordeaux + 5 villes, pas d'adresse | aucun détecté | moyen-élevé |
| **ITS ARTY** | T: « Agence web à Bordeaux (Gironde)… » · H1: « Agence web bordeaux en gironde » | orienté résultats/entrepreneurs, « bienveillance » | **15+ témoignages nommés**, avant/après, **certifié Showit** | Bordeaux/Gironde + villes, France + int'l | aucun détecté | moyen-élevé (FAQ, blog, process 3 phases) |
| **Sympozium** | T: « Agence web à Bordeaux \| Création de sites internet » · H1: « Sympozium, 25 ans d'expertise… » | généraliste établi | portfolio 7 clients nommés (pas d'avis/prix/awards) | **adresse réelle** 1 rue Lucien Faure 33300, tél, Google Maps | aucun détecté | moyen |
| Appalga / Natural-net / Dernier Cri | généralistes (2015 / 18 ans / B Corp) | généraliste | ancienneté, réalisations | Bordeaux | (non audité en détail) | — |
| Première Page / Eskimoz / Keyweo | agences SEO spécialisées (depuis 2012) | SEO/GEO | ancienneté, cas | Bordeaux + national | (non audité) | élevé |
| Sortlist (annuaire) | comparateur | mise en relation | avis agrégés | multi-ville | oui (annuaire) | — |

**Enseignements actionnables pour NEXCY** :
1. **H1 keyword vs marque** : tous les concurrents utilisent un H1 avec mot-clé (« Agence Web Bordeaux »). NEXCY assume un **H1 de marque** (validé) — différenciation premium ; le mot-clé reste dans Title/meta/corps. Trade-off conscient.
2. **Preuves** : les peers premium s'appuient sur **awards, portfolios nommés, témoignages, prix**. NEXCY (créée 2025, sans clients) **ne peut pas** rivaliser sur ce terrain sans inventer → différenciation par **méthode, standards, engagements et démonstration live** (cf. Livrable 5). **Ne jamais fabriquer** clients/avis/awards.
3. **Données structurées** : peu de concurrents audités exposent du JSON-LD. **À ne PAS interpréter comme un avantage de classement** : le balisage NEXCY (Organization / WebSite / ProfessionalService / AboutPage / ContactPage / Service) sert la **compréhension des entités** par les moteurs et l'**éligibilité éventuelle aux résultats enrichis** — ce n'est **pas un facteur de ranking direct**, et l'absence de JSON-LD chez un concurrent ne prouve aucun avantage SEO.
4. **Éviter** la confrontation frontale sur « agence web Bordeaux » (généralistes établis) et « agence SEO Bordeaux » (spécialistes) → cohérent avec le ciblage « premium » + « sur mesure ».

## Décisions validées par Matéo (figées)
- ✅ Accueil principal = **« agence web premium Bordeaux »**.
- ✅ H1 Accueil = **message de marque** (« Systèmes digitaux conçus avec précision. »).
- ✅ Pages légales = **indexables** (retrait du `noindex` du Lot 1).
- ✅ Studio = intention de marque (Title sans « agence digitale Bordeaux »).
- ✅ Service schema = **×4** (hors maintenance).
- Volumes : restés qualitatifs (non chiffrés) — priorisation sur intention/SERP.

---

## Sources utilisées
- SERP (WebSearch, juillet 2026) : sortlist.fr, appalga.com, sympozium.fr, natural-net.fr, derniercri.io, spationaute.io, latoutfrancais.fr, beaucoup.studio, itsarty.studio, agence-communication-bordeaux.com, evico.fr, influa.com, premiere.page, stratedge.fr, eskimoz.fr, keyweo.com, codeur.com, isiia.com, impli.fr, kayro.ai.
- Analyses SERP additionnelles (workflow) : création site web Bordeaux, création site web sur mesure, agence digitale Bordeaux, studio digital Bordeaux.
- Fetch : latoutfrancais.fr (Title confirmé).

## Données non vérifiables
- **Tous les volumes de recherche, CPC et scores de difficulté** : non vérifiés (aucune source fiable accessible). → à confirmer via **Google Keyword Planner / Semrush / Ahrefs** avant de figer la priorisation fine.
- **Présence de pack local Google Maps** : probable sur les requêtes géolocalisées mais non observable via WebSearch (organique seul) → à vérifier sur google.fr géolocalisé.

## Arbitrages proposés (à valider)
1. **Accueil principal = « agence web premium Bordeaux »** (et non « agence web Bordeaux », saturé).
2. **H1 Accueil = message de marque** (« Systèmes digitaux conçus avec précision. ») plutôt qu'un H1 sur-optimisé ; le mot-clé vit dans Title/meta/corps. *(Choix premium ; alternative : H1 avec « agence web premium à Bordeaux ».)*
3. **Studio = intention de marque** ; Title sans « agence digitale Bordeaux » (anti-cannibalisation).
4. **Pages légales → indexables** (retrait du `noindex` du Lot 1).
5. **Service schema ×4** (exclure la maintenance).
6. **Titles raccourcis** (tous ≤ 60 car.).

## Statut de validation
- [x] Mot-clé principal Accueil : **« agence web premium Bordeaux »** — validé.
- [x] H1 Accueil : **message de marque** — validé.
- [x] Pages légales : **indexables** (retrait du noindex) — validé.
- [x] Studio : Title de marque sans « agence digitale Bordeaux » — validé.
- [x] Service schema **×4** (sans maintenance) — validé.
- [x] Deep-dive concurrents : **complété** (peers premium réels ; liste du brief obsolète).
- [~] Volumes : procédé sur base **qualitative SERP** (chiffrage payant non requis pour cette phase).

➡️ **Matrice figée. Prête pour l'intégration (sous-lot SEO).**
