# Site de Léonel Djikeleng

Site personnel : automatisations, agents IA et sites web pour les PME de Québec.
Code autonome, sans compilation, que tu héberges où tu veux. Les demandes du formulaire vont dans **ton propre projet Supabase**.

Ce dossier est indépendant du reste du dépôt : il peut être déplacé tel quel dans son propre dépôt GitHub (recommandé, voir plus bas).

```
leonel-djikeleng/
├── site/                       ← le site à mettre en ligne (HTML, CSS, JS)
│   ├── index.html              ← page d'accueil (offres, métiers, démarche, FAQ, formulaire)
│   ├── confidentialite.html    ← politique Loi 25
│   ├── accessibilite.html
│   ├── 404.html
│   ├── assets/css/styles.css   ← couleurs, polices et espacements en tête de fichier
│   ├── assets/js/config.js     ← adresse et clé publique Supabase (à remplir)
│   ├── assets/js/main.js       ← menu, barre d'appel mobile, carrousels, formulaire
│   ├── assets/img/             ← vraies photos (Pexels), optimisées en WebP
│   ├── assets/fonts/           ← Fraunces et Hanken Grotesk, hébergées sur le site
│   └── credits-photos.txt
├── supabase/
│   ├── migrations/0001_demandes_diagnostic.sql   ← table, contraintes, sécurité
│   └── functions/demande-diagnostic/index.ts     ← reçoit le formulaire, anti-pourriel
└── projet/                     ← direction artistique, offres, décisions à valider
```

## Voir le site en local

```
cd leonel-djikeleng/site
python3 -m http.server 8790
```
Puis ouvrir http://localhost:8790.

## Mettre en ligne (au choix)

Le dossier `site/` est un site statique : n'importe quel hébergeur fonctionne.

- **Hostinger** : envoyer le contenu de `site/` dans `public_html/` (gestionnaire de fichiers ou FTP).
- **GitHub Pages** : dépôt dédié, Settings → Pages → Source « GitHub Actions » ou branche `main` / dossier racine.
- **Netlify / Cloudflare Pages** : dossier de publication `site`, aucune commande de compilation.

Après la mise en ligne : remplacer `https://leoneldjikeleng.com/` par le vrai domaine dans `index.html` (balise `canonical`), `robots.txt` et `sitemap.xml`.

## Brancher le formulaire sur ton Supabase

Tant que `assets/js/config.js` est vide, le formulaire n'envoie rien et invite le visiteur à appeler ou texter au 418 255-7236. Rien n'est perdu en silence.

1. Créer un projet sur supabase.com. **Région conseillée : Canada (Central)**, pour garder les données au Canada (Loi 25).
2. SQL Editor → coller et exécuter `supabase/migrations/0001_demandes_diagnostic.sql`.
3. Installer la CLI Supabase, puis depuis `leonel-djikeleng/` :
   ```
   supabase login
   supabase link --project-ref <ref-du-projet>
   supabase secrets set ORIGINES_AUTORISEES="https://leoneldjikeleng.com,https://www.leoneldjikeleng.com"
   supabase functions deploy demande-diagnostic --no-verify-jwt
   ```
4. Dans `site/assets/js/config.js` : mettre l'URL du projet et la clé **publique** (`anon` / `publishable`). Jamais la clé `service_role`.
5. Tester : envoyer une demande depuis le site, puis Table Editor → `demandes_diagnostic`.

Sécurité en place :
- Les visiteurs n'ont **aucun accès direct** à la table (RLS activée, aucune politique publique) : seule la fonction écrit, avec la clé serveur.
- La base refuse les données mal formées (contraintes CHECK), même si quelqu'un contourne le site.
- Anti-pourriel : champ piège invisible + délai minimal de 3 secondes. Un robot reçoit une fausse confirmation, rien n'est enregistré.
- La fonction n'accepte que les requêtes venant de ton domaine (`ORIGINES_AUTORISEES`).
- Conservation 12 mois : tâche `pg_cron` prête, en commentaire dans la migration.

Plus tard, la colonne `statut` (nouvelle → contactée → appel fixé → soumission envoyée → gagnée / perdue) permet de suivre les demandes comme un petit CRM, ou de les relier à n8n.

## Déplacer dans un dépôt dédié (recommandé)

1. Créer sur GitHub un dépôt vide, par exemple `leonel-djikeleng-site`.
2. Copier le contenu de ce dossier à la racine du nouveau dépôt.
3. Me donner le nom du dépôt : je peux pousser le code et préparer la publication automatique.

## Modifier le contenu

- Textes : directement dans `site/index.html`.
- Couleurs, polices, espacements : variables en tête de `site/assets/css/styles.css`.
- Ta photo : remplacer le bloc commenté `À COMPLÉTER` de la section « À propos » par `<img src="assets/img/leonel.webp" …>` (portrait 4:5, ~900 × 1125, WebP).
- Réseaux sociaux : réactiver la colonne « Réseaux » du pied de page (commentaire `À COMPLÉTER`).

## Licences

Photos : Licence Pexels, usage commercial permis (détail dans `site/credits-photos.txt`). Polices : SIL Open Font License.
