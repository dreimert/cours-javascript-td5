const Case = require('./Case');

class Monde {
  constructor() {
    this.map = {};
  }

  getCase(coord) {
    const coordString = coord.toString();

    if(!this.map[coordString]){
      this.map[coordString] = new Case(this, coord, "plaine");
    }

    return this.map[coordString];
  }
}

module.exports = Monde;
