# Rapport final : film publicitaire Mécanique SKL

14 octobre 2026 · Administrateur 2.0 avec Vidéo 4K 2.0 · pour Leonel Djikeleng (Leonel Djikeleng Solutions)

**Statut : Contrôlé.** Les fichiers ci-dessous ont été réellement exportés, contrôlés par le moteur et revus par un réviseur indépendant (90/100, aucun défaut critique).
Usage autorisé aujourd'hui : **démonstration au propriétaire du garage.** Aucune diffusion publique tant que le garage n'a pas confirmé son numéro.

---

## A. Informations confirmées utilisées

| Fait | Statut | Où il apparaît |
|---|---|---|
| F1 · Le garage s'appelle Mécanique SKL | vérifié | partout |
| F2 · 1100, boulevard des Chutes, Beauport (Québec) G1E 2G1 | vérifié | S2, flanc du pneu, carte finale |
| F3 · Mécanique générale, mécanique récréative, vente et pose de pneus | vérifié (Facebook, annuaires) | S3, S4, S5 |
| F5 · Évaluation écrite avant une réparation de plus de 100 $ (Loi sur la protection du consommateur) | vérifié (Office de la protection du consommateur, 9 oct. 2026) | S7 |

Utilisé, mais **non confirmé** (hypothèses, signalées à l'écran par « coordonnées à confirmer » et dans la mention de démonstration) :
- F4 · téléphone 418 663-1195 (un autre numéro, 581 982-1195, circule chez NAPA) ;
- F6 · « On regarde. On vous explique. Ensuite, on répare. » (positionnement de la maquette) ;
- F9 · les 5 points d'inspection ;
- F10 · pneus « été comme hiver ».

Non utilisé, car **à fournir** : F7 logo officiel (le nom est composé en typographie, aucun logo n'a été dessiné ni généré) et F8 vraies images de l'atelier.

## B. Concept retenu et raisons

**« Votre auto, vue de près. »** Le film part de l'objet signature de la maquette, la roue dont le flanc porte l'adresse du garage. La caméra recule, puis la roue sert de fil conducteur à travers les trois métiers, la façon de travailler et la promesse du prix écrit. Le film se termine sur l'appel à l'action et un plan schématique.

Pourquoi ce choix :
- **Rien de faux.** Sans images réelles du garage, un film généré par IA aurait montré un faux atelier et de faux mécaniciens. Un film graphique ne montre que des faits vérifiés et le dit clairement.
- **Même marque que le site.** On retrouve la même roue, le même doré, les mêmes polices. Le visiteur reconnaît l'univers.
- **L'argument qui rassure.** La peur principale du client cible est de payer une réparation qu'il ne comprend pas. Le film y répond par un fait légal vérifiable : le prix par écrit, avant de réparer.
- **Rythme.** La musique originale est à 120 bpm et chaque coupe tombe sur un temps. Le film n'a pas de voix : il se comprend sans le son, et des sous-titres sont fournis.

Structure (42 s) : accroche 0 à 3,5 s · identité 3,5 à 9 s · trois métiers 9 à 22,5 s · méthode 22,5 à 28,5 s · promesse 28,5 à 34,5 s · appel à l'action 34,5 à 42 s (numéro visible pendant 6 s).

## C. Compétences et outils réellement utilisés

- **Administrateur 2.0** : audit du contexte, coordination, décision d'intégration, trois revues critiques indépendantes.
- **Vidéo 4K 2.0** : `projet.json` (faits et statuts), `valider`, `exporter` (masters 4K et version réseaux), `controler` (tous les fichiers).
- **Rendu** : page HTML/SVG animée par une fonction du temps, capturée image par image en 3840×2160 par Chromium sans écran (Playwright), puis encodée par FFmpeg.
- **Son** : musique et effets composés par code (Python, numpy), normalisés selon EBU R128 (−16 LUFS pour le web, −14 pour les réseaux).
- **Encodage** : x264 (H.264), libvpx-vp9 (WebM), AAC, Opus.
- **Dépenses : 0 $.** Aucune génération payante, aucun crédit, aucun abonnement, aucune licence achetée (polices libres SIL OFL, musique originale).

## D. Fichiers produits

Dossier des exports (session Claude) : `scratchpad/film/exports/`. Lecteur du site : `site/assets/video/` (branche `film`). Les masters 4K, trop lourds pour Git (plus de 100 Mo), restent dans le dossier des exports.

| Fichier | Format | Dimensions | Durée | Poids | Pixels |
|---|---|---|---|---|---|
| `master/mecanique-skl-film-42s-4k.mp4` | H.264 + AAC | 3840×2160 | 42,0 s | 104,2 Mo | 4K natif |
| `master/mecanique-skl-film-42s-vertical-4k.mp4` | H.264 + AAC | 2160×3840 | 42,0 s | 113,7 Mo | 4K natif |
| `master/mecanique-skl-film-15s-4k.mp4` | H.264 + AAC | 3840×2160 | 15,0 s | 54,3 Mo | 4K natif |
| `web/mecanique-skl-film-42s-1080p.mp4` | H.264 + AAC | 1920×1080 | 42,0 s | 9,25 Mo | réduit du 4K |
| `web/mecanique-skl-film-42s-720p.mp4` | H.264 + AAC | 1280×720 | 42,0 s | 4,05 Mo | réduit du 4K |
| `web/mecanique-skl-film-42s-vertical-720x1280.mp4` | H.264 + AAC | 720×1280 | 42,0 s | 4,25 Mo | réduit du 4K |
| `web-court/mecanique-skl-film-15s-1080p.mp4` | H.264 + AAC | 1920×1080 | 15,0 s | 3,33 Mo | réduit du 4K |
| `web-court/mecanique-skl-film-15s-720p.mp4` | H.264 + AAC | 1280×720 | 15,0 s | 1,48 Mo | réduit du 4K |
| `social/mecanique-skl-film-42s-vertical-social-916.mp4` | H.264 + AAC, −14 LUFS | 1080×1920 | 42,0 s | 20,7 Mo | réduit du 4K |
| `site/skl-film-{1080,720,v720}.webm` | VP9 + Opus | 1920×1080 · 1280×720 · 720×1280 | 42,0 s | 8,46 · 3,04 · 3,24 Mo | réduit du 4K |
| `site/skl-film-{1080,720,v720}.mp4` | H.264 + AAC | idem | 42,0 s | 9,25 · 4,05 · 4,25 Mo | réduit du 4K |
| Affiches `skl-film-poster.jpg / .webp`, `skl-film-v-poster.jpg`, affiche du court | JPEG, WebP | 1920×1080, 1080×1920 | | 147 · 55 · 99 Ko | |
| Sous-titres `.fr.vtt` (site) et `.fr.srt` (réseaux), 42 s et 15 s | texte | | | | |

Toutes les vidéos sont à 30 images/s, en faststart. Les encodages web (`web/`, `web-court/`, `site/`) ont une image clé toutes les 2 s.

Sources (dépôt, branche `film`) : `projet/film/projet.json`, `render/` (page du film, scripts de rendu, de musique et de mixage), `sorties/` (sous-titres), revues `revue-v1.md`, `revue-v3.md`, `revue-v4.md`, et `integration-et-exploitation.md` (code et placement).

## E. Score qualité (revue indépendante sur les fichiers exportés)

| Critère | v1 | v3 | **v4** |
|---|---|---|---|
| Direction artistique et qualité visuelle (/20) | | 18 | **19** |
| Compréhension immédiate du message (/15) | | 13 | **13** |
| Crédibilité et identité de marque (/15) | | 13 | **13** |
| Montage, son et rythme (/15) | | 12 | **13** |
| Efficacité commerciale et appel à l'action (/15) | | 13 | **14** |
| Lisibilité et adaptation mobile (/10) | | 8 | **9** |
| Technique et optimisation web (/10) | | 8 | **9** |
| **Total** | **74** | **85** | **90** |

Aucun défaut critique avéré. Principales corrections entre les versions :
- fond sans quadrillage ni tuiles ;
- titres dégagés de la roue ;
- marges et mention du 9:16 hors de l'interface des réseaux ;
- appel à l'action de 6 s (3,7 s dans le court) ;
- crête vraie ≤ −1,6 dBTP partout ;
- ligne « rendez-vous » ajoutée ;
- sous-titres calés sur l'image ;
- version verticale servie aux téléphones.

Détail et preuves : `revue-v4.md`.

## F. Décision d'intégration web

**Retenu : B + D + E.**
- **B** : une section « Le film » placée après les repères de confiance et avant les services, avec un lecteur chargé au toucher.
- **D** : le fichier 1080p partageable par lien.
- **E** : les masters 4K et la version verticale pour le rendez-vous avec le propriétaire.

**Écartés :**
- **A**, le film au centre de l'accueil : il cacherait la roue animée et le bouton « Appeler », et ajouterait 8 à 10 Mo au chargement.
- **C**, le bandeau en lecture automatique : il ferait double emploi avec la roue, et un film qui se lit par ses textes doit partir du début.

Le lecteur charge les fichiers selon l'écran :
- **ordinateur** : WebM 1080p ;
- **téléphone tenu en portrait** : montage vertical 720×1280, où les textes restent lisibles ;
- **téléphone en paysage ou économie de données** : 720p.

Le MP4 sert de repli quand le WebM ne peut pas être lu. Aucun octet vidéo n'est chargé avant le geste et aucun service tiers n'est appelé (Loi 25). Les sous-titres et la transcription sont dans la page. Le détail et le tableau de notation sont dans `integration-et-exploitation.md`.

## G. Tests réalisés et résultats

| Test | Résultat |
|---|---|
| `controler` sur les 12 vidéos (résolution, ratio, durée, budget, loudness, 4K natif) | 12/12 CONFORME |
| Crête vraie (ebur128) | de −1,6 à −3,0 dBTP (cible ≤ −1,5) |
| Décodage complet, faststart, images noires ou corrompues | aucun défaut (réviseur) |
| Contrôle visuel : 59 images, contraste ×5, simulation de téléphone à 390 et 844 px | aucun défaut bloquant |
| Faits à l'écran comparés à `projet.json` | aucune affirmation inventée ; hypothèses nuancées à l'écran |
| Site, Chromium (ordinateur, téléphone portrait, paysage, réduction des animations) | 0 octet vidéo avant le clic, 0 requête tierce, 0 débordement, lecture, sous-titres chargés, pause hors écran |
| Site, WebM bloqué | le MP4 est bien choisi |
| `valider projet.json` | « prêt pour la préparation », avec réserves : F4, F6, F9, F10 en hypothèse, logo non fourni |

## H. Limites restantes

1. **Le numéro 418 663-1195 n'est pas confirmé.** Il bloque toute diffusion publique. S'il change, il faut refaire le rendu du flanc du pneu, de la carte finale et des affiches (moins d'une heure, sans coût).
2. **Pas de logo officiel ni de vraies images de l'atelier.** C'est un film graphique de démonstration, annoncé comme tel.
3. **Lecture MP4 non vérifiée sur Safari ou un iPhone.** Le navigateur de test ne lit pas le H.264. Il faut un essai sur un vrai iPhone avant la mise en ligne.
4. **Son sur un haut-parleur de téléphone (finition).** Le niveau perd 3,9 LU sous 300 Hz (cible : 3,5) et l'impact d'ouverture perd 9 dB. Le film reste compréhensible sans le son.
5. **« Demandez un rendez-vous sur le site »** n'a pas d'adresse web : il faudra l'ajouter quand le domaine sera choisi.
6. **La branche `film` n'est pas publiée.** La maquette en ligne ne montre pas encore la section « Le film ».

## I. Trois améliorations prioritaires pour la valeur commerciale

1. **Confirmer le numéro et obtenir le logo** auprès du garage, puis refaire le rendu. Le film devient diffusable sur le site et les réseaux, sans changer le montage.
2. **Tourner une demi-journée de vrais plans d'atelier** au téléphone 4K, avec l'accord écrit des personnes filmées, et les insérer dans le même montage. De vrais visages et de vrais outils sont la preuve de confiance la plus forte. C'est une option à proposer au garage.
3. **Mesurer après la mise en ligne**, sans témoin avant consentement, avec quatre événements : film lancé, film vu jusqu'à la carte finale, appel après le film, demande de rendez-vous. Ces mesures permettront ensuite de tester une autre accroche ou une version de 15 s.

## J. Prochaine action recommandée pour Mécanique SKL

Au rendez-vous, montrer d'abord la maquette sur le téléphone, puis le film vertical de 42 s. Demander ensuite trois choses :
- le bon numéro de téléphone ;
- le logo officiel ;
- l'accord pour publier.

S'il n'y a pas d'intérêt, le film et la maquette sont supprimés dans les 7 jours, avec une confirmation écrite.
