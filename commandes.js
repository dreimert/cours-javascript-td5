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

module.exports = commandes;
