# REPRISE : où en est le site de Mécanique SKL

Dernière mise à jour : 8 octobre 2026. À lire en premier dans toute nouvelle session.

## Contexte

- Client visé : **Mécanique SKL**, 1100, boul. des Chutes, Beauport (Québec) G1E 2G1. Le dépôt s'appelle « SLK » par erreur de frappe ; le garage s'écrit **SKL** partout (Facebook, NAPA, Nokian, Otobox).
- Compétences utilisées : MOI 2.0 (direction, conformité, QA) et 10K Websites (accueil épinglé au défilement, standard technique).
- Statut : **maquette de démarchage** (mode 11), à contenu en partie fictif, assumé et signalé. Bandeau « Maquette · pas le site officiel · contenu en partie fictif » sur toutes les pages, `noindex`, `robots.txt` bloquant, mention complète dans le pied de page. À retirer seulement avec l'accord écrit du garage.
- Éléments fictifs, tous étiquetés sur la page : logo (dessiné pour la maquette, fichiers dans `site/assets/img/`), trois avis en « bons de travail », exemples récréatifs (VTT, motoneige, côte-à-côte). Le formulaire n'envoie rien (message de démonstration).
- Les deux numéros trouvés en ligne (418 663-1195 et 581 982-1195) sont affichés côte à côte avec une note « à confirmer ».
- Animations sur téléphone : l'accueil épinglé (descente vers la roue, textes, poussière) tourne aussi sur mobile et tablette. Seule la réduction des animations demandée par l'appareil donne l'accueil fixe. La future vidéo, elle, ne se chargera que sur grand écran.
- Le fichier REPRISE.md d'origine n'a jamais été reçu : ce dossier a été reconstruit à partir de la recherche publique et de l'exemple Mécanique SKL documenté dans MOI 2.0.

## Ce qui est fait

- `site/` : site statique complet, sans dépendance ni étape de compilation.
  - `index.html` : accueil épinglé (la caméra descend vers la roue), statut ouvert/fermé en direct (heure de Québec), services, inspection à maintenir (moment interactif), pneus d'hiver avec compte à rebours réel, vos droits (LPC), rendez-vous (prépare un courriel, aucun tiers), adresse, heures, FAQ.
  - `confidentialite.html` (Loi 25) et `accessibilite.html`.
  - Polices hébergées sur le site (Archivo, Instrument Sans, IBM Plex Mono ; licence OFL).
- `projet/direction-artistique.md` : triage, registre des faits, brief DA, tokens, plan média, storyboard, band map.
- `projet/prompts-higgsfield.md` : prompts image et vidéo prêts, coûts vérifiés.

## Tests passés (8 octobre 2026)

- Aucun débordement horizontal de 320 à 1920 px ; aucune erreur console ; aucun domaine tiers contacté au chargement.
- Défilement rapide (crans de 120, 240 et 360 px) : chaque texte de l'accueil reste lisible 6 à 9 crans normaux, aucun ne saute.
- Inspection : redescend en douceur si on relâche, se termine après environ 2,6 s, fonctionne au clavier.
- Réduction des animations, activée puis désactivée en direct : accueil fixe, puis retour au défilement.
- Tablette portrait → paysage : bascule correcte entre accueil fixe et accueil épinglé.
- Contrastes : textes ≥ 4,8:1.
- Porte de texte : zéro tiret cadratin, zéro mot creux.

## Bloquant

- **Higgsfield** : le compte est au forfait gratuit et refuse toute génération (« Requires basic plan or higher »). La vidéo d'accueil est prête à être générée dès qu'un forfait (ou l'essai de 3 jours) est actif : voir `projet/prompts-higgsfield.md`, puis renseigner `HERO_VIDEO` dans `site/assets/js/main.js`.

## Éléments à obtenir du garage (par impact)

1. **Photos de l'atelier** (3 ou 4 plans larges + détails, mains au travail) : c'est ce qui fera passer le site de beau à crédible.
2. **Le bon numéro** : 418 663-1195 partout, sauf NAPA qui affiche 581 982-1195.
3. **Heures confirmées** : une seule source (lun.-jeu. 8 h-17 h, ven. 8 h-12 h).
4. **Logo officiel** : le logo actuel a été dessiné pour la maquette (`logo-skl-sombre.svg`, `logo-skl-clair.svg`, `logo-skl-symbole.svg`).
5. **Nom légal**, responsable des renseignements personnels, et liste précise des services récréatifs (VTT, motoneige, VR ?).

## Pour publier

1. Retirer le bandeau `.demo-banner`, les étiquettes `.tag-fictif`, les avis fictifs, la mention « Maquette non officielle » du pied de page, la balise `noindex`, et remplacer `robots.txt` (seulement avec l'accord du garage). Brancher le formulaire (commentaire `MAQUETTE` dans `main.js`) et garder un seul numéro.
2. Remplacer `example.com` aux endroits marqués `DEPLOY STEP` (index.html, sitemap.xml).
3. Compresser le **contenu** de `site/` (pas le dossier) et le déployer (Hostinger selon 10K Websites).
