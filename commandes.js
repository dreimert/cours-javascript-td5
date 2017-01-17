const commandes = {
  nom: function(socket, nom) {
    const last = socket.data.nom;
    socket.data.nom = nom;
    return `${last} a changé de nom pour ${nom}.`;
  },
  nord: function(socket) {
    socket.data.case = socket.data.case.nord();
    socket.emit('msg', socket.data.case.toString());
  },
  sud: function(socket) {
    socket.data.case = socket.data.case.sud();
    socket.emit('msg', socket.data.case.toString());
  },
  ouest: function(socket) {
    socket.data.case = socket.data.case.ouest();
    socket.emit('msg', socket.data.case.toString());
  },
  est: function(socket) {
    socket.data.case = socket.data.case.est();
    socket.emit('msg', socket.data.case.toString());
  }
};

module.exports = commandes;
