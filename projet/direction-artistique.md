# Mécanique SKL : dossier de direction (MOI 2.0 + 10K Websites)

Version du 8 octobre 2026. Ce document est l'entrée de la construction : les textes marqués « verbatim » sont repris tels quels dans le site.

## 0. Triage

| Point | Décision |
|---|---|
| Modes | 2 (refonte premium) + 11 (maquette de démarchage, tant que le client n'a pas validé) |
| Niveau fonctionnel | Vitrine interactive : statut ouvert/fermé, demande de rendez-vous par courriel, FAQ |
| Immersion | 2 → 3 sur ordinateur (accueil épinglé au défilement), 2 sur téléphone (accueil fixe composé) |
| Action n° 1 | Appeler le garage. Action n° 2 : demander un rendez-vous |
| Contraintes | Higgsfield connecté mais bloqué sur le forfait gratuit (aucune génération possible). Facebook, NAPA, Otobox et Nokian bloqués par le réseau : faits tirés des extraits de recherche |

Porte A : **Mécanique SKL, garage de mécanique générale, récréative et de pneus au 1100, boul. des Chutes à Beauport, pour les automobilistes du secteur qui veulent un mécanicien proche et franc ; on veut qu'ils appellent.**

## 1. Registre des faits

| Information | Valeur retenue | Sources | Fiabilité |
|---|---|---|---|
| Nom | Mécanique SKL | Facebook, Otobox, NAPA, Nokian, Tripadvisor | Confirmée |
| Nom légal (NEQ) | Inconnu | | Manquante |
| Adresse | 1100, boul. des Chutes, Québec (Beauport) G1E 2G1 | Facebook, Otobox, NAPA, Nokian | Confirmée |
| Téléphone | 418 663-1195 | Facebook, Tripadvisor, Otobox, Nokian | Contradictoire : NAPA affiche 581 982-1195 |
| Courriel | mecaniqueSKL@outlook.com | Facebook (extrait) | Une seule source |
| Heures | lun.-jeu. 8 h-17 h, ven. 8 h-12 h, sam.-dim. fermé | Otobox | Une seule source |
| Services | Mécanique générale et récréative ; vente et pose de pneus | Facebook, Nokian, Otobox | Confirmée (catégories), détail manquant |
| Réseaux | Centre NAPA AutoCare ; détaillant Nokian Tyres | Localisateurs NAPA et Nokian | Confirmée (une source officielle chacun) |
| Contact chez Nokian | Kevin Lamontagne | Nokian | Une seule source : non affiché |
| Avis | 4 avis Facebook, aucun sur Tripadvisor | Facebook, Tripadvisor | Aucun avis citable |
| Photos, logo | Aucun | | Manquants |

Faits juridiques utilisés (vérifiés le 8 octobre 2026, OPC et Québec.ca) :
- Évaluation écrite obligatoire pour une réparation de plus de 100 $, sauf renonciation écrite et signée de la main du client. Le garage ne peut pas facturer plus que le total sans autorisation.
- Réparation garantie 3 mois ou 5 000 km, selon le premier terme atteint (LPC, art. 176).
- Pneus d'hiver obligatoires du 1er décembre au 15 mars (véhicules immatriculés au Québec).

## 2. Recherche (porte B)

Langage des clients relevé dans les avis de garages de Québec et Beauport : « prix honnêtes », « service rapide », « transparent », « personnel digne de confiance », et la crainte inverse, la « surfacturation ». L'objection centrale : *vais-je payer plus que prévu ?*

Concurrents du secteur (Garage Beauport, Centre de l'auto R.G., Mécanique Jo Garage) : gabarits bleu et gris, listes de services génériques, photos de banque d'images. Aucun n'explique au visiteur ses droits. **Angle :** le seul garage du secteur qui commence par vous dire ce qu'il regarde et ce à quoi vous avez droit.

Références analysées :
1. Sites de préparateurs automobiles premium (fonds graphite, typographie large) : le sérieux vient de la retenue et de la matière, pas du chrome.
2. Signalétique industrielle (marquage au sol, ruban de chantier) : une couleur unique et fonctionnelle guide l'œil sans décorer.
3. Fiches techniques de pneus (flanc, codes, pictogrammes) : un vocabulaire visuel qui n'appartient qu'au métier.

## 3. Brief de direction artistique

```
CONCEPT : « L'inspection » : on regarde avant de réparer. Graphite, béton et jaune de marquage.
ARCHÉTYPE : local premium + automobile · immersion 2-3
PERSONNALITÉ : franc, précis, solide · à éviter : clinquant
PALETTE : graphite #121416 (fond), carbone #1B1E21 (surface), béton #E7E8E5 (sections claires),
          acier #A3ABB4 (texte secondaire), signal #F5B400 (action, rare), encre #14171A
TYPO : Archivo variable (largeur 62-125, graisse 100-900) / Instrument Sans 400-600 / IBM Plex Mono 400-500
COMPOSITION : grille 12 colonnes, sections qui alternent sombre/clair, aucune grille de cartes identiques
PROFONDEUR : couches (sol, brume, roue, texte), grain fixe, aucune ombre portée décorative
STYLE PHOTO (pour la liste de prises de vue) : lumière d'atelier chaude + jour froid d'hiver, plongées, gestes, mains
ICÔNES : trait 1,5 px, angles vifs, dessinées pour le site
BOUTONS : rectangles à coins 2 px ; principal jaune signal sur encre ; secondaire contour acier
MOTION : sec et mécanique ; la roue tourne avec le défilement ; un seul reflet sur le CTA principal
DÉTAIL SIGNATURE : la roue vue du dessus, dont le flanc porte l'adresse et le numéro comme les inscriptions
                   d'un vrai pneu ; la ligne jaune de marquage qui traverse la page
```

Écart assumé par rapport aux interdits de 10K Websites : « quasi-noir + accent ambré » est un réflexe d'IA à éviter, **sauf quand c'est le monde réel du sujet**. Ici, le jaune n'est pas une ambiance : c'est le jaune du marquage au sol et des bras de pont élévateur. Pour ne pas tomber dans le gabarit : pas de serif à fort contraste, alternance avec des sections béton claires, jaune réservé à l'action et au marquage.

## 4. Système visuel (tokens)

```css
:root{
  --canvas:#121416; --panel:#1B1E21; --concrete:#E7E8E5; --concrete-2:#D9DBD7;
  --ink:#14171A; --steel:#A3ABB4; --steel-dark:#59616A; --text:#F1F2EF;
  --accent:#F5B400; --accent-hover:#FFC629; --accent-muted:rgba(245,180,0,.18);
  --ease-out:cubic-bezier(.22,1,.36,1); --ease-mech:cubic-bezier(.65,0,.35,1);
}
```

## 5. Plan média

| Section | Média | Fonction | Source |
|---|---|---|---|
| Accueil (ordinateur) | Scène codée : sol de béton, ligne jaune, roue SVG vue du dessus, brume | Poser la thèse, descendre vers la roue | Code (aujourd'hui) ; vidéo Higgsfield 6 s quand le forfait le permet |
| Accueil (téléphone) | Même scène, composée, sans défilement épinglé | Lisibilité, appel immédiat | Code |
| Inspection | Grande roue SVG + balayage de lampe | Moment interactif | Code |
| Pneus d'hiver | Bande « ruban de chantier » | Date légale réelle | Code |
| Toutes | Grain de béton fixe | Un seul environnement | Code (SVG feTurbulence) |

Aucune image générée ou de banque d'images ne représente l'atelier, l'équipe ou les réalisations.

## 6. Storyboard narratif

| Section | Fonction | Média | Mouvement | CTA | Transition |
|---|---|---|---|---|---|
| Accueil | Promesse | Sol + roue | Descente vers la roue, rotation au défilement | Appeler | La roue s'immobilise, la ligne jaune continue vers le bas |
| Statut | Utilité immédiate | Plaque | Pastille qui respire si ouvert | Appeler | Bascule vers le béton clair |
| Services | Offre | Rangées numérotées | Filet qui se dessine | Rendez-vous | Retour au graphite |
| Inspection | Preuve par le geste | Roue + lampe | Maintenir pour inspecter | Rendez-vous | Ruban de chantier |
| Pneus d'hiver | Urgence vraie | Ruban + compte à rebours | Défilement du ruban | Réserver ma pose | Béton clair |
| Vos droits | Réassurance | Fiche technique | Lignes qui s'impriment | | Graphite |
| Rendez-vous | Passage à l'action | Formulaire | Champs qui s'éclairent | Préparer le courriel | Béton |
| Visite + FAQ | Objections | Adresse, heures | Jour courant surligné | Itinéraire | Pied de page |

## 7. Band map de l'accueil épinglé (verbatim, plages = point de départ)

| Bande | Plage | Moment | Texte | Entrée |
|---|---|---|---|---|
| 1 | 0,00-0,30 | Vue haute, roue petite | Sur-titre « Garage à Beauport · 1100, boul. des Chutes » / H1 « Mécanique SKL » / « Mécanique générale, mécanique récréative et pneus. » | Approche en profondeur (rampe au chargement) |
| 2 | 0,36-0,64 | Descente, la roue grandit | « On regarde. » « On vous explique. » « Ensuite, on répare. » | Mot par mot, coup sec avec dépassement |
| 3 | 0,72-1,00 | Arrivée au-dessus de la roue | « Le prix par écrit, avant de réparer. » / « Pour toute réparation de plus de 100 $, c'est votre droit au Québec. » / Appeler le 418 663-1195 · Demander un rendez-vous | Montée mot par mot, puis sous-titre, puis boutons |

Accueil fixe (téléphones, réduction des animations) : H1 « Mécanique SKL », sous-titre « Mécanique générale, mécanique récréative et pneus, au 1100, boul. des Chutes à Beauport. », boutons Appeler et Rendez-vous.

## 8. Vidéo prévue (dès que Higgsfield le permet)

Tier 1, une prise de 6 s, image de départ + image-vers-vidéo. Prompts prêts dans `projet/prompts-higgsfield.md`. La vidéo remplace la couche « sol » de la scène codée ; la roue SVG prend le relais à la dernière image.

## 9. Porte de texte

Tout texte visible passe le contrôle : zéro tiret cadratin, aucun mot creux (« solutions », « sans souci », « votre satisfaction est notre priorité »), espaces insécables avant « : ; ! ? ».
