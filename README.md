# Awrabaya — site vitrine

*Ma pudeur, mon trésor.* La boutique en ligne d'Awrabaya, mode pudique à petits prix.
Une page légère, sans 3D : elle s'ouvre de la même façon sur téléphone et sur ordinateur.

## L'expérience

1. **La porte du riad.** À l'arrivée, une porte en bois sculpté attend dans une arche de
   pierre. La visiteuse prend la clé : elle vole jusqu'à la serrure et tourne, les battants
   s'ouvrent sur la page d'accueil, et le mur s'efface. « Passer l'intro » et Échap
   permettent de l'éviter.
2. **La cabine.** En haut de l'accueil, une pièce sur son mannequin, sous une arche, change
   de coloris toute seule ; pastilles de couleur, flèches et « Voir la pièce ».
3. **Le défilé.** Toute la collection glisse lentement à l'écran ; au survol, la pièce
   montre un autre coloris ; un clic ouvre sa fiche.
4. **Le dressing.** Un plateau tournant en marbre et or où les mannequins sont disposés en
   cercle (en-tête, accueil, défilé), avec filtres et fiches produit : coloris, taille,
   commande par e-mail.

## Voir le site

```sh
python3 serve.py 5180
```

Puis ouvrir <http://127.0.0.1:5180>. `version-monofichier.html` contient tout le site
dans un seul fichier et s'ouvre directement par double-clic.

## Modifier

| Quoi | Où |
|---|---|
| Textes des sections | `index.html` |
| Adresse e-mail | `index.html` : lien `mailto:` et attribut `data-email` du formulaire |
| Les trois chiffres « Clientes » | `index.html`, section `clientes` : `data-count` **et** le nombre affiché |
| Articles (nom, prix, coloris, tailles, description) | `js/catalogue.js` |
| Pièces de la cabine | `FEATURED` en tête de la partie « fitting room » de `js/site.js` |
| Photos des articles | `assets/products/` (WebP détouré, 820 × 1260, mannequin en bas au centre), référencées dans `js/catalogue.js` par coloris (`photo`) |
| Dessins de secours (articles sans photo) | `js/garments.js` |
| Mise en page, palette, typographie | `css/site.css` (variables en tête) |
| Porte d'entrée et dressing | `js/intro.js`, `js/dressing.js` et `css/awrabaya.css` |

Après une modification, régénérez la version monofichier :

```sh
python3 build_monofichier.py
```

Les articles de `js/catalogue.js` sont des exemples : remplacez-les par les vôtres.
Le bouton « Commander » ouvre la messagerie avec la pièce, le coloris et la taille ; il
sera remplacé par le panier de la boutique WooCommerce.

## Contenu

```text
index.html                 La page
css/site.css               Mise en page, palette, typographie
css/awrabaya.css           Porte d'entrée et dressing
css/fonts.css              Playfair Display et Jost
js/site.js                 Cabine, défilé, apparitions, compteurs, formulaire
js/intro.js                Porte d'entrée
js/dressing.js             Penderie tournante et fiches produit
js/catalogue.js            Les articles
js/garments.js             Dessins des vêtements
assets/products/           Photos détourées des articles
assets/brand/mark.svg      Le logo AWRABAYA
assets/fonts/              Polices WOFF2
sources/                   Logo d'origine et sa version vectorisée
version-monofichier.html   Le site entier en un seul fichier
```

Le formulaire de contact ouvre la messagerie de la visiteuse avec un message prérempli :
aucun serveur n'est nécessaire, le site s'héberge sur n'importe quel hébergement statique.
