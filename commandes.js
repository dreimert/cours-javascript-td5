const commandes = {
  nom: function(socket, nom) {
    const last = socket.data.nom;
    socket.data.nom = nom;
    return `${last} a changé de nom pour ${nom}.`;
  },
  nord: function(socket) {
    socket.data.case.removeSocket(socket);
    socket.data.case = socket.data.case.nord();
    socket.data.case.addSocket(socket);
    socket.emit('msg', socket.data.case.toString());
  },
  sud: function(socket) {
    socket.data.case.removeSocket(socket);
    socket.data.case = socket.data.case.sud();
    socket.data.case.addSocket(socket);
    socket.emit('msg', socket.data.case.toString());
  },
  ouest: function(socket) {
    socket.data.case.removeSocket(socket);
    socket.data.case = socket.data.case.ouest();
    socket.data.case.addSocket(socket);
    socket.emit('msg', socket.data.case.toString());
  },
  est: function(socket) {
    socket.data.case.removeSocket(socket);
    socket.data.case = socket.data.case.est();
    socket.data.case.addSocket(socket);
    socket.emit('msg', socket.data.case.toString());
  },
  dire: function(socket, ...mots) {
    return `${socket.data.nom} : ${mots.join(" ")}`;
  },
  panneau: function(socket, ...mots) {
    socket.data.case.addPanneau(mots.join(' '));
    return `${socket.data.nom} a changé le panneau pour : ${mots.join(' ')}.`;
  }
};

module.exports = commandes;
