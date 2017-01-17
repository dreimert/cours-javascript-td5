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

module.exports = Monde;
