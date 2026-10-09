# Garage Jean-Yves Deschênes : direction artistique (MOI 2.0)

9 octobre 2026. Maquette de démarchage (mode 11), même cadre que Mécanique SKL, univers visuel entièrement différent.

## 1. Triage

| Point | Décision |
|---|---|
| Mode | 11, maquette de démarchage (+ 1, création : aucun site trouvé) |
| Niveau fonctionnel | Vitrine interactive : appel, rendez-vous (formulaire de démonstration), voyants, FAQ |
| Immersion | 2,5 : premium rassurant, deux moments signature (vue éclatée, voyants) |
| Action n° 1 | Appeler le 418 661-2102 |
| Sources | Annuaires publics seulement (les pages elles-mêmes ne s'ouvrent pas depuis l'environnement ; données lues dans les résultats de recherche) |

Phrase de la porte A : **un garage de mécanique générale toutes marques à Beauport, tenu par son propriétaire, pour les automobilistes du quartier qui veulent un mécanicien honnête moins cher que le concessionnaire ; on veut qu'ils appellent.**

## 2. Registre des faits

| Information | Source(s) | Fiabilité |
|---|---|---|
| Adresse : 228A, 105e Rue, Québec (Beauport) G1C 3A8 | AccesGo ; « 228, 105e rue » chez Otobox, VyMaps | **Contradictoire (228 ou 228A)** : affiché 228A, à confirmer |
| Téléphone : 418 661-2102 | Otobox, Loc8NearMe, annuaires | Confirmé par plusieurs sources |
| Nom : « Garage Jean-Yves Deschenes », « Garage J-Y Deschenes » (Facebook), « Garage JY Deschene » (PagesJaunes), « Garage Jean Yves Deschênes Mécanique Générale » | Annuaires, Facebook, registre | **Quatre graphies** : argument de vente |
| Registre des entreprises : « Garage J.Y. Deschenes », immatriculé le 31 août 2018, adresse au 633, route 138, Saint-Tite-des-Caps (code 6351, mécanique automobile) | OpenGov (REQ) | Une source ; adresse du registre différente de l'atelier |
| Heures : lun.-ven. 8 h-17 h 30, fermé la fin de semaine | Otobox | **Contradictoire** : 8 h 30-17 h (Loc8NearMe), mercredi 8 h (Nicelocal), samedi 8 h-12 h (VyMaps) |
| « Mécanique générale et entretien toutes marques, à prix moindre que votre concessionnaire » | Facebook (environ 154 mentions J'aime) | Une source (la description du garage) |
| Équipé pour l'injection, le diagnostic électronique, l'électricité automobile ; freins, silencieux, suspension, climatisation ; entretien selon le plan du fabricant | AccesGo | Une source |
| Antirouille, pare-brise, démarreurs à distance, remorquage | AccesGo (pages de catégories) | Une source, non affichés comme services sûrs |
| Vente de pneus en ligne et prise de rendez-vous | Otobox | Une source |
| Avis : propriétaire qui prend le temps de trouver la meilleure option ; ne change pas de pièces inutilement ; prix raisonnables (un avis négatif en 2013) | PagesJaunes (4 avis), Loc8NearMe | Résumés, pas de citations exactes : **aucun avis cité** |
| Changement d'huile à partir de 54,99 $ | Nicelocal | Ancien, non affiché |
| Site web | Aucun trouvé | Manquant |

## 3. Brief de direction artistique

- **Concept : « Le manuel d'atelier ».** Le site se lit comme la page d'un manuel de réparation bien tenu : papier crème quadrillé, dessins techniques au trait, figures numérotées, chapitres. Il dit sans le dire : ici on sait exactement ce qu'on fait, et on vous l'explique.
- **Le détail qui n'appartient qu'à lui :** Deschênes, c'est « des chênes ». L'emblème est une feuille de chêne dont la nervure centrale est une clé mixte.
- **Archétype :** le sage artisan (honnête, posé, précis), pas le héros.
- **Différences voulues avec Mécanique SKL :** fond clair au lieu d'asphalte sombre ; vert bouteille et orange rouille au lieu du jaune signalisation ; empattement (Fraunces) au lieu de la linéale étroite ; angles droits et filets fins au lieu des capsules ; aucune roue, aucun décor fixe ; la page défile comme un document, la figure s'éclate au lieu de tourner.
- **Palette :** papier `#F3EEE3`, papier 2 `#E9E1D0`, encre `#17241D`, vert chêne `#1F4A38`, vert nuit `#10241B`, rouille `#B0461A` (texte) / `#C4521D` (aplats), ambre voyant `#E3A21A`, rouge voyant `#D93A2B`.
- **Typographies (OFL, hébergées) :** Fraunces variable (titres, chiffres de chapitres, italiques d'accent) ; Public Sans variable (texte, étiquettes en capitales espacées).
- **Composition :** colonne de texte + marge de notes, comme un manuel. Quadrillage de 24 px à peine visible. Filets de 1 px.
- **Iconographie :** trait de 1,6 px, extrémités arrondies, symboles normalisés pour les voyants.
- **Boutons :** rectangles nets, rayon 3 px ; principal rouille plein, secondaire au trait.

## 4. Plan média

| Section | Média | Source | Remarque |
|---|---|---|---|
| Accueil | Fig. 1 : frein à disque en vue éclatée (moyeu, disque, plaquettes, étrier, écrou) | Dessin SVG codé | Aucune photo inventée des locaux |
| Principe | Feuille de chêne en filigrane | SVG | |
| Voyants | 7 symboles normalisés | SVG codé | Information générale |
| Le reste | Typographie, filets, quadrillage | CSS | Photos de l'atelier à obtenir |

## 5. Storyboard

| Section | Fonction | Média | Mouvement | CTA |
|---|---|---|---|---|
| Accueil | Promesse : le propriétaire explique avant de réparer | Fig. 1 | La figure s'éclate au chargement, puis les pièces s'écartent légèrement au défilement | Appeler · Rendez-vous |
| Le principe | Différence (tirée des avis publics) | Feuille de chêne | Lignes qui montent | |
| Table des matières | Offre (7 chapitres, symptômes) | Numéros | Ouverture en accordéon | Préremplit le formulaire |
| Un voyant s'allume ? | Moment signature, utilité réelle | Tableau de bord | Le voyant s'allume, la fiche répond | « Décrire mon voyant » |
| Pourquoi un garage de quartier | Différence vs concessionnaire | | Apparitions | |
| Vos droits | Réassurance légale | Encadré « Note » | | |
| Procédure | Expérience en 3 temps | Numéros | Trait qui se dessine | |
| Ce que disent les clients | Preuve (résumés, sans citation inventée) | | | |
| Avant le 1er décembre | Urgence réelle (loi) | Liste à cocher | Coches | Rendez-vous |
| Rendez-vous | Action | Formulaire de démonstration | | Appeler |
| Nous trouver | Adresse, heures, FAQ | | | Itinéraire |
