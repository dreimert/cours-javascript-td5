var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const commandes = {
  nom: function(socket, nom) {
    const last = socket.data.nom;
    socket.data.nom = nom;
    return `${last} a changé de nom pour ${nom}.`;
  }
};

io.on('connection', function(socket){
  socket.data = {
    nom: "Anonymous"
  };
  console.log('a user connected :', socket.data.nom);

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('cmd', function(cmd){
    const params = cmd.split(' ');
    const commandeName = params[0]; // exemple : commandeName = "nom"
    const commandeArguments = params.slice(1); // exemple : commandeArguments = ["Luffy"]

    if(commandes[commandeName]){
      const msg = commandes[commandeName](socket, ...commandeArguments);
      if(msg) {
        io.emit('msg', msg);
      }
    } else {
      console.log("La commande n'existe pas !");
      socket.emit('msg', "La commande n'existe pas !");
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
