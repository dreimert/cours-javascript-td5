var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const commandes = {
  nom: function(nom) {
    console.log("L'utilisateur veut changer son nom pour ", nom);
  }
};

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('cmd', function(cmd){
    const params = cmd.split(' ');
    const commandeName = params[0]; // exemple : commandeName = "nom"
    const commandeArguments = params.slice(1); // exemple : commandeArguments = ["Luffy"]

    if(commandes[commandeName]){
      commandes[commandeName](...commandeArguments); // ... est appelé opérateur de décomposition : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/Op%C3%A9rateur_de_d%C3%A9composition
      socket.emit('msg', "Commande bien reçu");
    } else {
      console.log("La commande n'existe pas !");
      socket.emit('msg', "La commande n'existe pas !");
    }

    io.emit('msg', cmd);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
