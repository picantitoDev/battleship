const gameModule = require("../src/gameLoop")

// Constructor Test
test("Correctly starts the game loop", () => {
  let gameLoop = gameModule
  expect(gameLoop.getTurn()).toBe("one")
  expect(gameLoop.getDirection()).toBe("horizontal")
  expect(gameLoop.getGameStatus()).toBe("running")
})

// Next turn test
test("Correctly switches the player's turn", () => {
  let gameLoop = gameModule
  expect(gameLoop.getTurn()).toBe("one")
  gameLoop.nextTurn()
  expect(gameLoop.getTurn()).toBe("two")
})

// Get Direction test
test("Correctly switches the ships direction", () => {
  let gameLoop = gameModule
  expect(gameLoop.getDirection()).toBe("horizontal")
  gameLoop.switchDirection()
  expect(gameLoop.getDirection()).toBe("vertical")
  gameLoop.switchDirection()
  expect(gameLoop.getDirection()).toBe("horizontal")
})

// Play turn test
test("Check if game is over", () => {
  let gameLoop = gameModule
  gameLoop.newGame()
  gameLoop.playTurn(2, 2)
  expect(gameLoop.gameOver()).toBe(true)
})

// Check winner test
test("Correctly checks if player one wins", () => {
  let gameLoop = gameModule
  gameLoop.newGame()
  gameLoop.playTurn(2, 2)
  expect(gameLoop.checkWinner()).toBe("one")
})

test("Correctly checks if player two wins", () => {
  let gameLoop = gameModule
  gameLoop.newGame()
  gameLoop.playTurn(3, 3)
  gameLoop.playTurn(1, 1)
  expect(gameLoop.checkWinner()).toBe("two")
})

test("Correctly resets the game", () => {
  let gameLoop = gameModule
  gameLoop.newGame()
  gameLoop.nextTurn()
  gameLoop.switchDirection()

  gameLoop.newGame() // Reset everything
  expect(gameLoop.getTurn()).toBe("one")
  expect(gameLoop.getDirection()).toBe("horizontal")
  expect(gameLoop.getGameStatus()).toBe("running")
})

test("Repeated attacks on the same empty spot do not change the game status", () => {
  let gameLoop = gameModule
  gameLoop.newGame()

  gameLoop.playTurn(3, 3)
  gameLoop.playTurn(3, 3)

  expect(gameLoop.getGameStatus()).toBe("running")
  expect(gameLoop.checkWinner()).toBe(null)
})

test("Players cannot play after the game is over", () => {
  let gameLoop = gameModule
  gameLoop.newGame()

  gameLoop.playTurn(2, 2)
  expect(gameLoop.getGameStatus()).toBe("over")

  gameLoop.playTurn(3, 3)
  expect(gameLoop.getGameStatus()).toBe("over")
})

test("Game ends when all ships are sunk", () => {
  let gameLoop = gameModule
  gameLoop.newGame()

  gameLoop.playTurn(2, 2)

  expect(gameLoop.gameOver()).toBe(true)
  expect(gameLoop.getGameStatus()).toBe("over")
})

test("Turn switching alternates between players", () => {
  let gameLoop = gameModule
  gameLoop.newGame()

  expect(gameLoop.getTurn()).toBe("one")
  gameLoop.nextTurn()
  expect(gameLoop.getTurn()).toBe("two")
  gameLoop.nextTurn()
  expect(gameLoop.getTurn()).toBe("one")
})

test("Cannot place ships outside board boundaries", () => {
  let gameLoop = gameModule
  gameLoop.newGame()

  expect(() =>
    gameLoop.playerOne.gameBoard.placeShip(new Ship(1), -1, -1, "horizontal"),
  ).toThrow()
  expect(() =>
    gameLoop.playerTwo.gameBoard.placeShip(new Ship(1), 100, 100, "vertical"),
  ).toThrow()
})
