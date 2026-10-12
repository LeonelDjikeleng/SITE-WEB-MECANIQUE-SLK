# 04 · Design mobile VIP : Mécanique SKL

Équipe Administrateur 2.0 · 12 octobre 2026 · recommandations seulement (aucun fichier du site modifié).

**Compétences chargées pour ce dossier :** `ui-ux-pro-max` (recherches réelles dans sa base : `--design-system`, domaines `product`, `style`, `color`, `typography`, `ux`, `landing`, et ses références `quick-reference.md` et `pro-rules.md`) et `moi-2-0` (références `direction-artistique.md`, `motion.md`, `performance.md`).

**Ce que la base ui-ux-pro-max a dit, et ce qu'on en garde :**

| Recherche | Résultat | Décision |
|---|---|---|
| `--design-system "auto repair garage local service premium dark"` | Motif « Trust & Authority + Conversion », style Flat, bleu #1E40AF + orange #EA580C, Inter | **Motif retenu** (preuves, prix transparents, formulaire court, CTA constant). **Palette et police refusées** : c'est le gabarit « entrepreneur bleu et gris » que la DA SKL combat (MOI 2.0, archétypes), et Inter est le choix par défaut à éviter. |
| `color "dark gold luxury automotive"` | « Premium dark + gold accent » (fond quasi noir, accent or, texte clair) | Confirme la direction actuelle : on affine, on ne change pas. |
| `style "dark luxury premium automotive"` | Dark Mode OLED (coût faible, contraste 7:1 visé), Skeuomorphism (relief tactile, coût élevé) | On prend le **sombre à fort contraste** et seulement le **relief statique** du skeuomorphisme (dégradé du bouton or), jamais ses textures ou ombres animées. |
| `typography "condensed bold industrial technical"` | Barlow Condensed + Barlow | Refusé : Archivo variable fait déjà le condensé (largeur 62-125 %) sans nouveau fichier. |
| `ux` (touch, safe area, line height, motion, sticky) | 44 pt iOS / 48 dp Android, 8 px entre cibles, interlignage 1,5-1,75, 1-2 éléments animés par écran, réduction des animations, barre fixe qui ne masque pas le contenu, zones sûres, `blur-purpose` (flou réservé aux fenêtres modales), chiffres tabulaires, retour d'appui < 100 ms, échelle 0,95-1,05 à l'appui | Appliqué partout ci-dessous. |
| `ux` / `landing` : carte, géolocalisation, permission | **Aucune correspondance dans la base** (deux essais) | La section « Nous trouver » repose sur les règles générales (Loi 25, MOI 2.0) : c'est une recommandation de repli, pas une donnée de la base. |

---

## 1. Ce qui fait « bon gabarit » plutôt que « VIP » sur téléphone

Observé sur les captures 390 × 844 (Chromium, mode tactile) dans `scratchpad/admin-design/` : `m-00` à `m-12`.

| # | Constat (capture) | Pourquoi ça fait gabarit |
|---|---|---|
| 1 | **Page de 16,7 écrans** (14 123 px). Services 1 634 px, inspection 1 474, rendez-vous 1 533, nous trouver 1 471. | Le luxe tient en peu de mots. Ici, le même message revient sans cesse : « prix par écrit » apparaît 5 fois, la garantie 4 fois, l'adresse et les heures 3 fois. |
| 2 | **Deux « Appeler » sur le premier écran** (m-00) : le bouton or de l'accueil, puis la barre du bas déjà affichée. Le JS ajoute toujours `is-mobile`, donc la barre ne fait jamais son entrée. | Quatre actions visibles au premier écran, c'est un réflexe d'outil de création de sites. Le VIP montre une seule action évidente. |
| 3 | **Barre du bas** : trois cases égales, icône au-dessus, libellés en mono majuscules de 11,8 px. Le texte de la page passe dessous et se lit à travers les bords (m-05, m-07). | C'est l'allure d'une barre d'onglets d'application générique. L'appel, pourtant l'action n° 1, pèse autant que « Itinéraire ». |
| 4 | **En-tête en capsule à 82 % d'opacité, sans flou** : en défilant, le contenu se lit à travers (m-12 : « 581 982-1195 » sous le logo ; m-04 : « Fermé · ouvre demain » sous la capsule). | Une transparence qui laisse voir du texte paraît négligée. Un en-tête VIP est franchement opaque ou franchement vitré. |
| 5 | **Bandeau maquette sur 2 lignes** : 40 px réels alors que `--banner-h` vaut 30 px, en mono majuscules très espacé. | Il occupe 5 % de l'écran en permanence et décale l'en-tête de 10 px. Le bandeau est obligatoire, mais il peut être fin. |
| 6 | **Typographie utilitaire trop présente** : étiquettes à 11,2 px espacées de 0,2 em, heures en mono, mentions du pied de page en mono sur 10 lignes (m-11). | Le mono sert aux codes et aux chiffres. En paragraphe, il fait « terminal » et se lit mal. |
| 7 | **Deux roues à la suite** : sur mobile, la roue de l'inspection passe avant son titre (`order:-1`), donc une seconde grande roue et le bouton « Maintenir » arrivent sans contexte (m-06). | Ça répète l'élément signature au lieu de le mettre en scène. La roue de fond doit rester la seule « grande roue ». |
| 8 | **Repères en liste verticale** (icône + 2 lignes × 4, 360 px, m-02). | C'est la liste d'avantages du gabarit standard. |
| 9 | **« Nous trouver » sans carte** : l'adresse sert de titre, trois capsules se répartissent en 2 + 1, sept lignes d'heures en mono espacé, et rien n'aide au trajet (pas de choix d'application, pas de distance) (m-09, m-12). | C'est la section la plus utilitaire, et c'est elle qui fait le plus « annuaire ». |
| 10 | **Numérotation 01 à 08** décorative, et **deux numéros géants** dans Rendez-vous (environ 580 px avant le premier champ, m-08). | Les numéros ne codent aucune vraie séquence (MOI 2.0, § 6). Le formulaire arrive trop tard. |
| 11 | **Reflet `.btn--shine` en boucle infinie** toutes les 6 s sur deux boutons (m-10). | Un mouvement perpétuel sans cause, qui attire l'œil et repeint l'écran pour rien. |
| 12 | **Marge latérale de 16 px** à 390 px, sections de 80 px, ombres choisies au cas par cas. | Le VIP vient d'un système d'espaces et d'élévations, pas de valeurs ponctuelles. |

**Ce qui est déjà VIP et à garder :** la roue de fond qui tourne au défilement natif, le titre « Mécanique SKL » fin et serré avec son filet or, les feuilles béton arrondies sur fond sombre, le bouton or en relief, les bons de travail inclinés, le ruban de chantier, le compte à rebours « 54 jours ».

---

## 2. Le système mobile VIP

Tous les jetons s'ajoutent à la couche « FINITION PREMIUM » (fin de `styles.css`) et remplacent les valeurs ponctuelles. Base : `html{font-size:100%}` (1 rem = 16 px).

### 2.1 Échelle typographique mobile (référence 390 px)

| Rôle | Police | Taille exacte | Valeur CSS | Interlignage | Graisse | Approche | Largeur |
|---|---|---|---|---|---|---|---|
| H1 accueil | Archivo | 51 px à 390 | `clamp(2.75rem, 13vw, 3.5rem)` | 0,92 | 760 | -0,04 em | `font-stretch:100%` |
| Manifeste | Archivo | 41 px | `clamp(2.25rem, 10.5vw, 2.75rem)` | 0,98 | 740 | -0,035 em | 96 % |
| H2 section | Archivo | 34 px | `clamp(1.875rem, 8.6vw, 2.375rem)` | 1,04 | 740 | -0,03 em | 94 % |
| H3 (service, étape) | Archivo | 24 px | `1.5rem` | 1,12 | 700 | -0,02 em | 96 % |
| Grand chiffre (compte à rebours) | Archivo | 96 px | `clamp(5rem, 25vw, 7rem)` | 0,85 | 780 | -0,05 em | 100 % |
| Chapeau (lede) | Instrument Sans | 18 px | `1.125rem` | 1,5 | 400 | 0 | n/a |
| Texte courant | Instrument Sans | 17 px | `1.0625rem` | 1,6 | 400 | 0 | n/a |
| Texte secondaire | Instrument Sans | 15 px | `0.9375rem` | 1,5 | 400 | 0 | n/a |
| Bouton | Instrument Sans | 16 px | `1rem` | 1 | 600 | 0,005 em | n/a |
| Libellé de la barre du bas | Instrument Sans | 13 px | `0.8125rem` | 1,1 | 600 | 0,01 em | n/a |
| Étiquette (sur-titre) | Plex Mono | 12 px | `0.75rem` | 1,2 | 500 | 0,14 em, majuscules | n/a |
| Heures, codes, chiffres | Plex Mono | 15 px | `0.9375rem` | 1,3 | 400 | 0 | n/a |
| Mentions légales | Instrument Sans | 13 px | `0.8125rem` | 1,55 | 400 | 0 | n/a |

Règles :
- **Minimum absolu : 12 px.** Aucun texte en dessous, bandeau compris.
- **Mono : 2 lignes au plus.** Réservé aux étiquettes, heures, numéros, codes du flanc. Le paragraphe du pied de page passe en Instrument Sans.
- Titres : `text-wrap:balance; max-inline-size:18ch`. Paragraphes : `text-wrap:pretty; max-inline-size:38ch` sur mobile.
- Chiffres alignés : `font-variant-numeric:tabular-nums` sur les heures, le compte à rebours et la distance.
- Champs de formulaire : 17 px, jamais moins de 16 px (sinon iOS zoome).

### 2.2 Espacements (base 4, mobile)

```css
:root{
  --s-1:4px; --s-2:8px; --s-3:12px; --s-4:16px; --s-5:20px; --s-6:24px;
  --s-7:32px; --s-8:48px; --s-9:64px; --s-10:72px; --s-11:96px;
  --gutter:clamp(16px, 5.2vw, 24px);              /* 20 px à 390, 16 px à 320 */
  --section-y:clamp(72px, 10vw, 140px);            /* 72 px sur téléphone */
  --sheet-gap:8px;                                 /* marge des feuilles béton */
}
```

| Relation | Valeur |
|---|---|
| Étiquette → H2 | 12 px |
| H2 → chapeau | 14 px |
| Chapeau → contenu | 32 px |
| Entre deux cartes empilées | 12 px |
| Entre deux boutons empilés | 12 px (8 px au minimum, selon ui-ux-pro-max) |
| Rangée de liste (services, heures, FAQ) | 20 px en haut et en bas, filet de 1 px |
| Padding intérieur d'une carte | 20 px (24 px dès 600 px) |
| Haut de section | `var(--section-y)` ; une feuille claire : 64 px + 8 px d'écart |

### 2.3 Rayons (imbrication cohérente : rayon intérieur = rayon extérieur moins le padding)

```css
:root{
  --r-sheet:28px;   /* feuilles béton (actuel : clamp(22px,2.4vw,34px)) */
  --r-card:20px;    /* carte, formulaire, carte-plan */
  --r-inner:12px;   /* élément dans une carte de padding 8 px */
  --r-field:14px;   /* champs de formulaire */
  --r-pill:999px;   /* boutons, puces, barre du bas */
}
```

Les bons de travail gardent 4 px : c'est du papier, pas une carte d'interface.

### 2.4 Élévation (trois niveaux seulement, jamais animés)

```css
:root{
  --e-1:inset 0 1px 0 rgba(255,255,255,.04), 0 1px 2px rgba(0,0,0,.40);
  --e-2:inset 0 1px 0 rgba(255,255,255,.05), 0 12px 32px -8px rgba(0,0,0,.50);
  --e-3:inset 0 1px 0 rgba(255,255,255,.07), 0 18px 40px -10px rgba(0,0,0,.60), 0 2px 6px rgba(0,0,0,.35);
  --glow-gold:0 8px 24px -6px rgba(245,180,0,.38);   /* bouton or principal uniquement */
}
```
Usage : `--e-1` pour les puces et les champs, `--e-2` pour les cartes et la carte-plan, `--e-3` pour l'en-tête et la barre du bas. Sur les feuilles béton, `0 -1px 0 rgba(255,255,255,.5) inset` seulement : leur contraste avec le fond suffit.

### 2.5 Verre et flou : du « verre fumé simulé », sans `backdrop-filter`

La roue de fond tourne à chaque pixel de défilement. Un `backdrop-filter` posé au-dessus devrait recalculer le flou à chaque image : c'est exactement ce qui a été retiré le 8 octobre pour obtenir 59 img/s. La base ui-ux-pro-max va dans le même sens (`blur-purpose` : le flou sert aux fenêtres modales, pas à la décoration).

```css
.glass{ /* en-tête, barre du bas, sur-titre de l'accueil, puce de statut */
  background:linear-gradient(180deg, rgba(35,39,43,.97) 0%, rgba(17,19,22,.97) 100%);
  border:1px solid rgba(241,242,239,.09);
  box-shadow:var(--e-3);
}
```
- Opacité **0,96 à 0,97** : rien ne se lit à travers (corrige le constat 4). Le dégradé et le filet clair du haut donnent l'effet vitré.
- `backdrop-filter` autorisé **uniquement** sur un futur panneau modal plein écran et immobile (aucun n'est prévu). Jamais sur l'en-tête, la barre du bas ni une section.

### 2.6 Palette affinée et contrastes calculés (WCAG 2.1, formule de luminance relative)

```css
:root{
  /* sombre */
  --bg:#121416; --bg-deep:#0D0F11; --surface:#1B1E21; --surface-2:#23272B; --surface-3:#2A2F34;
  --text:#F1F2EF; --text-2:#C8CDD2; --text-3:#A3ABB4; --text-4:#8A929B;
  --gold:#F5B400; --gold-hi:#FFD45C; --gold-lo:#E2A200; --on-gold:#16130A;
  --line:rgba(241,242,239,.10); --field-border:#6B737A;
  /* clair (feuilles béton) */
  --paper:#E7E8E5; --paper-hi:#F4F4F1;
  --ink:#14171A; --ink-2:#2F353B; --ink-3:#3C434A; --ink-4:#59616A; --gold-ink:#7A5000;
  /* états */
  --ok:#5AD17A; --ok-ink:#176A33;
}
```

| Paire | Ratio | Usage permis |
|---|---|---|
| `--text` #F1F2EF sur `--bg` #121416 | **16,43:1** | tout |
| `--text` sur `--surface` #1B1E21 | **14,90:1** | tout |
| `--text-2` #C8CDD2 sur `--bg` | **11,53:1** | chapeaux sur fond sombre (remplace #d9dcdf, #cfd3d7 et #c8ccd0 : une seule valeur) |
| `--text-3` #A3ABB4 sur `--bg` / `--surface` / `--surface-2` | **7,95 / 7,21 / 6,47:1** | texte secondaire |
| `--text-4` #8A929B sur `--bg` / `--surface` / `--surface-2` | **5,86 / 5,31 / 4,77:1** | métadonnées seulement (jamais sur `--surface-3`) |
| `--gold` #F5B400 sur `--bg` / `--surface` | **10,03 / 9,10:1** | texte d'accent, icônes, chiffres |
| `--on-gold` #16130A sur `--gold-hi` / `--gold-lo` | **13,10 / 8,31:1** | libellé du bouton or (pire cas = bas du dégradé) |
| `--ink` #14171A sur `--paper` / `--paper-hi` | **14,63 / 16,33:1** | titres sur béton |
| `--ink-2` #2F353B sur `--paper` | **10,08:1** | texte courant sur béton |
| `--ink-3` #3C434A sur `--paper` | **8,15:1** | chapeaux sur béton |
| `--ink-4` #59616A sur `--paper` / `--paper-hi` | **5,11 / 5,70:1** | étiquettes sur béton |
| `--gold-ink` #7A5000 sur `--paper` | **5,74:1** | puces « Maquette » sur béton (remplace #8A5A00, à 4,82:1 : trop juste pour du 12 px en pointillé) |
| `--ok` #5AD17A sur `--bg` / `--surface` | **9,53 / 8,64:1** | « Ouvert » sur fond sombre |
| `--ok-ink` #176A33 sur `--paper` | **5,43:1** | « Ouvert » sur béton (#1E7A3C ne fait que 4,37:1 : refusé) |
| Bandeau #9AA2AA sur #08090A | **7,71:1** | bandeau maquette |
| `--field-border` #6B737A sur `--bg` | **3,83:1** | bordure de champ (composant ≥ 3:1) |
| **`--gold` sur `--paper`** | **1,50:1** | **INTERDIT pour tout texte.** Sur béton, l'or ne sert qu'aux filets et au marquage. |

Le statut ne repose jamais sur la couleur seule : le mot « Ouvert » ou « Fermé » est toujours écrit.

### 2.7 États des boutons

| Bouton | Repos | Appui (`:active`, tactile) | Survol (`@media (hover:hover)` seulement) | Focus clavier | Désactivé / attente |
|---|---|---|---|---|---|
| **Principal or** | dégradé `--gold-hi → --gold → --gold-lo`, `--glow-gold`, texte `--on-gold` | `transform:scale(.97)` en 90 ms + dégradé assombri (`--gold → --gold-lo`) | `translateY(-1px)`, dégradé plus clair, 180 ms | `outline:2px solid var(--text); outline-offset:3px` (blanc sur fond sombre, l'or ne se détacherait pas de lui-même) | `opacity:.45; box-shadow:none; pointer-events:none; aria-disabled="true"` |
| **Secondaire sombre** (contour) | `border:1px solid rgba(241,242,239,.28)`, fond `rgba(13,15,17,.55)` | fond `rgba(241,242,239,.10)`, `scale(.97)` | bordure `.6` | idem | idem |
| **Encre** (sur béton) | `--ink` en dégradé `#22262A → #121416`, `--e-2` | `scale(.97)`, fond `#0D0F11` | `translateY(-1px)` | `outline:2px solid var(--ink)` | idem |
| **Lien d'action** (« Décrire mon problème → ») | soulignement or 2 px | la flèche avance de 4 px | idem | idem | n/a |
| **Bouton d'attente** (géolocalisation) | n/a | n/a | n/a | n/a | libellé « Recherche de votre position… » + anneau de 14 px qui tourne (`.8s linear`, seulement pendant l'attente), `aria-busy="true"` |

Tailles : bouton principal de **52 px** de haut, secondaire de **48 px**, aucune cible sous **44 × 44 px**. Sur tous les éléments tactiles : `touch-action:manipulation`. Le `-webkit-tap-highlight-color:transparent` n'est permis que si un `:active` visible existe.

### 2.8 Mouvement : autorisé et interdit

```css
:root{
  --t-press:90ms; --t-release:160ms; --t-hover:180ms; --t-ui:240ms;
  --t-enter:280ms; --t-exit:200ms; --t-reveal:360ms;
  --ease-out:cubic-bezier(.22,1,.36,1);     /* entrées (déjà dans le site) */
  --ease-in:cubic-bezier(.4,0,1,1);         /* sorties */
  --ease-mech:cubic-bezier(.65,0,.35,1);    /* déplacements (déjà dans le site) */
}
```

**Autorisé :**

| Micro-interaction | Propriétés | Durée et courbe |
|---|---|---|
| Appui sur un bouton ou une carte | `transform:scale(.97)` | 90 ms à l'appui, 160 ms au relâchement, `--ease-out` |
| Apparition au défilement (sous le premier écran seulement, une fois) | `opacity` + `translateY(12px)` | 360 ms `--ease-out` ; décalage de 60 ms, au plus 4 éléments |
| Entrée / sortie de la barre du bas | `transform` (+ `opacity` en mouvement réduit) | entrée 280 ms `--ease-out`, sortie 200 ms `--ease-in` |
| En-tête qui se cache / revient | `transform` | 240 ms |
| Carte Google qui remplace l'aperçu | `opacity` (fondu enchaîné, déclenché par l'événement `load` de l'iframe) | 240 ms |
| Icône de la FAQ (+ → −) | `transform:rotate` | 200 ms ; le contenu s'ouvre sans animer sa hauteur |
| « Copié » / « Adresse copiée » | échange de libellé + coche | affiché 1,6 s |
| Pastille « Ouvert » qui respire | `transform` + `opacity` d'un anneau de 10 px | 2,4 s, **3 cycles puis arrêt** (`animation-iteration-count:3`) |
| Roue de fond | inchangée : environ 0,11° par pixel, lissage de 0,15 s, défilement natif | n/a |

**Interdit :**
- Toute boucle infinie sur un bouton : le `.btn--shine` passe à **un seul passage, 1,2 s après le chargement**, puis plus rien (`animation-iteration-count:1`).
- Animer `box-shadow`, `height`, `width`, `top`, `filter`, `backdrop-filter`, `clip-path` sur une grande surface pendant le défilement.
- Défilement lissé par une bibliothèque, section épinglée, `scroll-snap` vertical, parallaxe sur du texte, défilement horizontal imposé (seul le carrousel des bons reste, à faire défiler soi-même).
- Ressorts et dépassements (`--ease-spring`) sur les éléments d'interface. Toute durée d'interface supérieure à 500 ms.
- Un délai de plus de 150 ms avant qu'un CTA devienne cliquable.
- En `prefers-reduced-motion: reduce` : roue et décor immobiles (déjà en place), barre du bas en simple fondu de 120 ms, aucune translation.

---

## 3. La section « Nous trouver » VIP

### 3.1 Maquette en texte (390 px, feuille béton claire, carte sombre au centre)

```
┌──────────────────── feuille béton (r 28, marge 8) ───────────────────┐
│  NOUS TROUVER                          ← étiquette mono 12 px --ink-4 │
│  Au 1100, boul. des Chutes.            ← H2 34 px --ink               │
│  Beauport (Québec) G1E 2G1             ← 17 px --ink-3                │
│  ┌────────────────────────────────┐                                   │
│  │ ● Ouvert · ferme à 17 h        │    ← puce statut (glass sombre)   │
│  └────────────────────────────────┘                                   │
│  ┌──────────── carte-plan 4:3, r 20, --e-2 ────────────────────────┐  │
│  │  [SVG local : asphalte #16191C, îlots, boulevard des Chutes      │  │
│  │   avec marquage jaune pointillé, repère SKL or + étiquette]      │  │
│  │                                               N ↑   (mono 10 px) │  │
│  │      ╭──────────────────────────────────────╮                    │  │
│  │      │ ⌖  Afficher la carte Google          │ ← capsule 44 px    │  │
│  │      ╰──────────────────────────────────────╯                    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ⓘ La carte est fournie par Google. En l'affichant, Google reçoit     │
│    votre adresse IP et peut utiliser des témoins.                     │
│    Politique de confidentialité   ← 13 px --ink-3, icône ⓘ 14 px,     │
│                                     lien souligné, collé sous la carte │
│  Plan stylisé, pas à l'échelle.   ← 12 px --ink-4                     │
│                                                                       │
│  1100, boul. des Chutes, Québec G1E 2G1   [⧉ Copier]  ← rangée 52 px  │
│                                                                       │
│  OUVRIR L'ITINÉRAIRE DANS                 ← étiquette                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                               │
│  │ Google   │ │  Waze    │ │  Plans   │  ← grille 3 col., gap 8, 52 px│
│  │ Maps     │ │          │ │          │     ordre selon l'appareil     │
│  └──────────┘ └──────────┘ └──────────┘                               │
│  ┌──────────────────────────────────────────────┐                     │
│  │ ◎  À quelle distance suis-je ?               │ ← bouton encre 52 px│
│  └──────────────────────────────────────────────┘                     │
│  [cadenas] Votre position reste dans votre téléphone : elle n'est ni  │
│     envoyée ni conservée.     ← 13 px --ink-3, icône cadenas tracée   │
│                                 1,5 px (SVG, pas d'émoji), AVANT la    │
│                                 demande du navigateur                  │
│  (résultat) Vous êtes à environ 3,4 km du garage, à vol d'oiseau.     │
│                                                                       │
│  HEURES                                                               │
│  ▌Lundi au jeudi ........ 8 h à 17 h   AUJOURD'HUI  ← jour courant    │
│   Vendredi .............. 8 h à 12 h                                 │
│   Samedi et dimanche .... Fermé                                      │
│  [Maquette] Numéros et heures tirés d'annuaires, à confirmer.         │
└───────────────────────────────────────────────────────────────────────┘
```

**Mentions Loi 25, hiérarchie légère :** pas d'encadré juridique. Chaque mention est **une phrase de 13 px collée sous le geste qu'elle concerne** (carte, position), précédée d'une petite icône au trait (ⓘ pour la carte, cadenas pour la position, SVG de 14 px en `--ink-4`), en `--ink-3` (8,15:1 sur béton), avec un interlignage de 1,5 et 8 px d'écart avec le composant. Elles sont lisibles **avant** le toucher, jamais cachées dans une infobulle, et le bouton les cite par `aria-describedby`, pour que les lecteurs d'écran les entendent avec le libellé. Les trois liens Google Maps, Waze et Plans sont des **liens sortants** : rien n'est chargé avant le toucher, donc aucune mention n'est requise. Seule la mention « (nouvel onglet) » est ajoutée pour l'accessibilité.

Hiérarchie : (1) où, en une ligne lisible ; (2) est-ce ouvert maintenant ; (3) voir le lieu (l'aperçu local, instantané et sans tiers) ; (4) y aller dans **son** application ; (5) la distance, en option ; (6) les heures complètes. Hauteur visée : **environ 1 250 px**, contre 1 471 aujourd'hui, avec beaucoup plus de fonctions.

### 3.2 Composants

**a. Puce de statut** (même logique que `main.js`, lignes 163-178, réutilisée) : `display:inline-flex; gap:8px; min-height:36px; padding:0 14px; border-radius:999px` en `.glass`. Point de 8 px (`--ok` si ouvert, `--text-4` si fermé, `--gold` si fermeture dans moins de 60 minutes). Texte de 14 px, graisse 600, `--text`. Exemples : « Ouvert · ferme à 17 h », « Ferme bientôt · 16 h 30 », « Fermé · ouvre lundi à 8 h ».

**b. Carte-plan locale en SVG** (inline, moins de 4 Ko, aucune requête) :
- `viewBox="0 0 400 300"`, `role="img"`, `aria-label="Plan stylisé : Mécanique SKL au 1100, boulevard des Chutes, Beauport. Pas à l'échelle."`
- Fond `#16191C`. Îlots en `rect` de rayon 6 : `#1E2226`, contour 1 px `#262B30`.
- Rues secondaires : trait `#2A2F34`, 8 px, `stroke-linecap:round`.
- **Boulevard des Chutes** : trait `#343A40` de 16 px, avec une ligne centrale `#F5B400` de 1,5 px, `stroke-dasharray:8 8`, opacité 0,8 (le marquage au sol de la DA). Nom posé le long du tracé (`textPath`) en Plex Mono 9 px, approche 0,12 em, `#8A929B`.
- **Repère du garage** : halo statique (cercle r 34, `rgba(245,180,0,.14)`), disque r 22 en `#F5B400`, et dedans le symbole `#closing-mark` réduit à 60 % en `#16130A`. Étiquette à droite : `rect` de rayon 10 en `#0D0F11`, contour `rgba(241,242,239,.12)`, « Mécanique SKL » en Instrument 12 px 600 `#F1F2EF`, « 1100, boul. des Chutes » en 10 px `#A3ABB4`.
- « N ↑ » en mono 10 px `#8A929B`, en haut à droite.
- **Vérité** : on trace seulement ce qui est vérifié sur une vraie carte (au minimum le boulevard des Chutes et l'orientation). Sinon, une trame abstraite autour du boulevard. Rien n'est recopié d'un fond de carte (droits de Google, ou ODbL et attribution pour OpenStreetMap). La légende « Plan stylisé, pas à l'échelle » est obligatoire.
- Le cadre `.map-card` porte `aspect-ratio:4/3; border-radius:20px; overflow:hidden; box-shadow:var(--e-2)`. Le même ratio sert à l'iframe : **aucun décalage de mise en page (CLS 0)**.

**c. Bouton « Afficher la carte Google »** : capsule de 44 px posée à 16 px du bas de la carte, centrée, `.glass`, 15 px 600 `--text`, icône de carte de 18 px en `--gold`. Au toucher :
0. **Avant le toucher**, rien de Google n'est chargé : ni iframe, ni script, ni police, ni image, ni `preconnect` ou `dns-prefetch` vers un domaine Google. La mention « La carte est fournie par Google. En l'affichant, Google reçoit votre adresse IP et peut utiliser des témoins. Politique de confidentialité » est visible sous la carte, et reliée au bouton par `aria-describedby="map-note"`.
1. on crée l'iframe (code d'intégration **officiel**, à obtenir dans Google Maps → Partager → Intégrer une carte) avec `loading="lazy"`, `referrerpolicy="strict-origin-when-cross-origin"`, `title="Carte Google : Mécanique SKL, 1100, boulevard des Chutes"` et `style="border:0"` ;
2. l'iframe est insérée sous l'aperçu (`opacity:0`), puis à son `load`, fondu de 240 ms et retrait du SVG ;
3. le bouton devient « Masquer la carte » (retour à l'aperçu, iframe supprimée).

Rien n'est mémorisé d'une visite à l'autre : chaque visite redemande le toucher (Loi 25, consentement explicite). La politique de confidentialité doit ajouter un paragraphe « Carte Google sur demande ». À tester : sur téléphone, la carte intégrée doit laisser défiler la page à un doigt. Sinon, on garde l'aperçu et le bouton ouvre plutôt Google Maps dans un nouvel onglet.

**d. Adresse copiable** : une rangée de 52 px avec l'adresse complète (Instrument 16 px `--ink`) et un bouton « Copier » de 44 × 44 px (icône ⧉ + libellé). `navigator.clipboard.writeText('1100, boul. des Chutes, Québec (Québec) G1E 2G1')`. Le libellé devient « Adresse copiée » ✓ pendant 1,6 s, annoncé par `aria-live="polite"`. Sans presse-papiers, l'adresse est sélectionnée.

**e. Trio d'applications** : `display:grid; grid-template-columns:repeat(3,1fr); gap:8px`. Chaque bouton : 52 px, `border-radius:16px`, fond `--paper-hi`, contour `1px solid rgba(20,23,26,.14)`, `--e-1`, libellé 14 px 600 `--ink`, petite icône générique de 18 px **dessinée pour le site** (épingle, flèche de navigation, boussole). **Pas de logos officiels Google, Waze ou Apple** : sinon, le site semble affilié. Ordre : iPhone ou iPad → Plans, Google Maps, Waze ; sinon → Google Maps, Waze, Plans.
- Google Maps : `https://www.google.com/maps/dir/?api=1&destination=1100+boulevard+des+Chutes+Qu%C3%A9bec+QC+G1E+2G1`
- Waze : `https://waze.com/ul?q=1100%20boulevard%20des%20Chutes%20Qu%C3%A9bec%20G1E%202G1&navigate=yes` (passer à `?ll=LAT,LNG&navigate=yes` une fois les coordonnées vérifiées)
- Plans (Apple) : `https://maps.apple.com/?daddr=1100+boulevard+des+Chutes,+Qu%C3%A9bec,+QC+G1E+2G1&dirflg=d`
- Les trois en `target="_blank" rel="noopener"`, avec la mention « (nouvel onglet) » en `.sr`.

**f. « À quelle distance suis-je ? »** (bouton encre de 52 px, pleine largeur, icône ◎ en or) :
- La position n'est **jamais** demandée au chargement, seulement après ce toucher. Bouton masqué si `!('geolocation' in navigator) || !isSecureContext`.
- `getCurrentPosition(ok, err, {enableHighAccuracy:false, timeout:8000, maximumAge:600000})`.
- **Avant la demande du navigateur**, la phrase « Votre position reste dans votre téléphone : elle n'est ni envoyée ni conservée. » est affichée sous le bouton (icône cadenas, 13 px `--ink-3`, `id="near-note"`, reliée par `aria-describedby`).
- Distance calculée **sur l'appareil** (haversine) : la position n'est ni envoyée ni écrite nulle part (pas de `localStorage`, pas de journal). La variable est effacée après le calcul. Le lien « Trajet » n'ajoute **pas** `origin=` : l'application de navigation utilise sa propre localisation.
- Résultat (`aria-live="polite"`, chiffres tabulaires) : « Vous êtes à environ **3,4 km** du garage, à vol d'oiseau. » Sous 1 km : « à environ 650 m ». Format français : virgule décimale, espace insécable avant « km ».
- Option VIP peu coûteuse : sur l'aperçu, une petite flèche or de 20 px collée au bord de la carte, orientée vers le visiteur, avec « 3,4 km ».
- Refus : « Localisation refusée. Aucun souci : les boutons ci-dessus calculent le trajet dans votre application. » Délai dépassé : « Position introuvable pour l'instant. Réessayer ».
- **Jamais** de durée de trajet inventée : le temps réel vient de l'application de navigation.
- **À COMPLÉTER** : les coordonnées exactes du 1100, boul. des Chutes (clic droit sur le repère dans Google Maps, 5 décimales), à vérifier avant d'activer la fonction. Les ajouter aussi au JSON-LD (`"geo":{"@type":"GeoCoordinates",...}`, `"hasMap"`).

**g. Heures en trois lignes** (au lieu de sept) : une rangée de 52 px par ligne, filet de 1 px `rgba(20,23,26,.12)`. Jours en Instrument 16 px `--ink-2`, heures en Plex Mono 15 px `--ink` à droite, chiffres tabulaires. Ligne du jour : barre or de 3 px à gauche (filet, pas du texte), graisse 600, puce « AUJOURD'HUI » en mono 12 px `--ink-4`. Le tableau reste un vrai `<table>` avec `<caption>`.

### 3.3 Squelette HTML et CSS (implémentable tel quel)

```html
<section class="find light" id="visite" aria-labelledby="find-title">
  <div class="wrap">
    <p class="label">Nous trouver</p>
    <h2 id="find-title" class="find__title">Au 1100, boul. des&nbsp;Chutes.</h2>
    <p class="find__city">Beauport (Québec) G1E&nbsp;2G1</p>
    <p class="find__status glass" data-status><span class="status__dot" aria-hidden="true"></span><span class="status__text">Heures d'ouverture</span></p>

    <figure class="map-card" data-map>
      <svg class="map-card__plan" viewBox="0 0 400 300" role="img" aria-label="Plan stylisé : Mécanique SKL au 1100, boulevard des Chutes, Beauport. Pas à l'échelle."><!-- tracé vérifié --></svg>
      <button class="map-card__load glass" type="button" data-map-load aria-controls="map-frame" aria-describedby="map-note">Afficher la carte Google</button>
      <div id="map-frame" class="map-card__frame" hidden></div>
    </figure>
    <p class="find__note" id="map-note"><svg class="find__ico" aria-hidden="true"><!-- ⓘ trait 1,5 px --></svg>La carte est fournie par Google. En l'affichant, Google reçoit votre adresse IP et peut utiliser des témoins. <a href="confidentialite.html#carte">Politique de confidentialité</a></p>
    <p class="find__scale">Plan stylisé, pas à l'échelle.</p>

    <div class="find__addr"><span>1100, boul. des Chutes, Québec G1E&nbsp;2G1</span><button class="find__copy" type="button" data-copy="1100, boul. des Chutes, Québec (Québec) G1E 2G1">Copier</button></div>

    <p class="label find__apps-label">Ouvrir l'itinéraire dans</p>
    <div class="find__apps" data-apps><!-- 3 liens, ordre réglé par JS --></div>
    <button class="btn btn--ink find__near" type="button" data-near aria-describedby="near-note" hidden>À quelle distance suis-je&nbsp;?</button>
    <p class="find__note" id="near-note" data-near-note hidden><svg class="find__ico" aria-hidden="true"><!-- cadenas trait 1,5 px --></svg>Votre position reste dans votre téléphone&nbsp;: elle n'est ni envoyée ni conservée.</p>
    <p class="find__near-out" data-near-out aria-live="polite"></p>

    <table class="hours hours--vip" data-hours><caption class="label">Heures</caption><tbody><!-- 3 lignes --></tbody></table>
  </div>
</section>
```

```css
.find__title{margin-top:12px}
.find__city{margin-top:6px;font-size:1.0625rem;color:var(--ink-3)}
.find__status{display:inline-flex;align-items:center;gap:8px;min-height:36px;margin-top:20px;padding:0 14px;border-radius:999px;font:600 .875rem/1 var(--body);color:var(--text)}
.map-card{position:relative;margin:24px 0 0;aspect-ratio:4/3;border-radius:var(--r-card);overflow:hidden;background:#16191C;box-shadow:var(--e-2)}
.map-card__plan,.map-card__frame,.map-card__frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.map-card__frame{opacity:0;transition:opacity var(--t-ui) var(--ease-out)}
.map-card.is-live .map-card__frame{opacity:1}
.map-card__load{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);min-height:44px;padding:0 18px;border-radius:999px;font:600 .9375rem/1 var(--body);color:var(--text);white-space:nowrap;touch-action:manipulation}
.map-card__load:active{transform:translateX(-50%) scale(.97)}
.find__note{display:flex;gap:8px;align-items:flex-start;margin-top:8px;font-size:.8125rem;line-height:1.5;color:var(--ink-3);max-inline-size:44ch}
.find__note a{color:var(--ink);text-underline-offset:3px}
.find__ico{flex:none;width:14px;height:14px;margin-top:3px;color:var(--ink-4)}
.find__scale{margin-top:4px;font-size:.75rem;color:var(--ink-4)}
.find__addr{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:52px;margin-top:24px;padding-block:4px;border-block:1px solid rgba(20,23,26,.12);font-size:1rem;color:var(--ink)}
.find__copy{min-width:44px;min-height:44px;padding:0 12px;border:0;border-radius:12px;background:rgba(20,23,26,.06);font:600 .875rem/1 var(--body);color:var(--ink)}
.find__apps-label{margin-top:28px}
.find__apps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:12px}
.find__apps a{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;min-height:52px;border-radius:16px;background:var(--paper-hi);border:1px solid rgba(20,23,26,.14);box-shadow:var(--e-1);font:600 .875rem/1.1 var(--body);color:var(--ink);text-decoration:none;touch-action:manipulation;transition:transform var(--t-release) var(--ease-out)}
.find__apps a:active{transform:scale(.97);transition-duration:var(--t-press)}
.find__near{width:100%;margin-top:12px}
.find__near-out{min-height:1.5em;margin-top:10px;font-variant-numeric:tabular-nums;color:var(--ink-2)}
.hours--vip{max-width:none;margin-top:32px;font-family:var(--body)}
.hours--vip th{font:400 1rem/1.3 var(--body);color:var(--ink-2);padding-block:16px}
.hours--vip td{font:400 .9375rem/1.3 var(--mono);font-variant-numeric:tabular-nums;color:var(--ink)}
@media (min-width:860px){.find .wrap{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);column-gap:64px}.map-card{grid-column:2;grid-row:1 / span 8;margin-top:0}}
```

```js
/* Nous trouver : carte sur demande + trio + distance. Aucun appel réseau avant un toucher. */
const GARAGE = { lat: null, lng: null }; // À COMPLÉTER : coordonnées vérifiées (5 décimales)
const MAP_EMBED = '';                     // À COMPLÉTER : src du code « Intégrer une carte » de Google Maps
const card = $('[data-map]'), loadBtn = $('[data-map-load]'), frame = $('#map-frame');
loadBtn?.addEventListener('click', () => {
  if (card.classList.contains('is-live') || frame.firstChild) { frame.replaceChildren(); frame.hidden = true; card.classList.remove('is-live'); loadBtn.textContent = 'Afficher la carte Google'; return; }
  const f = Object.assign(document.createElement('iframe'), { src: MAP_EMBED, title: 'Carte Google : Mécanique SKL, 1100, boulevard des Chutes', loading: 'lazy', referrerPolicy: 'strict-origin-when-cross-origin' });
  f.addEventListener('load', () => card.classList.add('is-live'), { once: true });
  frame.hidden = false; frame.append(f); loadBtn.textContent = 'Masquer la carte';
});
const ios = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
// ordonner les 3 liens : ios ? [plans, google, waze] : [google, waze, plans]
const near = $('[data-near]'), out = $('[data-near-out]');
if (near && 'geolocation' in navigator && isSecureContext && GARAGE.lat) {
  near.hidden = false; $('[data-near-note]').hidden = false;
  near.addEventListener('click', () => {
    near.setAttribute('aria-busy', 'true'); near.textContent = 'Recherche de votre position…';
    navigator.geolocation.getCurrentPosition(p => {   // position utilisée ici seulement, jamais stockée ni transmise
      const R = 6371, r = d => d * Math.PI / 180, dLat = r(GARAGE.lat - p.coords.latitude), dLng = r(GARAGE.lng - p.coords.longitude);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(r(p.coords.latitude)) * Math.cos(r(GARAGE.lat)) * Math.sin(dLng / 2) ** 2;
      const km = 2 * R * Math.asin(Math.sqrt(a));
      out.textContent = km < 1 ? `Vous êtes à environ ${Math.round(km * 1000 / 50) * 50} m du garage, à vol d'oiseau.` : `Vous êtes à environ ${km.toLocaleString('fr-CA', { maximumFractionDigits: 1 })} km du garage, à vol d'oiseau.`;
      done();
    }, e => { out.textContent = e.code === 1 ? 'Localisation refusée. Aucun souci : les boutons ci-dessus calculent le trajet dans votre application.' : 'Position introuvable pour l’instant. Réessayez.'; done(); },
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 });
  });
  function done() { near.removeAttribute('aria-busy'); near.textContent = 'À quelle distance suis-je ?'; }
}
```

---

## 4. Barre d'action mobile VIP

### 4.1 Contenu

```
╭──────────────────────────────────────────────────────────╮
│ ╭──────────────────────────╮  ╭─────────╮  ╭─────────╮   │
│ │ ☎  Appeler               │  │   ▦     │  │   ⌖     │   │
│ │    Ouvert · ferme à 17 h │  │ Rendez- │  │ Trajet  │   │
│ ╰──────────────────────────╯  │  vous   │  ╰─────────╯   │
│      capsule or (1,6 fr)      ╰─────────╯                │
╰──────────────────────────────────────────────────────────╯
```

- **Appeler** (principal, colonne de 1,6 fr) : capsule or, icône de 20 px, « Appeler » en 15 px 600 `--on-gold` et, dessous, l'état en direct en 12 px 500 `rgba(22,19,10,.78)` (contraste supérieur à 7:1 sur l'or), par exemple « Ouvert · ferme à 17 h » ou « Fermé · ouvre lun. 8 h ». Le bouton reste « Appeler » même fermé : la constance prime, et l'état informe.
- **Rendez-vous** (1 fr) : icône calendrier + libellé de 13 px 600 `--text`, ancre `#rendez-vous`.
- **Trajet** (1 fr) : lien direct vers l'application du visiteur (Plans sur iPhone, Google Maps ailleurs). Le choix complet reste dans « Nous trouver ».
- Libellés en Instrument Sans, casse de phrase : plus de mono majuscule.

### 4.2 CSS

```css
@media (max-width:720px){
  .dock{position:fixed;z-index:55;
    left:max(12px, env(safe-area-inset-left)); right:max(12px, env(safe-area-inset-right));
    bottom:max(12px, env(safe-area-inset-bottom));
    display:grid;grid-template-columns:1.6fr 1fr 1fr;gap:6px;height:64px;padding:6px;border-radius:32px;
    background:linear-gradient(180deg, rgba(35,39,43,.97), rgba(17,19,22,.97));
    border:1px solid rgba(241,242,239,.10);box-shadow:var(--e-3);
    transform:translateY(calc(100% + 24px + env(safe-area-inset-bottom)));
    transition:transform var(--t-exit) var(--ease-in);visibility:hidden}
  .dock.is-in{transform:none;visibility:visible;transition:transform var(--t-enter) var(--ease-out),visibility 0s}
  .dock a{display:flex;align-items:center;justify-content:center;gap:8px;min-height:52px;border-radius:26px;
    font:600 .8125rem/1.1 var(--body);letter-spacing:.01em;text-transform:none;color:var(--text);text-decoration:none;
    touch-action:manipulation;-webkit-tap-highlight-color:transparent;transition:transform var(--t-release) var(--ease-out),background-color var(--t-release)}
  .dock a:not(:first-child){flex-direction:column;gap:3px}
  .dock a:active{transform:scale(.97);background:rgba(241,242,239,.08);transition-duration:var(--t-press)}
  .dock a:first-child{background:linear-gradient(180deg,var(--gold-hi),var(--gold) 60%,var(--gold-lo));color:var(--on-gold);font-size:.9375rem;box-shadow:inset 0 1px 0 rgba(255,255,255,.5)}
  .dock a:first-child:active{background:linear-gradient(180deg,var(--gold),var(--gold-lo))}
  .dock small{display:block;font:500 .75rem/1.1 var(--body);color:rgba(22,19,10,.78)}
  html{scroll-padding-bottom:calc(88px + env(safe-area-inset-bottom))}  /* le focus n'est jamais caché (WCAG 2.4.11) */
  .foot{padding-bottom:calc(64px + 32px + env(safe-area-inset-bottom))}
}
@media (max-width:720px) and (max-height:500px){ .dock{height:56px;padding:4px} .dock a{min-height:48px} .dock small{display:none} }
@media (prefers-reduced-motion:reduce){ .dock{transform:none;opacity:0;transition:opacity 120ms linear} .dock.is-in{opacity:1} }
```

Le `viewport-fit=cover` est déjà dans le `<meta viewport>` : `env(safe-area-inset-*)` fonctionne. Sur un iPhone avec barre d'accueil (34 px d'inset), la barre flotte 34 px au-dessus du bord, hors de la zone de geste. Sur un téléphone sans encoche, elle flotte à 12 px.

### 4.3 Comportement à l'apparition

1. **Cachée au chargement.** Supprimer `dock.classList.add('is-mobile')` (main.js, ligne 148) et la règle `.dock.is-mobile`.
2. **Entrée** dès que les boutons de l'accueil sortent de l'écran : un `IntersectionObserver` sur `.hero__ctas` (`threshold:0`) bascule `is-in`, au lieu du seuil de 140 px. Une seule action « Appeler » est donc visible à la fois.
3. **Sortie** quand un autre bloc d'appel est à l'écran (`.closing__ctas` ou le haut du pied de page) : un même observateur suit tous les `[data-cta-zone]`.
4. **Sortie** pendant la saisie : `focusin` sur un champ du formulaire → `is-in` retiré ; `focusout` → rétabli après 150 ms. Le clavier virtuel ne pousse donc jamais la barre au milieu du formulaire.
5. **Sortie** quand le menu est ouvert (`setMenu(true)`).
6. Aucune sortie selon le sens du défilement : c'est l'en-tête qui se cache en descendant, la barre reste stable. C'est le calme qui fait premium.
7. Échelle des plans (z-index) : décor −1 · contenu 0 · en-tête 50 · barre 55 · bandeau 60 · menu 70.

---

## 5. Ordre des sections sur téléphone, raccourcis et fusions

Objectif : **environ 11 à 12 écrans (9 500 à 10 000 px), contre 16,7 aujourd'hui**, sans retirer aucune information utile.

| # | Section | Changement | Hauteur visée |
|---|---|---|---|
| 1 | **Accueil** | Le sur-titre devient le **statut en direct** : « ● Ouvert · ferme à 17 h · Beauport ». La bande Statut disparaît (fusion). | 1 écran |
| 2 | **Manifeste + promesse** | Inchangé, mais padding ramené à 64 / 72 px et lignes à 41 px. | 620 px (au lieu de 725 + 146 de statut) |
| 3 | **Repères** | Grille 2 × 2 : icône de 22 px + titre seul (sans sous-ligne), tuiles `--surface` de rayon 16. Garantie et prix écrit restent visibles ici, puis seulement dans « Vos droits ». | 240 px (au lieu de 360) |
| 4 | **Services** | Une phrase par service (environ 120 caractères). Puces de symptômes masquées sous 720 px. Lien d'action conservé. | ≈ 1 000 px (au lieu de 1 634) |
| 5 | **Comment ça se passe** | **Fusion** de « Inspection » et de « Votre visite » : les 4 temps, dont l'étape 2 « On inspecte » contient la roue interactive (`min(72vw, 300px)`, après le texte, jamais avant le titre) et le bouton « Maintenir ». Une seule « grande » roue reste à l'écran : celle du fond. | ≈ 1 300 px (au lieu de 1 474 + 1 076) |
| 6 | **Pneus d'hiver** | Ruban + compte à rebours + offre. Un seul paragraphe (date et amende) ; la phrase sur le pictogramme passe dans l'offre. Hors saison (16 mars au 30 septembre) : section réduite à un bandeau. | ≈ 1 050 px (au lieu de 1 431) |
| 7 | **Avis** (bons de travail) | Inchangé (déjà VIP). | 650 px |
| 8 | **Vos droits et vos questions** | **Fusion** de « Vos droits » et de la FAQ : 3 rangées de droits (évaluation, renonciation, garantie ; la rangée « Réseau » est déjà dans les Repères), puis 4 questions. On retire « Est-ce que je vais connaître le prix… » et « Ma réparation est-elle garantie ? », qui répètent les droits. | ≈ 1 100 px (au lieu de 1 223 + environ 700) |
| 9 | **Rendez-vous** | Les deux numéros géants deviennent une ligne : « Plus rapide : appelez le 418 663-1195 » + la note des deux numéros, en 13 px. Le formulaire commence 180 px sous le titre. | ≈ 1 150 px (au lieu de 1 533) |
| 10 | **Nous trouver** | La nouvelle section VIP (§ 3). | ≈ 1 250 px |
| 11 | **Pied de page avec appel final** | **Fusion** de l'appel final et du pied de page : titre « Un bruit, un voyant, une saison qui change ? » + les deux boutons, puis coordonnées et liens. Mentions de maquette en Instrument Sans 13 px. | ≈ 800 px (au lieu de 574 + 851) |

À retirer partout : la numérotation 01 à 08 (étiquettes simples), l'indice « Défilez » (déjà masqué sur mobile) et les répétitions de « prix par écrit » au-delà de 3 apparitions (manifeste, repères, vos droits).

**Bandeau maquette** (obligatoire, mode 11) : une seule ligne de 28 px, « MAQUETTE NON OFFICIELLE · CONTENU EN PARTIE FICTIF » en Plex Mono 12 px, approche 0,06 em, #9AA2AA sur #08090A (7,71:1), `--banner-h:28px` ajusté au rendu réel. Au-dessous de 380 px, version courte : « MAQUETTE NON OFFICIELLE ». La mention complète reste dans le pied de page.

---

## 6. Dix règles « ne jamais faire » pour garder le niveau

1. **Jamais de `backdrop-filter`** au-dessus du décor qui tourne (en-tête, barre du bas, sections). Le verre est simulé : dégradé à 0,97, filet clair, ombre `--e-3`.
2. **Jamais de requête vers Google, Waze ou Apple avant un toucher explicite** (pas même un `preconnect`), et jamais de demande de position au chargement. La carte et la géolocalisation partent d'un bouton, à chaque visite. Chaque bouton est précédé de sa mention en clair : « fournie par Google, adresse IP, témoins » pour la carte ; « reste dans votre téléphone, ni envoyée ni conservée » pour la position (Loi 25).
3. **Jamais de texte or sur béton** (1,50:1). Sur fond clair, l'or ne sert qu'aux filets et au marquage. Pour un accent texte sur béton : `--gold-ink` #7A5000 (5,74:1).
4. **Jamais deux « Appeler » dans le même écran.** La barre du bas s'efface quand les boutons de l'accueil ou de l'appel final sont visibles.
5. **Jamais de boucle infinie sur un bouton**, ni d'animation de `box-shadow`, `height`, `filter` ou `clip-path` pendant le défilement. Le reflet du CTA passe une fois, puis s'arrête.
6. **Jamais toucher au défilement natif** : pas de lissage par une bibliothèque, pas d'épinglage, pas de `scroll-snap` vertical. La roue reste liée au défilement, sans glissement automatique.
7. **Jamais de texte sous 12 px, ni de paragraphe en mono au-delà de 2 lignes**, ni de champ de formulaire sous 16 px.
8. **Jamais de cible tactile sous 44 × 44 px**, ni moins de 8 px entre deux cibles. Jamais d'effet de survol hors de `@media (hover:hover)`.
9. **Jamais d'information inventée** : coordonnées non vérifiées, stationnement, durée de trajet, avis réels. La distance est toujours « à vol d'oiseau », et le plan toujours « stylisé, pas à l'échelle ».
10. **Jamais de valeur hors système** : aucune couleur, police, ombre, rayon ou durée qui ne soit pas un jeton des § 2.1 à 2.8. Jamais de logo officiel Google, Waze ou Apple : des icônes dessinées et le nom en texte.

---

*Captures de référence : `/tmp/claude-0/-home-user-SITE-WEB-MECANIQUE-SLK/21921b5d-c548-5640-9040-acb90318934b/scratchpad/admin-design/m-00` à `m-12` (390 × 844, tactile). Mesures : hauteur totale 14 123 px ; bandeau 40 px réels pour 30 px déclarés ; barre du bas à 774 px, déjà visible au chargement.*
