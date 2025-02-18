const Gameboard = require("../src/gameboard")
const Ship = require("../src/ship")

test("Correctly creates a new Gameboard", () => {
  let board = new Gameboard()
  expect(board.grid instanceof Map).toBe(true)
  expect(board.grid.size).toBe(0)
})

test("Correctly places a Ship in the Gameboard", () => {
  let board = new Gameboard()
  let ship = new Ship(1)
  board.placeShip(ship, 1, 1)
  let result = board.grid.get("1-1")
  expect(result).toEqual(ship)
})

test("Correctly places a Large Ship Horizontally in the Gameboard", () => {
  let board = new Gameboard()
  let ship = new Ship(4)
  board.placeShip(ship, 1, 1)
  let p1 = board.grid.get("1-1")
  let p2 = board.grid.get("2-1")
  let p3 = board.grid.get("3-1")
  let p4 = board.grid.get("4-1")

  expect(p1).toEqual(ship)
  expect(p2).toEqual(ship)
  expect(p3).toEqual(ship)
  expect(p4).toEqual(ship)
})

test("Correctly places a Large Ship Vertically in the Gameboard", () => {
  let board = new Gameboard()
  let ship = new Ship(4)
  board.placeShip(ship, 1, 1, "vertical")
  let p1 = board.grid.get("1-1")
  let p2 = board.grid.get("1-2")
  let p3 = board.grid.get("1-3")
  let p4 = board.grid.get("1-4")

  expect(p1).toEqual(ship)
  expect(p2).toEqual(ship)
  expect(p3).toEqual(ship)
  expect(p4).toEqual(ship)
})

test("Throws an error if ship is placed out of bounds (Horizontally)", () => {
  let board = new Gameboard()
  let ship = new Ship(4)
  expect(() => board.placeShip(ship, 20, 1, "horizontal")).toThrow(
    "Invalid ship placement (The initial position is out of bounds)",
  )
})

test("Throws an error if ship is placed out of bounds (Vertically)", () => {
  let board = new Gameboard()
  let ship = new Ship(4)
  expect(() => board.placeShip(ship, 1, 20, "vertical")).toThrow(
    "Invalid ship placement (The initial position is out of bounds)",
  )
})

test("Throws an error if ship goes out of bounds (Vertically)", () => {
  let board = new Gameboard()
  let ship = new Ship(5)
  expect(() => board.placeShip(ship, 5, 7, "vertical")).toThrow(
    "Ship placement is going out of bounds",
  )
})

test("Throws an error if ship goes out of bounds (Horizontally)", () => {
  let board = new Gameboard()
  let ship = new Ship(5)
  expect(() => board.placeShip(ship, 7, 5, "horizontal")).toThrow(
    "Ship placement is going out of bounds",
  )
})

test("Throws an error if trying to overlap a one-sized ship", () => {
  let board = new Gameboard()
  let ship1 = new Ship(1)
  let ship2 = new Ship(1)
  board.placeShip(ship1, 1, 1, "vertical")
  expect(() => board.placeShip(ship2, 1, 1, "vertical")).toThrow(
    "Overlapping an existing ship!",
  )
})

test("Throws an error if trying to overlap a ship (Horizontally)", () => {
  let board = new Gameboard()
  let ship1 = new Ship(3)
  let ship2 = new Ship(3)
  board.placeShip(ship1, 4, 4, "horizontal")
  expect(() => board.placeShip(ship2, 2, 4, "horizontal")).toThrow(
    "Overlapping an existing ship!",
  )
})

test("Throws an error if trying to overlap a ship (Vertically)", () => {
  let board = new Gameboard()
  let ship1 = new Ship(4)
  let ship2 = new Ship(4)
  board.placeShip(ship1, 4, 4, "vertical")
  expect(() => board.placeShip(ship2, 4, 3, "vertical")).toThrow(
    "Overlapping an existing ship!",
  )
})
