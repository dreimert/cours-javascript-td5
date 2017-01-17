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

    console.log(commandeName);
    console.log(commandeArguments);

    io.emit('msg', cmd);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
