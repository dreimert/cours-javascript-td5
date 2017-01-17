var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const Coord = require('./Coord');
const Monde = require('./Monde');
const commandes = require('./commandes');

const monde = new Monde();

io.on('connection', function(socket){
  socket.data = {
    nom: "Anonymous",
    case: monde.getCase(new Coord())
  };
  console.log('a user connected :', socket.data.nom);

  socket.data.case.addSocket(socket);

  socket.emit('msg', socket.data.case.toString());

  socket.on('disconnect', function(){
    console.log('user disconnected');
    socket.data.case.removeSocket(socket);
  });

  socket.on('cmd', function(cmd){
    const params = cmd.split(' ');
    const commandeName = params[0]; // exemple : commandeName = "nom"
    const commandeArguments = params.slice(1); // exemple : commandeArguments = ["Luffy"]

    if(commandes[commandeName]){
      const msg = commandes[commandeName](socket, ...commandeArguments);
      if(msg) {
        socket.data.case.sendToMembers(msg);
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
