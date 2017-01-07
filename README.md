# Cours de Javascript : TD 5 - Étape 3

Vous avez un MUD minimal. Si vous voulez aller plus loin voici quelles idées.

## Facile

* Quand quelqu'un fait une action comme mettre un panneau, arriver ou partir d'une case, informer les autres personnes présentes.
* Génère aléatoirement le type de la case. Par exemple : colline, forêt, rivière...
* Fait un système pour reprendre sa progression quand on reprend son ancien nom.

## Moyen

* Distingue les différents type de messages dans l'interface : les événements, les paroles, les descriptions. Pour ça, utilise plusieurs types d'événement socket.io et différentes style et / ou couleurs d'écriture.
* Implémente des cases sur lesquels ont ne peut pas se déplacer comme des murs ou des montagnes.
* Faut un système de chargement de carte.
* Sauvegarde le monde.
* Fait un système de login qui empèche le joueur de jouer tant qu'il n'a pas créé un compte ou qu'il ne s'est pas loggué.
* Implémente un inventaire
* Implémente un système d'artisanat

## Dur

* Créé un générateur procédural du monde
* ... avec des donjons !
* Implémente un système de quêtes
* Implémente un système de combat
