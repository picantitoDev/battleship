import Player from "./player"
import Ship from "./ship"

const gameModule = (function () {
  let playerOne = new Player("human")
  let playerTwo = new Player("computer")
  let turn = "one"
  let gameStatus = "running"
  let direction = "horizontal"
  return {
    nextTurn() {
      turn = turn === "one" ? "two" : "one"
    },

    switchDirection() {
      direction = direction === "horizontal" ? "vertical" : "horizontal"
    },

    getDirection() {
      return direction
    },

    getGameStatus() {
      return gameStatus
    },
    newGame() {
      gameStatus = "running"
      turn = "one"
      playerOne = new Player("human")
      playerTwo = new Player("human")
      // Define ships for each player separately
      const shipsOne = [
        new Ship(5), // Carrier
        new Ship(4), // Battleship
        new Ship(3), // Cruiser
        new Ship(3), // Submarine
        new Ship(2), // Destroyer
      ]

      const shipsTwo = [
        new Ship(5),
        new Ship(4),
        new Ship(3),
        new Ship(3),
        new Ship(2),
      ]

      // Hardcoded ship positions for Player One
      playerOne.gameBoard.placeShip(shipsOne[0], 1, 1, "vertical") // Carrier (5 cells)
      playerOne.gameBoard.placeShip(shipsOne[1], 2, 2, "vertical") // Battleship (4 cells)
      playerOne.gameBoard.placeShip(shipsOne[2], 5, 5, "vertical") // Cruiser (3 cells)
      playerOne.gameBoard.placeShip(shipsOne[3], 7, 3, "vertical") // Submarine (3 cells)
      playerOne.gameBoard.placeShip(shipsOne[4], 9, 6, "vertical") // Destroyer (2 cells)

      // Hardcoded ship positions for Player Two
      playerTwo.gameBoard.placeShip(shipsTwo[0], 1, 1, "horizontal") // Carrier (5 cells)
      playerTwo.gameBoard.placeShip(shipsTwo[1], 3, 4, "horizontal") // Battleship (4 cells)
      playerTwo.gameBoard.placeShip(shipsTwo[2], 6, 7, "horizontal") // Cruiser (3 cells)
      playerTwo.gameBoard.placeShip(shipsTwo[3], 8, 2, "horizontal") // Submarine (3 cells)
      playerTwo.gameBoard.placeShip(shipsTwo[4], 9, 8, "horizontal") // Destroyer (2 cells)
    },
    getTurn() {
      return turn
    },

    getPlayerOne() {
      return playerOne
    },
    getPlayerTwo() {
      return playerTwo
    },
    gameOver() {
      if (
        playerOne.gameBoard.allShipsSunk() ||
        playerTwo.gameBoard.allShipsSunk()
      ) {
        return true
      }
      return false
    },

    checkWinner() {
      if (playerOne.gameBoard.allShipsSunk() === true) {
        return "two"
      }
      if (playerTwo.gameBoard.allShipsSunk() === true) {
        return "one"
      }
      return null
    },
    playTurn(x, y) {
      if (gameStatus === "over") return

      let opponentBoard =
        turn === "one" ? playerTwo.gameBoard : playerOne.gameBoard

      try {
        opponentBoard.receiveAttack(x, y)
      } catch (error) {
        console.log(error.message)
        return
      }

      if (this.gameOver()) {
        gameStatus = "over"
      } else {
        this.nextTurn()
      }
    },
  }
})()

export default gameModule
