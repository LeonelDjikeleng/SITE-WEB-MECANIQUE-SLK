# Offres, direction et décisions à valider

## Direction artistique (validée par Pavel)
Même famille que dkgguesthouse.com : titres Fraunces, texte Hanken Grotesk, ivoire / pierre / encre, un seul accent bleu nuit, surtitres précédés d'un trait, boutons pilule, vraies photos de Québec. Détail signature : le **carnet de calcul** (temps perdu, chiffres alignés), propre au métier de Léonel.

## Mobile d'abord
- Héros en photo portrait du Château Frontenac enneigé, texte en bas, bouton pleine largeur.
- Espacements resserrés au téléphone (sections de 64 px, gouttière de 20 px).
- Offres et métiers en carrousel horizontal (balayage, points de position) : la page reste courte.
- Barre d'action fixe « Appeler / Réserver un appel » après le héros, cachée au formulaire.
- Menu plein écran à grandes lettres.

## Offres (Sales 2.0)
Porte d'entrée unique : **appel gratuit de 20 minutes**, puis **prix fixe par écrit avant tout engagement**.

| Offre | Promesse | Pour qui | Contenu |
|---|---|---|---|
| Essentiel | Une tâche, réglée. | Une tâche précise fait perdre du temps | Calcul du temps perdu · 1 automatisation · essais sur cas réels · guide d'une page |
| Signature (recommandée pour commencer) | Un site qui travaille pour vous. | Pas de site, ou un site qui ne rapporte rien | Site premium mobile · textes écrits ensemble · formulaire qui alerte et répond · référencement local Québec · Loi 25 · mise en ligne et formation |
| Vidéo publicitaire | Votre entreprise, en 30 secondes. | Se faire voir sur les réseaux et le site | Scénario orienté action · montage avec les vidéos du client et des images de son emplacement · versions verticale et horizontale · sous-titres français · musique libre de droits |
| Pilote automatique (tout inclus) | Le site, les relances, les réponses, la vidéo. | Beaucoup de demandes, peu de bras | Signature + 3 automatisations + agent IA (relais humain) + 1 vidéo publicitaire + tableau de suivi |
| Entretien mensuel (option) | | Tout client | Surveillance · mises à jour · corrections · rapport mensuel |

Aucun prix affiché pour l'instant : les bornes (plancher, cible) sont à fixer avec Finance & Pricing 2.0, puis Sales 2.0 choisit dans ces bornes. Ajouter un « à partir de » augmenterait la confiance une fois les prix fixés.

## Décisions à valider par Pavel (engagements écrits sur le site)
1. **« Prix fixe, par écrit, avant tout engagement »** : te convient-il pour toutes les offres ?
2. **« Vos comptes restent à vous »** : les outils sont ouverts au nom du client, qui garde l'accès même après la fin du contrat.
3. **« Un humain au bout du fil »** : ligne directe 418 255-7236 (appel ou texto).
4. **« Je vous écris ou vous appelle dans les prochains jours ouvrables »** (message après envoi du formulaire).
5. Le badge « Recommandé pour commencer » sur Signature (c'est un conseil, pas une statistique).
6. Vidéo (confirmé par Pavel le 22 novembre 2026) : montage des vidéos du client inclus ; tournage sur place offert en supplément payant.
7. La vidéo de démonstration du site est faite avec des photos libres de droits : à remplacer par une vraie réalisation dès que tu en as une (avec l'accord du client).

## Éléments à fournir (par impact)
1. Ta vraie photo (portrait, lumière naturelle) : c'est ce qui rend le site humain.
2. Ton courriel professionnel (politique de confidentialité).
3. Le domaine (ex. leoneldjikeleng.com) et l'hébergeur choisi.
4. Les liens Facebook, Instagram et TikTok.
5. Tes prix plancher et cible par offre.

## Avant la mise en ligne publique
Conformité Web 2.0 (lois) → Cybersécurité 2.0 (fonction Supabase, en-têtes) → QA & Delivery 2.0 (décision) → Serveur 2.0 (hébergement, DNS). Rien n'est publié sans le « oui » de Pavel.

## Espacements (22 novembre 2026)
Échelle resserrée et uniforme : sections de 48 px au téléphone, 72 px à la tablette, 88 px à l'ordinateur ; écarts internes de 8, 12, 16 et 20 px. Héros réduit à 74 % de la hauteur d'écran au téléphone.

## Vidéo de démonstration
`projet/video-demo/film.html` + `rec.js` : animation HTML capturée image par image (Playwright), encodée avec ffmpeg. 15 s, 9:16, muette. Exports : `site/assets/video/demo-720.mp4` (1,1 Mo), `demo-720.webm` (1,1 Mo), affiche WebP. Contrôlée avec Vidéo 4K 2.0 (`controler`) : CONFORME.
