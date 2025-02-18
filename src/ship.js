class Ship {
  constructor(length = 1) {
    this.length = length
    this.hits = 0
    this.sunk = false
  }

  hit() {
    if (this.isSunk()) {
      console.log("Ship already sunk")
      return
    }
    this.hits++
  }

  isSunk() {
    return this.hits === this.length ? true : false
  }
}

module.exports = Ship
