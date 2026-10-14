# Revue critique indépendante : film Mécanique SKL, version v4

Réviseur : équipe Administrateur 2.0. Je n'ai pas réalisé ce film. Je n'ai modifié aucun fichier du projet, sauf ce rapport.
Date : 14 octobre 2026.
Compétence chargée : `video-4k-2-0` (référence `10-controle-qualite.md`, moteur `scripts/video4k.py`).
Fichiers évalués : les exports réels du dossier `scratchpad/film/exports/` (master, web, web-court, social, site), refaits pour la v4.
Preuves : `scratchpad/film/revue-v4/` (sous-dossiers `tech/`, `son/`, `st/`, `zoom/`, planches `planche-*.png`).

---

## Verdict

**Note : 90/100. Aucun défaut critique avéré. Le seuil de 90/100 est atteint, de justesse.**

- **Pour l'usage prévu (démonstration au propriétaire) : PRÊT.**
- **Pour toute diffusion publique (réseaux, publicité, site en ligne) : BLOQUÉ** tant que le numéro 418 663-1195 n'est pas confirmé par le garage (C-0).

La v4 corrige pour de vrai presque tous les défauts de la v3, et je l'ai vérifié sur les fichiers exportés :
- la crête vraie est sous −1,5 dBTP partout ;
- la coupe de 9,0 s a son accent ;
- la mention du 9:16 tient sur 2 lignes, hors de la zone du bas ;
- le manifeste n'est plus coupé ;
- la lampe reste dans le pneu ;
- le titre de S2 est dégagé ;
- le téléphone en portrait reçoit le montage vertical ;
- les sous-titres suivent l'écran ;
- les affiches et les noms de fichiers sont alignés.

Il reste des finitions. Le son perd encore 3,9 LU sur un haut-parleur de téléphone et l'impact d'ouverture y disparaît presque (−9 dB). L'affiche de la version courte est prise au milieu d'un fondu. Il reste aussi quelques écarts de dossier : métadonnées du fichier social, `projet.json` incomplet, poids du court 1080p.

---

## 1. Contrôle technique (sur les fichiers exportés)

### ffprobe et faststart (`tech/ffprobe.txt`, `tech/faststart.txt`, `tech/images-cles.txt`)

| Fichier | Résolution | Durée | Vidéo | Audio | Poids | faststart |
|---|---|---|---|---|---|---|
| master/…-42s-4k.mp4 | 3840×2160, 30 i/s, 1260 img | 42,0 s | H.264 High, yuv420p, BT.709, progressif, 19,6 Mb/s | AAC 48 kHz stéréo, 270 kb/s | 104,2 Mo | oui |
| master/…-42s-vertical-4k.mp4 | 2160×3840, 30 i/s | 42,0 s | idem, 21,4 Mb/s | AAC 271 kb/s | 113,7 Mo | oui |
| master/…-15s-4k.mp4 | 3840×2160, 30 i/s, 450 img | 15,0 s | idem, 28,7 Mb/s | AAC 267 kb/s | 54,3 Mo | oui |
| web/…-42s-1080p.mp4 | 1920×1080 | 42,0 s | H.264, 1,62 Mb/s | AAC 130 kb/s | **9,25 Mo** (budget 10) | oui |
| web/…-42s-720p.mp4 | 1280×720 | 42,0 s | H.264 | AAC 130 kb/s | 4,05 Mo | oui |
| web/…-42s-vertical-720x1280.mp4 (nouveau) | 720×1280 | 42,0 s | H.264 | AAC 130 kb/s | 4,25 Mo | oui |
| web-court/…-15s-1080p.mp4 | 1920×1080 | 15,0 s | H.264 | AAC 130 kb/s | **4,07 Mo** | oui |
| web-court/…-15s-720p.mp4 | 1280×720 | 15,0 s | H.264 | AAC 130 kb/s | 1,48 Mo | oui |
| social/…-vertical-social-916.mp4 | 1080×1920 | 42,0 s | H.264, 3,7 Mb/s | AAC 251 kb/s | 20,7 Mo | oui |
| site/skl-film-1080.webm | 1920×1080 | 42,0 s | VP9 | Opus | 8,46 Mo | sans objet |
| site/skl-film-720.webm | 1280×720 | 42,0 s | VP9 | Opus | 3,04 Mo | sans objet |
| site/skl-film-v720.webm | 720×1280 | 42,0 s | VP9 | Opus | 3,24 Mo | sans objet |

- Les fichiers `site/` sont **identiques** (MD5) à ceux de `site/assets/video/` du dépôt. Les MP4 du site sont identiques à ceux de `web/` (`tech/md5-*.txt`).
- Images clés du web 42 s : toutes les 2 s, en plus des coupes (0 ; 2 ; 3,5 ; 5,5 ; … ; 40,5). Version courte : 0 ; 1,5 ; 3,5 ; … ; 14,7. **Corrigé.**
- Métadonnées : les fichiers 1080p, 720p, vertical 720 et WebM portent « Réduit depuis le rendu graphique 4K natif ». **Le fichier social 1080×1920 porte encore « aucune mise à l'échelle »** (P3).

### Moteur `controler` (`tech/controler.txt`)

| Fichier | Résultat |
|---|---|
| 3 masters | CONFORMES, 4K natif, −16,1 / −14,3 / −16,2 LUFS. Le court a une image figée à 11,8 s (carte finale, voulue). |
| web 1080p, 720p, vertical 720 | CONFORMES (`--budget-mo 10` / `5` / `5`) |
| web-court 1080p | **NON CONFORME avec `--budget-mo 4`** : 4,07 Mo, soit 70 Ko au-dessus. La doc annonce « environ 3 Mo » (P3). |
| web-court 720p | CONFORME (image figée en fin, voulue) |
| social 9:16 | CONFORME, −14,3 LUFS |
| 3 WebM | CONFORMES, **sans avertissement de crête** (v3 : −0,5 dBTP) |

### Intégrité, noir, clics (`son/mesures.txt`, `son/debut.txt`, `son/attaque.txt`)

- Décodage complet : **0 erreur sur les 12 fichiers.**
- Noir : seulement 34,40 à 34,57 s, le fondu voulu avant la carte finale. Plus aucun noir dans la version courte.
- Fin : les 50 dernières ms sont entre −70 et −73 dBFS. **Le fondu est propre.** Aucun écrêtage (facteur de planéité 0).
- Début : silence numérique jusqu'à 19 ms, puis l'impact d'ouverture monte à 50 % de sa crête en 1,8 ms. C'est l'attaque percussive voulue (couche médium ajoutée), pas un clic parasite. Après encodage AAC, la fenêtre de 10 à 20 ms monte à −35/−37 dBFS (contre −44 dans le master), signe d'un léger pré-écho. C'est inaudible dans la mesure, mais à confirmer à l'écoute (P3).

---

## 2. Contrôle visuel

Images regardées : **31 du master 16:9** (`h/`, planches `planche-h-1.png` à `planche-h-3.png`), **14 du vertical** (`planche-v-1.png`, `planche-v-2.png` avec le gabarit des réseaux), **14 du court** (`planche-court.png`), plus des recadrages (`zoom/`) et une simulation de téléphone (`planche-telephone.png`, 390 px en portrait et 844 px en paysage).

| Point | Constat v4 |
|---|---|
| Fond près de la ligne jaune à 8,6 s | Contraste ×5 (`zoom/h4k-8.6-contraste5.png`) : aucun rectangle. Mesure des raccords : aucun saut aligné au-dessus de 2,1 niveaux (`tech/tuiles.txt`). |
| S2, recul (4,4 à 5,8 s) | « SKL » ne touche plus jamais le pneu (`zoom/s2-collision.png`). |
| S3, lampe | Le secteur éclairé s'éteint avant le bord du pneu, avec un masque doux (`zoom/h11-lampe-x4.png`, `zoom/v12-lampe.png`). Le bord avant du faisceau reste net : c'est le dessin d'un faisceau, acceptable. |
| S5 | « Au même garage que votre auto. » : la ligne est utile et n'ajoute aucun fait. |
| S6, 9:16 | « On regarde. / On vous explique. / Ensuite, on répare. » : 3 lignes entières, marge droite de 617 px. |
| S7 | Ligne légale équilibrée : « Pour une réparation de plus de / 100 $, c'est votre droit au Québec. » Plus d'orphelin en 16:9 ni en 9:16. |
| S8 | Ajout de « ou demandez un rendez-vous sur le site ». Le numéro est visible **6,03 s** (principal et vertical) et **3,67 s** (court) (`st/apparition-cta.txt`). 0 pixel vert (`tech/point-vert.txt`). |
| S8, 9:16 | Plan plus compact. Mention sur 2 lignes (« Film de démonstration non officiel » / « images graphiques · coordonnées à confirmer »), **bas du texte à 73,8 %** (v3 : 83,7 %), marge droite de 623 px (`tech/marges-vertical.txt`, `zoom/v40-carte.png`). |
| Marges du 9:16 | De 617 à 856 px à droite. Bas du texte entre 65 et 75 % de la hauteur dans toutes les scènes. |
| Téléphone en portrait (vertical 720 réduit à 390 px) | Titres, numéro, adresse et rendez-vous nets. Ligne légale de **11,7 px**. Mention de **8,5 px** par ligne : petite, mais lisible (`tech/tailles-texte.txt`). |
| Téléphone en paysage (720p 16:9 à 844 px) | Mention d'environ 10 px, lisible. |
| Typographie | Aucune faute. Insécables justes. Point médian de « Chutes · Beauport » un peu plus collé à gauche (approche du glyphe dans Instrument Sans) : détail. |
| Affiches | 16:9 du site = affiche de `web/` (MD5 identiques), tirée de S2 : bonne image. L'affiche verticale (1080×1920) est nette. **L'affiche du court est prise au milieu d'un fondu** : « ou demandez un rendez-vous… » à demi transparent, mention absente (`zoom/affiches.png`, P3). |

---

## 3. Fond

| À l'écran | Fait | Statut |
|---|---|---|
| Mécanique SKL, Beauport, 1100, boulevard des Chutes, G1E 2G1 | F1, F2 | vérifiés |
| Mécanique générale, récréative, pneus, vente et pose ; « Au même garage que votre auto » | F3 | vérifié |
| Repères d'inspection ; « été comme hiver » ; « On regarde… » | F9, F10, F6 | hypothèses déclarées |
| Prix par écrit, plus de 100 $, droit au Québec | F5 | vérifié |
| 418 663-1195 (CTA, flanc, affiche du court) | F4 | **hypothèse** |
| « ou demandez un rendez-vous sur le site » | `cta.texte` (action secondaire du brief) | aucun fait nouveau |

- **Aucune affirmation inventée.** La mention « Film de démonstration non officiel · images graphiques · coordonnées à confirmer » est lisible en 9:16 et en 16:9 paysage, et elle figure dans les sous-titres (cue 13).
- Le numéro reste affirmé en grand et en jaune, et sans nuance sur le flanc et sur l'affiche du court. C'est acceptable pour la démonstration au propriétaire, qui connaît son numéro. C'est inacceptable pour une diffusion publique avant confirmation. La doc d'intégration l'écrit d'ailleurs (ligne « Réseaux… seulement après confirmation du numéro »).
- « Sur le site » n'a pas d'adresse web. Hors du site (courriel, réseaux), la phrase reste vague (P3, à compléter quand le domaine sera connu).
- Écart sur le site : la transcription de la page dit « Mécanique générale : on regarde avant de parler de prix. », alors que le film affiche « Inspection, diagnostic, réparation. ». Le petit texte sous le lecteur omet « coordonnées à confirmer » (P3, hors fichiers vidéo).

---

## 4. Son (sans écoute) : `son/`

| Mesure | Master 16:9 | Master 9:16 | Master court | Web 1080/720/v720 | Court 1080/720 | Social | 3 WebM |
|---|---|---|---|---|---|---|---|
| Loudness | −16,1 | −14,3 | −16,2 | −16,3 | −16,4 | −14,3 | −16,1 |
| LRA | 2,7 | 2,9 | 2,7 | 2,7 | 2,7 | 2,9 | 2,7 |
| **Crête vraie (cible ≤ −1,5)** | −2,1 | −2,0 | −2,8 | −3,0 | −2,1 | −1,9 | **−1,6** |
| Écart au passe-haut 300 Hz (cible ≤ 3,5) | 3,9 | 3,9 | 3,5 | 4,1 | 3,7 | 3,9 | 4,0 |

- **Crête : les 12 fichiers sont conformes.** Les WebM passent de −0,5 à −1,6 dBTP, donc la marge est mince. L'Opus est bien encodé depuis le mixage normalisé : la crête suit celle du master, et non plus celle de l'AAC.
- **Coupe de 9,0 s : accent présent**, transitoire à 9,000 s (+12,1 dB ; v3 : +80 ms et 4,3 dB). Coupes du principal : 5 sur 7 exactes, 18,0 s à +100 ms (cliquet) et 34,5 s à +90 ms. Version courte : 4 sur 6 exactes, 1,5 s et 10,5 s à +90 ms (`son/analyse-rythme.txt`). Le rythme est bon.
- **Téléphone, pas de progrès réel** : l'écart global reste de 3,9 LU (v3 : 3,8). L'ouverture perd 9,1 dB (v3 : 10,1) et l'ouverture du court en perd 12,6. La couche médium de l'impact gagne 1 dB, ce qui ne suffit pas.
- **Dynamique** : le RMS par scène est quasiment identique à la v3 (S2 à S6 entre −14,2 et −15,4 dBFS, à ±0,2 dB près). Les nappes et charleys « plus denses » ne se mesurent pas. Le LRA baisse même (3,2 → 2,7). Il n'y a toujours pas de montée audible avant la promesse.
- Spectre (`son/spectre-h.png`) : médium présent de bout en bout, accent visible à 9,0 s.

---

## 5. Sous-titres

| Cue (principal) | Sous-titre | Écran | Écart |
|---|---|---|---|
| 6, 7, 8 manifeste | 22,8 / 24,05 / 25,3 s | 22,8 / 24,05 / 25,3 s | **exact** |
| 9, 10 promesse et ligne légale | 29,4 / 30,7 s | 29,4 / 30,7 s | **exact** |
| 11, 12 nom et CTA | 34,9 / 35,9 s | 34,9 / 35,97 s | exact |
| 13 rappel et mention | 39,0 s, « Film de démonstration non officiel · coordonnées à confirmer » | mention dès 36,5 s | la formule omet « images graphiques » (P3) |

- Version courte : l'adresse et les sous-lignes sont ajoutées, et la mention est en fin de fichier.
- Les VTT et SRT existent dans `web/`, `web-court/` et `social/`, et ils sont identiques aux sources de `sorties/`.
- Le VTT du site est identique à celui de `web/`.
- Le montage vertical partage la même chronologie et le même VTT. C'est cohérent.

---

## 6. Note détaillée

| Critère | Note | Justification |
|---|---|---|
| Direction artistique et qualité visuelle | **19/20** | Fond propre, aucune collision, lampe contenue, manifeste et mention bien composés en 9:16, affiches justes. −1 : affiche du court prise en plein fondu, petits détails typographiques (point médian, bord net du faisceau). |
| Compréhension immédiate du message | **13/15** | Accroche dès 0,4 s, ordre clair, ligne de S5 plus utile, CTA complet. −2 : la promesse forte arrive encore à 28,5 s, et les trois métiers gardent le même gabarit. |
| Crédibilité et identité de marque | **13/15** | Aucun fait inventé, mention complète et lisible, hypothèses déclarées. −2 : numéro F4, méthode F6, repères F9 et « été comme hiver » F10 affirmés à l'écran ; numéro sur le flanc et sur l'affiche du court sans nuance. |
| Montage, son et rythme | **13/15** | Crêtes conformes partout, accent sur chaque coupe, sous-titres au rythme de l'écran. −2 : écart de 3,9 LU au téléphone, ouverture presque muette sur un petit haut-parleur, dynamique plate (LRA 2,7). |
| Efficacité commerciale et appel à l'action | **14/15** | CTA de 6 s et 3,7 s, rendez-vous ajouté, promesse dans les deux montages. −1 : numéro non confirmé ; « sur le site » sans adresse hors du site. |
| Lisibilité et adaptation mobile | **9/10** | Montage vertical servi aux téléphones en portrait, marges de 617 px ou plus, bas du texte à 75 % au plus, ligne légale de 11,7 px à 390 px. −1 : la mention verticale est passée de 26 à 24 px (8,5 px à 390 px), juste lisible. |
| Qualité technique et optimisation web | **9/10** | 12 fichiers sans erreur, faststart, images clés toutes les 2 s, budgets du film principal tenus, WebM conformes, site identique aux exports. −1 : métadonnées du fichier social, court 1080p à 4,07 Mo contre « environ 3 Mo » annoncés, `projet.json` sans `fichiers_produits` ni `mesure`. Lecture MP4 en navigateur non vérifiée. |
| **Total** | **90/100** | Seuil atteint, aucun défaut critique avéré. |

---

## 7. Suivi des défauts v3 (un par un)

| Défaut v3 | État v4 | Preuve |
|---|---|---|
| **C-0** numéro non confirmé | **Ouvert** (hors du pouvoir de la production). La règle « aucune diffusion publique avant confirmation » est écrite dans la doc d'intégration. | `projet.json` F4 « hypothese », `valider` |
| **P2-1** crête vraie (WebM −0,5, vertical −1,4, court 720p −1,2) | **Corrigé** : de −1,6 à −3,0 dBTP sur les 12 fichiers | `son/mesures.txt`, `tech/controler.txt` |
| **P2-2** mention du 9:16 dans les 20 % du bas, 3 lignes | **Corrigé** : 2 lignes, bas à 73,8 % | `tech/marges-vertical.txt`, `zoom/v40-carte.png` |
| **P2-3** « Ensuite, on / répare. » en 9:16 | **Corrigé** : 3 lignes entières | `planche-v-2.png`, `planche-telephone.png` |
| **P2-4** 16:9 illisible sur téléphone en portrait | **Corrigé** : `main.js` sert `v720` en portrait et `720` en paysage ; ligne légale à 11,7 px, mention à 8,5 px | diff `main.js`, `tech/tailles-texte.txt` |
| **P2-5** dossier d'exports incohérent | **Corrigé en grande partie** : VTT et SRT complets partout, affiche de `web/` = affiche du site, métadonnées « Réduit… » sur les fichiers web, `projet.json` v4 à 120 bpm, noms de fichiers alignés dans la doc. **Reste** : métadonnée du fichier social, `production.fichiers_produits` et `integration_web.mesure` vides, poids du court annoncé à 3 Mo (réel 4,07). | `tech/ffprobe.txt`, `projet.json` |
| **P2-6** rendez-vous en ligne absent | **Corrigé** (carte finale et sous-titres) | images 36,5 et 41,9 s |
| **P3-1** lampe qui déborde | **Corrigé** (masque radial) | `zoom/h11-lampe-x4.png` |
| **P3-2** « SKL » sur le pneu pendant le recul | **Corrigé** | `zoom/s2-collision.png` |
| **P3-3** orphelin « Québec. » | **Corrigé** (lignes équilibrées) | image à 32,5 s |
| **P3-4** aucun accent à 9,0 s | **Corrigé** (0 ms, +12,1 dB) | `son/analyse-rythme.txt` |
| **P3-5** dynamique plate, ouverture perdue au téléphone | **Non corrigé** : écart de 3,9 LU, ouverture à −9,1 dB, RMS par scène inchangé, LRA 2,7 | `son/analyse-rythme.txt` |
| **P3-6** sous-titres en avance, version courte incomplète | **Corrigé** (formule de la mention incomplète, détail) | section 5 |
| **P3-7** ligne de S5 qui répète le titre | **Corrigé** | image à 20 s |
| **P3-8** images clés espacées de 8,3 s | **Corrigé** (2 s) | `tech/images-cles.txt` |
| **P3-9** moteur laxiste sur la crête | Sans objet en v4 (aucune crête au-dessus de −1,5) ; la limite du moteur demeure | |

Bilan : **14 défauts sur 16 corrigés**. Restent C-0 (externe) et P3-5 (son au téléphone). P2-5 est corrigé à l'exception de petits restes.

---

## 8. Défauts restants classés

### Critiques
Aucun avéré.

### P1 (bloquant)
- **C-0 Numéro F4 non confirmé.** Il bloque toute diffusion publique, mais pas la démonstration au propriétaire. Correction : confirmation par le garage, puis F4 passe à « vérifié ». Si le numéro change, refaire le rendu du flanc, de S8 et des affiches. Vérification : `valider` sans la réserve « coordonnées du CTA ».

### P2
Aucun.

### P3 (finition)
1. **Son au téléphone** (ancien P3-5) : écart de 3,9 LU, ouverture à −9 dB (court : −12,6), aucune montée. Correction : couche de 400 Hz à 2 kHz plus forte sur l'impact (ou un « tic » métallique aigu à 0,02 s), +1,5 à +2 dB de densité de S3 à S6. Vérification : écart de 3,5 LU au plus, ouverture à −6 dB ou mieux au passe-haut, LRA de 4 LU ou plus.
2. **Affiche du court prise en plein fondu** : la tirer à 14,5 s (carte complète, mention comprise). Vérification : la ligne du rendez-vous est opaque et la mention visible.
3. **Court 1080p à 4,07 Mo** contre « environ 3 Mo » annoncés dans la doc : réencoder à 3,5 Mo, ou corriger la doc et le budget.
4. **Métadonnée du fichier social** : remplacer « aucune mise à l'échelle » par « Réduit depuis le rendu graphique 4K natif ».
5. **`projet.json`** : remplir `production.fichiers_produits` (chemins, poids, loudness, crête) et `integration_web.mesure`.
6. **Transcription du site** : aligner « Mécanique générale » sur le film (« Inspection, diagnostic, réparation. ») et ajouter « coordonnées à confirmer » au petit texte sous le lecteur.
7. **Cue 13** : reprendre la mention exacte (« … · images graphiques · coordonnées à confirmer »).
8. **« sur le site »** : ajouter le domaine quand il sera connu (utile hors du site).
9. **Attaque de l'impact d'ouverture** : passage du silence au plein niveau en moins de 2 ms à 20 ms, avec un léger pré-écho AAC. À juger à l'écoute ; sinon, une rampe de 3 à 5 ms.
10. **Petits détails typographiques** : point médian collé à gauche dans « Chutes · Beauport » (espace fine insécable ou crénage), bord net du faisceau de la lampe (optionnel). Mention verticale à 24 px : revenir à 26 px si la place le permet.

---

## 9. Comparaison des versions

| Critère | v1 | v3 | v4 |
|---|---|---|---|
| Direction artistique /20 | 15 | 18 | 19 |
| Compréhension /15 | 12 | 13 | 13 |
| Crédibilité /15 | 11 | 13 | 13 |
| Montage, son, rythme /15 | 11 | 12 | 13 |
| Commercial /15 | 11 | 13 | 14 |
| Mobile /10 | 7 | 8 | 9 |
| Technique /10 | 7 | 8 | 9 |
| **Total** | **74** | **85** | **90** |

Pour dépasser 90 avec une marge, le levier principal est le son au téléphone (P3-1), puis la confirmation du numéro, qui ferait gagner un point de crédibilité.

---

## 10. Ce qui n'a pas pu être vérifié

- **Écoute réelle**, au casque et sur un téléphone : musicalité, attaque d'ouverture, pré-écho, fatigue d'écoute.
- **Fluidité du mouvement** en lecture (images fixes seulement).
- **Lecteur du site dans un navigateur** : je ne l'ai pas testé moi-même. J'ai lu le code (`main.js` : vertical en portrait, 720p en paysage ou sur petit écran, 1080p ailleurs, création au clic) et vérifié que les fichiers servis sont identiques aux exports. La production signale que la lecture MP4 n'a pas pu être vérifiée (Chromium de test sans H.264) : à tester sur un vrai Safari ou iPhone.
- **Interface réelle des réseaux** : zones estimées (300 px à droite, 20 % en bas).
- **Numéro** et **texte officiel de la LPC** : non vérifiables depuis ce poste.
