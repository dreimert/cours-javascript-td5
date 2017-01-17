class Case {
  constructor(monde, coord, type) {
    this.monde = monde;
    this.coord = coord;
    this.type = type;
  }

  nord() {
    return this.monde.getCase(this.coord.nord());
  }

  sud() {
    return this.monde.getCase(this.coord.sud());
  }

  ouest() {
    return this.monde.getCase(this.coord.ouest());
  }

  est() {
    return this.monde.getCase(this.coord.est());
  }

  toString(){
    return `
      Vous êtes en ${this.coord} sur une ${this.type}.
      Au nord, il y a une ${this.nord().type}.
      Au sud, il y a une ${this.sud().type}.
      À l'ouest, il y a une ${this.ouest().type}.
      Et à l'est, il y a une ${this.est().type}.
    `;
  }
}

module.exports = Case;
