const Ship = require("../src/ship")

test("Correctly creates a new Ship", () => {
  let ship = new Ship()
  expect(ship.length).toBeGreaterThan(0)
  expect(ship.length).toBeLessThan(6)
  expect(ship.hits).toBe(0)
  expect(ship.sunk).toBe(false)
})

test("Correctly adds hit to new Ship", () => {
  let ship = new Ship()
  ship.hit()
  expect(ship.hits).toBe(1)
})

test("Stops adding hits to new Ship", () => {
  let ship = new Ship()
  for (let i = 0; i < ship.length; i++) {
    ship.hit()
  }
  ship.hit()
  expect(ship.hits).toBe(ship.length)
})

test("Calculates whether a ship is sunk", () => {
  let ship = new Ship()
  for (let i = 0; i < ship.length; i++) {
    ship.hit()
  }
  expect(ship.isSunk()).toBe(true)
})

test("Correctly updates ship 'sunk' property", () => {
  let ship = new Ship()
  for (let i = 0; i < ship.length; i++) {
    ship.hit()
  }
  expect(ship.sunk).toBe(true)
})

test("Calculates whether a ship is not sunk", () => {
  let ship = new Ship()
  for (let i = 0; i < ship.length - 1; i++) {
    ship.hit()
  }
  expect(ship.isSunk()).toBe(false)
})

test("Calculates whether a ship is not sunk when it hasn't been hit", () => {
  let ship = new Ship()
  expect(ship.isSunk()).toBe(false)
})

test("Correctly sinks a ship of length 1 after one hit", () => {
  let ship = new Ship(1)
  ship.hit()
  expect(ship.isSunk()).toBe(true)
})
