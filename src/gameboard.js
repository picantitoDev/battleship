class Gameboard {
  constructor() {
    this.grid = new Map()
  }

  checkBounds(ship, x, y) {
    if (x > 10 || x <= 0 || y > 10 || y <= 0) {
      throw new Error(
        "Invalid ship placement (The initial position is out of bounds)",
      )
    }

    if (x + ship.length > 10 || y + ship.length > 10) {
      throw new Error("Ship placement is going out of bounds")
    }
  }

  checkOverlapping(ship, x, y, direction) {
    if (direction === "horizontal") {
      for (let i = x; i < x + ship.length; i++) {
        if (this.grid.get(`${i}-${y}`)) {
          throw new Error("Overlapping an existing ship!")
        }
      }
    }

    if (direction === "vertical") {
      for (let i = y; i < y + ship.length; i++) {
        if (this.grid.get(`${x}-${i}`)) {
          throw new Error("Overlapping an existing ship!")
        }
      }
    }
  }

  placeShip(ship, x, y, direction = "horizontal") {
    this.checkBounds(ship, x, y)
    this.checkOverlapping(ship, x, y, direction)

    if (direction === "horizontal") {
      for (let i = x; i < x + ship.length; i++) {
        this.grid.set(`${i}-${y}`, ship)
      }
    }

    if (direction === "vertical") {
      for (let i = y; i < y + ship.length; i++) {
        this.grid.set(`${x}-${i}`, ship)
      }
    }
  }
}

module.exports = Gameboard
