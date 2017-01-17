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
  },
  nord: function(socket) {
    socket.data.coord = socket.data.coord.nord();
    socket.emit('msg', `Vous êtes maintenant à la case ${socket.data.coord}`);
  },
  sud: function(socket) {
    socket.data.coord = socket.data.coord.sud();
    socket.emit('msg', `Vous êtes maintenant à la case ${socket.data.coord}`);
  },
  ouest: function(socket) {
    socket.data.coord = socket.data.coord.ouest();
    socket.emit('msg', `Vous êtes maintenant à la case ${socket.data.coord}`);
  },
  est: function(socket) {
    socket.data.coord = socket.data.coord.est();
    socket.emit('msg', `Vous êtes maintenant à la case ${socket.data.coord}`);
  }
};

const Coord = require('./Coord');

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

io.on('connection', function(socket){
  socket.data = {
    nom: "Anonymous",
    coord: new Coord()
  };
  console.log('a user connected :', socket.data.nom);

  socket.emit('msg', `Vous êtes à la case ${socket.data.coord}`);

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
