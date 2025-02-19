import Player from "./player"
import Ship from "./ship"

const gameModule = (function () {
  let playerOne = new Player("human")
  let playerTwo = new Player("human")
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
      playerOne = new Player("human")
      playerTwo = new Player("human")
      direction = "horizontal"
      turn = "one"
      gameStatus = "running"

      playerOne.gameBoard.placeShip(new Ship(1), 1, 1, direction)
      playerTwo.gameBoard.placeShip(new Ship(1), 2, 2, direction)
    },
    getTurn() {
      return turn
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

module.exports = gameModule
