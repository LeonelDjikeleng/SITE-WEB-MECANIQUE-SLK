# 07 · Contrôle qualité et livraison : maquette Mécanique SKL, version VIP mobile

> Contrôleur indépendant (QA & Delivery 2.0, avec webapp-testing). Je n'ai pas construit cette version et je n'ai modifié aucun fichier du site.
> Date : 12-13 octobre 2026 · Version testée : commit `7f2a24f` « Version VIP mobile… » (commité à 23 h 49 UTC par le constructeur au début du contrôle ; arbre de travail identique à ce commit pendant tous les tests) · Serveur : `http://localhost:8765/`
> Usage prévu : **montrer la maquette au garage sur un téléphone**.

> **DÉCISION FINALE (13 octobre, après contre-vérification du commit `07527a3`) : PRÊT SOUS RÉSERVE.** Voir la section 7. Les sections 1 à 6 décrivent le premier passage (décision BLOQUÉ, aujourd'hui levée).

## Décision du premier passage (12 octobre) : BLOQUÉ (correctifs courts)

**Aucun P0 ni P1.** Trois des cinq critères (règles absolues de Pavel) ne sont pas entièrement tenus, ce qui bloque d'office selon la grille QA :

| Anomalie | Gravité | Règle de Pavel touchée |
|---|---|---|
| R-023 · La mention sur la géolocalisation est placée **après** le bouton « À quelle distance suis-je ? » et la barre du bas la recouvre quand le bouton arrive à l'écran | P2 | 1. Loi 25 (« mention visible AVANT ce bouton ») |
| R-044 · Le point « Vous » est **caché à 100 %** sous le bouton « Voir sur Google Maps » pour toute position au sud du garage (Vieux-Québec, Lévis, Sainte-Foy) | P2 | 4. Fonctions (plan avec point « Vous ») |
| R-037 · Le focus clavier peut tomber sur l'en-tête **masqué**, donc hors de l'écran | P2 | 3. Clavier et focus visibles |
| R-038 · L'icône téléphone de l'en-tête n'a **aucun nom accessible** sur mobile | P2 | 3. Accessibilité |

Ces quatre corrections prennent environ 30 minutes au total. Une fois corrigées, il faut rejouer `t1`, `t5`, `t6` et `t9` (section 6). Si rien d'autre n'apparaît, la décision attendue est **PRÊT SOUS RÉSERVE** (il resterait les P3 et P4 ci-dessous). « PRÊT » ne vaut jamais autorisation de publier.

**Couverture** : 55 contrôles, dont 50 exécutés (38 PASSÉS, 12 ÉCHOUÉS). 2 n'ont pas été exécutés : les liens externes (on ne contacte pas Google, Waze ni Apple) et le jugement humain de conformité. 3 sont BLOQUÉS dans `qa.py` parce que Playwright Python est absent ; je les ai refaits en Playwright Node (voir R-030, R-047 et R-049).

---

## 1. Méthode

- **Compétences chargées avec l'outil Skill** : `anthropic-skills:qa-delivery-2-0` (grille, campagne, décision) et `anthropic-skills:webapp-testing` (démarche reconnaissance puis action avec Playwright).
- **Moteur QA** : `qa.py campagne init` avec 5 critères, puis `qa.py site` (exploration HTTP), `qa.py livrable`, `decision` et `rapport`. Les résultats du navigateur ont été versés dans la même campagne par la fonction `ajouter` de `qa.py`, preuves à l'appui. Campagne : `scratchpad/admin-qa/QA.json`, rapport brut : `scratchpad/admin-qa/rapport-qa.md`.
- **Navigateur** : Playwright Node 1.56.1, Chromium 1194 sans affichage. Contexte mobile `isMobile`, `hasTouch`, DPR 2, `fr-CA`, fuseau `America/Toronto` sauf pour le test du statut (fuseau volontairement faux, `Asia/Tokyo`).
- **Gestes réels** : `Input.synthesizeScrollGesture` en mode tactile ne fait pas défiler cette version de Chromium (0 px mesuré). Les défilements au doigt passent donc par `Input.dispatchTouchEvent` (touchStart, 15 à 28 touchMove, touchEnd), le vrai chemin tactile du compositeur.
- **Espions Loi 25** injectés avant le chargement (`addInitScript`) sur `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`, `EventSource`, `Image.src`, `geolocation.*`, `permissions.query`, `Storage.setItem`, `document.cookie`, `indexedDB.open`, `caches.open` et `serviceWorker.register`. S'y ajoutent l'écoute de toutes les requêtes du contexte et `Network.getAllCookies` (CDP).
- **Contrastes** mesurés sur les **pixels réels** : capture de la zone, puis capture avec le texte rendu transparent pour obtenir le vrai fond (dégradés, roue, voiles). Le ratio WCAG est calculé avec la couleur calculée du texte. Les mesures sont doublées de 17 calculs sur les couleurs déclarées.
- Scripts : `/tmp/claude-0/-home-user-SITE-WEB-MECANIQUE-SLK/21921b5d-c548-5640-9040-acb90318934b/scratchpad/admin-qa/` (`t1-loi25.mjs` … `t10-console.mjs`, sorties `t*.json`, captures `*.png`).

## 2. Résultats par règle

### Règle 1 · Loi 25 : CA-1 ÉCHOUÉ (5 sous-points PASSÉS sur 6)

| Test | Résultat mesuré | Statut |
|---|---|---|
| Requêtes au chargement (390 px) | 10 requêtes, toutes vers `localhost:8765` (document, CSS, JS, 5 polices, 2 SVG) | PASSÉ |
| Défilement complet (descente jusqu'à 10 961 px, puis remontée) | 0 requête de plus, **0 domaine tiers** ; 0 aussi sur les pages légales | PASSÉ |
| Témoins et stockage | `Network.getAllCookies` 0, `document.cookie` vide, localStorage 0, sessionStorage 0, IndexedDB [], Cache [], service worker 0, espions de stockage : 0 appel (avant et après géolocalisation et formulaire) | PASSÉ |
| Géolocalisation au toucher seulement | `getCurrentPosition`, `watchPosition`, `permissions.query` : **0 appel avant le toucher**, 1 au toucher (`enableHighAccuracy:false`) | PASSÉ |
| Position ni envoyée ni stockée | après le calcul (Vieux-Québec → « Vous · 6,8 km ») : 0 fetch, XHR, beacon, WebSocket ou image ; 0 requête réseau après 3 s ; stockage 0 ; URL inchangée | PASSÉ |
| Refus et délai | code 1 → « Localisation refusée… », code 3 → « Position introuvable… », 0 requête | PASSÉ |
| Liens Google Maps, Waze, Plans | 6 liens `target=_blank rel=noopener`, sans `ping` ; aucun `preconnect`, `dns-prefetch`, `prefetch` ni `speculationrules` ; 0 iframe ; 0 requête après le focus des 6 liens | PASSÉ |
| Mention claire **avant** le bouton | `#near-note` vient **après** `[data-near]` (bouton 413-467 px, note 477-555 px). Quand le bouton entre à l'écran : note 764-842 px, barre `.dock` à 768 px, élément au centre de la note = lien de la barre. **La mention est masquée.** | **ÉCHOUÉ (R-023)** |
| Politique cohérente avec le code | `#carte` (rien n'est chargé avant un toucher, ce qui correspond à `MAP_EMBED` vide et 0 iframe), `#distance` (calcul sur l'appareil, ce qui correspond à 0 requête), copier et partager, formulaire « n'envoie et ne conserve rien » (0 requête à l'envoi) | PASSÉ |

### Règle 2 · Fluidité : CA-2 PASSÉ

| Test | Résultat mesuré | Statut |
|---|---|---|
| Défilement natif | écouteurs sur `window` : resize (passif) ×2, load, keydown, scroll (passif). Aucun écouteur wheel, touchmove ni touchstart. `scroll-behavior:auto`, `scroll-snap:none` | PASSÉ |
| Défilement complet au doigt, **CPU ×4**, 390 × 844 | 10 961 px en 23,9 s ; **58,1 images/s** ; p50 16,7 ms, p95 16,8 ms, p99 33,3 ms, max 66,6 ms ; **1 image sur 1 389 au-delà de 33 ms (0,07 %)** ; 0 long task, 0 long animation frame ; 135 layouts et 1 178 recalculs de style | PASSÉ |
| Travail au repos en haut de page (5 s) | TaskDuration 0,5 ms, 0 recalcul de style, 0 layout ; 0 animation en cours (fermé), et 0 après 9 s en heures d'ouverture (la pulsation s'arrête après 3 itérations) | PASSÉ |
| Glissement qui part de « Lancer l'inspection » | appui sur le bouton puis glissement de 300 px : scrollY 4 798 → **5 148 (+350 px)**, retour de 250 px correct. Le bouton ne se déclenche pas (libellé inchangé). `touch-action: manipulation` | PASSÉ |

### Règle 3 · Mobile VIP : CA-3 ÉCHOUÉ

| Test | Résultat mesuré | Statut |
|---|---|---|
| Débordement à 320, 360, 390, 768, 1440 et 1920 px, sur les 3 pages | 18 combinaisons : `scrollWidth = clientWidth`, `scrollTo(500,0)` donne scrollX 0, 0 élément hors cadre | PASSÉ |
| Bandeau maquette lisible en entier | tronqué par ellipse : accueil à 320 et 360 px (« … EN PARTIE… ») ; pages légales de 320 à 768 px (« Maquette · Pas le site officiel de Méca… ») | ÉCHOUÉ (R-031, P3) |
| Cibles ≥ 44 px (390 px, 41 cibles) | barre 151×52 et 94×52, applis 64 px de haut, Copier 44 px, menu 59 px : OK. **Logo `a.brand` 98×36**, menu « Rendez-vous » `.btn--sm` 129×42 ; liens dans le texte de 16 à 23 px de haut | ÉCHOUÉ (R-032, P3) |
| Jamais deux « Appeler » visibles | 378 positions (320×568, 360×640, 390×844, descente par pas de 120 px puis remontée), avec test de visibilité réelle (`elementFromPoint`) : **0 position avec deux « Appeler »**. La barre se cache sur l'accueil, le rendez-vous et l'appel final | PASSÉ |
| Après « Rendez-vous », premier champ visible | 5 tailles × 4 chemins (lien de l'accueil, menu, barre, « Décrire mon problème ») : `#f-nom` visible et au premier plan (320×568 : 514-563 px ; 390 : 498-546 px), en-tête et barre cachés, préremplissage « Mécanique générale : » | PASSÉ |
| Contrastes ≥ 4,5:1 | 57 textes mesurés sur les pixels réels et 17 calculs ; **aucun sous 4,5**. Détail en section 3 | PASSÉ |
| Clavier : indicateur de focus | 88 et 89 arrêts Tab (390 et 1440 px) : 0 élément sans contour, ordre logique, lien d'évitement vers `#main`, menu au clavier (Échap rend le focus au bouton), inspection avec Entrée | PASSÉ |
| Clavier : focus jamais caché | après un cycle Tab (ou un Tab après défilement), la marque, « Services », « Menu » et le téléphone reçoivent le focus à **top −59 px** sous `.top.is-hidden` | **ÉCHOUÉ (R-037)** |
| Noms accessibles | 390 px : `a.top__call` (tel:) **sans nom** (le `span` est en `display:none` sous 980 px et il n'y a pas d'`aria-label`) ; 1440 px : 0 | **ÉCHOUÉ (R-038)** |
| `prefers-reduced-motion` | à 150 ms : accueil à opacité 1, 0/41 apparitions masquées ; après défilement : `--rot` et `--tx` inchangés, 0 animation ; inspection immédiate (5/5) ; barre en fondu seulement | PASSÉ |

### Règle 4 · Fonctions : CA-4 ÉCHOUÉ (un seul sous-point)

| Test | Résultat mesuré | Statut |
|---|---|---|
| Statut ouvert ou fermé, heure de Québec (navigateur réglé sur Tokyo) | 10 cas. Accueil = Nous trouver dans tous les cas : lun 7 h « Fermé · ouvre aujourd'hui à 8 h » (barre « Fermé · ouvre à 8 h ») ; lun 10 h « Ouvert · ferme à 17 h » ; lun 17 h et 18 h, dim 22 h « Fermé · ouvre demain à 8 h » ; ven 13 h et sam « Fermé · ouvre lundi à 8 h » (barre « lun. 8 h ») ; ligne « aujourd'hui » juste ; compte à rebours 50 jours au 12 oct., 102 jours de saison au 3 déc. | PASSÉ |
| « Ferme bientôt » | lun 16 h 30 et ven 11 h 30 : accueil et Nous trouver « Ferme bientôt · ferme à 17 h », barre « Ouvert · jusqu'à 17 h » (même sens, mais nuance perdue) | ÉCHOUÉ (R-041, P4) |
| Inspection d'un appui | toucher → 2,6 s → « Inspection terminée », 5/5 points, bouton « Faire inspecter mon véhicule » affiché | PASSÉ |
| Plan et point « Vous » (géolocalisation simulée et permission) | « Vous · 6,8 km » (Vieux-Québec), « 300 m », « 239 km » (Montréal) ; phrase « à vol d'oiseau » | PASSÉ |
| Point « Vous » **visible** | **couvert à 100 %** par `.map-card__load` pour le Vieux-Québec, Lévis et Sainte-Foy (390 et 320 px), libellé couvert de 33 à 100 % ; Montréal de 49 à 100 % ; visible au nord (Charlesbourg, Boischatel), à Giffard et au garage | **ÉCHOUÉ (R-044)** |
| Ordre des applis | user-agent iPhone : **Plans, Google Maps, Waze** ; `[data-route]` → `maps.apple.com`. Android : Google, Waze, Plans | PASSÉ |
| Copier et Partager | presse-papiers = « 1100, boul. des Chutes, Québec (Québec) G1E 2G1 », « Copié » puis retour à 1,8 s ; repli en texte si refus ; Partager affiché seulement si `navigator.share` existe, URL sans ancre ; 0 requête | PASSÉ |
| Formulaire | envoi vide : message d'erreur, `aria-invalid` sur 3 champs, focus sur `#f-nom` ; nom fait d'espaces refusé ; envoi valide : « Merci Jean. Ceci est une maquette… », `role=status` ; 0 requête, 0 stockage ; barre cachée pendant la saisie | PASSÉ |
| Menu mobile | `aria-expanded` vrai, libellé « Fermer », défilement bloqué, barre cachée ; Échap ferme le menu ; un lien ferme le menu et place la section à 124 px | PASSÉ |
| Liens internes et légaux | 8 ancres résolues ; `confidentialite.html#carte` et `#distance` ; pied de page vers les 2 pages (200) ; « Retour au site » ; 0 erreur console sur les 3 pages ; 404 réel | PASSÉ |

### Règle 5 · Contenu : CA-5 PASSÉ

| Test | Résultat | Statut |
|---|---|---|
| Tirets cadratins | **0** tiret cadratin (U+2014) et 0 `&mdash;` dans les 5 fichiers (0 demi-cadratin aussi) | PASSÉ |
| JSON-LD | `JSON.parse` réussi ; `AutoRepair`+`TireShop`, adresse, coordonnées, horaires cohérents avec la page | PASSÉ |
| Affirmations réelles | NAPA AutoCare et Nokian viennent des localisateurs officiels (`projet/direction-artistique.md`). Avis, offre, parcours et exemples récréatifs sont étiquetés « fictif » ou « maquette ». Heures et numéros sont marqués « à confirmer ». Évaluation écrite au-delà de 100 $, renonciation manuscrite, garantie de 3 mois ou 5 000 km et pneus d'hiver du 1er décembre au 15 mars : conformes au résumé de l'OPC | PASSÉ |
| Précision de la garantie | le seuil de 50 $ du guide OPC n'est pas mentionné | ÉCHOUÉ (R-053, P3) |
| Français | correct ; apostrophes mélangées (58 droites dans le HTML, 7 courbes dans le JS) | ÉCHOUÉ (R-054, P4) |

Faux positifs de `qa.py` sur le contenu provisoire (R-005 et R-013) : `example.com` est voulu par Pavel (étape de déploiement), `555-0123` est un exemple de format dans un placeholder, et `[hidden]` et `[open]` sont des sélecteurs CSS. Ils sont enregistrés comme exceptions dans la campagne, avec la justification.

## 3. Contrastes mesurés (extrait)

Mesure sur les pixels réels : ratio entre le texte et le fond médian capturé sous le texte.

| Texte | Ratio |
|---|---|
| Plan « 1 km » `#8A929B` sur `#262A2F` (calcul) | **4,58** (le plus bas, texte d'environ 9 px rendus) |
| Placeholder du formulaire `#858D95` sur `#1F2327` | 4,70 à 4,76 |
| Inspection au repos `.checks b` `#7B838B` sur `#121416` | 4,80 |
| Libellés clairs et « à confirmer » `#59616A` sur `#E3E4E1` | 4,92 à 5,30 |
| Étiquette « Exemple fictif » `#7A5000` sur papier | 5,53 à 5,74 |
| Statut dans la barre `rgba(22,19,10,.78)` sur or `#E2A200` | 5,54 |
| Mention géolocalisation `#3C434A` | 8,00 |
| Bandeau maquette `#9AA2AA` sur `#08090A` | 7,71 |
| Statut de l'accueil (pastille sur la roue) | 12,28 (le pixel le plus clair du fond donne encore 7,76) |
| Sous-titre de l'accueil sur la roue | 12,08 (pire pixel : 9,72) |
| Bouton Appeler `#16130A` sur or | 9,98 (8,31 sur le bas du dégradé) |
| Erreur du formulaire `#FF9A8D` | 7,73 |

## 4. Anomalies et correctifs suggérés

Aucune anomalie **P0** ni **P1** (les deux P1 de `qa.py` sont des faux positifs couverts par une exception).

### P2 · Importantes (4)

**R-023 · Mention sur la géolocalisation après le bouton et masquée par la barre**
- Preuve : `index.html` l. 226-227, `[data-near]` puis `#near-note`. Mesure : bouton entré à l'écran, note de 764 à 842 px, `.dock` à partir de 768 px, `elementFromPoint` au centre de la note = lien de la barre. Capture : `admin-qa/geo-bouton-entree.png`.
- Correctif : placer `<p class="find__note" id="near-note" …>` **avant** le bouton (garder `aria-describedby="near-note"`). La phrase se lit alors avant le toucher et ne passe plus sous la barre.

**R-044 · Point « Vous » caché sous « Voir sur Google Maps »**
- Preuve : `.map-card__load` en `position:absolute; bottom:14px` dans `.map-card`. Le point est placé à `y = 150 + r` dans un viewBox 400×300 : tout utilisateur au sud tombe dans la zone du bouton. Couverture mesurée : 100 % (Vieux-Québec, Lévis, Sainte-Foy). Captures : `admin-qa/geo-point-vous.png`, `admin-qa/geo-montreal.png`.
- Correctif : sortir le lien de la figure et le mettre sous la carte, en pleine largeur comme « À quelle distance suis-je ? ». Autre solution : réserver le bas du plan, en limitant `y` à environ 215 dans `placeMe`. C'est la position la plus probable d'un client (centre-ville, Rive-Sud), donc à corriger avant la démonstration.

**R-037 · Focus caché sous l'en-tête masqué**
- Preuve : `.top.is-hidden { transform: translateY(…) }`. Le focus va sur `a.brand`, les liens du menu et `.top__call` alors que leur rectangle est à top −59 px (1440 et 390 px). Capture : `admin-qa/focus-cycle-1440.png`.
- Correctif : `.top:focus-within { transform: none }`, et dans `onPageScroll`, ne pas ajouter `is-hidden` si `top.contains(document.activeElement)`.

**R-038 · Lien téléphone de l'en-tête sans nom accessible (≤ 980 px)**
- Preuve : arbre d'accessibilité, `link` sans nom `<a class="top__call" href="tel:+14186631195">`. Le `span` est masqué par `display:none` (`styles.css` l. 109). Échec WCAG 4.1.2 (niveau A).
- Correctif : `aria-label="Appeler le 418 663-1195"` sur `.top__call`, ou utiliser la classe `.sr` au lieu de `display:none`.

### P3 · Mineures (3)

- **R-031 · Bandeau tronqué** (`.demo-banner span { text-overflow: ellipsis }`). Capture : `hero-320.png`. Correctif : sur les pages légales, reprendre le texte court de l'accueil ; à 360 px et moins, raccourcir (« Maquette non officielle · Fictif ») ou permettre deux lignes.
- **R-032 · Cibles sous 44 px** : `a.brand` 36 px de haut, `.btn--sm` 42 px, liens dans le texte. Correctif : `.brand { min-height: 44px }`, `.btn--sm { min-height: 44px }`. Pour les liens dans le texte, l'exception WCAG 2.5.8 s'applique : à Pavel de trancher, faute de quoi il faut ajouter une zone de toucher (`padding-block`).
- **R-053 · Seuil de la garantie légale** : le guide de l'OPC indique que la garantie de 3 mois ou 5 000 km vise les réparations de plus de 50 $. Correctif : vérifier l'article 176 de la LPC, puis écrire « sur les réparations d'automobiles de plus de 50 $ ». La correction peut attendre la mise en ligne, sauf si le garage lit ce passage de près.

### P4 · Améliorations (4)

- **R-041** : la barre affiche « Ouvert · jusqu'à 17 h » au lieu de « Ferme bientôt · 17 h ». Au passage, éviter « Ferme bientôt · ferme à 17 h » (répétition).
- **R-054** : uniformiser les apostrophes (toutes courbes ou toutes droites).
- **R-055** : supprimer la règle morte `.status.is-open .status__dot::after { animation: breathe 4s … infinite }` (`styles.css` l. 209). Elle est sans effet aujourd'hui, mais c'est une animation infinie qui attend d'être réactivée.
- **Observation à arbitrer** : l'icône téléphone de l'en-tête coexiste avec « Appeler le 418 663-1195 » de l'accueil, et avec la barre quand l'en-tête réapparaît (13 à 19 positions sur 120 avec plus d'un lien `tel:` visible). La règle « jamais deux boutons Appeler » est respectée à la lettre, puisque l'icône n'a pas de libellé « Appeler ». Si Pavel l'entend au sens large, appliquer à `.top__call` la même logique de zones que la barre.

## 5. Non exécuté ou limites

- Les liens externes Google Maps, Waze et Apple n'ont pas été ouverts (règle : ne pas solliciter de tiers). Seul leur format a été contrôlé : `dir/?api=1&destination=…`, `waze.com/ul?ll=…&navigate=yes`, `maps.apple.com/?daddr=…`.
- Aucun vrai téléphone : tout est mesuré dans Chromium émulé. iOS Safari (barre d'adresse dynamique, `100svh`, invite de géolocalisation) **reste à voir sur l'iPhone de démonstration**, en 2 minutes, avant le rendez-vous.
- La géolocalisation sans réponse à l'invite est un cas d'automate. Le bouton affiche « Recherche de votre position… » jusqu'à la réponse, ce qui est normal.
- Pas de Lighthouse ni de Core Web Vitals terrain (outils absents) ; la fluidité est mesurée directement (section 2).

## 6. Pour rejouer après correction

```bash
cd /tmp/claude-0/-home-user-SITE-WEB-MECANIQUE-SLK/21921b5d-c548-5640-9040-acb90318934b/scratchpad/admin-qa
node t1-loi25.mjs   # R-023 : mention avant le bouton, visible au-dessus de la barre
node t9-vous.mjs    # R-044 : pointCouvertParBouton 0 % partout
node t6-debug.mjs   # R-037 : « fin » sans top négatif
node t5-a11y.mjs    # R-038 : sans_nom_390 vide ; contrastes et mouvement réduit
node t3-mobile.mjs  # non-régression : débordement, deux « Appeler », champ visible
```

Le constructeur corrige (Moi 2.0, version VIP mobile). QA rejoue, puis Pavel décide. Le contrôleur n'a rien publié ni commité.

---

## 7. Contre-vérification du 13 octobre

**Version contre-vérifiée** : commit `07527a3` « Correctifs QA… », fait par le constructeur à 00 h 11 UTC. Les fichiers du site n'ont pas bougé depuis 00 h 11 ; tous les tests ont été rejoués après cette heure. Le contrôleur n'a modifié aucun fichier du site et n'a fait aucun commit. Nouvelle campagne : `scratchpad/admin-qa/QA2.json`, rapport brut : `rapport-qa-2.md`.

**Tests rejoués** : `t1` (Loi 25), `t2` (fluidité, 3 passages, plus un témoin), `t3` (débordements, cibles, « Appeler », rendez-vous), `t4` (fonctions), `t5` et `t7` (contrastes, clavier, noms, mouvement réduit), `t6` (focus), `t9` (point « Vous »), `t10` (console et tiers), `t11` (captures), ainsi que `qa.py site` et `qa.py livrable`.

### Correctifs vérifiés

| Anomalie | Correctif | Mesure après correction | Statut |
|---|---|---|---|
| R-023 (P2) mention de géolocalisation | `#near-note` placé avant le bouton | note avant le bouton dans le DOM (note 323-401 px, bouton 413-467 px) ; bouton juste au-dessus de la barre : note à 610-688 px, **entièrement visible**, barre à 768 px, élément au centre de la note = texte de la note. Capture `v2-geo-bouton-entree.png` | **CORRIGÉ** |
| R-044 (P2) point « Vous » caché | lien « Voir sur Google Maps » sorti du plan | 9 lieux × 2 largeurs (320 et 390 px), dont Vieux-Québec, Lévis, Sainte-Foy et Montréal : point et libellé **couverts à 0 %**, libellé jamais hors de la carte. Capture `v2-plan-levis.png` | **CORRIGÉ** |
| R-037 (P2) focus caché | `.top:focus-within{transform:none}` | après un cycle Tab complet : marque à top 50 px, « Services » à 51 px (au lieu de −59) ; 0 focus hors écran à 390 et 1440 px | **CORRIGÉ** |
| R-038 (P2) nom accessible | `aria-label` sur `.top__call` | arbre d'accessibilité : 0 lien ou bouton sans nom à 390 et 1440 px | **CORRIGÉ** |
| R-031 (P3) bandeau tronqué | texte « Maquette non officielle » sous 380 px, pages légales alignées | 0 texte tronqué sur 18 combinaisons (3 pages × 6 largeurs) | **CORRIGÉ** |
| R-032 (P3) cibles | `.brand` et `.btn--sm` à 44 px minimum | logo 98×44, menu « Rendez-vous » 129×44 | **CORRIGÉ** (réserve ci-dessous) |
| R-053 (P3) garantie | « réparations d'automobiles de plus de 50 $ » | présent dans le repère et dans « Vos droits » ; la FAQ récréatif reste cohérente | **CORRIGÉ** |
| R-041 (P4) « Ferme bientôt » | textes alignés | lun 16 h 30 : « Ferme bientôt · à 17 h » à l'accueil et dans Nous trouver, « Ferme bientôt · 17 h » dans la barre ; ven 11 h 30 : même chose pour 12 h | **CORRIGÉ** |
| R-054 (P4) apostrophes | apostrophes typographiques dans l'accueil et dans le JS | accueil et JS : 0 apostrophe droite. **Restent** 18 apostrophes droites dans `confidentialite.html`, 7 dans `accessibilite.html`, et `data-prefill="Passage d'hiver"`, qui préremplit le champ avec une droite | **PARTIEL (P4 ouvert)** |
| R-055 (P4) CSS mort | règle `breathe … infinite` supprimée | 0 règle `infinite` dans les feuilles de style | **CORRIGÉ** |

### Non-régression

| Domaine | Résultat du 13 octobre | Statut |
|---|---|---|
| Loi 25, réseau | 10 requêtes, toutes vers `localhost:8765` ; **0 tiers** au chargement, au défilement complet (11 051 px) et sur les pages légales | PASSÉ |
| Loi 25, stockage et géolocalisation | 0 témoin et 0 stockage ; 0 appel de géolocalisation avant le toucher ; après le calcul, 0 fetch, XHR, beacon ou requête ; « Vous · 6,8 km » | PASSÉ |
| Fluidité, CPU ×4, 390 px | 3 passages : **56,4 à 57,6 images/s**, p50 16,7 ms, 0,69 à 1,1 % d'images au-delà de 33 ms (une image sautée), max de 50 à 83 ms, **0 long task**. Témoin : l'ancienne version `7f2a24f`, servie à part (copie dans le scratchpad, port 8766) dans les mêmes conditions, donne 56,6 à 58,1 images/s et 0,34 à 0,98 %. L'écart avec le 12 octobre (0,07 %) vient de la charge de la machine, pas des correctifs | PASSÉ |
| Repos et glissement | 0,5 ms de travail en 5 s, 0 animation ; glissement depuis « Lancer l'inspection » : +356 px, bouton non déclenché | PASSÉ |
| Débordements 320 à 1920 px | 18 combinaisons, 0 débordement, scrollX 0 | PASSÉ |
| Deux « Appeler » | 379 positions, 0 violation | PASSÉ |
| Rendez-vous | `#f-nom` visible et non masqué dans les 5 tailles et par les 4 chemins | PASSÉ |
| Contrastes | couleurs inchangées, mêmes mesures : minimum 4,58 | PASSÉ |
| Mouvement réduit | tout est affiché à 150 ms, roue et ruban figés, inspection immédiate | PASSÉ |
| Fonctions | statut (10 cas), inspection, Plans en premier sur iPhone, copier et partager, formulaire (0 requête), menu, 8 ancres, pages légales, 0 erreur console | PASSÉ |
| Contenu | 0 tiret cadratin, JSON-LD valide | PASSÉ |

### Réserves (ne bloquent pas la démonstration)

- **P3, à trancher par Pavel** : 7 liens dans le texte font de 16 à 23 px de haut (« Confidentialité », numéros, courriel, « Politique de confidentialité »). WCAG 2.5.8 les exempte (liens dans une phrase), mais la règle de Pavel dit 44 px pour tout. Pour la tenir à la lettre, ajouter une zone de toucher (`padding-block`) sur ces liens.
- **P4** : apostrophes droites restantes sur les deux pages légales et dans `data-prefill="Passage d'hiver"`.
- **P4, observation** : sous 380 px, le bandeau dit seulement « Maquette non officielle ». « Fictif » reste dans le pied de page et sur chaque étiquette ; le choix est acceptable.
- **P4, observation** : l'icône téléphone de l'en-tête coexiste avec « Appeler » (12 à 18 positions sur environ 125 avec plus d'un lien `tel:`). La règle sur deux « Appeler » est respectée à la lettre.
- **P4, observation** : à 1440 px, quand le focus revient dans l'en-tête, celui-ci glisse en 0,35 s ; pendant ce court instant, le focus est en mouvement mais il n'est jamais hors de l'écran une fois la transition finie.
- Faux positifs de `qa.py` (example.com voulu, placeholder 555-0123, sélecteurs CSS) : exceptions enregistrées. Liens externes non ouverts (règle : ne pas contacter de tiers).
- À faire par Pavel avant le rendez-vous, en 2 minutes : ouvrir la maquette sur **l'iPhone de démonstration** (Safari) et toucher une fois « À quelle distance suis-je ? ». L'émulation Chromium ne couvre ni l'invite iOS ni la barre d'adresse dynamique.

### Décision finale : PRÊT SOUS RÉSERVE

Pour l'usage prévu (montrer la maquette au garage sur un téléphone) : les 5 critères sont PASSÉS, il ne reste aucune anomalie P0, P1 ou P2, et seulement des réserves P3 et P4 (couverture : 37 sur 42 contrôles exécutés ; 34 PASSÉS, 3 ÉCHOUÉS, à savoir les 2 faux positifs couverts par exception et 1 P4). **« Prêt » n'autorise pas une publication** : `example.com`, le `noindex` et `Disallow` restent en place, comme prévu pour une maquette.
