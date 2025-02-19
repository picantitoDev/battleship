const Gameboard = require("../src/gameboard")
const Ship = require("../src/ship")

// Constructor Test
test("Correctly creates a new Gameboard", () => {
  let board = new Gameboard()
  expect(board.grid instanceof Map).toBe(true)
  expect(board.grid.size).toBe(0)
})

// Place Ship Function
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

// Receive Attack Function
test("Receive Attack correctly Register hit", () => {
  let board = new Gameboard()
  let ship = new Ship(4)
  board.placeShip(ship, 4, 4, "vertical")
  board.receiveAttack(4, 4)
  expect(ship.hits).toBe(1)
})

test("Receive Attack correctly Register multiple hits", () => {
  let board = new Gameboard()
  let ship = new Ship(4)
  board.placeShip(ship, 4, 4, "vertical")
  board.receiveAttack(4, 4)
  board.receiveAttack(4, 5)
  board.receiveAttack(4, 6)
  expect(ship.hits).toBe(3)
})

test("Receive Attack correctly sunks ships", () => {
  let board = new Gameboard()
  let ship = new Ship(3)
  board.placeShip(ship, 4, 4, "vertical")
  board.receiveAttack(4, 4)
  board.receiveAttack(4, 5)
  board.receiveAttack(4, 6)
  expect(ship.isSunk()).toBe(true)
})

test("Receive Attack correctly stores missed shot", () => {
  let board = new Gameboard()
  board.receiveAttack(1, 1)
  expect(board.missedShots.size).toBe(1)
})

test("Receive Attack correctly stores multiple missed shots", () => {
  let board = new Gameboard()
  board.receiveAttack(1, 1)
  board.receiveAttack(2, 2)
  expect(board.missedShots.size).toBe(2)
})

test("Receive Attack correctly stores edge missed shots", () => {
  let board = new Gameboard()
  board.receiveAttack(10, 10)
  board.receiveAttack(1, 10)
  board.receiveAttack(10, 1)
  board.receiveAttack(1, 1)
  expect(board.missedShots.size).toBe(4)
})

test("Receive Attack correctly stores missed shots and hits", () => {
  let board = new Gameboard()
  let ship = new Ship(4)
  board.placeShip(ship, 4, 4, "vertical")
  board.receiveAttack(4, 4)
  board.receiveAttack(4, 5)
  board.receiveAttack(1, 1)
  expect(board.missedShots.size).toBe(1)
  expect(ship.hits).toBe(2)
})

test("Receive Attack throws an error when is out of bounds", () => {
  let board = new Gameboard()
  expect(() => board.receiveAttack(30, 2)).toThrow("Invalid position!")
})

test("Receive Attack throws an error if the ship has already been hit", () => {
  let board = new Gameboard()
  let ship = new Ship(1)
  board.placeShip(ship, 4, 4, "vertical")
  board.receiveAttack(4, 4)
  expect(() => board.receiveAttack(4, 4)).toThrow("Already shot that position!")
})

test("Receive Attack throws an error if the shot was already thrown in that position", () => {
  let board = new Gameboard()
  board.receiveAttack(4, 4)
  expect(() => board.receiveAttack(4, 4)).toThrow("Already shot that position!")
})

test("Receive Attack does not store a missed shot when hitting a ship", () => {
  let board = new Gameboard()
  let ship = new Ship(3)
  board.placeShip(ship, 4, 4, "vertical")
  board.receiveAttack(4, 4)
  expect(board.missedShots.size).toBe(0)
})

test("Receive Attack correctly registers hit at grid boundary", () => {
  let board = new Gameboard()
  let ship = new Ship(1)
  board.placeShip(ship, 10, 10, "horizontal")
  board.receiveAttack(10, 10)
  expect(ship.hits).toBe(1)
})

test("Receive Attack does not register more hits on a sunken ship", () => {
  let board = new Gameboard()
  let ship = new Ship(2)
  board.placeShip(ship, 5, 5, "horizontal")
  board.receiveAttack(5, 5)
  board.receiveAttack(6, 5) // Ship is now sunk
  expect(() => board.receiveAttack(5, 5)).toThrow("Already shot that position!")
})

test("Receive Attack does not duplicate missed shots", () => {
  let board = new Gameboard()
  board.receiveAttack(2, 2)
  expect(() => board.receiveAttack(2, 2)).toThrow("Already shot that position!")
  expect(board.missedShots.size).toBe(1)
})

test("Receive Attack on different ships registers separately", () => {
  let board = new Gameboard()
  let ship1 = new Ship(2)
  let ship2 = new Ship(3)
  board.placeShip(ship1, 4, 4, "vertical")
  board.placeShip(ship2, 6, 6, "horizontal")
  board.receiveAttack(4, 4)
  board.receiveAttack(6, 6)
  expect(ship1.hits).toBe(1)
  expect(ship2.hits).toBe(1)
})
