# Revue critique indépendante : film Mécanique SKL, version v3

Réviseur : équipe Administrateur 2.0. Je n'ai pas réalisé ce film. Je n'ai modifié aucun fichier du projet, sauf ce rapport.
Date : 14 octobre 2026.
Compétence chargée : `video-4k-2-0` (référence `10-controle-qualite.md`, moteur `scripts/video4k.py`).
Fichiers évalués : les exports réels du dossier `scratchpad/film/exports/` (master, web, web-court, social, webm).
Preuves (mesures, images extraites, planches, spectre) : `scratchpad/film/revue-v3/` (sous-dossiers `tech/`, `son/`, `st/`, `h/`, `v/`, `c/`, `zoom/`).

---

## Verdict

**Note : 85/100. Aucun défaut critique avéré. La v3 n'atteint pas le seuil de livraison de 90/100.**

La v3 corrige presque tous les défauts de la v1. Le fond n'a plus de quadrillage ni de rectangles de tuiles. Les titres ne touchent plus la roue en fin de plan. Les marges du 9:16 sont larges. Le point vert a disparu. La version courte a une promesse et un appel à l'action de 3,7 s. Les encodages web existent et tiennent leur budget. C'est un film propre, cohérent et crédible pour une démonstration.

Il reste des défauts de finition. Pris ensemble, ils coûtent 5 points :
- la crête vraie des deux fichiers WebM est à −0,5 dBTP. Or ce sont les fichiers que le site lit en premier dans Chrome et Firefox ;
- en 9:16, la mention « démonstration · coordonnées à confirmer » tient sur 3 lignes. Elle finit par un mot orphelin et descend dans les 20 % du bas, sous l'interface des réseaux ;
- en 9:16, la phrase clé est mal coupée : « Ensuite, on / répare. » ;
- sur téléphone, le site sert le 16:9 en 720p. La mention et la ligne légale y font 5 à 6 px : elles sont illisibles ;
- le dossier d'exports est incohérent : sous-titres vides dans `web/`, mauvaise affiche dans `web/`, métadonnées fausses, `projet.json` pas à jour.

**Risque toujours ouvert (C-0)** : le numéro 418 663-1195 reste une hypothèse (F4). Il est désormais nuancé à l'écran par « coordonnées à confirmer », mais en petit. Il apparaît aussi, sans nuance, sur le flanc du pneu de S2 à S7. Ce n'est pas un défaut critique avéré, car rien ne prouve que le numéro est faux. Il le deviendrait si le numéro était faux.

---

## 1. Contrôle technique (sur les fichiers exportés)

### ffprobe (`tech/ffprobe.txt`, `tech/faststart.txt`)

| Fichier | Résolution | Cadence | Durée | Vidéo | Audio | Poids / débit | faststart |
|---|---|---|---|---|---|---|---|
| master/…-42s-4k.mp4 | 3840×2160 | 30/1, 1260 img | 42,00 s | H.264 High, yuv420p, BT.709, progressif | AAC-LC 48 kHz stéréo, 269 kb/s | 105,7 Mo, 20,1 Mb/s | oui |
| master/…-42s-vertical-4k.mp4 | 2160×3840 | 30/1, 1260 img | 42,00 s | idem | idem, 271 kb/s | 113,9 Mo, 21,7 Mb/s | oui |
| master/…-15s-4k.mp4 | 3840×2160 | 30/1, 450 img | 15,00 s | idem | idem, 268 kb/s | 56,7 Mo, 30,2 Mb/s | oui |
| web/…-42s-1080p.mp4 | 1920×1080 | 30/1 | 42,00 s | H.264 High | AAC 130 kb/s | **9,23 Mo** (budget 10) | oui |
| web/…-42s-720p.mp4 | 1280×720 | 30/1 | 42,00 s | H.264 High | AAC 97 kb/s | 3,11 Mo | oui |
| web-court/…-15s-1080p.mp4 | 1920×1080 | 30/1 | 15,00 s | H.264 High | AAC 131 kb/s | 3,70 Mo | oui |
| web-court/…-15s-720p.mp4 | 1280×720 | 30/1 | 15,00 s | H.264 High | AAC 97 kb/s | 1,46 Mo | oui |
| social/…-vertical-social-916.mp4 | 1080×1920 | 30/1 | 42,00 s | H.264 High | AAC 272 kb/s | 21,1 Mo | oui |
| webm/skl-film-1080.webm | 1920×1080 | 30/1 | 42,01 s | VP9 | Opus 48 kHz | 8,80 Mo | sans objet |
| webm/skl-film-720.webm (réencodé à 08:06, évalué en dernier) | 1280×720 | 30/1 | 42,01 s | VP9 | Opus | 3,00 Mo | sans objet |

- Décodage complet de chaque fichier : **0 erreur**. Aucun fichier corrompu.
- Fidélité des encodages web au master réduit (SSIM) : 1080p MP4 0,981 ; 1080p WebM 0,977 ; 720p MP4 0,983 ; 720p WebM 0,981. Une vue à contraste ×4 de deux images en 720p ne montre ni blocs ni bandes (`zoom/web720-contraste4.png`).
- Les fichiers du site (`site/assets/video/`) sont identiques aux exports (MD5 égaux), y compris le WebM 720p réencodé. Le VTT du site est bien le bon.
- Métadonnées : les fichiers 1080p et 720p disent « Rendu graphique 4K natif (pixels natifs, aucune mise à l'échelle) ». C'est faux pour un fichier réduit (défaut P3).
- Images clés du 1080p web : 0 ; 3,5 ; 11,8 ; 18 ; 22,5 ; 28,5 ; 34,7 s. Un écart atteint 8,3 s : la recherche dans le lecteur sera un peu lente (mineur).

### Moteur `video4k.py controler` (`tech/controler.txt`, `tech/webm-720.txt`)

| Fichier | Paramètres | Résultat |
|---|---|---|
| master 42 s 16:9 | `--ratio 16:9 --resolution 3840x2160 --duree 42 --lufs -16 --projet` | CONFORME, 4K natif, −16,1 LUFS |
| master vertical | `--ratio 9:16 --resolution 2160x3840 --duree 42 --lufs -14 --projet` | CONFORME, 4K natif, −14,2 LUFS |
| master 15 s | `--duree 15 --lufs -16` | CONFORME. Avertissement : image figée à 11,6 s (carte finale fixe, voulue) |
| web 1080p | `--budget-mo 10 --duree 42 --lufs -16` | CONFORME, 9,23 Mo, −16,2 LUFS |
| web 720p | `--budget-mo 5` | CONFORME, 3,11 Mo |
| web-court 1080p / 720p | `--budget-mo 4` / `2` | CONFORME (image figée en fin, voulue) |
| social 9:16 | `--resolution 1080x1920 --lufs -14` | CONFORME, −14,2 LUFS |
| WebM 1080 | `--budget-mo 10 --lufs -16` | CONFORME **avec un avertissement : crête −0,5 dBTP** |
| WebM 720 | `--budget-mo 5 --lufs -16` | CONFORME **avec un avertissement : crête −0,5 dBTP** |

`valider projet.json` (`tech/valider.txt`) : « PRÊT POUR LA PRÉPARATION (pas encore pour la production finale) ». Réserves : S3 (F9), S4 (F10), S6 (F6) et S8 (F4) reposent sur des hypothèses ; coordonnées du CTA non vérifiées ; logo non fourni.

### Images noires, figées, clics (`tech/noir-fige-decodage.txt`, `son/clics-astats.txt`)

- Noir : 1 image à 0 s (ouverture au noir, voulue) et 34,40 à 34,57 s (fondu au noir avant la carte finale, 5 images, voulu). Dans la version courte, 10,50 à 10,57 s (entrée de la carte finale, voulue). Rien d'autre.
- Images figées : seulement sur les cartes finales (fixes, avec la pulsation discrète du repère). C'est voulu.
- Début : les 3 premières ms sont silencieuses dans tous les fichiers. Les 20 premières ms restent entre −48 et −53 dBFS. **Aucun clic.**
- Fin : les 50 dernières ms sont entre −70 et −77 dBFS. **Le fondu est propre.**
- Aucun silence de plus de 0,3 s sous −50 dB. Facteur de planéité 0 (aucun écrêtage). Décalage DC ≤ 0,0005.

---

## 2. Contrôle visuel

Images extraites et regardées : **29 du master 16:9** (`h/`), **12 du vertical** (`v/`, planches `planche-v-1.png` et `planche-v-2.png` avec le gabarit des réseaux en rouge), **13 du court** (`c/`, `planche-court.png`), plus des recadrages (`zoom/`) et une simulation de téléphone à 390 px (`planche-telephone-390px.png`).

### Défaut de tuiles près de la ligne jaune (8,6 s)

- Image v2 à 8,6 s, contraste ×5 (`zoom/v2-h4k-8.6-contraste5.png`) : deux rectangles nets à droite de la ligne jaune, au pied de la roue.
- Image v3 à 8,6 s, même traitement (`zoom/h4k-8.6-contraste5.png`) : **aucun rectangle**. Seule reste la texture organique du béton.
- Mesure (`tuiles.py`, zone du sol à gauche de la roue, pixels sombres seulement) : en v2, un raccord vertical à x ≈ 2224–2227 px, aligné sur 8 bandes de 64 px, avec un saut jusqu'à 6,35 niveaux. En v3, aucun raccord comparable : le plus fort saut fait 1,9 niveau sur 4 bandes, ce qui correspond à la texture. **Défaut corrigé.**
- Contraste ×5 sur 6 autres images du 16:9 (`planche-h-contraste5.png`) et sur 5 images du 9:16 (`planche-v-contraste5.png`) : aucun quadrillage, aucune dalle, aucune bande. La texture `concrete.png` fait maintenant 2048 px. Elle est affichée à 1024 px CSS avec un zoom ×2, donc à sa taille native.

### Scène par scène (16:9 sauf mention)

| Scène | Ce qui est vu | Constat |
|---|---|---|
| S1 0 à 3,5 s | Macro du flanc, balayage de lumière, « Votre auto, vue de près. » dès 0,4 s | Bien. Le texte reste lisible pendant le balayage : contraste de 3,9:1 au pire en 9:16 (gros texte, donc acceptable). |
| S2 3,5 à 9 s | Recul, roue, ligne jaune, « Garage à Beauport / Mécanique SKL / 1100, boulevard des Chutes » | En fin de plan, 150 px (4K) séparent « SKL » du pneu. **Mais pendant le recul (4,2 à 6,2 s), le « L » et le « K » chevauchent la bande de roulement** (`zoom/s2-collision.png`). Le défaut est transitoire. Sur le flanc, on lit « 418 663-1195 » à 8,6 s, donc aussi sur l'affiche du site. |
| S3 9 à 13,5 s | Lampe d'inspection, 5 repères, « Mécanique générale / Inspection, diagnostic, réparation. » | 240 px entre le titre et le pneu. **Le secteur éclairé de la lampe dépasse du contour du pneu** : un quartier clair à bord droit déborde sur le sol (`zoom/h11-lampe.png`, `zoom/v12-lampe.png`). |
| S4 13,5 à 18 s | Gros plan du flanc, cercle doré sur le pictogramme hiver, « Pneus / Vente et pose, été comme hiver. » | Propre. |
| S5 18 à 22,5 s | Roue à crampons, « Mécanique récréative / Aussi pour les véhicules récréatifs. » | **4 goujons** (corrigé). 126 px entre « récréative » et la roue. La ligne secondaire répète le titre sans rien ajouter. |
| S6 22,5 à 28,5 s | « On regarde. / On vous explique. / Ensuite, on répare. » en escalier | Bien en 16:9. **En 9:16, les phrases sont coupées : « On vous / explique. » et « Ensuite, on / répare. »** Le « on » doré est séparé de « répare. » (`planche-v-2.png`). |
| S7 28,5 à 34,5 s | Bon de travail opaque, tampon « Prix écrit », promesse et ligne légale | Le papier entre opaque (corrigé). **En 16:9, la ligne légale laisse « Québec. » seul sur la 2e ligne** (mot orphelin). En 9:16, la coupure est correcte. |
| S8 34,5 à 42 s | « Nous trouver / Mécanique SKL / Appelez le 418 663-1195 / adresse / services », plan schématique, mention en bas | Titre à 34,9 s, numéro visible à 35,97 s, donc **6,0 s de CTA**. 225 px entre « SKL » et le plan. **0 pixel vert** sur les 3 versions (`tech/point-vert.txt`). La mention se lit : « Film de démonstration non officiel · images graphiques · coordonnées à confirmer ». |
| Court 0 à 15 s | Accroche à 0,9 s, identité, 3 métiers, « Le prix par écrit, avant de réparer. » (9,0 à 10,5 s), carte finale | Le numéro apparaît à 11,33 s et reste jusqu'à 15 s, soit **3,67 s** (corrigé). La promesse est présente. |

### Vertical 9:16 et lisibilité au téléphone (`tech/marges-vertical.txt`)

- Marge droite de tout texte entre 50 et 90 % de la hauteur : **618 à 1054 px** (minimum demandé : 300 px). Corrigé.
- Bloc de texte entre 56 et 76 % de la hauteur dans toutes les scènes. **Exception : la carte finale (37 et 40 s), dont la mention descend jusqu'à 83,7 %.** Elle entre donc dans les 20 % du bas, où Reels et TikTok affichent le nom du compte et la légende. Elle tient sur 3 lignes : « Film de démonstration non officiel · / images graphiques · coordonnées à / confirmer ». La première ligne finit par un point médian et « confirmer » reste seul (`zoom/v37-mention.png`).
- Simulation à 390 px de large (`planche-telephone-390px.png`) : en 9:16, les titres, le numéro et l'adresse sont nets. Les sous-textes font environ 14 px et la mention environ 10 px par ligne : c'est lisible.
- **Le 16:9 sur téléphone** (le site sert le 720p 16:9 aux téléphones) : la mention fait **4,8 px** de haut et la ligne légale **6,3 px** (`tech/contrastes.txt`). Les deux sont illisibles en mode portrait. Le numéro reste lisible (environ 15 px).
- Contrastes : mention 5,5:1 (16:9) et 6,5:1 (9:16), ligne légale 11:1. C'est conforme. Le problème vient de la taille, pas du contraste.

### Textes et typographie

Aucune faute d'orthographe. Les espaces insécables sont correctes (« 100 $ », « 418 663-1195 »). Les apostrophes typographiques sont utilisées partout (« Ce qu'on », « Main-d'œuvre »). Le nom « Mécanique SKL » est correct partout. Aucun logo dessiné ni généré. Défauts de mise en page relevés : orphelin « Québec. » (S7 16:9), coupure « on / répare. » (S6 9:16), mention sur 3 lignes avec orphelin (S8 9:16).

### Affiches

- L'affiche du site (`webm/skl-film-poster.jpg|.webp`, 1920×1080, 147 Ko et 55 Ko) est tirée de 8,6 s. C'est une bonne image : nom, adresse, roue. Elle est sans tuiles.
- L'affiche produite par le moteur dans `web/mecanique-skl-film-42s-poster.jpg` est l'image d'accroche, sombre et sans message (`zoom/poster-web.png`). Elle n'est pas utilisée par le site, mais elle peut être prise par erreur (P3).

---

## 3. Fond : chaque affirmation contre `projet.json`

| À l'écran | Fait | Statut |
|---|---|---|
| Mécanique SKL | F1 | vérifié |
| Garage à Beauport · 1100, boulevard des Chutes · Beauport (Québec) · G1E 2G1 (flanc) | F2 | vérifié |
| Mécanique générale · Récréative · Pneus · Vente et pose | F3 | vérifié |
| Inspection, diagnostic, réparation | F3 (formulation générique de « mécanique générale ») | acceptable |
| Repères Pneus, Freins, Suspension, Liquides, Électricité | F9 | **hypothèse**, désormais inscrite |
| « été comme hiver » | F10 | **hypothèse**, désormais inscrite |
| On regarde. On vous explique. Ensuite, on répare. | F6 | **hypothèse** |
| Le prix par écrit, avant de réparer · plus de 100 $, votre droit au Québec | F5 | vérifié (OPC, revue v1) |
| Appelez le 418 663-1195 (S8) et « 418 663-1195 » sur le flanc (S2 à S7, affiche) | F4 | **hypothèse** |
| Plan schématique (1, 3 et 10 km, nord) | aucun | décor graphique sans nom de rue, couvert par « images graphiques » |

- **Aucune affirmation inventée hors de `projet.json`.** Les éléments non vérifiés sont tous déclarés comme hypothèses, et le film porte « Film de démonstration non officiel · images graphiques · coordonnées à confirmer ». Pour une maquette de prospection montrée au propriétaire, c'est honnête.
- **Présentation du numéro** : le CTA l'affiche en grand et en jaune. La nuance « coordonnées à confirmer » est en petit gris, au bas de l'écran : illisible au téléphone en 16:9, et sous l'interface des réseaux en 9:16. Le numéro gravé sur le flanc n'a aucune nuance. C'est acceptable pour la démonstration, mais le garage doit confirmer le numéro avant toute diffusion publique.
- **Mention démonstration** : présente dans les 3 versions, dès 36,4 s (16:9 et 9:16) et dès 11,6 s (court). Elle est absente des sous-titres et de l'affiche.
- Le brief vise aussi « demander un rendez-vous depuis le site ». Le film n'en parle toujours pas.

---

## 4. Son (analyse objective, sans écoute) : `son/`

| Mesure | master 16:9 | master 9:16 | master court | web 1080p | web 720p | court 1080p | court 720p | social 9:16 | WebM 1080 | WebM 720 |
|---|---|---|---|---|---|---|---|---|---|---|
| Loudness intégrée | −16,1 | −14,2 | −16,1 | −16,2 | −16,3 | −16,3 | −16,3 | −14,2 | −16,1 | −16,1 |
| LRA (LU) | 3,2 | 3,4 | 2,4 | 3,1 | 3,1 | 2,5 | 2,5 | 3,3 | 3,1 | 3,1 |
| Crête vraie (dBTP), cible ≤ −1,5 | −1,7 | **−1,4** | −1,8 | −2,0 | −1,8 | −1,9 | **−1,2** | −1,6 | **−0,5** | **−0,5** |
| Passe-haut 300 Hz (LUFS) | −19,9 | −18,0 | −19,7 | −20,3 | −20,3 | −20,1 | −20,2 | −18,0 | −20,0 | n. m. |

- Loudness : toutes les cibles sont tenues (−16 pour le web, −14 pour les réseaux, à ±0,3 LU).
- **Crête vraie : 4 fichiers sur 10 dépassent −1,5 dBTP.** Les deux WebM sont à −0,5 dBTP, alors que leur source (`mecanique-skl-film-42s.mp4`) est à −1,4 dBTP. L'encodage Opus ajoute environ 0,9 dB de crête, et la pire crête tombe vers 19,9 s (cliquet de S5). Il n'y a ni saturation ni écrêtage (les crêtes restent sous 0 dBTP). Ce n'est donc pas un « audio défectueux », mais la norme est dépassée sur les fichiers que le site lit en premier. Le moteur laisse passer −1,4 et −1,2 sans avertir : la limite m-9 de la v1 est toujours là.
- Haut-parleur de téléphone (passe-haut 300 Hz) : **écart de 3,8 LU** (v1 : 5,2 LU ; cible : ≤ 3,5). C'est nettement mieux. Par scène (`son/analyse-rythme.txt`) : S1 −10,1 dB (l'impact grave d'ouverture disparaît au téléphone), S2 −5,5, S3 −6,5, S4 −7,0, S5 −6,5, S6 −4,4, S7 −6,8, S8 −1,4.
- Spectre (`son/spectre-h.png`) : le médium entre 300 Hz et 1,4 kHz est désormais présent de bout en bout (harmoniques de basse, nappe, arpèges). Répartition de l'énergie : 20–100 Hz −3,8 dB ; 100–300 Hz −5,4 ; 300 Hz–1 kHz −6,4 ; 1–4 kHz −13,3 ; 4–16 kHz −16,3.
- Synchronisation sur les coupes (pas de 5 ms, à 120 bpm) : **5 coupes sur 7 ont un transitoire exactement sur la coupe** (3,5 ; 13,5 ; 22,5 ; 28,5 ; 34,5 s). À 18,0 s, le transitoire arrive 75 ms avant la coupe. **À 9,0 s (entrée de S3), il n'y a pas d'accent** : l'écart est de +80 ms et la montée de 4,3 dB seulement. Les grosses caisses tombent sur les demi-secondes impaires (3,5 ; 4,5…) et le premier tic de la lampe arrive à 9,49 s. Version courte : 5 coupes sur 6 sont exactes, celle de 1,5 s a +90 ms d'écart.
- Dynamique : le niveau RMS par scène reste à plat de S2 à S8 (−14,3 à −15,6 dBFS), avec un LRA de 3,2 LU. La « pulsation qui monte » prévue au brief ne se mesure pas. La résolution de la carte finale passe par le timbre (accord majeur, cloche), pas par le niveau.
- Documentation : `projet.json` annonce une musique « à 96 bpm », alors que `audio.py` et le montage sont à 120 bpm.

---

## 5. Sous-titres (`sorties/*.vtt|*.srt`, comparés aux images)

| Cue (principal) | Sous-titre | Apparition à l'écran (mesurée ou calculée) | Écart |
|---|---|---|---|
| 1 | 0,40 s « Votre auto, vue de près. » | 0,35 à 0,9 s | bon |
| 2 | 4,20 s identité + adresse | surtitre 4,0 s, titre 4,2 à 5,1 s, adresse 5,3 à 6,0 s | bon |
| 3, 4, 5 | 9,2 / 13,7 / 18,2 s | titres 9,2 / 13,6 / 18,1 s | bon |
| 6 | 22,8 s, les 3 phrases d'un coup | 22,8 / 24,05 / 25,3 s | **le sous-titre montre « Ensuite, on répare. » 2,5 s avant l'écran** |
| 7 | 29,4 s promesse + ligne légale | promesse 29,4 à 30,5 s, ligne légale 30,7 à 31,4 s | ligne légale 1,3 s en avance |
| 8 | 34,9 s « Mécanique SKL » | 34,9 à 35,5 s | bon |
| 9 | 35,7 s CTA | numéro à 35,97 s (`st/apparition-cta.txt`) | 0,27 s d'avance, acceptable |

Version courte : cue 7 à 10,7 s (titre à 10,72 s), cue 8 à 11,2 s (numéro à 11,33 s). Le recalage de la v1 est donc fait. Restent trois manques : l'adresse (cue 2) et les sous-lignes des métiers (cues 3 à 5) ne sont pas transcrites, alors qu'elles sont à l'écran ; la mention de démonstration n'est dans aucun sous-titre ; **`exports/web/mecanique-skl-film-42s.vtt` est vide** (8 octets, « WEBVTT » seul). Le site utilise le bon fichier, mais ce fichier vide est un piège dans le dossier d'exports.

---

## 6. Note détaillée

| Critère | Note | Justification |
|---|---|---|
| Direction artistique et qualité visuelle | **18/20** | Fond propre (plus de quadrillage ni de tuiles, mesuré), titres dégagés en fin de plan, point vert supprimé, bon de travail opaque, palette et typographies tenues, rendu net en 4K natif. −2 : secteur de la lampe qui déborde du pneu (S3), chevauchement transitoire « SKL »/pneu pendant 2 s (S2), orphelin « Québec. » (S7), coupure « on / répare. » en 9:16. |
| Compréhension immédiate du message | **13/15** | Texte d'accroche dès 0,4 s, puis qui, où, quoi, comment et quoi faire, dans l'ordre. −2 : la promesse forte (prix par écrit) n'arrive qu'à 28,5 s dans le film principal, et les trois métiers gardent le même gabarit. |
| Crédibilité et respect de l'identité de marque | **13/15** | Nom et adresse exacts, aucun faux logo, mention complète avec « coordonnées à confirmer », hypothèses toutes déclarées, VTT à 4 goujons. −2 : le numéro (F4), la méthode (F6), les repères (F9) et « été comme hiver » (F10) restent affirmés à l'écran ; le numéro est gravé sur le flanc sans nuance ; la ligne de S5 est creuse. |
| Qualité du montage, du son et du rythme | **12/15** | Coupes franches, 5 sur 7 exactement sur un accent, CTA plus tôt, médium enrichi, pas de clic ni d'écrêtage. −3 : crête au-dessus de la cible sur 4 fichiers (WebM à −0,5 dBTP), aucun accent sur la coupe de 9,0 s, dynamique plate (aucune montée mesurable), perte de 3,8 LU au téléphone et ouverture qui disparaît sur un petit haut-parleur. |
| Efficacité commerciale et appel à l'action | **13/15** | CTA de 6,0 s (principal et vertical) et de 3,7 s (court), numéro en accent, promesse différenciante dans les deux montages. −2 : aucune mention du rendez-vous en ligne (2e action du brief), et un numéro non confirmé. |
| Lisibilité et adaptation mobile | **8/10** | Vrai montage 9:16, marges droites de 618 px ou plus, titres nets à 390 px. −2 : mention du 9:16 dans les 20 % du bas et sur 3 lignes ; sur téléphone, le site sert le 16:9, où mention et ligne légale font 5 à 6 px. |
| Qualité technique et optimisation web | **8/10** | Tous les fichiers sont conformes, sans corruption, avec faststart ; budgets tenus (9,23 Mo en 1080p) ; WebM et affiche présents ; site identique aux exports. −2 : crête du WebM ; dossier d'exports incohérent (VTT vide, affiche d'accroche dans `web/`) ; métadonnées « aucune mise à l'échelle » sur les fichiers réduits ; `projet.json` pas à jour (96 bpm, `version: 2`, `fichiers_produits` et `mesure` vides). |
| **Total** | **85/100** | Seuil de 90 non atteint. Aucun défaut critique avéré. |

---

## 7. Défauts classés

### Critiques

**Aucun avéré.** Pas de fausse information démontrée, pas de logo incorrect, pas de scène absurde, pas d'audio défectueux (aucun écrêtage), pas de coordonnée prouvée fausse, pas d'export corrompu.

### P1 (bloquant)

**C-0 Numéro non confirmé (F4)**. Il bloque toute diffusion hors du rendez-vous de démonstration.
- Problème : « Appelez le 418 663-1195 » (S8, court) et « 418 663-1195 » sur le flanc (S2 à S7, affiche du site). F4 est au statut « hypothèse », et un second numéro circule (581 982-1195).
- Impact : si le numéro est faux, le défaut devient critique et l'appel à l'action appelle quelqu'un d'autre.
- Correction : faire confirmer le numéro par le garage. Avant cette confirmation, ne publier aucune version sur les réseaux et ne pas envoyer la version courte à d'autres destinataires que le garage.
- Vérification : F4 passe à « vérifié » (source et date) et `valider` ne lève plus la réserve « coordonnées du CTA non vérifiées ». Si le numéro change, refaire le rendu de S2 à S8, du flanc et de l'affiche.

Aucun autre P1 pour l'usage prévu (démonstration au propriétaire).

### P2

**P2-1 Crête vraie au-dessus de −1,5 dBTP (WebM −0,5, vertical 4K −1,4, court 720p −1,2)**
- Impact : la norme de diffusion est dépassée, avec un risque de légère distorsion sur certains décodeurs. Or les WebM sont les fichiers lus en premier par Chrome et Firefox.
- Correction : produire un mixage maître limité à −2,5 dBTP avant tout encodage avec perte (par exemple `loudnorm=I=-16:TP=-2.5`, ou `alimiter` suréchantillonné), réencoder l'Opus depuis ce mixage et non depuis l'AAC, puis remesurer chaque fichier final.
- Vérification : `ebur128=peak=true` à −1,5 dBTP ou moins sur les 10 fichiers, loudness à ±0,5 LU de la cible, et `controler` sans avertissement.

**P2-2 Mention du 9:16 dans les 20 % du bas, sur 3 lignes avec un orphelin**
- Impact : la nuance « coordonnées à confirmer » et la mention de démonstration sont masquées par l'interface des réseaux.
- Correction : en 9:16, monter le bloc (ou réduire l'écart de 60 px sous les services, ou placer la mention sous le plan) et la composer sur 2 lignes équilibrées, par exemple « Film de démonstration non officiel » / « Images graphiques · coordonnées à confirmer ». Le bas du texte doit rester à 78 % de la hauteur au plus.
- Vérification : la mesure du bas du texte à 37 et 40 s donne 78 % ou moins, sans orphelin.

**P2-3 Coupure de la phrase clé en 9:16 (S6)**
- Impact : « Ensuite, on / répare. » sépare l'accent doré de son verbe et casse le rythme du manifeste.
- Correction : en 9:16, ramener `.man` à environ 80 px, ou imposer les lignes « On regarde. / On vous explique. / Ensuite, / on répare. » avec « on répare. » en `white-space: nowrap`.
- Vérification : image à 26,5 s en 9:16 : aucune ligne ne coupe un groupe, et la marge droite reste de 300 px ou plus.

**P2-4 Le 16:9 servi aux téléphones rend illisibles la mention et la ligne légale**
- Impact : en mode portrait (390 px), la mention fait 4,8 px et « Pour une réparation de plus de 100 $… » fait 6,3 px. La preuve légale et la nuance ne passent pas.
- Correction : sur téléphone en mode portrait, servir le montage vertical (le 1080×1920 existe déjà, ou le 720×1280 à créer) ; sinon, en 16:9, agrandir la ligne légale (30 à 40 px CSS) et doubler la mention sous le lecteur, dans la page.
- Vérification : simulation à 390 px : mention et ligne légale à 9 px ou plus.

**P2-5 Dossier d'exports et documentation incohérents**
- Problème : `exports/web/mecanique-skl-film-42s.vtt` est vide ; `exports/web/…-poster.jpg` montre l'image d'accroche (sombre) et non l'affiche du site ; les 1080p et 720p disent « aucune mise à l'échelle » ; `projet.json` dit 96 bpm, `version: 2`, avec `fichiers_produits` et `mesure` vides ; `integration-et-exploitation.md` renvoie à un `rapport-final.md` absent et donne des noms de fichiers qui n'existent pas (`skl-film-1080.mp4` dans les exports, `…-vertical-1080x1920.mp4`).
- Impact : un fichier faux (sous-titres vides, mauvaise affiche) peut être livré ou mis en ligne par erreur.
- Correction : copier le VTT principal dans `web/` et le VTT court dans `web-court/` ; remplacer l'affiche de `web/` par celle de 8,6 s ; corriger le commentaire des fichiers réduits (« Réduit depuis le master 4K natif ») ; mettre `projet.json` à jour (120 bpm, version 3, fichiers produits avec les mesures réelles de ce rapport) ; aligner les noms de fichiers dans la doc.
- Vérification : la taille des VTT est supérieure à 900 octets, les MD5 des affiches sont identiques à ceux du site, et `valider` passe.

**P2-6 Rendez-vous en ligne absent**
- Impact : la 2e action visée par le brief n'est pas suggérée.
- Correction : ajouter sous l'adresse de la carte finale « ou demandez un rendez-vous sur le site » (Instrument 34 px, sans nouveau fait à vérifier).
- Vérification : image de la carte finale, sans collision et avec le bas du texte à 78 % ou moins en 9:16.

### P3 (finition)

- **P3-1 Lampe de S3 qui déborde du pneu** : le secteur éclairé dépasse le contour, avec un bord droit dur. Correction : `#lamp { inset: 2% }` ou un masque circulaire égal au rayon du pneu, et un bord adouci (dégradé de 4° au lieu de 0°). Vérification : contraste ×4 à 11 s, aucun pixel éclairé hors du pneu.
- **P3-2 Chevauchement « SKL »/pneu pendant le recul (4,2 à 6,2 s)** : démarrer la roue plus à droite (`cx` initial + 6 % de W), ou retarder le titre à la fin du recul. Vérification : images à 4,6 et 5,5 s.
- **P3-3 Orphelin « Québec. » (S7 16:9)** : `maxWidth` de 820 à 900 px, ou « au&nbsp;Québec ».
- **P3-4 Aucun accent sur la coupe de 9,0 s** : ajouter un tic ou un cliquet à 9,0 s (début de S3). Vérification : transitoire de plus de 6 dB à ±20 ms.
- **P3-5 Dynamique plate et ouverture perdue au téléphone** : faire monter le niveau ou la densité de S3 à S6 (+1,5 à +2 dB), ajouter une couche médium (300 Hz à 2 kHz) à l'impact d'ouverture. Vérification : écart au passe-haut de 3,5 LU ou moins, et S1 à −6 dB ou mieux.
- **P3-6 Sous-titres** : séparer les cues 6 et 7 au rythme de l'écran (22,8 / 24,05 / 25,3 s ; 29,4 / 30,7 s), ajouter l'adresse et les sous-lignes dans la version courte, ajouter la mention en fin de fichier.
- **P3-7 Ligne de S5 qui répète le titre** (« Aussi pour les véhicules récréatifs. ») : la remplacer par un bénéfice qui n'ajoute aucun fait non vérifié, ou la retirer.
- **P3-8 Images clés espacées jusqu'à 8,3 s dans le 1080p web** : `-g 60` (une image clé toutes les 2 s) pour une recherche fluide dans le lecteur.
- **P3-9 Moteur trop laxiste sur la crête** (déjà signalé en v1, m-9) : −1,4 et −1,2 dBTP passent sans avertissement. À signaler au responsable de la compétence.

---

## 8. Comparaison avec la v1

| Défaut v1 | État en v3 | Preuve |
|---|---|---|
| C-0 numéro non confirmé | **Partiel** : « coordonnées à confirmer » ajouté à la mention, numéro toujours non confirmé et sans nuance sur le flanc | images 36,5 et 38,5 s, F4 |
| M-1 quadrillage du fond (et tuiles de la v2) | **Corrigé** | contraste ×5, mesure des raccords v2 contre v3 |
| M-2 textes sur les objets | **Corrigé en fin de plan** (126 à 240 px), reste un chevauchement transitoire en S2 | `zoom/s2-collision.png` |
| M-3 marges du 9:16 | **Corrigé** (618 px ou plus) | `tech/marges-vertical.txt` |
| M-4 CTA court | **Corrigé** (3,67 s, 15 s, promesse ajoutée) | `st/apparition-cta.txt` |
| M-5 faits non vérifiés | **Corrigé dans le dossier** (F9 et F10 inscrits), toujours affirmés à l'écran (normal pour une démonstration) | `projet.json`, `valider` |
| M-6 accroche lente | **Corrigé** (texte dès 0,4 s) | images 0,5 à 1,5 s |
| M-7 encodages web et affiche | **Corrigé** (9,23 Mo, 720p, WebM, affiche) ; dossier à nettoyer (P2-5) | `tech/controler.txt` |
| m-1 point vert | **Corrigé** (0 pixel) | `tech/point-vert.txt` |
| m-2 crête vraie | **Partiel** : 6 fichiers sur 10 conformes, WebM −0,5 dBTP | `son/ebur128.txt` |
| m-3 médium pauvre | **Amélioré** : 5,2 → 3,8 LU | `son/` |
| m-4 sous-titres en avance | **Corrigé pour le CTA** ; cues 6 et 7 en avance sur l'écran | section 5 |
| m-5 bon de travail transparent | **Corrigé** | image à 28,8 s |
| m-6 moyeu à 3 goujons | **Corrigé** (4) | image à 20 s |
| m-7 écran vide en S8 | **Corrigé** (titre à 34,9 s, CTA de 6,0 s) | images 34,9 à 36,5 s |
| m-8 mention illisible | **Partiel** : agrandie et complétée ; illisible au téléphone en 16:9, mal placée en 9:16 | `tech/contrastes.txt` |
| m-9 moteur laxiste | **Inchangé** | `tech/controler.txt` |
| m-10 image stéréo | non remesurée | |

Progression : **74 → 85/100** (DA +3, compréhension +1, crédibilité +2, montage et son +1, commercial +2, mobile +1, technique +1).

Projection : si les P2 sont corrigés, on obtient environ 19 + 13 + 13 + 13 + 14 + 9 + 9,5 = **90 à 91/100**. Corriger aussi P3-1, P3-2 et P3-5 donne une marge. La confirmation du numéro (C-0) reste nécessaire avant toute diffusion publique, quelle que soit la note.

---

## 9. Ce qui n'a pas pu être vérifié

- **Écoute réelle** : musicalité, justesse des effets, confort d'écoute et rendu sur un vrai téléphone. Tout ce qui est dit du son vient de mesures (loudness, spectre, transitoires, passe-haut).
- **Fluidité du mouvement** : seules des images fixes ont été vues (plus de 60). Saccades et vitesse de lecture restent à juger en lecture réelle.
- **Lecture dans le site** : je n'ai pas testé le lecteur en navigateur (chargement au clic, choix WebM/MP4, sous-titres). J'ai seulement constaté que les fichiers du site sont identiques aux exports et que le VTT du site est le bon.
- **Interface réelle des réseaux** : zones estimées (300 px à droite, 20 % en bas).
- **Numéro de téléphone** et **texte officiel de la LPC** : non vérifiables depuis ce poste (même limite qu'en v1).
