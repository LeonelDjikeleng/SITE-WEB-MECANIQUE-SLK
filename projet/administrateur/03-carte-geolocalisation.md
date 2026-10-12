# 03 · Carte Google et géolocalisation : Mécanique SKL

> Recherche technique et juridique · 12 octobre 2026 · Équipe Administrateur 2.0
> Client : Mécanique SKL, 1100, boulevard des Chutes, Québec (Beauport) QC G1E 2G1
> Contexte : maquette statique HTML/CSS/JS, aucune dépendance, aucune clé d'API.
> Limite : réseau restreint. Les pages MapQuest, NAPA, Otobox et Apple n'ont pas pu être ouvertes directement (DNS refusé, et Nominatim/Geogratis refusés par la politique réseau). Les faits ci-dessous viennent des extraits de recherche WebSearch. Chaque point non confirmé est signalé.
> Aucun fichier du site n'a été modifié.

---

## Conformité Loi 25 : décision finale

Règle de Pavel : ne jamais violer la Loi 25, tout faire légalement et officiellement. Ce qui suit est la décision qui s'applique au site ; le reste du document en donne le détail et les sources.

### 1. Aucune requête vers Google sans action explicite et éclairée du visiteur

- Au chargement de la page, **zéro requête** vers Google, Waze ou Apple : pas d'iframe, pas de police Google, pas d'image de tuile, pas de script, pas de `preconnect`/`dns-prefetch` vers leurs domaines. (Vérifié : la maquette actuelle sert ses polices en local et n'intègre aucune carte. À contrôler dans l'onglet Réseau des outils du navigateur avant chaque livraison.)
- **Option retenue par défaut (la plus sûre)** : pas de carte intégrée. Un plan simplifié dessiné en SVG local + les liens sortants Itinéraire (Google Maps, Waze, Plans). Un lien sortant n'envoie rien tant qu'il n'est pas touché, et Google autorise expressément les liens vers ses cartes (Geo Guidelines).
- **Option permise si le garage veut une carte interactive** : façade locale, puis iframe Google chargée **seulement au toucher** d'un bouton. La façade affiche **avant le toucher**, en clair et à côté du bouton : « La carte est fournie par Google. Si vous l'affichez, Google recevra votre adresse IP et pourra déposer des témoins. » avec un lien vers la politique de confidentialité du site (et celle de Google).

### 2. Conformité aux conditions officielles de Google

| Format d'iframe | Statut officiel | Décision |
|---|---|---|
| `https://www.google.com/maps?q=…&output=embed` | **Non documenté** par Google (aucune page officielle ne le décrit ; seuls des tutoriels tiers le citent) | **Exclu**, y compris dans la maquette |
| Code de **« Partager > Intégrer une carte »** de Google Maps (`https://www.google.com/maps/embed?pb=…`) | Fonction officielle décrite dans l'aide Google Maps ; les Geo Guidelines de Google disent qu'il n'est pas nécessaire de demander la permission pour simplement intégrer une carte Google sur son site, à condition de respecter les conditions et l'attribution | **Permis, sans clé.** Pavel génère le code depuis la fiche du garage |
| **Maps Embed API** `https://www.google.com/maps/embed/v1/place?key=…` | Officielle, gratuite et illimitée, mais clé Google Cloud et compte de facturation obligatoires | **Permis**, si le garage accepte un compte Google Cloud |
| Lien sortant (Maps URLs, Waze Deep Links, liens Plans) | Officiels, documentés, sans clé | **Permis et recommandé** |

Dans tous les cas : ne jamais masquer le logo Google ni les mentions, ne jamais remplacer la carte par une capture d'écran de Google Maps.

### 3. Géolocalisation

- Demandée **seulement au toucher** du bouton « Calculer ma distance », jamais au chargement.
- Phrase affichée **avant** le toucher : « Votre position sert uniquement à calculer la distance sur votre appareil. Elle n'est ni envoyée, ni enregistrée. »
- Calcul **uniquement dans le navigateur** (haversine), **jamais transmis** (aucun `fetch`, formulaire, analytique) **ni conservé** (aucun `localStorage`, témoin ni journal).
- Refus sans pénalité : le bouton Itinéraire fonctionne sans la position.

### 4. Texte exact à ajouter à la politique de confidentialité

Remplacer la section « Liens externes » actuelle de `confidentialite.html` par les deux sections suivantes (à faire lors de l'intégration, pas maintenant) :

> **Carte et itinéraire**
>
> Aucune carte ni aucun service de Google, de Waze ou d'Apple n'est chargé lorsque vous ouvrez ce site.
>
> Les boutons « Itinéraire », « Waze » et « Plans » ouvrent l'application ou le site de Google Maps, de Waze (Google) ou d'Apple Plans seulement lorsque vous les touchez. À partir de ce moment, ces entreprises reçoivent votre demande et appliquent leur propre politique de confidentialité.
>
> Si vous touchez « Afficher la carte Google », votre navigateur se connecte aux serveurs de Google LLC, qui peuvent se trouver à l'extérieur du Québec, notamment aux États-Unis. Google reçoit alors votre adresse IP et l'adresse de la page consultée, et peut déposer des témoins (cookies) dans votre navigateur. Mécanique SKL ne reçoit et ne conserve aucun de ces renseignements. Si vous ne touchez pas ce bouton, rien n'est transmis à Google. Pour en savoir plus : [politique de confidentialité de Google](https://policies.google.com/privacy).
>
> **Distance jusqu'au garage**
>
> Le bouton « Calculer ma distance » est facultatif. Si vous le touchez, votre navigateur vous demande la permission d'utiliser votre position. Le calcul de la distance et du temps de route approximatif se fait uniquement sur votre appareil. Votre position n'est ni transmise à Mécanique SKL ni à un tiers, et elle n'est pas enregistrée. Vous pouvez refuser ou retirer cette permission en tout temps dans les réglages de votre navigateur ; le reste du site fonctionne sans elle.

(Si la façade de carte n'est pas retenue, retirer le troisième paragraphe de « Carte et itinéraire ».)

---

## 1. Coordonnées retenues

| Champ | Valeur |
|---|---|
| **Latitude** | **46.86987** |
| **Longitude** | **-71.17556** |
| Format Waze/Google | `46.86987,-71.17556` |
| Confiance | **Élevée pour l'usage visé (lien d'itinéraire, JSON-LD, calcul de distance)**, précision estimée à ±20 m. Moyenne au sens strict, car aucune source n'a pu être ouverte directement et aucun géocodeur officiel n'était accessible. |

### Recoupement

| Source | Lat. | Long. | Écart avec le point retenu | Remarque |
|---|---|---|---|---|
| MapQuest, fiche « Mecanique SKL » (JSON-LD `geo`) | 46.86987 | -71.17556 | 0 m | Point retenu |
| MapQuest, fiche « Atelier Mecanique Des Chutes », même adresse | 46.86987 | -71.17556 | 0 m | Même point : vraisemblablement le géocodage du bâtiment. Probablement l'ancien nom des lieux (à confirmer) |
| Nokian Tyres, localisateur (« Kevin Lamontagne, Mecanique SKL ») | 46.86974 | -71.17548 | 16 m | Source indépendante de MapQuest |
| Tripadvisor (fiche Mécanique Skl) | 46.8698 | -71.17565 | 10 m | Arrondi à 4 décimales |
| Données Québec, bornes-fontaines (segment boul. des Chutes, Beauport) | 46.86903 | -71.17690 | 138 m | Contrôle de vraisemblance : un point municipal est bien sur ce boulevard, tout près |

Les trois fiches commerciales tombent dans un cercle d'environ 16 m. Distances calculées avec la fonction haversine de la section 5.

**À faire avant la mise en ligne (5 min)** : ouvrir Google Maps sur place ou en vue satellite, faire un appui long sur l'entrée du garage, et comparer. Si l'écart dépasse 30 m, remplacer les coordonnées dans les trois extraits (URL Waze, JSON-LD, constante JS). Noter aussi le **Place ID** Google de la fiche du garage s'il existe (outil « Place ID Finder » de Google), pour fiabiliser le lien Google (section 3).

---

## 2. Carte Google intégrée sans clé d'API

### Les trois formats

| Format | Clé ? | Statut | Usage conseillé |
|---|---|---|---|
| **A. Code « Partager > Intégrer une carte »** de Google Maps : `https://www.google.com/maps/embed?pb=…` | Non | Fonction officielle de Google Maps grand public (aide Google : Menu > Partager ou intégrer la carte > Intégrer une carte > Copier le HTML). Les Geo Guidelines de Google indiquent qu'aucune permission n'est nécessaire pour simplement intégrer une carte Google sur un site, si les conditions et l'attribution sont respectées | **Option officielle sans clé.** Pavel génère le code lui-même depuis la fiche du garage. Le paramètre `pb` est opaque, on ne peut pas le fabriquer à la main |
| **B. Ancienne URL** `https://www.google.com/maps?q=…&output=embed` | Non | **Non documentée** par Google : aucune page officielle ne la décrit, seuls des tutoriels tiers la citent. Peut cesser sans préavis | **Exclue** (règle de Pavel : uniquement des solutions officielles), même pour la maquette |
| **C. Maps Embed API** `https://www.google.com/maps/embed/v1/place?key=CLE&q=…` | **Oui** | Officielle. Gratuite, sans limite de requêtes, mais exige une clé Google Cloud et un compte de facturation | Si le garage veut une solution contractuelle stable ; restreindre la clé au domaine (référent HTTP) |

### URL prêtes à l'emploi (adresse déjà encodée)

```text
# A. Officiel sans clé : à générer dans Google Maps (Partager > Intégrer une carte > Copier le HTML),
#    puis ne garder que la valeur de src, de la forme :
https://www.google.com/maps/embed?pb=VALEUR_GENEREE_PAR_GOOGLE

# B. Non documenté : NE PAS UTILISER (cité pour mémoire)
# https://www.google.com/maps?q=…&output=embed

# C. Maps Embed API (remplacer CLE)
https://www.google.com/maps/embed/v1/place?key=CLE&q=M%C3%A9canique%20SKL%2C%201100%20boulevard%20des%20Chutes%2C%20Qu%C3%A9bec%2C%20QC%20G1E%202G1&zoom=16&language=fr
```

### Conditions et limites à respecter

- **Ne jamais masquer ni recouvrir** le logo Google, les mentions de droits d'auteur ni le lien vers les conditions (conditions de Google Maps Platform et conditions propres aux services).
- Taille minimale de la carte intégrée : **200 × 200 px** (documentation Maps Embed API).
- La carte intégrée peut afficher de la publicité Google.
- **Ne pas utiliser une capture d'écran de Google Maps** comme aperçu statique : les conditions interdisent de copier ou de mettre en cache le contenu Google hors du service. L'aperçu de la façade (section 4) doit être un dessin maison (SVG) ou une image OpenStreetMap créditée « © contributeurs OpenStreetMap ».
- Si les témoins tiers sont bloqués par le visiteur, l'iframe peut afficher une erreur : la façade évite ce cas pour qui ne clique pas.
- Coût réseau : une iframe Google charge plusieurs centaines de Ko de scripts. Raison de plus pour ne la charger qu'au clic (performance mobile et Loi 25 vont dans le même sens).

### Alternative sans Google

OpenStreetMap : `https://www.openstreetmap.org/export/embed.html?bbox=…&layer=mapnik&marker=46.86987,-71.17556`. Même logique (l'iframe transmet aussi l'IP à un tiers, hors Canada). Défaut connu : le marqueur peut ne pas s'afficher quand le `src` est injecté après le chargement de la page, ce qui est justement le cas d'une façade. À tester avant de le retenir.

---

## 3. Liens d'itinéraire qui ouvrent l'application

Principe : **aucune géolocalisation n'est nécessaire pour un itinéraire.** Sans `origin`, chaque application part de la position actuelle du téléphone, avec sa propre permission. C'est le moyen le plus simple et le plus sûr, côté vie privée.

### Google Maps (Maps URLs, documentation officielle, sans clé)

Format universel : ouvre l'application Google Maps si elle est installée (Android, iOS), sinon le site web. `api=1` est obligatoire.

```text
# Recommandé : nom + adresse (mène à la fiche du commerce, pas seulement à un point)
https://www.google.com/maps/dir/?api=1&destination=M%C3%A9canique%20SKL%2C%201100%20boulevard%20des%20Chutes%2C%20Qu%C3%A9bec%2C%20QC%20G1E%202G1&travelmode=driving

# Variante par coordonnées (point exact, mais sans le nom du commerce)
https://www.google.com/maps/dir/?api=1&destination=46.86987%2C-71.17556&travelmode=driving

# Encore mieux quand le Place ID est connu (destination reste obligatoire avec destination_place_id)
https://www.google.com/maps/dir/?api=1&destination=M%C3%A9canique%20SKL%2C%201100%20boulevard%20des%20Chutes%2C%20Qu%C3%A9bec%2C%20QC%20G1E%202G1&destination_place_id=PLACE_ID&travelmode=driving

# Fiche / point sur la carte (lien « Voir sur Google Maps », valeur pour hasMap)
https://www.google.com/maps/search/?api=1&query=M%C3%A9canique%20SKL%2C%201100%20boulevard%20des%20Chutes%2C%20Qu%C3%A9bec%2C%20QC%20G1E%202G1
```

Notes :
- `dir_action=navigate` lance directement la navigation guidée. **Déconseillé ici** : le client veut souvent d'abord voir le trajet.
- La documentation recommande le **Place ID** comme meilleure garantie de tomber sur le bon commerce. Une requête par coordonnées seules ne mène pas toujours à la fiche.
- Attention : MapQuest liste aussi « Atelier Mécanique des Chutes » à la même adresse. Inclure « Mécanique SKL » dans la requête évite d'ouvrir une ancienne fiche. Tester sur téléphone.
- Le site actuel utilise `destination=1100+boulevard+des+Chutes+Qu%C3%A9bec+QC+G1E+2G1` : valide. On peut ajouter le nom et `&travelmode=driving`.

### Waze (documentation officielle « Waze Deep Links »)

Base `https://waze.com/ul`. Ouvre l'application si elle est installée, sinon une page web Waze. `navigate=yes` lance la navigation. **Utiliser les coordonnées** (`ll`) : avec une adresse texte (`q`), Waze navigue vers le premier résultat de recherche, moins fiable.

```text
https://waze.com/ul?ll=46.86987%2C-71.17556&navigate=yes&zoom=17
```

Option : ajouter `&utm_source=mecaniqueskl` (Waze recommande `utm_source` pour identifier le partenaire). Sans incidence pour le visiteur.

### Apple Plans

Apple a introduit avec **iOS 18.4** un nouveau format « unifié » d'URL Plans (session WWDC25, réponse d'un ingénieur Apple sur les forums). Le format historique `daddr`/`dirflg` reste documenté (archive) et largement utilisé, mais **un `daddr` en coordonnées ne se comporte plus comme avant sur iOS récent** (signalement Apple Developer Forums). D'où le choix de l'adresse texte.

```text
# Historique, documenté (archive Apple) : adresse texte, en voiture
https://maps.apple.com/?daddr=1100%20boulevard%20des%20Chutes%2C%20Qu%C3%A9bec%2C%20QC%20G1E%202G1&dirflg=d

# Format unifié iOS 18.4+ (forme probable : la page Apple « Adopting unified Maps URLs » n'a pas pu être lue, À TESTER sur un iPhone)
https://maps.apple.com/directions?destination=1100%20boulevard%20des%20Chutes%2C%20Qu%C3%A9bec%2C%20QC%20G1E%202G1&mode=driving
```

Recommandation : utiliser le format historique dans la maquette et tester les deux sur un iPhone avant la livraison.

### HTML prêt à l'emploi

```html
<div class="itineraire">
  <a class="btn btn--ink" target="_blank" rel="noopener"
     href="https://www.google.com/maps/dir/?api=1&amp;destination=M%C3%A9canique%20SKL%2C%201100%20boulevard%20des%20Chutes%2C%20Qu%C3%A9bec%2C%20QC%20G1E%202G1&amp;travelmode=driving">
    Itinéraire<span class="sr"> avec Google Maps (nouvel onglet)</span>
  </a>
  <p class="itineraire__autres">Ouvrir avec
    <a target="_blank" rel="noopener" href="https://waze.com/ul?ll=46.86987%2C-71.17556&amp;navigate=yes&amp;zoom=17">Waze</a> ·
    <a target="_blank" rel="noopener" href="https://maps.apple.com/?daddr=1100%20boulevard%20des%20Chutes%2C%20Qu%C3%A9bec%2C%20QC%20G1E%202G1&amp;dirflg=d">Plans (iPhone)</a>
  </p>
</div>
```

Rappel : dans un attribut HTML, `&` s'écrit `&amp;` (comme le fait déjà le site).

---

## 4. Loi 25 et carte intégrée

### Le problème

Une iframe Google Maps chargée à l'ouverture de la page contacte les serveurs de Google **avant toute action du visiteur** : transmission de l'adresse IP et de la page d'origine, dépôt possible de témoins (ex. `NID`, classé « non strictement nécessaire » par plusieurs gestionnaires de consentement). Google n'offre **aucun mode « confidentialité renforcée »** pour Maps (contrairement à YouTube) : le contrôle doit se faire côté site.

### Ce que dit la loi (secteur privé, RLRQ c. P-39.1, telle que modifiée par la Loi 25)

- **Art. 8** : informer la personne, au moment de la collecte, des fins, des moyens, des tiers éventuels et de la **possibilité que les renseignements soient communiqués hors du Québec**.
- **Art. 8.1** : si l'on recueille des renseignements avec une technologie permettant d'**identifier, de localiser ou d'effectuer un profilage**, informer la personne de son recours et des moyens de l'activer. Ces fonctions doivent être **désactivées par défaut**. La CAI applique ce principe aux témoins : un témoin qui permet, a priori, d'identifier, de géolocaliser ou de profiler doit être désactivé par défaut.
- **Art. 9.1** : paramètres de confidentialité les plus élevés par défaut (les témoins de connexion sont exclus de cet article précis, mais restent visés par l'art. 8.1).
- **Art. 17** : avant de communiquer des renseignements personnels hors du Québec, une évaluation des facteurs relatifs à la vie privée (EFVP) est exigée.
- **Consentement** (depuis septembre 2023) : manifeste, libre, éclairé, donné à des fins spécifiques, demandé pour chaque fin.

L'adresse IP est généralement traitée comme un renseignement personnel. Une carte chargée d'office place donc le garage dans une zone grise (communication hors Québec sans information préalable). Aucune décision de la CAI propre aux cartes Google n'a été trouvée : **à valider par un juriste** si le garage veut aller au-delà de la solution ci-dessous.

### Recommandation retenue (voir aussi « Conformité Loi 25 : décision finale » en tête)

1. **Par défaut : pas de carte intégrée du tout.** Plan SVG local + liens sortants. C'est la solution la plus simple, officielle et sans aucune transmission.
2. Si une carte interactive est voulue : **aucune iframe au chargement**. Afficher une **façade** : aperçu statique local (SVG maison), adresse lisible, et, **avant le bouton**, la phrase d'information : « La carte est fournie par Google. Si vous l'affichez, Google recevra votre adresse IP et pourra déposer des témoins. » avec lien vers la politique de confidentialité.
3. **Chargement au toucher** du bouton « Afficher la carte Google », avec une iframe **officielle** (code « Intégrer une carte » ou Maps Embed API avec clé), jamais `output=embed`.
4. Le toucher vaut **action positive, explicite et éclairée pour cette seule fin**. Le choix **n'est pas mémorisé** : à chaque visite, la carte reste fermée jusqu'au toucher. Ainsi aucun bandeau de témoins global n'est requis pour la carte, puisque rien ne se charge par défaut.
5. Les **liens d'itinéraire** restent de simples liens : rien ne part chez Google, Waze ou Apple avant le toucher. Ne pas ajouter de `preconnect` ou `dns-prefetch` vers leurs domaines (cela contacterait leurs serveurs dès le chargement).
6. **Politique de confidentialité** : texte exact dans la section « Conformité Loi 25 : décision finale », point 4.
7. Point juridique résiduel : le transfert hors Québec (art. 17, EFVP) vise la communication **par l'entreprise**. Ici, c'est le navigateur du visiteur qui se connecte à Google, à sa demande, après information ; Mécanique SKL ne reçoit ni ne transmet rien. C'est l'analyse la plus courante, mais aucune décision de la CAI propre aux cartes intégrées n'a été trouvée : si le garage veut une certitude absolue, s'en tenir à l'option 1 (liens seulement) ou consulter un juriste.

### Façade de carte : code prêt à l'emploi (sans dépendance)

```html
<figure class="carte" data-carte>
  <!-- Aperçu local : SVG maison (rien ne part chez un tiers) -->
  <svg class="carte__apercu" viewBox="0 0 400 240" role="img"
       aria-label="Plan simplifié : le garage est au 1100, boulevard des Chutes, à Beauport">
    <rect width="400" height="240" fill="var(--carte-fond, #e9e6df)"/>
    <path d="M-10 170 C 120 150, 260 120, 410 80" stroke="#fff" stroke-width="18" fill="none"/>
    <text x="40" y="200" font-size="13" fill="#555">boul. des Chutes</text>
    <g transform="translate(232 118)">
      <path d="M0 0c-9-12-14-19-14-26a14 14 0 0 1 28 0c0 7-5 14-14 26z" fill="#c8102e"/>
      <circle cy="-26" r="5" fill="#fff"/>
    </g>
    <text x="252" y="98" font-size="14" font-weight="600" fill="#222">Mécanique SKL</text>
  </svg>
  <!-- Information AVANT le toucher, liée au bouton par aria-describedby -->
  <figcaption class="carte__note" id="carte-avis">
    La carte est fournie par Google. Si vous l'affichez, Google recevra votre adresse IP
    et pourra déposer des témoins dans votre navigateur. Rien n'est envoyé tant que vous ne touchez pas le bouton.
    <a href="confidentialite.html#carte">Politique de confidentialité</a>
  </figcaption>
  <button type="button" class="btn btn--line carte__btn" data-carte-btn aria-describedby="carte-avis" hidden>
    Afficher la carte Google
  </button>
</figure>

<script>
(function () {
  var fig = document.querySelector('[data-carte]');
  if (!fig) return;
  var btn = fig.querySelector('[data-carte-btn]');
  // UNIQUEMENT une URL officielle :
  //  - code « Partager > Intégrer une carte » de Google Maps : https://www.google.com/maps/embed?pb=...
  //  - ou Maps Embed API : https://www.google.com/maps/embed/v1/place?key=CLE&q=...
  // Jamais https://www.google.com/maps?...&output=embed (non documenté).
  var SRC = ''; // à remplir ; tant que c'est vide, le bouton reste caché et seul le plan local s'affiche
  if (!/^https:\/\/www\.google\.com\/maps\/embed(\/v1\/place)?\?/.test(SRC)) return;
  btn.hidden = false;
  btn.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = SRC;                // première et seule requête vers Google, après le toucher
    f.title = 'Carte Google : Mécanique SKL, 1100, boulevard des Chutes, Québec';
    f.width = '100%';
    f.height = '320';           // au moins 200 x 200 px (exigence Google)
    f.style.border = '0';
    // Minimisation : n'envoie que le domaine, pas l'URL complète de la page.
    // Si une clé Embed API restreinte par référent est refusée, tester la valeur indiquée dans la doc Google.
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    f.setAttribute('allowfullscreen', '');
    fig.querySelector('.carte__apercu').replaceWith(f);
    btn.remove();
    f.focus();                  // accessibilité : le focus suit le contenu
  }, { once: true });
})();
</script>
```

Sans JavaScript, ou tant que `SRC` est vide, le visiteur voit le plan local et les liens d'itinéraire : rien ne manque et rien ne part chez Google. Le choix n'est pas mémorisé d'une visite à l'autre.

---

## 5. Géolocalisation du navigateur (optionnelle)

### Exigences (MDN)

- **Contexte sécurisé obligatoire** : HTTPS (ou `localhost` pour tester). Vérifier `window.isSecureContext`.
- **Permission explicite** du visiteur, demandée par le navigateur à l'appel de `getCurrentPosition()`. Peut aussi être bloquée par la `Permissions-Policy` (iframe).
- **Imprécision** : `coords.accuracy` en mètres (de quelques mètres en GPS à plusieurs kilomètres en Wi-Fi/IP sur ordinateur).
- Options : `enableHighAccuracy` (faux par défaut, plus lent et plus énergivore si vrai), `timeout` (infini par défaut : **toujours le fixer**), `maximumAge` (0 par défaut ; accepter une position récente accélère).

### Bonnes pratiques

- **Ne jamais demander la position au chargement.** Seulement au toucher d'un bouton explicite (« Calculer ma distance »), avec une phrase qui dit que tout reste sur l'appareil. C'est aussi l'exigence de l'art. 8.1 (désactivé par défaut, activé par le visiteur).
- **Ne rien envoyer, ne rien stocker** : ni serveur, ni `localStorage`, ni analytique.
- Gérer les refus et erreurs avec un message utile et **toujours proposer le bouton Itinéraire** (qui n'a pas besoin de la position).
- Si la précision est mauvaise (> 3 km), le dire au lieu d'afficher un chiffre trompeur.
- **Estimation du temps : prudente et présentée comme telle.** Le trajet routier dépasse la distance à vol d'oiseau d'environ 20 % dans les grandes villes et jusqu'à 50 % en banlieue (études de « circuité ») : on applique un facteur de 1,3 et on donne une **fourchette** arrondie, avec la mention « estimation, sans la circulation ». Pour un temps fiable, renvoyer vers l'application de navigation.

### Code prêt à l'emploi

```html
<div class="distance" data-distance>
  <!-- Explication AVANT le toucher -->
  <p class="distance__note" id="distance-avis">Votre position sert uniquement à calculer la distance sur votre appareil. Elle n'est ni envoyée, ni enregistrée.</p>
  <button type="button" class="btn btn--line" data-distance-btn aria-describedby="distance-avis">Calculer ma distance</button>
  <p class="distance__resultat" data-distance-out aria-live="polite"></p>
</div>

<script>
(function () {
  var GARAGE = { lat: 46.86987, lng: -71.17556 }; // 1100, boul. des Chutes (à revérifier sur place)
  var box = document.querySelector('[data-distance]');
  if (!box) return;
  var btn = box.querySelector('[data-distance-btn]');
  var out = box.querySelector('[data-distance-out]');

  if (!('geolocation' in navigator) || !window.isSecureContext) {
    box.hidden = true; // fonction indisponible : le bouton Itinéraire suffit
    return;
  }

  // Distance à vol d'oiseau (formule de haversine), en km. Calcul 100 % local.
  function haversineKm(lat1, lng1, lat2, lng2) {
    var R = 6371.0088; // rayon terrestre moyen (km)
    var rad = Math.PI / 180;
    var dLat = (lat2 - lat1) * rad;
    var dLng = (lng2 - lng1) * rad;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
  }

  // Fourchette prudente : route ≈ 1,3 × vol d'oiseau ; 35 à 50 km/h en ville ; +2 min (stationnement, feux).
  function tempsApprox(km) {
    var route = km * 1.3;
    var min = Math.round(route / 50 * 60);
    var max = Math.round(route / 35 * 60) + 2;
    var arr = function (m) { return Math.max(5, Math.ceil(m / 5) * 5); };
    if (route < 2) return 'moins de 5 minutes';
    return 'environ ' + arr(min) + ' à ' + arr(max) + ' minutes';
  }

  function fmtKm(km) {
    return km < 1 ? Math.round(km * 1000 / 50) * 50 + ' m'
                  : km.toLocaleString('fr-CA', { maximumFractionDigits: 1 }) + ' km';
  }

  btn.addEventListener('click', function () {
    btn.disabled = true;
    out.textContent = 'Recherche de votre position…';
    navigator.geolocation.getCurrentPosition(function (pos) {
      var c = pos.coords;
      var km = haversineKm(c.latitude, c.longitude, GARAGE.lat, GARAGE.lng);
      var txt = 'Vous êtes à ' + fmtKm(km) + ' du garage à vol d\'oiseau, soit ' +
                tempsApprox(km) + ' en voiture (estimation, sans la circulation).';
      if (c.accuracy > 3000) txt += ' Votre position est imprécise (± ' + fmtKm(c.accuracy / 1000) + ').';
      out.textContent = txt;
      btn.disabled = false;
    }, function (err) {
      var msg = {
        1: 'Vous avez refusé l\'accès à votre position. Aucun problème : le bouton Itinéraire fonctionne sans elle.',
        2: 'Votre position est introuvable pour le moment. Essayez le bouton Itinéraire.',
        3: 'La recherche a pris trop de temps. Réessayez ou utilisez le bouton Itinéraire.'
      };
      out.textContent = msg[err.code] || msg[2];
      btn.disabled = false;
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
  });
})();
</script>
```

Vérification de la fonction (Node 22) : 16 m entre les points MapQuest et Nokian ; 6,8 km du Château Frontenac (46.8118, -71.2052) au garage, soit « environ 15 à 20 minutes » affiché.

---

## 6. Données structurées Schema.org (JSON-LD)

Google exige pour `geo` **au moins 5 décimales** (respecté). Les heures acceptent `hh:mm` ou `hh:mm:ss`. Proposition qui remplace le bloc actuel de `index.html` (mêmes données, plus `geo`, `hasMap`, `areaServed` structuré et `url`) :

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["AutoRepair", "TireShop"],
  "@id": "https://DOMAINE-A-CONFIRMER/#garage",
  "name": "Mécanique SKL",
  "url": "https://DOMAINE-A-CONFIRMER/",
  "telephone": "+1-418-663-1195",
  "email": "mecaniqueSKL@outlook.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1100, boulevard des Chutes",
    "addressLocality": "Québec",
    "addressRegion": "QC",
    "postalCode": "G1E 2G1",
    "addressCountry": "CA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 46.86987,
    "longitude": -71.17556
  },
  "hasMap": "https://www.google.com/maps/search/?api=1&query=M%C3%A9canique%20SKL%2C%201100%20boulevard%20des%20Chutes%2C%20Qu%C3%A9bec%2C%20QC%20G1E%202G1",
  "areaServed": [
    { "@type": "Place", "name": "Beauport, Québec" },
    { "@type": "City", "name": "Québec" }
  ],
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday"], "opens": "08:00", "closes": "17:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "08:00", "closes": "12:00" }
  ],
  "sameAs": ["https://www.facebook.com/mecaniqueskl/"]
}
</script>
```

Remarques :
- Heures : une seule source (Otobox). Les garder marquées « à confirmer ».
- Le numéro 581 982-1195 (NAPA) n'est pas mis dans le JSON-LD : un seul numéro, celui confirmé par le plus de sources.
- Si le Place ID est trouvé, `hasMap` peut devenir `https://www.google.com/maps/search/?api=1&query=M%C3%A9canique%20SKL&query_place_id=PLACE_ID`.
- Valider avec le test des résultats enrichis de Google une fois le site en ligne.

---

## 7. UX mobile de la section « Nous trouver »

Ordre recommandé sur téléphone (pouce, une main) :

1. **Adresse en gros**, copiable (texte réel, pas une image), avec le quartier : « Beauport ».
2. **Un seul bouton principal plein** : « Itinéraire » (Google Maps universel, qui fonctionne sur Android, iPhone et ordinateur). Zone tactile d'au moins 44 × 44 px.
3. **Choix d'application en lien secondaire** juste en dessous : « Ouvrir avec Waze · Plans (iPhone) ». Pas de fenêtre de choix intermédiaire : un clic, une application. Option : n'afficher « Plans » qu'aux appareils Apple (détection par `navigator.userAgent`, sans conséquence si elle se trompe).
4. **Bouton Appeler** (`tel:`) au même niveau visuel que l'itinéraire : c'est l'autre action principale d'un garage.
5. **Heures du jour mises en évidence** (« Ouvert jusqu'à 17 h » / « Fermé, ouvre lundi 8 h »), déjà en place dans la maquette.
6. **Repères visuels** : une phrase du type « Entrée par … , enseigne NAPA AutoCare visible depuis le boulevard ». **À obtenir du garage** : aucun repère vérifiable n'a été trouvé en ligne, ne rien inventer. Ajouter une photo de la devanture si le garage en fournit une.
7. **Plan local SVG**, et seulement en option la **carte Google en façade** (section 4), sous les boutons, jamais au-dessus : sur mobile, une carte interactive capte le défilement (piège à pouce). Après chargement, garder une marge de défilement autour.
8. **Distance (section 5)** en option, discrète, sous la carte.
9. Stationnement : si le garage a des places client ou une consigne de dépôt des clés après les heures, l'écrire (information très demandée dans les localisateurs de commerces).

Ce que fait déjà bien la maquette : bouton Itinéraire Google, liens `tel:`, tableau d'heures, barre d'actions mobile, mention dans la politique de confidentialité. Améliorations : ajouter Waze et Plans, `travelmode=driving`, `geo` et `hasMap` dans le JSON-LD, façade de carte, unifier les numéros.

---

## 8. Synthèse des décisions

| Sujet | Décision |
|---|---|
| Coordonnées | 46.86987, -71.17556 (3 sources concordantes à 16 m près), à revérifier sur Google Maps avant la livraison |
| Itinéraire Google | `https://www.google.com/maps/dir/?api=1&destination=M%C3%A9canique%20SKL%2C%201100%20boulevard%20des%20Chutes%2C%20Qu%C3%A9bec%2C%20QC%20G1E%202G1&travelmode=driving` |
| Waze | `https://waze.com/ul?ll=46.86987%2C-71.17556&navigate=yes&zoom=17` |
| Apple Plans | `https://maps.apple.com/?daddr=1100%20boulevard%20des%20Chutes%2C%20Qu%C3%A9bec%2C%20QC%20G1E%202G1&dirflg=d` (format unifié à tester sur iPhone) |
| Carte intégrée | Par défaut : aucune (plan SVG local + liens). En option : façade locale + iframe officielle au toucher (« Intégrer une carte » sans clé, ou Maps Embed API avec clé). `output=embed` exclu (non documenté) |
| Loi 25 | Zéro requête vers Google avant un toucher éclairé ; avis affiché avant le bouton ; texte exact de la politique en tête du document ; géolocalisation au bouton seulement, explication avant, calcul local, rien transmis ni conservé |
| Schema.org | Ajouter `geo`, `hasMap`, `areaServed` structuré, `url`, `sameAs` |

---

## Sources

### Coordonnées et fiches du garage
- [MapQuest : Mecanique SKL, 1100 Boulevard Des Chutes](https://www.mapquest.com/ca/quebec/mecanique-skl-792488067)
- [MapQuest : Atelier Mecanique Des Chutes, 1100 Boulevard des Chutes](https://www.mapquest.com/ca/quebec/atelier-mecanique-des-chutes-280109405)
- [MapQuest : Boulevard des Chutes (point de rue 46.85973, -71.18247)](https://www.mapquest.com/ca/quebec/quebec/g1e/boulevard-des-chutes-46.85973,-71.18247)
- [Nokian Tyres : Kevin Lamontagne, Mecanique SKL, Québec G1E 2G1](https://na.nokiantyres.com/where-to-buy/dealer-locator/mecanique-skl-quebec/)
- [Tripadvisor : Mécanique Skl](https://www.tripadvisor.ca/Attraction_Review-g155033-d28316531-Reviews-Mecanique_Skl-Quebec_City_Quebec.html)
- [NAPA AutoCare : Mécanique SKL](https://napaautocare.ca/shop-locator/mecanique-skl)
- [Otobox : Mécanique SKL](https://otobox.ca/detaillants/quebec/mecanique-skl)
- [Facebook : Mécanique SKL](https://www.facebook.com/mecaniqueskl/)
- [Données Québec : bornes-fontaines de la Ville de Québec (CSV)](https://www.donneesquebec.ca/recherche/dataset/e7e90f77-6a1b-4b9e-bc3f-650f8fd30ab8/resource/a31d6442-8c62-4f9d-ae84-37c3f60027da/download/vdq-bornefontaine.csv)
- [Commission de toponymie : boulevard des Chutes](https://toponymie.gouv.qc.ca/ct/ToposWeb/Fiche.aspx?no_seq=218398)

### Google Maps (intégration, URL, conditions)
- [Google : Maps URLs, Get Started](https://developers.google.com/maps/documentation/urls/get-started)
- [Google : Google Maps URL referral](https://developers.google.com/maps/architecture/maps-url)
- [Google : Link to Google Maps (Place ID, query)](https://developers.google.com/maps/documentation/places/web-service/maps-links)
- [Google : Maps Embed API overview](https://developers.google.com/maps/documentation/embed/get-started)
- [Google : Embedding a map (Embed API)](https://developers.google.com/maps/documentation/embed/embedding-map)
- [Google : Maps Embed API Usage and Billing](https://developers.google.com/maps/documentation/embed/usage-and-billing)
- [Google : Google Maps Platform Terms of Service](https://cloud.google.com/maps-platform/terms)
- [Google : Google Maps Platform Service Specific Terms](https://cloud.google.com/maps-platform/terms/maps-service-terms)
- [Aide Google Maps : partager ou intégrer une carte](https://support.google.com/maps/answer/144361?hl=en&co=GENIE.Platform%3DDesktop)
- [Google Brand Resource Center : Geo Guidelines (intégrer une carte sans permission, liens bienvenus, attribution)](https://about.google/brand-resource-center/products-and-services/geo-guidelines/)
- [Google Maps : conditions d'utilisation additionnelles](https://www.google.com/help/terms_maps/)
- [Politique de confidentialité de Google](https://policies.google.com/privacy)
- [Aakash Web : intégrer Google Maps (URL `output=embed` sans clé, non officielle)](https://www.aakashweb.com/articles/how-to-embed-google-maps-on-your-website/)
- [Simon Willison : URL d'intégration OpenStreetMap](https://simonwillison.net/2024/Nov/25/openstreetmap-embed-url/)
- [OpenStreetMap : marqueur absent quand l'iframe est chargée après la page (issue #3929)](https://lists.openstreetmap.org/pipermail/rails-dev/2023-February/025856.html)

### Waze et Apple Plans
- [Google for Developers : How to use Waze Deep Links](https://developers.google.com/waze/deeplinks)
- [Google : Launch Google Maps or Waze (navigate=yes)](https://developers.google.com/maps/documentation/navigation/connect/launch-navigation-app)
- [Apple : Map Links (archive, daddr / dirflg)](https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/MapLinks/MapLinks.html)
- [Apple Developer Forums : daddr=lat,long ne fonctionne plus, renvoi vers les URL unifiées iOS 18.4](https://developer.apple.com/forums/thread/784030)
- [Apple WWDC25 : Go further with MapKit (URL unifiées)](https://developer.apple.com/videos/play/wwdc2025/204/)

### Loi 25, CAI, juristes
- [CAI : Principaux changements apportés par la Loi 25](https://www.cai.gouv.qc.ca/protection-renseignements-personnels/sujets-et-domaines-dinteret/principaux-changements-loi-25)
- [CAI : Rédiger une politique de confidentialité, guide pour les entreprises (PDF)](https://www.cai.gouv.qc.ca/uploads/pdfs/CAI_GU_POL_Confidentialite.pdf)
- [McMillan : le guide de la CAI sur la politique de confidentialité](https://mcmillan.ca/fr/perspectives/publications/la-commission-dacces-a-linformation-du-quebec-presente-un-guide-de-redaction-de-la-politique-de-confidentialite-a-publier-sur-un-site-web/)
- [Gouvernement du Québec : identification, localisation et profilage](https://www.quebec.ca/gouvernement/travailler-gouvernement/normes-gouvernance-pratiques-internes/protection-des-renseignements-personnels/technologie-et-droit-a-la-protection-des-renseignements-personnels/identification-localisation-profilage)
- [Gouvernement du Québec : protection de la vie privée par défaut](https://www.quebec.ca/gouvernement/travailler-gouvernement/normes-gouvernance-pratiques-internes/protection-des-renseignements-personnels/technologie-et-droit-a-la-protection-des-renseignements-personnels/protection-defaut)
- [Fasken : témoins et vie privée des internautes, tour d'horizon](https://www.fasken.com/fr/knowledge/2021/11/30-cookies-vie-privee-internautes-tour-horizon-canado-europeen)
- [Fasken : le profilage technologique sous la Loi 25](https://www.fasken.com/fr/knowledge/loi-25/13-profilage-technologique-avenir-sous-pl-64)
- [Fasken : transferts hors Québec et EFVP](https://www.fasken.com/fr/knowledge/loi-25/30-transfers-of-personal-information-outside-eu-quebec-impact-assessment)
- [BLG : transferts transfrontaliers de renseignements personnels hors du Québec](https://www.blg.com/fr/insights/2022/12/cross-border-transfers-of-personal-information-outside-quebec)
- [IAB Canada : bonnes pratiques Loi 25, transparence (PDF)](https://iabcanada.com/wp-content/uploads/2022/06/IAB-Canada_BPG-Que_Transparence_June-2022.pdf)
- [RCGT : Loi 25 et gestion des témoins](https://www.rcgt.com/fr/conseils/avis-d-experts/loi-25-gestion-temoins-comment-conformer-loi/)
- [Q14 : appliquer la Loi 25 à son site Web (modules externes dont Google Maps)](https://q14.plus/blogue/loi-25-renseignements-personnels/)
- [Cookiebeam : consentement pour Google Maps intégré](https://cookiebeam.com/guides/google-maps-embed-consent-2026)
- [iubenda : Google Maps et le RGPD (contexte européen, comparable)](https://www.iubenda.com/en/help/62728-google-maps-and-the-gdpr-how-to-be-compliant/)
- [ConsentStack : témoins de Google Maps (NID)](https://www.consentstack.io/vendors/google-maps)

### Géolocalisation, distance, données structurées, UX
- [MDN : Geolocation.getCurrentPosition()](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition)
- [MDN : options maximumAge / timeout / enableHighAccuracy](https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions/maximumAge)
- [Boeing : circuité des réseaux routiers (arXiv)](https://arxiv.org/pdf/1708.00836)
- [Ballou et al. (2002) : facteurs de circuité routière par pays](https://trid.trb.org/view.aspx?id=726009)
- [Google Search Central : données structurées LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Schema.org : AutoRepair](https://schema.org/AutoRepair)
- [Econsultancy : UX mobile des localisateurs de magasins](https://econsultancy.com/store-locator-tools-which-retailers-offer-the-best-mobile-ux/)
- [Nielsen Norman Group : Store Finders and Locators](https://www.nngroup.com/reports/ecommerce-store-finders-and-locators/)
- [Storemapper : 10 bonnes pratiques de localisateur](https://storemapper.com/blog/10-store-locator-best-practices-to-help-people-find-your-business)
