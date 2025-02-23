const Ship = require("./ship")

class Gameboard {
  constructor() {
    this.grid = new Map()
    this.missedShots = new Set()
    this.attacked = new Set()
    this.placedShips = new Set()
  }

  allShipPositions(ship) {
    const positions = []
    for (const [position, currentShip] of this.grid.entries()) {
      if (currentShip === ship) {
        positions.push(position)
      }
    }
    return positions
  }

  checkBounds(ship, x, y) {
    if (x > 10 || x <= 0 || y > 10 || y <= 0) {
      throw new Error(
        "Invalid ship placement (The initial position is out of bounds)",
      )
    }

    if (x + ship.length - 1 > 10 || y + ship.length - 1 > 10) {
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

    this.placedShips.add(ship)
  }

  receiveAttack(x, y) {
    if (x > 10 || x <= 0 || y > 10 || y <= 0) {
      throw new Error("Invalid position!")
    }

    if (this.attacked.has(`${x}-${y}`)) {
      throw new Error("Already shot that position!")
    }

    const ship = this.grid.get(`${x}-${y}`)

    if (ship === undefined) {
      this.missedShots.add(`${x}-${y}`)
      this.attacked.add(`${x}-${y}`)
      return
    }

    ship.hit()
    this.attacked.add(`${x}-${y}`)
  }

  allShipsSunk() {
    return [...this.placedShips].every((ship) => ship.isSunk())
  }
}

let printMap = function (grid) {
  for (let [key, value] of grid.entries()) {
    console.log(`${key} ->`, value)
  }
}

let board = new Gameboard()
let ship = new Ship(3)
board.placeShip(ship, 4, 4, "horizontal")
ship.hit()
ship.hit()
ship.hit()
printMap(board.grid)
module.exports = Gameboard
