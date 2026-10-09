# REPRISE : maquette du Garage Jean-Yves Deschênes

Dernière mise à jour : 9 octobre 2026. À lire en premier dans toute nouvelle session sur ce prospect.

## Contexte

- Prospect : **Garage Jean-Yves Deschênes, mécanique générale**, 228A, 105e Rue, Québec (Beauport) G1C 3A8, 418 661-2102. Aucun site web trouvé ; page Facebook « Garage J-Y Deschenes » (environ 154 mentions J'aime).
- Même cadre que Mécanique SKL : MOI 2.0, mode 11 (maquette de démarchage identifiée), contenu en partie fictif et signalé, `noindex`, `robots.txt` bloquant, formulaire de démonstration, aucune requête vers un tiers.
- Direction artistique **volontairement différente** de SKL : « Le manuel d'atelier » (papier crème quadrillé, vert chêne, rouille, Fraunces + Public Sans, angles droits). Détail signature : Deschênes = « des chênes », emblème feuille de chêne + clé. Voir `direction-artistique.md` (registre des faits inclus).
- Publication : `garage-deschenes/site/` est publié sous `/garage-deschenes/` par le même flux GitHub Pages que SKL.

## Ce qui est fait

- `site/index.html` : accueil avec Fig. 1 (frein à disque en vue éclatée, s'ouvre au chargement, pièces qui s'écartent au défilement), principe tiré des avis publics, table des matières (7 chapitres en accordéon, préremplissage du formulaire), **tableau de bord des voyants** (7 voyants, niveau rouge ou ambre, quoi faire), garage de quartier vs concessionnaire, encadré « Vos droits » (LPC : évaluation écrite > 100 $, facture > 50 $ et pièces remplacées, garantie 3 mois ou 5 000 km), procédure en 3 étapes, résumés d'avis publics (aucune citation inventée), liste d'hiver à cocher avec compte à rebours réel jusqu'au 1er décembre, rendez-vous, adresse, heures, FAQ.
- `confidentialite.html` (Loi 25), `accessibilite.html`, `robots.txt`, `sitemap.xml`.

## Éléments fictifs ou à valider (tous signalés sur la page)

- Logo (dessiné pour la maquette), phrase « On change ce qui est usé. Le reste, on vous le dit. », procédure en 3 étapes, formulaire.
- Heures affichées lun.-ven. 8 h-17 h 30 (Otobox) : les annuaires se contredisent (8 h 30-17 h, mercredi 8 h, samedi 8 h-12 h).
- Adresse 228A (AccesGo) ou 228 (Otobox, VyMaps).
- Antirouille, démarreurs à distance, pare-brise : une seule source, affichés « à confirmer ».

## Tests passés (9 octobre 2026)

- `qa_capture.mjs` (MOI 2.0) : 360, 390, 768, 1440 px sans défaut ; aucun domaine tiers ; contenu visible avec réduction des animations.
- Aucun débordement de 320 à 1920 px ; aucune erreur console.
- Interactions : menu mobile, voyants (bouton pressé + fiche), chapitres, préremplissage, formulaire (erreur puis message de démonstration), liste d'hiver, barre d'appel mobile, ordre de tabulation.
- Fluidité : téléphone ralenti ×4, 60 img/s, 0 saccade ; ordinateur 60 img/s.
- Contrastes ≥ 4,8:1 ; zéro tiret cadratin.

## Arguments de vente propres à ce prospect

1. **Quatre graphies du nom en ligne** (Jean-Yves Deschenes, J-Y Deschenes, JY Deschene, Jean Yves Deschênes Mécanique Générale) : les clients le cherchent mal.
2. **Heures contradictoires** dans quatre annuaires, et adresse 228 ou 228A.
3. **Aucun site**, alors que ses avis parlent d'honnêteté : c'est exactement ce qu'un site doit montrer.
4. Le tableau des voyants est utile toute l'année et donne une raison de revenir au site.

## Éléments à obtenir du garage (par impact)

1. Photos de l'atelier et de Jean-Yves au travail (avec son accord).
2. Heures exactes et adresse exacte (228 ou 228A).
3. Accord pour citer de vrais avis Google.
4. Logo, s'il en existe un.
5. Liste confirmée des services (antirouille, démarreurs, pare-brise, pneus en ligne).
