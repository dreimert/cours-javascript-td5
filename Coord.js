class Coord {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return `${this.x},${this.y}`;
  }

  nord() {
    return new Coord(this.x, this.y + 1);
  }

  sud() {
    return new Coord(this.x, this.y - 1);
  }

  ouest() {
    return new Coord(this.x - 1, this.y);
  }

  est() {
    return new Coord(this.x + 1, this.y);
  }
}

module.exports = Coord;
