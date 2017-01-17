# Cours de Javascript : TD 5 - Étape 2

Vous avez une application de chat fonctionnelle qui communique en temps réel avec un serveur et les autres participants. Nous allons voir comment transformer tout ça en un MUD !

## Définition

Un MUD est un *Multi-User Dungeon*, cf. [article Wikipedia](https://fr.wikipedia.org/wiki/Multi-user_dungeon). Historiquement, toutes les interactions sont en texte, que ce soit les actions du joueur ou la description des décors. Le but est d'explorer à l'aide d'un avatar virtuel un espace dans lequel on peut interagir avec les éléments des décors, des personnes non joueurs (PNJ) controlé par le serveur ou encore les autres joueurs. Pour se déplacer, le joueur va de case en case en tapant par exemple "Nord", "Sud", "Ouest" ou "Est" ou encore "Haut", "Bas", "Gauche" ou "Droite". L'avatar peut avoir plusieurs caractéristiques comme un nom, des points de vie...

## Cahier des charges

Voici une liste des fonctions minimales que doit permettre un MUD :

* Pouvoir choisir son nom d'utilisateur
* Savoir où le personnage est
* Pouvoir déplacer le personne
* Décrire le décor
* Pouvoir discuter avec les autres utilisateurs
* Pouvoir interagir avec le décor

## Choix du nom d'utilisateur

Il faut que l'utilisateur puisse choisir un nom. Pour se faire, on va utiliser une commande qui pendra en paramètre le nom. Quelque chose de la forme : `nom monNom`. Pour des raisons de simplicité, il n'est pas possible d'avoir d'espace dans le nom.

Pour être plus lisible, coté client c.-à-d. le code executé par le navigateur, renommez `chat message` en `cmd` pour les événements émis et en `msg` pour les événements reçus. Faite les modifications appropriées coté serveur, c.-à-d. le code executé par node, pour que le chat continu de fonctionner.

Au niveau du client, il n'y a rien à changer, l'utilisateur peut déjà taper du texte. Il faut modifier le serveur pour qu'il traite correctement la commande de l'utilisateur. 

Au niveau du serveur, il faut maintenant analyser les commandes reçues pour effectuer l'action l'action voulu. Une commande a un nom et peut être suivi de paramètres. Pour connaitre le nom de la commande, il suffit de récupérer le premier mot. Il faut ensuite comparait ce nom avec la liste des commandes disponibles.

Commençons par créer la liste des commandes. Copier ce code au debut de votre index.js :

```Javascript
const commandes = {
  nom: function(nom) {
    console.log("L'utilisateur veut changer son nom pour ", nom);
  }
};
```

> #### Q1 - Que fait ce code ?

Il faut maintenant récupérer le nom de la commande tapée par l'utilisateur et vérifier qu'elle existe. Modifiez le code ci-après pour que `commandeName` contient le nom de la commande et que `commandeArguments` contienne les arguments. Pour vous aider, vous pouvez aller voir la [documentation de la fonction split](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String/split) et [celle de la fonction slice](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String/slice).

```Javascript
socket.on('cmd', function(cmd){ // exemple : cmd = "nom Luffy"
  // votre code...
  const commandeName = ...; // exemple : commandeName = "nom"
  const commandeArguments = ...; // exemple : commandeArguments = ["Luffy"]

  io.emit('msg', cmd);
});
```

Pour vérifier qu'une commande existe, il suffit de tester si elle existe dans `commandes`.

```Javascript
socket.on('cmd', function(cmd){ // exemple 2 : "commande avec des arguments"
  // votre code...
  const commandeName = /* ... */; // exemple 2 : "commande"
  const commandeArguments = /* ... */; // exemple 2 : ["avec", "des", "arguments"]

  if(commandes[commandeName]){
    commandes[commandeName](...commandeArguments); // ... est appelé opérateur de décomposition : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Op%C3%A9rateur_de_d%C3%A9composition
    socket.emit('msg', "Commande bien reçu");
  } else {
    console.log("La commande n'existe pas !");
    socket.emit('msg', "La commande n'existe pas !");
  }

  io.emit('msg', cmd);
});
```

Tester votre code avec plusieurs onglets.

> #### Q2 - Quel est la différence entre `socket.emit` et `io.emit` ?

Vous récupérez la commande et le nom de l'utilisateur mais on ne modifie rien pour le moment. Commençons par mettre un nom par défaut à tous les utilisateurs à `"Anonymous"`. Pour ce faire, pour chaque socket et à sa connexion, on associe un object à la socket qui contient un champs *nom* contenant `"Anonymous"`

```Javascript
io.on('connection', function(socket){
  socket.data = {
    nom: "Anonymous"
  };
  console.log('a user connected :', socket.data.nom);

  //...
)}
```

Modifiez le code pour que les messages envoyer à tous soit pré-fixé par le nom de l'émetteur.

Il faut que la fonction de modification du nom puisse modifier les données de l'utilisateur. Pour cela, on va passer à cette fonction la socket ! Ce qui permettra aussi à la fonction d'envoyer des messages directement à l'utilisateur.

```Javascript
    if(commandes[commandeName]){
      commandes[commandeName](socket, ...commandeArguments);
      socket.emit('msg', "Commande bien reçu");
    } else {
```

Modifiez la commande en conséquence et mettez à jour le nom de l'utilisateur.

Vous avez changé le nom de l'utilisateur mais pour le moment, les commandes sont toujours envoyées aux autres participants. À la place, il vaudrait mieux envoyer un message de lisible. Mettons en place une architecture générique permettant à toutes commandes d'envoyer un message à tous les participants :

```Javascript
    if(commandes[commandeName]){
      const msg = commandes[commandeName](socket, ...commandeArguments);
      if(msg) {
        io.emit('msg', msg);
      }
    } else {
```

Modifiez la commande pour qu'elle retourner une chaine comme `"Inconnu a changé de nom pour exemple."`.

Vous avez maintenant une commande qui modifie le nom de l'utilisateur avec une architecture permettant d'ajouter facilement d'autres commande.

## Le déplacement

Maintenant que le personnage a un nom, il faut le faire ce déplacer dans le monde. Avant de pouvoir se déplacer, il faut un monde ! Pour commencer, on va imaginer que le monde est une immense plaine infini et que l'on créera les cases à la volée en fonction des besoins. Créez le monde en copiant ce code au début du fichier index.js :

```Javascript
class Coord {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `${this.x},${this.y}`;
  }
}

class Monde {
  constructor() {
    this.map = {};
  }

  getCase(coord) {
    const coordString = coord.toString();

    if(!this.map[coordString]){
      this.map[coordString] = {
        coord: coord,
        type: "plaine"
      };
    }

    return this.map[coordString];
  }
}

const monde = new Monde();
```

Essayez de comprendre comment fonctionne ce code.

> #### Q3 - Que fait la fonction `getCase` ?

Maintenant que le monde existe, il faut placer nos utilisateurs dedans.

Commencez par mettre une coordonnées par défaut à tout nos utilisateurs.

```Javascript
  socket.data = {
    nom: "Anonymous",
    coord: new Coord()
  };
```

> ### Q4 - Code met par défaut tous les utilisateurs à la coordonnée 0, 0. Pourquoi ?

Fait en sorte que quand l'utilisateur se connect, il reçoive un message l'informant de sa position.

Nous allons allons implémenter les commandes "nord", "sud", "ouest" et "est".

Commencez par implémenter ces fonctions sur la classe `Coord`. Chacun de ces fonctions doit retourner une nouvelle coordonnée qui correspond au déplacement. Il vaut mieux retourner un nouvel object plutôt que de modifier l'existant sinon l'on pourrait modifier sans le faire exprès la coordonnée d'une case du monde par exemple.

`coord.nord()` retourne une nouvelle coordonées sans modifier la précédente ? Parfait !

Vous pouvez maintenant implémenter les commandes ! N'oubliez pas d'envoyer un message à l'utilisateur pour lui signaler ça nouvelle position.

### Interlude sur les modules

Notre code coté serveur reste raisonnable en taille mais mélange beaucoup de chose. Pour le rendre un peu plus clair, il faut le séparer en module. Vous avez déjà manipulé les modules en node. Quand vous faite `require('express')`, vous appeler le module `express`. Il est temps de créer le votre.

Créer un nouveau fichier `Coord.js` et copier le code suivant :

```JavaScript
class Coord {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `${this.x},${this.y}`;
  }

  nord() {
    return new Coord(this.x, this.y + 1);
  }

  sud() {
    return new Coord(this.x, this.y - 1);
  }

  ouest() {
    return new Coord(this.x - 1, this.y);
  }

  est() {
    return new Coord(this.x + 1, this.y);
  }
}

module.exports = Coord;
```

Observez le module.exports qui export la classe *Coord*.

Maintenant, dans votre `index.js`, supprimez la classe *Coord* et remplacer par :

```JavaScript
const Coord = require('./Coord');
```

Comme pour `express` ou `socket.io` cette commande charge le module `Coord`. Vérifiez que le code fonctionne.

Faite maintenant la même chose pour `Monde` et `commandes`. Votre index.js doit ressemblé à ça :

```JavaScript
// Autres require

const Coord = require('./Coord');
const Monde = require('./Monde');
const commandes = require('./commandes');

const monde = new Monde();

// express + socket.io
```

## Décrire le décor

Il faut maintenant décrire le monde mais depuis `commandes` on n'a pas accès au monde. Et puis, une case du monde devrait se décrire elle-même.

Créez un fichier `Case.js` et implémentez une classe dont le constructeur prend en paramètre et stocke le monde, la coordonnée et le type. La classe doit aussi implémenter les fonctions "nord", "sud", "ouest" et "est" qui retourne les cases correspondantes. Pour finir, implémenter une fonction `toString` qui décrit la case et les cases adjacentes.

Modifiez la classe `Monde` pour qu'elle utilise `Case`.

Modifiez l'initialisation d'un personnage comme suit :

```JavaScript
  socket.data = {
    nom: "Anonymous",
    case: monde.getCase(new Coord())
  };
```

Modifier les commandes pour mettre à jour correctement l'utilisateur et lui décrire le décor.

Exemple de texte retourné :

> Vous êtes en 0,1 sur une plaine. Au nord, il y a une plaine. Au sud, il y a une plaine. À l'ouest, il y a une plaine. Et à l'est, il y a une plaine.

## Pouvoir discuter avec les autres utilisateurs

Implémentez une commande `dire` qui permet de parler au autres joueurs. Pour vous aider voici comment j'écrire les paramètres de la commande :

```JavaScript
dire: function(socket, ...mots) {

}
```

Problème, cette fonction envoie le message à tout le monde quelque soit sa position. Il faut modifier notre code pour pouvoir envoyer uniquement aux personnages sur la même case. Pour cela, il suffit de stocker la socket des personnages présents dans la case.

Ajouter trois nouvelles fonctions à `Case` : `addSocket`, `removeSocket` et `sendToMembers`. Ces fonctions font respectivement : Ajoute une socket à la liste des membres de la case, enlève une socket à la liste des membres de la case et envoie un message à tous les membres de la case. Pour supprimer un élément d'un tableau, vous pouvez utiliser la [fonction splice](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/splice). Pour connaitre la position d'un élément, utilisez la [fonction indexOf](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array/indexOf).

Modifier `commandes.js` pour mettre à jour correctement les cases. Modifier `index.js` pour initialiser correctement la première case et pour retirer la socket quand l'utilisateur se déconnecte.

Testez votre code. Les autres utilisateurs ne doivent voir le résultat de la commande dire que s'ils sont sur la même case que vous.

## Pouvoir interagir avec le décor

Faite une commande qui permet de poser un panneau. Les panneaux doivent être décrit dans la description de la case quand un personnage arrive.

## La suite...

Vous avez maintenant un MUD minimal ! Si vous voulez aller plus loin, passer à l'étape 2 : git checkout etape-2.
