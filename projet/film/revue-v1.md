# Revue critique indépendante : film Mécanique SKL, premier montage (v1)

Réviseur : équipe Administrateur 2.0 (je n'ai pas réalisé ce film et je n'ai modifié aucun fichier du projet).
Date : 14 octobre 2026.
Compétence chargée : `video-4k-2-0` (références lues : `10-controle-qualite.md`, `03-direction-artistique.md`, `09-conformite-et-droits.md`, et le moteur `scripts/video4k.py`).
Fichiers évalués (scratchpad `film/`) : `principal-h-master.mp4`, `principal-v-master.mp4`, `court-h-master.mp4`.
Preuves (images extraites, planches, spectre, onde) : `scratchpad/film/revue-v1/`.

---

## Verdict

**Note : 74/100. Aucun défaut critique avéré. La v1 ne peut pas être livrée en l'état** (seuil fixé à 90/100).

Le film est solide sur l'essentiel : une direction artistique cohérente et premium, un message clair, le bon nom (« Mécanique SKL ») partout, l'adresse exacte, aucun faux logo et une mention de démonstration présente. Il perd des points sur des défauts de finition visibles, qui se corrigent tous en une passe de rendu : texture de fond qui laisse voir un quadrillage, textes qui chevauchent les objets, un point vert parasite sur la carte finale, des marges trop justes en 9:16 et un appel à l'action trop court dans la version de 14,5 s. Il manque aussi les encodages web. La v2 peut raisonnablement viser 90 si les corrections P1 et P2 sont faites.

Un risque reste ouvert et deviendrait critique : **le numéro 418 663-1195 n'est pas confirmé** (fait F4, statut « hypothèse »). Le site l'affiche avec la mention « à confirmer », le film l'affiche comme un fait.

---

## 1. Contrôle technique (sur les fichiers exportés)

### ffprobe

| Fichier | Résolution | Cadence | Durée | Vidéo | Audio | Poids / débit | faststart |
|---|---|---|---|---|---|---|---|
| principal-h-master | 3840×2160 (16:9) | 30/1 CFR, 1260 images | 42,000 s | H.264 High, yuv420p, BT.709, progressif | AAC-LC 48 kHz stéréo, 258 kb/s | 261,7 Mo, environ 49,6 Mb/s | oui (moov avant mdat) |
| principal-v-master | 2160×3840 (9:16) | 30/1, 1260 images | 42,000 s | idem | idem, 260 kb/s | 269,8 Mo, environ 51,1 Mb/s | oui |
| court-h-master | 3840×2160 (16:9) | 30/1, 435 images | 14,500 s | idem | idem, 263 kb/s | 124,8 Mo, environ 68,6 Mb/s | oui |

Métadonnées : titre « Mécanique SKL · film de démonstration » ; commentaire « Rendu graphique 4K natif (pixels natifs, aucune mise à l'échelle). Musique originale. »

### Moteur `video4k.py controler`

| Fichier | Paramètres | Résultat |
|---|---|---|
| principal-h | `--ratio 16:9 --resolution 3840x2160 --duree 42 --lufs -16 --projet projet.json` | CONFORME : 4K natif, −16,0 LUFS |
| principal-v | `--ratio 9:16 --resolution 2160x3840 --duree 42 --lufs -14 --projet projet.json` | CONFORME : 4K natif, −14,2 LUFS |
| court-h | `--ratio 16:9 --resolution 3840x2160 --duree 14.5 --lufs -16` | CONFORME, avec un avertissement : image figée à 12,6 s (carte finale fixe, voulue) |

`valider projet.json` : « PRÊT POUR LA PRÉPARATION (pas encore pour la production finale) ». Réserves : S6 repose sur F6 (hypothèse), S8 sur F4 (hypothèse), coordonnées du CTA non vérifiées, logo non fourni.

Deux limites du moteur sont à connaître :
- il n'avertit qu'au-delà de −1,0 dBTP, alors que sa propre consigne est « viser −1,5 ». Les crêtes à −1,0 passent donc sans signal (voir le défaut M-9) ;
- avec `--projet`, il ignore toute image figée dans une scène `graphique`. Comme les 8 scènes le sont, la détection des images figées est en pratique désactivée sur le film principal.

### Son (analyse objective)

| Mesure | principal-h | principal-v | court-h | Cible (compétence) |
|---|---|---|---|---|
| Loudness intégrée (EBU R128) | −16,0 LUFS | −14,2 LUFS | −16,1 LUFS | −16 web / −14 réseaux : OK |
| LRA | 2,9 LU | 2,5 LU | 2,0 LU | très compressé, acceptable pour le web |
| Crête vraie | −1,0 dBTP | −1,1 dBTP | −1,4 dBTP | ≤ −1,5 dBTP : **dépassée de 0,1 à 0,5 dB** |
| Crête échantillon (astats) | −1,25 dBFS | −1,17 dBFS | −1,47 dBFS | |
| Saturation (flat factor, échantillons écrêtés) | 0 | 0 | 0 | aucune saturation |
| Décalage DC | 0,0005 | 0,0006 | 0,0004 | négligeable |
| Silence > 0,3 s sous −50 dB | aucun | aucun | aucun | |
| Début (20 premières ms) | −56 dBFS crête | −51 | −62 | aucun clic |
| Fin (30 dernières ms) | −81 dBFS crête | −79 | −76 | fondu propre jusqu'au silence |
| Corrélation de phase moyenne | 0,98 (min. 0,76) | | | quasi mono : compatible, mais image stéréo étroite |
| Perte avec un passe-haut à 300 Hz (haut-parleur de téléphone simulé) | −5,2 LU | −5,2 LU | | la basse porte une grande part du niveau |

Loudness momentanée : impact d'ouverture à −9 LUFS (0 à 0,5 s), puis −12 à −21 en pulsation régulière, et une décroissance de 37,5 à 42 s jusqu'à −32. Spectre (`revue-v1/spectre-h.png`) : souffle large bande de 0 à 3,5 s, transitoires larges (cliquets, tics) de 9,5 à 23,5 s et de 29,5 à 31 s, et presque rien au-dessus de 1 kHz de 3,5 à 9 s et de 23,5 à 29 s. Au téléphone, le passe-haut à 300 Hz donne −24,6 LUFS pour S2 et −22,6 pour S6 : ces passages risquent de paraître creux sur un petit haut-parleur.

---

## 2. Contrôle visuel (3 images par scène au minimum, 16:9 en 1280 px, planches 9:16)

| Scène | Ce qui est vu | Défauts relevés |
|---|---|---|
| S1 accroche 0 à 3,5 s | Macro de la bande de roulement, trait de lumière ambrée, « MÉCANIQUE SKL · 1100… » gravé sur le flanc, pictogramme montagne-flocon | Image sombre, peu contrastée, sans texte pendant 3,5 s. **Quadrillage visible dans le fond** (dalles rectangulaires). |
| S2 identité 3,5 à 9 s | Recul, roue entière, ligne jaune, « Garage à Beauport / Mécanique SKL / 1100, boulevard des Chutes » | En 16:9, « SKL » chevauche le pneu. En 9:16, marge droite de 142 px (6,6 %) à une hauteur de 60 à 73 %, donc dans la colonne des boutons Reels/TikTok. Quadrillage du fond visible. |
| S3 mécanique générale 9 à 13,5 s | Lampe d'inspection, 5 repères (Pneus, Freins, Suspension, Électricité, Liquides), « On regarde avant de parler de prix. » | « générale » mord sur le pneu en 16:9. Les 5 repères ne viennent pas des faits vérifiés (F3 dit seulement « mécanique générale »). |
| S4 pneus 13,5 à 18 s | Gros plan du flanc, cercle doré sur le pictogramme hiver, « Vente et pose, été comme hiver. » | Propre. « été comme hiver » est une déduction, pas un fait vérifié (mineur). |
| S5 récréative 18 à 22,5 s | Roue à crampons qui entre par la droite | En 16:9, « récréative » est posé sur la roue (forte collision). Moyeu à **3 goujons** : peu crédible pour un VTT (4 en général). |
| S6 manifeste 22,5 à 28,5 s | « On regarde. / On vous explique. / Ensuite, on répare. » en escalier, roue assombrie | Bien en 16:9. **En 9:16, « on répare. » finit à 114 px du bord droit (5,3 %)**, à une hauteur de 53 à 71 % : il tombe sous les boutons des réseaux. |
| S7 prix par écrit 28,5 à 34,5 s | Bon de travail « Évaluation écrite », tampon « Prix écrit », « Le prix par écrit, avant de réparer. Pour une réparation de plus de 100 $, c'est votre droit au Québec. » | Entrée du bon (28,5 à 29 s) en semi-transparence : le moyeu et l'arc jaune se voient à travers le papier. Fondu au noir rapide (34,0 à 34,4 s). |
| S8 carte finale 34,5 à 42 s | Plan schématique (1, 3 et 10 km, nord), épingle « Mécanique SKL », « Appelez le 418 663-1195 », adresse, services, mention « Film de démonstration non officiel · images graphiques » | **Point vert parasite** au coin haut-gauche du plan (de 34,5 à 42 s, et aussi dans la version courte et la version verticale). En 16:9, « SKL » chevauche le bord du plan. De 34,4 à 35,6 s, l'écran est vide (titre à 35,7 s, CTA à 36,8 s). Le CTA reste lisible 5,2 s. |
| Court 0 à 14,5 s | Roue, identité, trois métiers, carte finale | **CTA visible seulement 2,3 s (12,2 à 14,5 s)**, sous le minimum de 3 s. La promesse « prix par écrit » est absente (seul le sous-titre de S3 l'évoque). |

Textes : aucune faute relevée. Le nom « Mécanique SKL » est correct partout (titres, flanc, carte, métadonnées). Adresse conforme à F2. Aucun logo dessiné ni généré : le nom est composé en typographie, ce qui est la bonne décision tant que F7 n'est pas fourni. La mention a un contraste mesuré de 5,1:1, mais elle mesure environ 30 px de haut en 4K : illisible en 16:9 sur un téléphone.

Vérification juridique de S7 : la règle de l'évaluation écrite au-delà de 100 $ (LPC, réparation automobile) concorde avec les sources de l'OPC, d'Éducaloi et de Protégez-vous trouvées par recherche. Nuance : le consommateur peut y renoncer par un écrit qu'il rédige et signe lui-même. La formule « c'est votre droit » est exacte. Le texte officiel n'a pas pu être ouvert (accès réseau bloqué). **Ce n'est pas une fausse information.**

---

## 3. Note détaillée

| Critère | Note | Justification |
|---|---|---|
| Direction artistique et qualité visuelle | **15/20** | Idée forte et tenue (la roue signature du site, l'inspection, une seule couleur d'accent), palette et typographies du site respectées, rendu vectoriel net, lumière soignée. On perd 5 points : quadrillage du fond visible sur toutes les scènes (texture `concrete.png` de 768 px non raccordable, répétée et agrandie), textes qui chevauchent les objets (S2, S3, S5, S8), point vert parasite sur la carte finale, bon de travail transparent à son entrée. C'est le contraire de « aéré, épuré ». |
| Compréhension immédiate du message | **12/15** | Qui, où, quoi, comment, combien et quoi faire : tout y est, dans le bon ordre. En revanche, les 3,5 premières secondes n'ont ni texte ni bénéfice, la promesse n'arrive qu'à 22,5 s, et les trois métiers suivent le même gabarit, sans hiérarchie. |
| Crédibilité et respect de l'identité de marque | **11/15** | Nom, adresse, absence de faux logo, mention de démonstration, aucune fausse image d'atelier : très bien. Mais trois éléments non vérifiés sont présentés comme des faits : le numéro (F4), la méthode « On regarde. On vous explique. Ensuite, on répare. » (F6) et les 5 repères de S3. Le moyeu de VTT à 3 goujons fragilise la crédibilité technique auprès d'un mécanicien, qui est précisément le spectateur de la démonstration. |
| Montage, son et rythme | **11/15** | Coupes franches et lisibles, son propre (aucune saturation, fin en fondu, loudness juste). Mais les trois scènes de métier ont la même mécanique, l'écran reste vide 1,2 s au début de S8, l'arc musical « qui monte » ne se voit ni dans l'onde ni dans le LRA (2,9 LU, énergie plutôt décroissante après 23 s), la crête dépasse la cible et le mix risque de paraître creux au téléphone. Sans voix off, le film repose entièrement sur les textes (c'est voulu). |
| Efficacité commerciale et appel à l'action | **11/15** | La promesse du prix par écrit est un vrai différenciateur, juste et vérifiable. Le CTA est unique, avec le numéro en accent, lisible 5,2 s dans la version principale. Par contre : seulement 2,3 s dans la version courte, aucune promesse dans la version courte, une accroche 9:16 trop lente pour arrêter un défilement, un numéro non confirmé, et rien sur le rendez-vous en ligne alors que c'est la deuxième action visée dans le brief. |
| Lisibilité et adaptation mobile | **7/10** | La version verticale est un vrai montage dédié, bien composé (bloc de texte vers 55 à 73 % de la hauteur, carte finale réussie). Mais les marges droites de S2 (6,6 %) et de S6 (5,3 %) tombent sous les boutons des réseaux, la mention est minuscule, et le texte du flanc est décoratif mais illisible au téléphone. |
| Qualité technique et optimisation web | **7/10** | Exports sains : 4K natif, 30 i/s constants, BT.709, faststart, durées exactes, loudness juste, aucun fichier corrompu. Mais il n'y a aucun encodage web (le brief vise 10 Mo maximum en 1080p, et les masters pèsent 262 et 270 Mo), aucun poster, une crête à −1,0 dBTP, des sous-titres VTT/SRT en avance sur l'image (CTA : sous-titre à 35,4 s pour une apparition à 36,8 s ; version courte : 10,9 s pour 12,2 s), et une texture de fond agrandie (768 px étirés). |
| **Total** | **74/100** | Seuil de 90 non atteint. Aucun défaut critique avéré. |

---

## 4. Défauts classés

### Critiques (bloquent toute livraison)

**Aucun avéré.** Fausse information, logo incorrect, scène absurde, audio défectueux, coordonnées erronées, export corrompu : rien de tout cela n'a été constaté.

**Risque à lever avant toute livraison au garage (C-0)** :
- Problème : « Appelez le 418 663-1195 » (S8, version courte, flanc du pneu S1 à S7) repose sur F4, au statut « hypothèse ». Un second numéro (581 982-1195) circule chez NAPA.
- Impact : si le numéro est faux, le défaut devient critique (coordonnées erronées) et le CTA appelle quelqu'un d'autre.
- Correction : confirmer le numéro auprès du garage. D'ici là, pour la démonstration, ajouter « (à confirmer) » sous le numéro, comme sur le site, ou garder le numéro et le signaler oralement au propriétaire.
- Vérification : F4 passe à « vérifié » dans `projet.json` avec sa source et sa date, puis `valider` ne lève plus la réserve « coordonnées du CTA non vérifiées ».

### Majeurs

**M-1 Quadrillage de la texture de fond (toutes les scènes, 3 versions)**
- Problème : `concrete.png` (768×768, `background-size: 640px`) n'est pas raccordable. Les raccords forment une grille visible : sauts de luminance de 1,5 à 3,3 niveaux sur les colonnes x ≈ 774, 1847 et 2920 en 4K (médiane 0,29), très visibles en 9:16 (S1, S4, S5).
- Impact : aspect bon marché, surtout sur un grand écran ou un téléphone en luminosité élevée. Le défaut contredit la promesse « premium ».
- Correction : remplacer la texture par une version raccordable en 2048 px minimum (décalage de moitié et retouche des bords, ou bruit procédural généré par code), avec `background-size` au moins égal à la taille native pour éviter l'agrandissement ; ou supprimer `#floor::before` et garder le dégradé radial avec le grain.
- Vérification : réextraire les images de S1, S4 et S5 en 16:9 et 9:16, plus le calcul des sauts de colonnes : aucun saut supérieur à 0,6 niveau au-dessus de la médiane, et aucune dalle visible sur la planche verticale.

**M-2 Textes qui chevauchent les objets (16:9)**
- Problème : « SKL » sur le pneu (S2, 4,5 à 9 s), « générale » sur le pneu (S3, 10 à 13,5 s), « récréative » sur la roue à crampons (S5, 19 à 22,5 s), « SKL » sur le bord du plan (S8, 35,7 à 42 s).
- Impact : composition chargée, lecture moins nette, impression de mise en page non maîtrisée.
- Correction : en 16:9, décaler la roue d'environ 8 % vers la droite (son centre passe d'environ 66 % à 72-74 % de la largeur) ou réduire les titres de 10 à 12 %, pour garder au moins 80 px en 4K entre la dernière lettre et l'objet. En S8, décaler le plan de 120 px vers la droite (ou réduire sa largeur de 8 %).
- Vérification : sur les images de fin de S2, S3, S5 et S8, aucun pixel de titre dans le contour de la roue ou du plan.

**M-3 Marges droites en 9:16 dans la zone des boutons des réseaux**
- Problème : S6, « on répare. », finit à 114 px du bord (5,3 %) entre 53 et 71 % de la hauteur ; S2, « Mécanique SKL », à 142 px (6,6 %) entre 60 et 73 %.
- Impact : sur Reels et TikTok, la colonne d'icônes (environ 13 à 15 % à droite, entre 50 et 90 % de la hauteur) masque la fin des phrases clés.
- Correction : en 9:16, réduire ces titres d'environ 12 % ou passer « Ensuite, on répare. » sur deux lignes, et ne plus décaler les lignes de S6 en escalier. Marge droite d'au moins 300 px (14 %) sur tout texte situé entre 50 et 90 % de la hauteur.
- Vérification : mesurer la marge droite (pixels clairs et jaunes) sur les images de fin de S2, S5, S6 et S8 en 9:16 : au moins 300 px partout, puis superposer un gabarit d'interface Reels.

**M-4 Version courte : CTA trop bref et sans promesse**
- Problème : CTA visible de 12,2 à 14,5 s, soit 2,3 s, sous le minimum de 3 s de la compétence. La promesse du prix par écrit est absente.
- Impact : la version la plus vue sur les réseaux est celle qui convertit le moins.
- Correction : passer à 15 s maximum avec un CTA d'au moins 3,5 s (raccourcir les trois métiers de 1,5 à 1,2 s chacun, ou retirer « Pneus » de la version courte), et ajouter une ligne de 1,5 s « Le prix par écrit, avant de réparer. » avant la carte finale. Décaler les sous-titres SRT en conséquence.
- Vérification : mesurer l'apparition du numéro (pixels jaunes) : visible au moins 3,5 s ; relancer `controler --duree`.

**M-5 Faits non vérifiés présentés comme établis**
- Problème : S6 utilise F6 (hypothèse) ; S3 affiche 5 repères (Freins, Suspension, Électricité, Liquides, Pneus) absents des faits ; S4 dit « été comme hiver » (déduit).
- Impact : dans une démonstration étiquetée, le risque est faible. Mais il devient une représentation trompeuse si le film sort du cadre de la démonstration.
- Correction : garder ces éléments pour la démonstration, les inscrire comme hypothèses dans `projet.json` (F9 : liste des interventions, F10 : pneus d'été et d'hiver) et les faire valider par le garage avant toute version officielle. Sinon, remplacer les 5 repères par « Diagnostic · Entretien · Réparation ».
- Vérification : `valider` liste chaque scène et ses faits ; aucune scène officielle ne repose sur une hypothèse.

**M-6 Accroche trop lente pour le 9:16**
- Problème : de 0 à 3,5 s, macro sombre sans texte ni bénéfice. Le nom n'est lisible que sur le flanc.
- Impact : sur Reels et TikTok, l'abandon se joue dans les 1,5 premières secondes. Sur le site (lecture au clic), c'est acceptable.
- Correction : dans la version verticale et la version courte, afficher dès 0,4 s une ligne d'accroche (par exemple « Avant de parler de prix, on regarde. »), éclaircir le premier plan d'environ +15 % de luminance moyenne et ramener l'impact sonore sur la première coupe (sans dépasser −1,5 dBTP).
- Vérification : planche des images à 0,2 / 0,8 / 1,5 s : un texte lisible dès 0,5 s.

**M-7 Aucun encodage web ni poster**
- Problème : seuls les masters existent (262 à 270 Mo, environ 50 Mb/s), alors que le brief vise un lecteur avec poster, 10 Mo maximum en 1080p et 720p au téléphone.
- Impact : le film ne peut pas aller sur la maquette.
- Correction : `exporter principal-h-master.mp4 --preset web-presentation --budget-mo 10 --projet projet.json` ; une version 720p pour le téléphone ; `--preset social-916` pour le vertical (−14 LUFS) ; un poster JPEG extrait à 38,5 s (carte finale complète) ; VTT recalés (voir m-4).
- Vérification : `controler <web>.mp4 --budget-mo 10 --duree 42 --lufs -16`, puis un test en navigateur réel (aucun octet vidéo avant `load`, poster affiché d'abord).

### Mineurs

**m-1 Point vert parasite sur la carte finale**
- Problème : le groupe `radar__me` (point « Vous », `#5AD17A`) de `render/radar.html` s'affiche à l'origine de la carte, en haut à gauche du plan. L'attribut `hidden` n'agit pas sur un `<g>` SVG.
- Correction : `style="display:none"` sur ce groupe, ou supprimer le groupe dans la copie utilisée pour le film.
- Vérification : recadrer le coin du plan à 38 s dans les 3 versions : aucun pixel vert.
- C'est un défaut mineur par la taille, mais visible pendant 7 s sur l'image la plus importante : **à corriger en premier.**

**m-2 Crête vraie à −1,0, −1,1 et −1,4 dBTP**
- Problème : la cible est ≤ −1,5 dBTP.
- Correction : limiteur à crête vraie à −2,0 dBTP avant l'encodage AAC (`loudnorm=I=-16:TP=-2:LRA=11` ou `alimiter`), puis remesurer après l'encodage, qui ajoute des crêtes entre échantillons.
- Vérification : `ebur128=peak=true` affiche une crête ≤ −1,5 dBTP sur les 3 fichiers et la loudness reste à ±0,5 LU de la cible.

**m-3 Mix pauvre au-dessus de 300 Hz**
- Problème : −5,2 LU au passe-haut à 300 Hz ; S2 à −24,6 LUFS.
- Correction : ajouter un harmonique ou une saturation douce sur la basse (contenu entre 600 Hz et 2 kHz), et une nappe ou un motif aigu discret sur S2 et S6.
- Vérification : l'écart entre le niveau normal et le passe-haut à 300 Hz est au plus de 3,5 LU ; écoute sur un vrai téléphone.

**m-4 Sous-titres en avance**
- Problème : cue 8 à 35,4 s pour un CTA visible à 36,8 s ; version courte, cue 6 à 10,9 s pour un CTA visible à 12,2 s.
- Correction : séparer le cue en « Mécanique SKL » (35,7 s) et « Appelez le… » (36,8 s) ; même chose pour la version courte.

**m-5 Bon de travail transparent à son entrée (28,5 à 29 s)**
- Correction : faire entrer le papier opaque (opacité 1, mouvement et ombre seulement), ou passer d'un fondu de 0,5 s à 0,15 s.

**m-6 Moyeu à 3 goujons sur la roue récréative (S5)**
- Correction : 4 goujons (gabarit VTT courant).

**m-7 Écran vide de 1,2 s au début de S8 (34,4 à 35,6 s)**
- Correction : faire entrer le titre à 34,9 s et le CTA à 35,8 s, ce qui donne un CTA de 6,2 s.

**m-8 Mention illisible au téléphone en 16:9**
- Correction : agrandir d'environ 25 % (de 30 à 38 px de haut en 4K), ou la répéter discrètement dans un coin pendant les 2 premières secondes.

**m-9 Seuil de crête du moteur plus laxiste que sa consigne**
- Problème : le moteur avertit au-delà de −1,0 dBTP alors que sa consigne est −1,5.
- Correction : à signaler au responsable de la compétence (ce réviseur ne la modifie pas).

**m-10 Image stéréo quasi mono (corrélation 0,98)**
- C'est acceptable. Un léger élargissement des effets (cliquets, tic) donnerait de l'air.

---

## 5. Corrections priorisées (ordre de rentabilité)

| Priorité | Correction | Effort | Gain estimé |
|---|---|---|---|
| P1 | m-1 : supprimer le point vert (une ligne de CSS ou SVG) | 5 min | DA +1 |
| P1 | M-1 : texture de fond raccordable en 2048 px, ou dégradé seul | 30 min + rendu | DA +2, technique +1 |
| P1 | M-2 et M-3 : marges et collisions (roue décalée, titres réduits, S6 en deux lignes en 9:16) | 1 h + rendu | DA +1, mobile +2, compréhension +1 |
| P1 | M-4 : version courte à 15 s, CTA de 3,5 s ou plus, ligne « prix par écrit » | 30 min + rendu | Commercial +2 |
| P1 | C-0 : faire confirmer le numéro (ou ajouter « à confirmer ») | appel ou message au garage | lève le risque critique, crédibilité +1 |
| P2 | M-6 : accroche texte dès 0,4 s en 9:16 et en version courte | 30 min | Commercial +1, compréhension +1 |
| P2 | M-7 : encodages web, poster, VTT recalés (m-4) | 20 min | Technique +2 |
| P2 | m-2 et m-3 : limiteur à −2 dBTP, contenu médium sur S2 et S6 | 30 min | Son +1 |
| P3 | m-5, m-6, m-7, m-8 | 30 min | finition, crédibilité |
| P3 | M-5 : inscrire F9 et F10 comme hypothèses et faire valider F6 et la liste des interventions | administratif | crédibilité (version officielle) |

Projection si P1 et P2 sont faits : environ 18 + 14 + 12 + 13 + 14 + 9 + 9 = **89 à 91/100**. Pour franchir 90 avec une marge, il faut aussi au moins une partie de P3, ou, pour la version officielle, de vraies images d'atelier (concept alternatif déjà noté dans `projet.json`).

Après correction, refaire le contrôle complet : `controler` sur les 3 masters et les encodages web, extraction de 3 images par scène, planche verticale, `ebur128=peak=true`, mesures des marges et du CTA comme dans cette revue.

---

## 6. Ce qui n'a pas pu être vérifié

- **Écoute réelle** : la musicalité, la justesse des effets (cliquet, tic de lampe, stylo), le synchronisme fin entre son et coupes, la fatigue d'écoute et le rendu sur un haut-parleur de téléphone ne sont qu'estimés par mesure (spectre, passe-haut, phase). Il faut une écoute au casque et sur un téléphone par Pavel.
- **Fluidité du mouvement** : seules des images fixes ont été vues. Saccades, à-coups de rotation, vitesse de lecture des textes et confort des transitions restent à juger en lecture réelle (une lecture complète en 4K et une en 1080p).
- **Interface réelle des réseaux** : les zones des boutons Reels et TikTok sont estimées (environ 13 à 15 % à droite). Il faut un essai en brouillon non publié, avec l'accord de Pavel, ou un gabarit officiel.
- **Texte officiel de la LPC** : les sites de l'OPC et d'Éducaloi n'étaient pas accessibles depuis ce poste. La règle des 100 $ est confirmée par des résumés de recherche concordants, pas par le texte de loi lui-même.
- **Numéro de téléphone** : non vérifiable sans le garage (F4).
- **Encodages web et intégration au site** : ils n'existent pas encore, donc ils n'ont pas été testés.
- **Licence des polices et droits de la musique** : `projet.json` les déclare (OFL, œuvre originale générée par code). Je n'ai pas audité le code de composition `render/audio.py` pour exclure un emprunt mélodique, ce qui est très improbable pour une synthèse par code.
