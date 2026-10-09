# Mécanique SKL : site web

Maquette de refonte du site de Mécanique SKL, garage à Beauport (Québec).

- `site/` : le site à déployer (HTML, CSS et JavaScript, sans compilation).
- `projet/` : direction artistique, registre des faits, prompts Higgsfield et fichier de reprise (`projet/REPRISE.md`).

## Voir le site en local

```
cd site
python3 -m http.server 8765
```

Puis ouvrir http://localhost:8765. Un double-clic sur `index.html` fonctionne aussi.

## Modifier le contenu

- Textes : directement dans `site/index.html`.
- Heures : tableau `.hours` dans `index.html` **et** constante `HOURS` dans `site/assets/js/main.js` (statut ouvert/fermé).
- Couleurs et polices : variables en tête de `site/assets/css/styles.css`.
- Vidéo d'accueil : constante `HERO_VIDEO` dans `main.js`.

## Licences

Polices Archivo, Instrument Sans et IBM Plex Mono : SIL Open Font License, utilisation commerciale permise. Illustrations (roue, sol, ruban) dessinées en code pour ce site.

## Deuxième maquette : Garage Jean-Yves Deschênes

- Dossier : `garage-deschenes/` (`site/` pour le site, `projet/` pour la direction artistique et la reprise).
- Publiée par le même flux GitHub Pages, sous `/garage-deschenes/`.
- Direction artistique distincte de Mécanique SKL : « Le manuel d'atelier ». Lire `garage-deschenes/projet/REPRISE.md` en premier.
