import Player from "./player"
import Ship from "./ship"

const gameModule = (function () {
  let playerOne = new Player("human")
  let playerTwo = new Player("computer")
  let turn = "one"
  let gameStatus = "running"
  let direction = "horizontal"

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function generateRandomShips(shipArray, player) {
    let j = 0
    while (j < 5) {
      let direction = ""
      // Hardcoded ship positions for Player One
      const orientation = randomIntFromInterval(1, 2)
      if (orientation === 1) {
        direction = "horizontal"
      } else {
        direction = "vertical"
      }
      try {
        let x = randomIntFromInterval(1, 10)
        let y = randomIntFromInterval(1, 10)
        player.gameBoard.placeShip(shipArray[j], x, y, direction)
        j++
      } catch (error) {
        continue
      }
    }
  }

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
      playerTwo = new Player("computer")
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

      generateRandomShips(shipsOne, playerOne)
      generateRandomShips(shipsTwo, playerTwo)
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

      let opponentBoardMissedShots = opponentBoard.missedShots.size

      try {
        opponentBoard.receiveAttack(x, y)
      } catch (error) {
        console.log(error.message)
        return
      }

      if (this.gameOver()) {
        gameStatus = "over"
      }
      if (opponentBoardMissedShots < opponentBoard.missedShots.size) {
        console.log("Miss! Next turn.")
        this.nextTurn()
      } else {
        console.log("Hit! Player keeps playing.")
      }
    },
  }
})()

export default gameModule
