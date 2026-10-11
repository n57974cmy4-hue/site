# Awrabaya — site vitrine

*Ma pudeur, mon trésor.* Site d'une seule page, piloté au scroll : une étoile à huit
branches (le khatam du zellige) en cristal champagne s'éclate en quatre fragments puis se recompose, sur cinq
chapitres (Accueil, À propos, Collection, Clientes, Contact), sur un fond qui
passe de l'ivoire au taupe. Tout est rendu en temps
réel avec Three.js, sans image ni vidéo.

## L'expérience

1. **La porte du riad.** À l'arrivée, une porte en bois sculpté attend dans une arche de
   pierre. La visiteuse prend la clé en laiton : elle vole jusqu'à la serrure, s'enfonce,
   tourne, et les deux battants s'ouvrent sur une penderie baignée de lumière. On entre.
   Le bouton « Passer l'intro » et la touche Échap permettent de l'éviter.
2. **Le site 3D.** L'étoile de cristal, percée comme une broche, se décompose et se recompose au scroll.
3. **Le dressing.** Le bouton « Le dressing » (en-tête, accueil, chapitre Collection) ouvre
   les portes d'une penderie tournante : on la fait tourner du doigt, à la souris, à la
   molette ou avec les flèches, les cintres se balancent, et chaque pièce s'ouvre sur sa
   fiche (coloris, taille, commande par e-mail).

## Voir le site

```sh
python3 serve.py 5180
```

Puis ouvrir <http://127.0.0.1:5180>. `index.html` a besoin d'un serveur (local ou
en ligne). `version-monofichier.html` contient tout le site dans un seul fichier et
s'ouvre directement par double-clic.

## Modifier

| Quoi | Où |
|---|---|
| Textes, menu | `index.html` |
| Adresse e-mail | `index.html` : lien `mailto:` (ligne 123) et attribut `data-email` du formulaire (ligne 125) |
| Les trois chiffres du chapitre « Clientes » | `index.html`, lignes 109 à 111 : `data-count` **et** le nombre affiché |
| Objet en cristal (l'étoile bijou) | `assets/shapes/shape.svg` (dessinée par `sources/etoile-bijou.py`) et sa copie en ligne dans `index.html` (`<script data-shape>`) |
| Logo de l'en-tête | `assets/brand/mark.svg` |
| Couleurs du fond (ivoire → taupe) | `SITE.palette` en tête de `js/app.js` |
| Mise en page | `css/styles.css` |
| Palette, typographie (Playfair Display, Jost), boutons | bloc « maison theme » à la fin de `css/awrabaya.css` |
| Articles du dressing (nom, prix, coloris, tailles, description) | `js/catalogue.js` |
| Dessins des vêtements | `js/garments.js` |
| Porte d'entrée | `js/intro.js` et `css/awrabaya.css` |
| Dressing tournant, fiche produit, commande | `js/dressing.js` et `css/awrabaya.css` |

Après une modification, régénérez la version monofichier :

```sh
python3 build_monofichier.py
```

Les articles de `js/catalogue.js` sont des exemples : remplacez-les par les vôtres.
Le bouton « Commander » ouvre la messagerie avec la pièce, le coloris et la taille ; il
sera remplacé par le panier de la boutique WooCommerce.

## Tout régénérer depuis le brief

Attention : `tools/build_site.py` repart du gabarit d'origine, sans la porte ni le
dressing. Modifiez plutôt les fichiers directement, puis `python3 build_monofichier.py`.

`site.json` contient tous les textes, la palette et les fichiers du logo
(`sources/`). Pour reconstruire le site complet dans un autre dossier :

```sh
python3 tools/build_site.py site.json --out ../awrabaya-build
```

## Contenu

```text
index.html                 Structure et contenu
css/                       Mise en page, thème et polices
js/app.js                  Scène 3D, verre, découpage, scroll, formulaire
assets/shapes/shape.svg    L'étoile bijou en cristal
assets/brand/mark.svg      Le logo AWRABAYA de l'en-tête
sources/                   Logo d'origine et ses versions vectorisées
vendor/                    Three.js r160
tools/                     Outils de génération des formes et du site
version-monofichier.html   Le site entier en un seul fichier
```

Le formulaire de contact ouvre la messagerie de la visiteuse avec un message
prérempli : aucun serveur n'est nécessaire, le site s'héberge sur n'importe quel
hébergement statique (GitHub Pages, Netlify, OVH…).
