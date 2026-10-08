# Prompts Higgsfield prêts à lancer

État au 8 octobre 2026 : le compte est au forfait gratuit, et Higgsfield refuse toute génération (« Requires basic plan or higher »). Rien n'a été dépensé.

Coûts vérifiés (préflight gratuit) :
- Image de départ : Seedream 4.5 = 1 crédit ; GPT Image 2.5 (2k, medium) = 1 crédit ; Nano Banana Pro 2k = 2 crédits
- Vidéo 6 s : Seedance 2.0 Mini 720p = 6 crédits ; Minimax Hailuo 1080 = 10 crédits ; Seedance 2.0 1080p = 54 crédits

## Image de départ (16:9)

```
Straight top-down overhead view, camera pointing directly down from the high ceiling of a large, clean auto repair workshop, composed as the first moment of a slow vertical descent toward the floor. A single car wheel (black winter tire with deep tread, dark graphite five-spoke alloy rim) lies flat on the floor, dead center of the frame, small, about one eighth of the frame height, the same distance from the left edge as from the right. The floor is one continuous surface of smooth light grey polished concrete filling the frame edge to edge, with subtle wear, faint tire marks and fine grain. One bright yellow painted safety line crosses the whole floor diagonally from the lower left to the upper right, passing beside the wheel without touching it. Lighting: cool blue early-winter dawn light falling from the left mixed with a warm overhead work lamp pooling softly on the wheel; a light haze in the air with drifting dust motes catching the light. Palette: graphite, concrete grey, steel, signal yellow, a touch of cold blue. Both halves of the frame are the same calm concrete floor, no objects, no tools, no machines, no people on either side. Cinematic, photorealistic, 16:9. No text, no logos, no lettering anywhere, smooth blank tire sidewall with no writing.
```

## Vidéo (image-vers-vidéo, 6 s, sans audio)

```
One continuous shot, no cuts. The camera descends straight down toward the car wheel lying flat on the concrete floor, a slow steady vertical descent along the center axis of the frame. The wheel stays centered and alive: the warm work light slides slowly across the rim, a faint glint travels along the spokes. The scene stays alive: thin haze drifts and thins out as the camera comes closer, dust motes float through the light. The shot ends at rest: the wheel seen from directly above, centered, filling about half of the frame height with generous concrete floor visible above and below it, the yellow safety line crossing the floor beside it, warm light pooled on the rim, the haze settled. No text or lettering anywhere.
```

Après génération : inspection des images de début, milieu et fin ; porte vidéo (vous la regardez avant intégration) ; encodage `-g 8` ; remplacement de la couche `.floor` dans `site/index.html` (voir le commentaire `VIDÉO HERO`).
