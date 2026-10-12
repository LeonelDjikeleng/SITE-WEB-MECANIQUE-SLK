# Mécanique SKL : audit et diagnostic de la maquette

12 octobre 2026 · Administrateur 2.0. Compétences chargées : **Audit Digital 2.0**, puis **Conversion & UX 2.0**.
Objet : la maquette de démarchage (`site/`), servie en local sur `http://localhost:8765/`. Ce n'est pas le site d'un prospect en ligne. C'est donc un **diagnostic de notre propre livrable** avant la version finale. Aucun fichier du site n'a été modifié.

Ce qui est voulu n'est **pas** compté comme défaut : le bandeau « Maquette », `noindex`, `robots.txt` bloquant, le formulaire de démonstration, les étiquettes « fictif », les deux numéros affichés côte à côte et `example.com` aux étapes de déploiement.

---

## 0. En bref (lecture téléphone)

**Verdict.** La maquette est solide sur l'essentiel :
- un geste pour appeler et un geste pour l'itinéraire, depuis le premier écran ;
- aucun tiers, aucun témoin (cookie), aucun stockage local ;
- contrastes conformes ;
- une signature forte (la roue qui porte l'adresse).

Elle reste en deçà d'une version « VIP mobile » sur cinq points mesurés :

1. **Le bouton « Maintenir pour inspecter » bloque le défilement au doigt.** Un glissement qui part du bouton déplace la page de 0 px (790 px juste à côté), à cause de `touch-action:none`. C'est contraire à ta priorité absolue.
2. **« Rendez-vous » mène à un formulaire invisible.** Après le geste, le premier champ est caché sous la barre d'actions (champ à 796 px, barre à 774 px). Il faut encore défiler environ un écran.
3. **La page est longue.** Elle fait 16,7 écrans à 390 px et 18,5 à 360 px. L'adresse et les heures n'arrivent qu'au 13ᵉ écran. Les seules marges de section font 2,3 écrans. Il n'y a **aucune carte**.
4. **Chromium n'enregistre aucun FCP ni LCP.** En cause, le fondu d'entrée de `body` (`opacity:0`). Sans cette seule règle, FCP = 684 ms (processeur ×4).
5. **Le décor travaille en continu.** Au repos en haut de page, la poussière animée occupe 34 % du processeur ralenti ×4 (1,7 s de travail toutes les 5 s). Pendant un défilement, on compte environ 200 recalculs de mise en page, contre 22 quand les animations sont réduites.

**Points légaux (P0 selon ta règle, à régler avant toute mise en ligne publique).** La maquette est conforme au chargement. La politique de confidentialité et l'offre d'exemple ont quatre écarts à corriger avant le branchement du formulaire (section 7).

---

## 1. Méthode, outils et limites

| Contrôle | Comment | Statut |
|---|---|---|
| Captures écran par écran : 360 × 780 et 390 × 844 (`isMobile`, `hasTouch`, ×2), 1440 × 900 | Playwright + Chromium 1194, script `captures.mjs` | Fait, 55 captures |
| Grille « Conversion & UX 2.0 » (`cro.py inspecter`) | Le module Python Playwright est absent : grille reproduite en Node (CTA du premier écran, cibles, tailles de texte, débordement, formulaire, clavier sur 30 tabulations) | Fait |
| Poids, requêtes, hôtes, témoins, stockage | Chrome DevTools Protocol (Network) | Fait |
| FCP, LCP, CLS, tâches longues | PerformanceObserver injecté avant le chargement | Fait |
| Fluidité du défilement | `Emulation.setCPUThrottlingRate` ×4, défilement synthétisé de toute la page à 2 400 px/s, images mesurées par `requestAnimationFrame`, compteurs `Performance.getMetrics` | Fait |
| Isolation des coûts | Variantes interceptées en mémoire (`page.route`, sans toucher aux fichiers) : sans fondu, sans poussière, sans animations infinies, sans décor JS, animations réduites | Fait |
| Contrastes | 204 textes à 390 px, fond réel échantillonné au pixel (texte masqué puis capture) | Fait |
| Parcours | geste « Rendez-vous », envoi du formulaire, boutons « Copier », FAQ, glissement au doigt sur le bouton d'inspection | Fait |
| Lighthouse, PageSpeed Insights, CrUX (données réelles) | Non installés ou inaccessibles | **Non testé** |
| Vrai téléphone avec carte graphique, iOS Safari | Indisponible | **Non testé** |
| Fiche Google Business Profile du garage | Accès réseau limité | **Non testé** |

Limites à garder en tête :
- **Chromium sans interface et sans carte graphique** : le rendu logiciel pénalise surtout l'ordinateur à 1440 px. Ce sont des mesures de **laboratoire**, jamais des données d'utilisateurs.
- **Serveur local sans compression** (`SimpleHTTP`) : les octets « transférés » sont les octets bruts. L'estimation compressée est calculée à part.
- **Défilement tactile** : le geste tactile synthétisé (`synthesizeScrollGesture`, source `touch`) ne défile pas dans ce Chromium sans interface, même sur une page sans aucun effet. Le défilement mobile est donc mesuré au geste molette, sur la fenêtre mobile. Le blocage du bouton d'inspection a, lui, été reproduit par de vrais événements tactiles (`Input.dispatchTouchEvent`).
- **Points juridiques** : ce sont des constats de conformité, pas un avis juridique. Fais valider avec un juriste, la CAI ou l'OPC avant publication.
- **Moteur `audit.py`** : non utilisé (pas de dossier prospect, la cible est notre maquette). La méthode de preuve, les statuts et la matrice P0 à P3 de la compétence sont appliqués à la main.

Scripts, mesures et captures (dossier temporaire de la session) : `/tmp/claude-0/-home-user-SITE-WEB-MECANIQUE-SLK/21921b5d-c548-5640-9040-acb90318934b/scratchpad/admin-audit/`
- `captures.mjs`, `perf.mjs`, `contraste.mjs`, `loi25.mjs`, `parcours.mjs`
- `mesures-captures.json`, `mesures-perf.json`, `mesures-contraste.json`
- `captures/tel390-ecran-00.png` à `-16.png`, `tel360-…`, `ordi1440-…`, `tel390-menu-ouvert.png`, `tel390-apres-tap-rendez-vous.png`

Priorités, d'après la matrice d'Audit Digital 2.0 :
- **P0** = bloquant. Ici, **tout écart légal** (ta règle) et rien d'autre.
- **P1** = élevée · **P2** = moyenne · **P3** = faible.
- Statuts : Confirmé · Probable · À vérifier, avec un niveau de confiance.

---

## 2. Mesures clés (390 × 844 sauf mention)

| Mesure | Valeur | Preuve |
|---|---|---|
| Hauteur de page | 14 123 px = **16,7 écrans** (360 px : 18,5 ; 1440 px : 13,1) | `mesures-captures.json` |
| Position du formulaire | **12,2 écrans** | idem |
| Position de « Nous trouver » (adresse, heures) | **13,3 écrans** | idem |
| Marges verticales de section (padding seul) | 1 938 px = **2,3 écrans** | `parcours.mjs` |
| Chrome fixe au chargement (bandeau 40 + en-tête 58 + barre 70) | 168 px, soit **20 % de l'écran** | captures `ecran-00` |
| Gestes pour appeler | **1** (barre, bouton de l'accueil ou icône d'en-tête), puis la confirmation du téléphone | `.dock a[href^=tel]` visible dès le chargement |
| Gestes pour l'itinéraire | **1** (barre « Itinéraire » → Google Maps, destination préremplie) | `.dock a[href*="maps/dir"]` |
| Gestes pour une demande | 1 geste + **environ 1 écran à défiler** + 3 champs obligatoires + envoi | `tel390-apres-tap-rendez-vous.png` |
| Requêtes au chargement | 10 réseau (+ 3 images `data:`), **toutes sur le même domaine** | `perf.mjs` |
| Poids brut | 277,6 Ko. Estimation compressée (gzip) : ≈ 192 Ko, dont **155 Ko de polices** (≈ 80 %) | `perf.mjs`, `gzip -9` |
| FCP / LCP | **aucun enregistré en 6 s**. Sans le fondu de `body` : FCP = LCP = 684 ms (×4) ; animations réduites : 628 ms | `debug.mjs`, `perf.mjs` |
| CLS | 0 | `perf.mjs` |
| Tâche longue au chargement (×4) | 390 à 490 ms (≈ 100 à 120 ms sans ralentissement) | `perf.mjs` |
| Témoins, localStorage, sessionStorage | **0 / 0 / 0**, après chargement, défilement complet, envoi du formulaire et « Copier » | `loi25.mjs` |
| Contraste minimal mesuré | **4,97:1** (petit texte), tous les textes ≥ 4,5:1 | `contraste.mjs` (les 8 alertes brutes sont des artefacts : cartes hors écran du carrousel, réponse de FAQ fermée) |
| Débordement horizontal (360, 390, 1440 px) | 0 | `mesures-captures.json` |
| Erreurs console | 0 | idem |

### Défilement de toute la page, processeur ×4

| Scénario | img/s | images > 25 ms | images > 50 ms | pire image | mises en page | recalculs de style |
|---|---|---|---|---|---|---|
| Téléphone 390, tel quel (2 passages) | 56,9 à 57,3 | 30 à 36 sur ≈ 655 (≈ 5 %) | 0 | 33 à 50 ms | 194 à 205 | 879 à 888 |
| Téléphone 390, animations réduites | 59,5 | 4 | 0 | 50 ms | **22** | **106** |
| Téléphone 390, sans décor JS ni animations infinies | 57,7 | 12 | 3 | 150 ms | 200 | 501 |
| Téléphone 360, tel quel | 56,8 | 36 | 0 | 50 ms | 203 | 886 |
| Téléphone 390, réseau 4G lente | 55,6 | 46 | 0 | 50 ms | 188 | 850 |
| Ordinateur 1440, processeur ×1 | 53,7 | 48 | 3 | 83 ms | 179 | 673 |
| Ordinateur 1440, processeur ×4 | 48,2 | 74 | 9 | **133 ms** | 134 | 574 |
| Ordinateur 1440 ×4, sans décor JS ni animations infinies | 55,4 | 40 | 1 | 50 ms | 172 | 402 |

Au repos 5 s en haut de page (téléphone, ×4) :
- **tel quel** : 300 recalculs de style, **1 768 ms de travail** sur 5 000 ;
- **sans la poussière** : 2 recalculs, **17 ms** ;
- **animations réduites** : 1 ms.

La poussière (`canvas.dust`, boucle `requestAnimationFrame`) est donc la seule cause du travail au repos. Les animations CSS infinies (`drift`, `shine`, `cue`) passent par le compositeur et ne coûtent presque rien au fil principal.

Écart avec REPRISE.md. Le dossier annonçait « 59 img/s, 0 image saccadée ». Les mesures d'aujourd'hui confirment **zéro saccade de plus de 50 ms sur téléphone**, mais environ 5 % d'images manquées (plus de 25 ms). Le mode « animations réduites », lui, est presque parfait. La différence vient des effets liés au défilement, pas du contenu.

---

## 3. Diagnostic (a) : parcours mobile et conversion

| # | Constat | Preuve | Impact | Correctif | Statut · prio |
|---|---|---|---|---|---|
| A1 | **Un glissement qui part du bouton d'inspection ne fait pas défiler la page** et lance la jauge. | `.hold{touch-action:none}` (styles.css l.269) + `e.preventDefault()` sur `pointerdown` (main.js l.234). Mesure : glissement de 300 px sur le bouton → 0 px ; à côté → 790 px. Bouton de 320 × 58 px, 5,6 % de l'écran, en plein milieu du flux. | Friction directe sur le geste le plus fréquent du téléphone, contraire à ta priorité « défilement natif ». | Remplacer « maintenir » par **un appui qui lance** l'inspection (2,6 s automatique, interruptible). Mettre `touch-action:manipulation` et retirer `preventDefault`. | Confirmé · élevée · **P1** |
| A2 | **Après « Rendez-vous », le formulaire n'est pas visible.** | Barre « Rendez-vous » → `scrollY` 9 556 ; étiquette « Votre nom » à 773 px, champ à 796–845 px ; barre à 774 px (`tel390-apres-tap-rendez-vous.png`). On voit le titre, deux grands numéros et « Copier ». | Le visiteur doit chercher le formulaire. Cela peut créer une friction au moment de l'action. | Viser le formulaire (`#demande` avec `scroll-margin-top`), placer le formulaire **avant** l'intro sur mobile, ou mieux : une **feuille `<dialog>` native** qui s'ouvre sur place avec 3 champs. Ajouter `scroll-padding-bottom` égal à la hauteur de la barre. | Confirmé · élevée · **P1** |
| A3 | **Page trop longue, ordre des sections défavorable au mobile.** | 16,7 écrans ; formulaire à 12,2 ; adresse à 13,3. Hauteurs : manifeste 0,86, services 1,94, inspection 1,75, votre visite 1,28, pneus 1,70, droits 1,45, avis 0,92, rendez-vous 1,82, visite et FAQ 1,74, appel final 0,68. | Les informations du « client pressé » (où, quand, ouvert ?) arrivent après 13 écrans. Le contenu de réassurance est dilué. | Viser **9 écrans au plus** : réordonner et fusionner (section 9, changements 1 et 6). | Confirmé · élevée · **P1** |
| A4 | **Aucune carte ; l'adresse visuelle est loin.** | 0 `iframe`, 0 image de carte. Adresse dans le sous-titre de l'accueil (texte), lien du bandeau d'état (1,86 écran), section « Nous trouver » (13,3 écrans). Sur mobile, `.kicker__more{display:none}` masque l'adresse de la pastille. | L'itinéraire est à un geste (point fort), mais rien ne montre **où** est le garage ni comment y entrer. C'est le manque principal que tu as relevé. | Carte d'accès statique au 2ᵉ écran (section 8). | Confirmé · moyen · **P2** |
| A5 | **Premier écran redondant et chargé.** | Trois « Appeler » visibles en même temps (icône d'en-tête, bouton jaune de l'accueil, barre jaune). La barre est forcée visible dès le chargement (`dock.classList.add('is-mobile')`, main.js l.148, qui annule le `y > 140`). Le chrome fixe occupe 20 % de l'écran. | Les deux boutons jaunes empilés se concurrencent. L'accueil perd de sa respiration premium. | La barre apparaît **quand les boutons de l'accueil sortent de l'écran** (IntersectionObserver). L'accueil propose Appeler + Itinéraire (au lieu de Rendez-vous). | Confirmé · moyen · **P2** |
| A6 | **Le statut ouvert/fermé ignore les jours fériés.** | `HOURS` indexé par jour de semaine seulement (main.js l.11, 174-181). Aujourd'hui, lundi 12 octobre 2026, c'est l'Action de grâce : à 10 h, le site afficherait « Ouvert maintenant · ferme à 17 h ». | Risque d'information fausse un jour férié (déplacement inutile). | Liste des jours fériés du Québec calculée en JS + tableau `FERMETURES` modifiable. Tant que le garage n'a pas confirmé : « Heures à confirmer ». | Confirmé · moyen · **P2** |
| A7 | **Éléments en trop pour un parcours mobile.** | Manifeste (0,86 écran de slogans), bandeau d'état séparé, bande des repères, appel final (0,68 écran, doublon de la barre), ruban de chantier, « Copier le 418/581 » (déjà cliquables). | Allongent sans faire avancer le visiteur. | Le manifeste devient une ligne de l'accueil. Le statut et les repères entrent dans l'accueil. L'appel final et le ruban sont supprimés. | Confirmé · moyen · **P2** |
| A8 | **Inspection : ordre et poids.** | Sur mobile, `.inspect__stage{order:-1}` place la roue (≈ 390 px) et le bouton **avant** le titre qui les explique (`ecran-05`). | Le visiteur voit un bouton sans contexte. 1,75 écran pour une démonstration. | La ramener à une carte compacte dans l'étape 2 « On inspecte », avec le texte d'abord. | Confirmé · faible · **P3** |
| A9 | **Menu mobile sans coordonnées.** | `tel390-menu-ouvert.png` : 5 ancres + « Rendez-vous », ni téléphone, ni adresse, ni statut. | Occasion manquée, faible. | Ajouter en pied de menu : statut, Appeler, Itinéraire. | Confirmé · faible · **P3** |
| A10 | **Barre d'actions : points forts à garder.** | 3 cibles de 123 × 58 px, `env(safe-area-inset-bottom)`, Appeler en jaune, 1 geste pour appeler ou se rendre. | — | Garder. Libellés en sans-serif au lieu de la mono en capitales (b2). | Positif |

---

## 4. Diagnostic (b) : design premium / VIP sur mobile

Regard de direction de création, capture par capture.

**Ce qui est déjà premium :**
- la roue dessinée qui porte l'adresse sur son flanc, une signature propre au garage ;
- la palette graphite et or ;
- Archivo serré pour les titres ;
- les boutons dorés en capsule ;
- la carte « Le passage d'hiver » ;
- la frise des 4 étapes ;
- les contrastes.

| # | Constat | Preuve | Correctif | Prio |
|---|---|---|---|---|
| B1 | **Collage de cinq langages de surface.** Feuilles claires arrondies, sections graphite, bons de travail perforés et inclinés, ruban de chantier rayé jaune et noir, carte d'offre. Le regard change d'univers à chaque écran. C'est ce qui fait « gabarit assemblé » plutôt que « maison de luxe ». | `ecran-04` (feuille), `ecran-08` (ruban), `ecran-12` (bons inclinés), `ecran-09` (carte) | Deux surfaces au plus (graphite + une carte claire), un seul rayon (20 px), l'or réservé à l'action principale et à un filet. Supprimer le ruban et l'inclinaison des cartes. | P2 |
| B2 | **IBM Plex Mono partout** : surtitres en capitales espacées, étiquettes de formulaire, choix « LE MATIN », tableau des heures, statut du jour, mentions, libellés de la barre. Effet « interface de développeur », et lisibilité réduite (11,2 px pour les surtitres). | 42 textes sous 12 px (`.label` 11,2 px, `.svc__tags span` 11,84 px, `.dock a` 11,84 px). Les espaces de la mono rendent « 8 h à 17 h » décousu (`ecran-15`). | Mono réservée aux chiffres, ou supprimée (−2 polices, −30 Ko). Surtitres en Instrument Sans 13 px, petites capitales légères. | P2 |
| B3 | **Numérotation « 01 · Services » à « 08 · Nous trouver ».** Code d'agence vu partout, sans valeur pour un client de garage. | `.label` des 8 sections | Supprimer les numéros. Surtitre court ou rien. | P3 |
| B4 | **Zones mortes.** Bas de la feuille Services (≈ 250 px vides, `ecran-04`), après la liste d'inspection (`ecran-06`), sous les bons de travail (≈ 200 px, `ecran-12`), 160 px de marges par section. | 2,3 écrans de marges mesurés | Sections mobiles à 56–64 px. Retirer les hauteurs minimales vides. | P2 |
| B5 | **Effets « démo » qui affaiblissent le haut de gamme** : reflet animé en boucle sur les boutons (`.btn--shine`, 6 s infini), poussière, « Défilez », compte à rebours qui défile de 120 à 50 (une capture prise en cours affiche 56). | `getAnimations()` : `shine` ×2, `drift`, `cue` infinis | Le luxe, c'est l'immobilité maîtrisée : boutons fixes, chiffre affiché directement. | P2 |
| B6 | **Accueil.** La pastille « Garage à Beauport » chevauche le flanc de la roue (`ecran-00`). Le H1 n'est que le nom. Le sous-titre répète l'adresse. | `ecran-00` (390), `tel360-ecran-00` | H1 « Mécanique SKL » + ligne « Garage et pneus à Beauport » ; statut en direct « Ouvert · ferme à 17 h » en pastille ; roue fixe derrière l'accueil seulement. | P3 |
| B7 | **Inspection en gris** : les points non cochés (#7b838b) semblent désactivés. | `ecran-06` | Points lisibles dès le départ ; l'animation ne fait que cocher. | P3 |
| B8 | **Heures sur 7 lignes en mono** (près d'un écran). | `ecran-15` | 3 lignes : « Lun–jeu 8 h–17 h · Ven 8 h–12 h · Sam–dim fermé », jour courant surligné. | P3 |
| B9 | **Formulaire.** Champs soulignés seulement, étiquettes mono en capitales, choix en grosses capsules mono. | `ecran-13`, `ecran-14` | Champs en cartes à fond léger, étiquettes en phrase, 3 champs. | P3 |
| B10 | **Ordinateur** : bel accueil (`ordi1440-ecran-00`). L'en-tête se cache en descendant : le téléphone disparaît de la vue sur ordinateur. | `ordi1440-ecran-02`, `-11` | En-tête compact toujours visible au-delà de 980 px, ou numéro dans un rappel discret. | P3 |

---

## 5. Diagnostic (c) : performance mesurée

| # | Constat | Preuve | Impact | Correctif | Statut · prio |
|---|---|---|---|---|---|
| C1 | **Aucun FCP ni LCP enregistré** tant que `body` part d'`opacity:0`. | `body{opacity:0;animation:page-in .6s … forwards}` (styles.css l.30). Sans cette règle (interceptée) : FCP = LCP = 684 ms (×4). Animations réduites : 628 ms. Avec la règle : `first-paint` seulement, ni `first-contentful-paint` ni `largest-contentful-paint` après 6 s, sur toutes les configurations. | Risque que PageSpeed Insights échoue ou mesure mal (« NO_FCP »). Le contenu est caché à chaque chargement. | Supprimer le fondu de `body`. Garder au plus un court glissement des éléments de l'accueil, ou rien. | **Probable** (Chromium 141 sans interface ; à revérifier dans PSI une fois en ligne) · confiance moyenne · **P1** (abaissée d'un niveau : probable) |
| C2 | **Travail continu au repos** à cause de la poussière animée. | Au repos 5 s, ×4 : 1 768 ms tel quel → 17 ms sans poussière (`drawDust` en `requestAnimationFrame` permanent, main.js l.117-134). | Batterie et chauffe sur téléphone. Le premier geste de défilement part d'un fil principal occupé. | Supprimer `canvas.dust` et son code. | Confirmé (labo) · moyen · **P2** |
| C3 | **Effets liés au défilement qui forcent la mise en page.** | Défilement complet ×4 : 194–205 mises en page et ≈ 880 recalculs de style ; 22 et 106 en animations réduites. ≈ 5 % d'images > 25 ms sur téléphone. Sur ordinateur ×4 : 9 images > 50 ms, pire 133 ms. `onScrollEffects` écrit `--draw`, `--ss`, `--sp`, `--cr` **puis** lit `getBoundingClientRect()` de l'élément suivant dans la même image (main.js l.299-324). `moveTape` relit après ces écritures (l.283-290). Le décor fixe est lissé en JS (l.45-51), et les titres se révèlent par `clip-path` (styles.css l.412-414, propriété non composée). | Aucune saccade visible sur téléphone (> 50 ms : 0), mais une marge faible sur un appareil d'entrée de gamme. Défauts plus nets sur ordinateur. | Sur téléphone : **aucun écouteur de défilement**. Roue fixe dans l'accueil seulement ; si on garde la rotation, `animation-timeline: scroll()` sous `@supports` (compositeur), sinon immobile. Révélations : supprimées sur mobile, ou opacité seule. Partout : toutes les lectures, puis toutes les écritures. | Confirmé (compteurs) / cause probable · moyen · **P2** |
| C4 | **Les polices pèsent 80 % du transfert.** | Archivo variable de 90 Ko (axes graisse et largeur) préchargée ; Instrument 400 et 600 (17 Ko chacune) ; Plex Mono 400 et 500 (15 Ko chacune). | Chemin critique alourdi sur réseau mobile (4G lente : chargement 1,67 s en local simulé). | Sous-ensemble latin d'Archivo, axe de graisse seul ou statique 750. Supprimer Plex Mono. Gain estimé : 50 à 70 Ko, 2 requêtes (estimation à vérifier après sous-ensemble). | Confirmé (poids) · faible · **P3** |
| C5 | **Décor fixe pleine hauteur avec trois bruits `feTurbulence`** en images `data:` (grain, béton, ligne jaune) sous tout le contenu de l'accueil. | styles.css l.48, 125, 132 | Coût de rendu sur vrai GPU **non mesuré**. | Remplacer par une petite texture WebP pré-calculée, ou rien sur mobile. | À vérifier · P3 |
| C6 | **Points forts** : 0 tiers, 0 CLS, 10 requêtes, aucune image matricielle lourde, `defer` sur le script, polices hébergées sur le site. | `perf.mjs` | — | Garder. | Positif |

---

## 6. Diagnostic (d) : accessibilité

| # | Constat | Preuve | Correctif | Prio |
|---|---|---|---|---|
| D1 | Contrastes conformes | 204 textes mesurés, minimum 4,97:1 (`.svc__num`, `dt`) | — | Positif |
| D2 | Clavier : focus visible sur les 30 premières tabulations ; l'inspection se fait à la barre d'espacement (terminée, bouton d'action affiché) ; lien d'évitement présent | `captures.mjs` (bloc clavier) | — | Positif |
| D3 | Le bouton d'inspection exige un appui maintenu de 2,6 s et bloque le défilement (A1) | idem A1 | Appui simple qui lance | P1 (via A1) |
| D4 | Cibles sous 44 px : liens du pied de page de 19 px de haut (espacement de 32 px, critère 2.5.8 a priori respecté), logo de 36 px, `581 982-1195` de 34 px, « Copier » de 24 px sur ordinateur | `petites` dans `mesures-captures.json` | Lignes de pied de page à 44 px | P3 |
| D5 | 42 textes sous 12 px (surtitres 11,2 px, pastilles 11,84 px, barre 11,84 px). Le bandeau maquette (10,56 px) est voulu. | `tresPetits` | 13 px minimum | P3 |
| D6 | Barre d'actions en fin d'ordre de tabulation (index 49 sur 52) | `ordreDockDansDom` | La placer après l'en-tête dans le DOM | P3 |
| D7 | Carrousel des avis : barre de défilement masquée, conteneur non focalisable (défilement au clavier non garanti sur Safari) | `.slips{scrollbar-width:none}` | Liste verticale sur mobile (3 avis courts) | P3 · à vérifier |
| D8 | Menu ouvert : pas de piège de focus (Échap fonctionne) | main.js l.152-160 | `inert` sur `main` quand le menu est ouvert | P3 |

---

## 7. Conformité Loi 25 et légalité (vérifiée)

### 7.1 Ce qui a été vérifié et qui est conforme (maquette, 12 octobre 2026)

| Contrôle | Résultat | Preuve |
|---|---|---|
| Requêtes au chargement | 10, **toutes vers `localhost:8765`** (téléphone et ordinateur, 12 configurations) | `perf.mjs` (`hotes`) |
| Requêtes après défilement complet, envoi du formulaire, « Copier », ouverture de FAQ | **0 requête externe** (seul le favicon local) | `loi25.mjs` |
| Témoins (cookies), localStorage, sessionStorage, `document.cookie` | **aucun** | `perf.mjs`, `loi25.mjs` |
| Formulaire | N'envoie rien (`preventDefault`, aucun `fetch`), message de démonstration explicite | main.js l.334-349 ; message mesuré |
| Liens Google Maps | Ne contactent Google **qu'après le geste** du visiteur, nouvel onglet, `rel=noopener`. Seule l'origine est transmise (politique de référent par défaut). | `loi25.mjs` (`dock`, `refPolicy`) |
| Polices | Hébergées sur le site, aucun appel à Google Fonts | `perf.mjs` |
| Avis fictifs | Étiquetés « Exemple fictif » et « Client fictif » : rien de trompeur (Loi sur la concurrence) | `index.html` l.293-311 |
| Faits légaux affichés | Évaluation écrite au-delà de 100 $, renonciation écrite et signée de la main du consommateur, garantie de 3 mois ou 5 000 km, pneus d'hiver du 1er décembre au 15 mars, amende de 200 à 300 $ : cohérents avec la LPC et le Code de la sécurité routière | `index.html` l.233, 262-278 |
| Compte à rebours | Vraie date légale, valeur juste (50 jours le 12 octobre), aucune fausse urgence | `parcours.mjs` |
| Langue | Site en français (Charte de la langue française) | — |

### 7.2 Écarts : tous **P0** selon ta règle, à régler avant de brancher le formulaire ou de publier

| # | Écart | Preuve | Correctif | Statut |
|---|---|---|---|---|
| L1 | **La politique ne correspond pas à la collecte.** Elle dit « Mécanique SKL conserve votre **courriel** » alors que le formulaire ne demande pas de courriel (nom, téléphone, véhicule, description, moment). Aucune **durée de conservation** n'est indiquée (« le temps nécessaire »). | `confidentialite.html`, section « Conservation et communication » ; `index.html` l.326-356 | Lister exactement les champs, les fins, qui y a accès, une durée chiffrée fixée par le garage, puis la destruction. | Confirmé · **P0** |
| L2 | **Transfert hors Québec** (messagerie Outlook / Microsoft) annoncé sans **évaluation des facteurs relatifs à la vie privée (EFVP)**, exigée avant de communiquer des renseignements hors Québec. | `confidentialite.html` | Réaliser une EFVP courte avant le branchement, l'archiver, la mentionner dans la politique ; ou choisir un traitement qui la rend inutile. | À vérifier (avec juriste) · **P0** |
| L3 | **Responsable des renseignements personnels** : titre générique (« la personne ayant la plus haute autorité ») et deux numéros « à confirmer ». La loi exige de publier sur le site le **titre et les coordonnées** du responsable. | `confidentialite.html` | Titre réel (ex. « Propriétaire ») + un courriel et un numéro confirmés par le garage. | Confirmé (à compléter) · **P0** |
| L4 | **Rappel annuel de l'offre « Le passage d'hiver »** (« seulement si vous le voulez ») : aucun mécanisme de consentement prévu. Un rappel par courriel ou texto est un message électronique commercial (**LCAP**) : il faut un consentement **exprès**, une case **non cochée** et distincte, l'identification de l'expéditeur, un désabonnement simple et la preuve du consentement conservée. C'est aussi une utilisation à déclarer dans la politique (Loi 25). | `index.html` l.244 ; politique muette sur les rappels | Case distincte non cochée dans le formulaire réel, texte de consentement, registre, lien de désabonnement dans chaque rappel, ajout à la politique. Ou retirer la mention du rappel. | Confirmé (absence de mécanisme) · **P0** |
| L5 | **Avis de collecte au moment de la collecte.** En production, le formulaire devra informer, au point de collecte, des fins, de l'utilisation et des droits, avec un lien vers la politique. La maquette n'a qu'une mention de démonstration (normal). | `index.html` l.351 | Ligne sous le bouton : « Vos renseignements servent seulement à vous rappeler et à préparer votre visite. Voir notre politique. » | Confirmé (à faire au branchement) · **P0** |
| L6 | **Portée de la garantie légale.** « Garantie 3 mois ou 5 000 km : sur chaque réparation, comme le prévoit la loi » est affiché à côté de la mécanique **récréative**. Les règles de la LPC sur la réparation visent les automobiles et les motocyclettes ; la couverture d'un VTT ou d'une motoneige est **à vérifier**. Une affirmation trop large sur un droit peut être une représentation trompeuse. | `index.html` l.126, 272, 397 | « Sur les réparations d'automobiles, comme le prévoit la LPC », ou la garantie propre au garage si elle est plus large (par écrit). | À vérifier (OPC ou juriste) · **P0** |
| L7 | **Frais d'évaluation non mentionnés.** La LPC permet de facturer l'évaluation si le consommateur en est informé avant. « On regarde avant », « Faire inspecter mon véhicule » ou le passage d'hiver pourraient laisser croire à une inspection gratuite. | `index.html` l.170, 180, 242 | Le garage confirme : « évaluation gratuite » ou « frais d'évaluation de X $, annoncés avant ». | À vérifier (avec le garage) · **P0** |

### 7.3 Règles pour toutes les recommandations de ce rapport (aucune requête vers un tiers avant un geste explicite et informé)

- **Carte** : image **auto-hébergée**. La carte Google interactive ne se charge qu'après un clic sur « Afficher la carte Google ». Texte au-dessus : « Google recevra votre adresse IP et pourra déposer des témoins. » Ajout à la politique. Code d'intégration officiel « Partager → Intégrer une carte » de Google Maps, ou une image tirée d'OpenStreetMap avec la mention « © contributeurs OpenStreetMap » (licence ODbL). **Jamais** de capture d'écran de Google Maps (conditions de Google).
- **Géolocalisation** : **ne pas utiliser `navigator.geolocation`**. La Loi 25 exige que les fonctions de localisation soient désactivées par défaut, et ce n'est pas nécessaire : le lien d'itinéraire laisse l'application de cartes du visiteur calculer le trajet sur son appareil. Le site ne collecte rien.
- **Statistiques** : aucune pour l'instant. Si le garage en veut : comptage de premier niveau des clics « Appeler », « Itinéraire » et « Envoyer », sans témoin, sans identifiant, sans conservation d'adresse IP, décrit dans la politique. Tout outil à témoins ou à identifiant (Google Analytics, Meta Pixel) : **désactivé par défaut**, consentement préalable opt-in, sinon on s'en passe.
- **Avis Google** : pas de widget tiers au chargement. Seulement de vrais avis, recopiés **avec l'accord écrit** de leur auteur, plus un lien « Voir nos avis sur Google » (geste). Jamais d'avis rédigés, achetés ou filtrés de façon trompeuse.
- **Prix** : si un prix est publié, il doit être le **prix total** (seules la TPS et la TVQ peuvent s'ajouter). Pas de prix barré fictif, pas de fausse rareté.
- **La maquette elle-même** : garder le lien privé, comme prévu dans `approche-commerciale.md`. La supprimer sur simple demande du garage.

---

## 8. Diagnostic (e) et (f) : SEO local, données structurées, carte et géolocalisation

### 8.1 SEO local et données structurées

| # | Constat | Preuve | Correctif | Prio |
|---|---|---|---|---|
| E1 | JSON-LD `AutoRepair` + `TireShop` présent avec nom, téléphone, courriel, adresse, zone, heures | `index.html` l.23-44 | Garder | Positif |
| E2 | Il manque `@id`, `url`, **`image`** (recommandée pour une entreprise locale), **`geo`**, **`hasMap`**, `sameAs` (page Facebook), `logo` | idem | Voir le gabarit ci-dessous | P2 |
| E3 | **`og:image` pointe vers un fichier inexistant** (`assets/img/og.jpg` absent du dossier). Aperçu sans image sur Facebook et Messenger, le canal principal du garage. | `ls site/assets/img` | Créer une image JPEG 1200 × 630 (vraie photo de l'atelier dès qu'elle existe) | P2 |
| E4 | H1 = « Mécanique SKL » seulement ; « Garage à Beauport » est dans une pastille | `h1` (390 : 54,6 px) | `<h1>Mécanique SKL <span>Garage et pneus à Beauport</span></h1>` | P3 |
| E5 | Balise `<title>` de 75 caractères (repère : 65 au plus) | `parcours.mjs` | « Mécanique SKL · Garage et pneus à Beauport (Québec) » (52 caractères) | P3 |
| E6 | Ni `apple-touch-icon` ni manifeste : icône SVG seulement (ajout à l'écran d'accueil, partage) | `parcours.mjs` | PNG 180 × 180 | P3 |
| E7 | Une seule page : aucune page de service (pneus d'hiver Beauport, freins…) | structure du site | Après validation : 2 ou 3 pages de service réelles, jamais de pages locales artificielles | P3 |

Gabarit JSON-LD de production. Les valeurs entre crochets viennent de la **fiche Google Business Profile vérifiée** ou du garage ; **rien n'est à inventer**, surtout pas les coordonnées.

```json
{
  "@context": "https://schema.org",
  "@type": ["AutoRepair", "TireShop"],
  "@id": "https://[domaine]/#garage",
  "name": "Mécanique SKL",
  "url": "https://[domaine]/",
  "image": "https://[domaine]/assets/img/og.jpg",
  "logo": "https://[domaine]/assets/img/[logo officiel]",
  "telephone": "+1-[numéro confirmé]",
  "address": { "@type": "PostalAddress", "streetAddress": "1100, boulevard des Chutes", "addressLocality": "Québec", "addressRegion": "QC", "postalCode": "G1E 2G1", "addressCountry": "CA" },
  "geo": { "@type": "GeoCoordinates", "latitude": [relevé sur l'épingle de la fiche Google, 5 décimales], "longitude": [idem] },
  "hasMap": "[lien de partage de la fiche Google Maps]",
  "sameAs": ["[URL de la page Facebook]"],
  "areaServed": [{ "@type": "Place", "name": "Beauport" }],
  "openingHoursSpecification": [ "[heures confirmées par le garage]" ]
}
```

### 8.2 Carte et géolocalisation : état actuel

- **Se rendre au garage : 1 geste** (barre « Itinéraire », visible dès le chargement). La destination est préremplie et Google Maps calcule l'itinéraire depuis la position du visiteur, sur son propre appareil. C'est déjà la meilleure mécanique possible, et elle est conforme.
- **Manques** :
  - aucune représentation visuelle du lieu ;
  - aucun repère d'arrivée (entrée, stationnement : à obtenir du garage) ;
  - aucun choix d'application (Plans d'Apple, Waze) ;
  - pas de « Copier » ni d'« Envoyer l'adresse » ;
  - l'adresse et les heures sont au 13ᵉ écran.
- **Recommandation** : une carte d'accès au 2ᵉ écran (changement 2 ci-dessous). Image statique auto-hébergée (≤ 40 Ko, SVG ou WebP), épingle dorée, adresse, statut, heures sur 3 lignes, puis :
  - **[Itinéraire]** (lien Google Maps, 1 geste) ;
  - liens secondaires **Plans** (`https://maps.apple.com/?daddr=…`) et **Waze** (`https://waze.com/ul?q=…&navigate=yes`) ;
  - **Envoyer l'adresse** (`navigator.share`, natif, sans tiers) ;
  - **Enregistrer le contact** (fichier .vcf généré localement) ;
  - **Afficher la carte Google** (chargement au clic, avec l'avis de la section 7.3).

---

## 9. La meilleure version possible : 14 changements classés par impact

Tout est faisable en HTML, CSS et JS **sans dépendance**. Règle de fluidité : **zéro écouteur de défilement sur téléphone**, uniquement `transform` et `opacity`, rien qui tourne au repos. Cible mesurable : se rapprocher du profil « animations réduites » d'aujourd'hui (22 mises en page sur un défilement complet, ≈ 0 ms de travail au repos), avec FCP enregistré et page de 9 écrans au plus.

1. **Accueil « accès immédiat »** (A3, A5, B6). Roue en image fixe dans l'accueil seulement (plus de calque `position:fixed` sous toute la page). H1 « Mécanique SKL » + « Garage et pneus à Beauport ». Pastille de statut en direct (« Ouvert · ferme à 17 h »). Deux boutons pleins : **Appeler** et **Itinéraire**. « Demander un rendez-vous » en lien secondaire. Les trois repères (NAPA AutoCare · Nokian · Prix par écrit) en une ligne de pastilles. *Appeler ou partir en 1 geste, sans défiler.*
2. **Carte d'accès au 2ᵉ écran** (A4, section 8.2). Carte statique auto-hébergée, adresse, heures sur 3 lignes, Itinéraire / Plans / Waze, Envoyer l'adresse, Enregistrer le contact, carte Google au clic seulement.
3. **Demande de rendez-vous en feuille `<dialog>` native** (A2). S'ouvre sur place depuis n'importe quel bouton, préremplie par le service. 3 champs (nom, téléphone, ce qui se passe) + moment facultatif. Avis de collecte Loi 25 sous le bouton. Case LCAP distincte et non cochée seulement si le rappel est offert. *Plus de saut de 12 écrans ni de champ caché sous la barre.*
4. **Retirer ce qui coûte sans servir** (C1, C2, C3, B5) : fondu de `body`, poussière, reflet animé, brume `drift`, « Défilez », ruban défilant, révélations `clip-path` sur mobile, lissage JS de la roue. *Retour au défilement 100 % natif.*
5. **Inspection à un appui** (A1, A8, D3). « Lancer l'inspection » (appui simple, 2,6 s automatiques, interruptible), `touch-action:manipulation`, texte avant la roue, carte compacte de 1 écran au plus, intégrée à l'étape 2.
6. **Page ramenée à 9 écrans au plus** (A3, A7). Ordre : Accueil → Nous trouver → Services (3 cartes compactes avec action) → Pneus d'hiver (chiffre fixe + offre, sans ruban) → « Comment ça se passe » (4 étapes + vos droits en accordéon) → Avis → FAQ (4 questions) → Pied de page complet (NAP, liens légaux). Le manifeste devient une ligne de l'accueil. L'appel final et le bandeau d'état séparé disparaissent.
7. **Barre d'actions intelligente** (A5). Masquée tant que les boutons de l'accueil sont visibles (IntersectionObserver, aucun écouteur de défilement), puis : Appeler (or) · Itinéraire · Demande. Libellés en sans-serif 13 px. `scroll-padding-bottom` à la hauteur de la barre.
8. **Système visuel unifié « VIP »** (B1, B3, B4). Deux surfaces, un rayon, l'or réservé à l'action, plus de numérotation 01–08, plus de cartes inclinées ni de ruban rayé. Sections mobiles à 56–64 px.
9. **Typographie resserrée** (B2, C4, D5). Archivo (titres) + Instrument Sans (texte) seulement. Plex Mono supprimée ou limitée aux chiffres. Aucun texte sous 13 px. Chiffres tabulaires pour les heures et le téléphone.
10. **Statut horaire fiable** (A6). Jours fériés du Québec calculés, tableau de fermetures exceptionnelles, mention « Heures à confirmer » tant que le garage n'a pas validé.
11. **SEO local complet** (E2 à E6). JSON-LD avec `geo`, `hasMap`, `url`, `image`, `sameAs` (valeurs de la fiche Google vérifiée), `og.jpg` 1200 × 630, `apple-touch-icon`, `<title>` de 52 caractères, H1 enrichi.
12. **Polices allégées** (C4). Sous-ensemble latin d'Archivo, une seule police préchargée, `font-display:swap`. Environ 2 requêtes et 50 à 70 Ko de moins (estimation à confirmer après le sous-ensemble).
13. **Accessibilité finale** (D4, D6, D7, D8). Lignes de pied de page à 44 px, barre plus tôt dans l'ordre du DOM, avis en liste verticale sur mobile, `inert` derrière le menu et la feuille.
14. **Conformité Loi 25 bouclée avant la mise en ligne** (L1 à L7). Politique alignée sur les vrais champs et une vraie durée, responsable nommé par son titre, EFVP pour Outlook, consentement LCAP du rappel, avis de collecte, garantie et frais d'évaluation formulés exactement.

Ordre conseillé :
- **d'abord 4, 5 et 3** : fluidité et parcours, environ une demi-journée ;
- **puis 1, 2, 6 et 7** : la refonte mobile, environ une journée ;
- **ensuite 8 à 13** : finition ;
- **14** : avant tout branchement du formulaire.

Chaque lot repasse par QA & Delivery 2.0 avec les mêmes scripts : glissement sur le bouton, geste « Rendez-vous », FCP, repos, défilement ×4, 0 requête tierce.

---

## 10. Arguments de vente tirés de l'audit (faits seulement)

Sources : `REPRISE.md`, `strategie-vente.md` et `approche-commerciale.md` (recherches du 8 octobre 2026), plus les deux recherches web du 12 octobre. Formulation prudente : aucun résultat garanti.

1. **Deux numéros différents circulent en ligne** pour le garage : 418 663-1195, et 581 982-1195 chez NAPA (FAIT, 8 octobre). Un client qui tombe sur le mauvais peut ne pas joindre le garage. C'est l'argument d'ouverture, vérifiable devant lui.
2. **Aucun site trouvé** pour le garage (FAIT, 8 octobre). Le 12 octobre, deux recherches web (« Mécanique SKL » + Beauport ou boulevard des Chutes, avec l'adresse et « avis ») n'ont donné **aucun résultat pertinent**. C'est un indice de faible visibilité, pas une preuve : moteur de recherche américain, statut « À vérifier ».
3. **Peu de preuves sociales** : une page Facebook d'environ 350 mentions J'aime et 4 avis (FAIT, 8 octobre). Aucune fiche d'avis citable trouvée.
4. **Des heures tirées d'une seule source** (Otobox), non confirmées (FAIT). Un client peut se déplacer pour rien.
5. **Concurrence dense** à Beauport (Garage Beauport, Centre de l'auto R.G., Mécanique Jo Garage, réseaux CAA) (FAIT, 8 octobre).
6. **Ce que la maquette prouve déjà, mesuré** :
   - appeler ou lancer l'itinéraire en **1 geste** depuis le téléphone ;
   - **0 témoin, 0 service tiers** au chargement : une confidentialité conforme à la Loi 25 dès le départ ;
   - contrastes lisibles ;
   - droits du consommateur expliqués en clair.

   C'est un site qui inspire confiance, à l'image du positionnement « on regarde, on explique, puis vous décidez ».
7. **À dire honnêtement** : le site ne remplace pas une **fiche Google Business Profile** complète ni de **vrais avis** de clients. C'est le premier canal de découverte d'un garage local. L'offre « Recommandé » le prévoit.

---

## 11. Suite proposée

1. Pavel valide l'ordre des lots (section 9). Moi 2.0 réalise les changements dans une branche ou une copie, sans toucher à la version présentée.
2. QA & Delivery 2.0 rejoue les scripts de ce dossier : critères d'acceptation chiffrés en sections 2 et 9.
3. Points à obtenir du garage avant la version publique : le bon numéro, les heures, le titre du responsable des renseignements personnels, les frais d'évaluation, la durée de conservation, l'accès et le stationnement pour la carte, les photos de l'atelier, l'épingle de la fiche Google (pour `geo` et `hasMap`).
