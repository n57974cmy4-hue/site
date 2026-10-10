# Awrabaya — site vitrine

*Ma pudeur, mon trésor.* Site d'une seule page, piloté au scroll : une arche orientale
(fenêtre de riad) en verre 3D teinté champagne s'éclate en quatre fragments puis se recompose, sur cinq
chapitres (Accueil, À propos, Collection, Clientes, Contact), sur un fond qui
passe de l'ivoire au taupe. Tout est rendu en temps
réel avec Three.js, sans image ni vidéo.

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
| Objet en verre (l'arche orientale) | `assets/shapes/shape.svg` (dessinée par `sources/arche-orientale.py`) |
| Logo de l'en-tête | `assets/brand/mark.svg` |
| Couleurs du fond (ivoire → taupe) | `SITE.palette` en tête de `js/app.js` |
| Mise en page, couleurs du texte | `css/styles.css` |

Après une modification, régénérez la version monofichier :

```sh
python3 build_monofichier.py
```

## Tout régénérer depuis le brief

`site.json` contient tous les textes, la palette et les fichiers du logo
(`sources/`). Pour reconstruire le site complet dans un autre dossier :

```sh
python3 tools/build_site.py site.json --out ../awrabaya-build
```

## Contenu

```text
index.html                 Structure et contenu
css/                       Mise en page et police
js/app.js                  Scène 3D, verre, découpage, scroll, formulaire
assets/shapes/shape.svg    L'arche orientale en verre
assets/brand/mark.svg      Le logo AWRABAYA de l'en-tête
sources/                   Logo d'origine et ses versions vectorisées
vendor/                    Three.js r160
tools/                     Outils de génération des formes et du site
version-monofichier.html   Le site entier en un seul fichier
```

Le formulaire de contact ouvre la messagerie de la visiteuse avec un message
prérempli : aucun serveur n'est nécessaire, le site s'héberge sur n'importe quel
hébergement statique (GitHub Pages, Netlify, OVH…).
