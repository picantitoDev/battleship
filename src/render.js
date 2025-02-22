import gameModule from "./gameLoop.js"

const displayController = (function () {
  const gameLoop = gameModule
  const playerOneGrid = document.getElementById("player-one-container")
  const playerTwoGrid = document.getElementById("player-two-container")

  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  return {
    init() {
      gameLoop.newGame()
      console.log(gameLoop.getPlayerOne().gameBoard.grid)
      console.log(gameLoop.getPlayerTwo().gameBoard.grid)
      this.createGrid(gameLoop.getPlayerOne(), playerOneGrid)
      this.createGrid(gameLoop.getPlayerTwo(), playerTwoGrid)
      this.handleClicks()
    },
    updateMessages(option) {
      const turnIndicator = document.getElementById("turn-indicator")
      const turnDetails = document.getElementById("turn-details")

      if (option === 1) {
        turnIndicator.innerText = "Player One's Turn"
        turnIndicator.classList.replace("text-red-600", "text-blue-600") // Switch colors if needed
        turnDetails.innerText = "Click a cell to attack!"
      } else if (option === 2) {
        turnIndicator.innerText = "Computer's Turn"
        turnIndicator.classList.replace("text-blue-600", "text-red-600")
        turnDetails.innerText = "Waiting for AI move..."
      } else if (option === 3) {
        turnIndicator.innerText = "Hit!"
        turnDetails.innerText = "Turn remains the same!"
      } else if (option === 4) {
        turnIndicator.innerText = "Missed!"
        turnDetails.innerText = "Switching turns..."
      }
    },
    handleClicks() {
      playerTwoGrid.addEventListener("click", async (event) => {
        if (event.target.tagName === "DIV") {
          console.log("div was clicked")
          const row = parseInt(event.target.dataset.row) // Get row from dataset
          const col = parseInt(event.target.dataset.col) // Get col from dataset

          if (!isNaN(row) && !isNaN(col)) {
            // Ensure valid numbers
            gameLoop.playTurn(row, col)
            this.updateBoards()

            setTimeout(() => {
              if (this.checkGameOver()) return
            }, 100)

            console.log("row: " + row)
            console.log("col: " + col)
            console.log(gameLoop.getPlayerTwo().gameBoard.grid)
            console.log(gameLoop.getPlayerTwo().gameBoard.attacked)
            console.log(gameLoop.getPlayerTwo().gameBoard.missedShots)
            console.log(gameLoop.getPlayerTwo().gameBoard.allShipsSunk())

            if (gameLoop.getTurn() === "two") {
              this.updateMessages(2)
              while (gameLoop.getTurn() === "two") {
                console.log("Computer shoots")
                await delay(1000)
                gameLoop.playTurn(
                  generateRandomNumber(1, 10),
                  generateRandomNumber(1, 10),
                )
                this.updateBoards()
                this.checkGameOver()
              }
              this.updateMessages(1)
            }
            this.updateBoards()
          }
        }
      })
    },
    createGrid(player, gridElement) {
      gridElement.innerHTML = "" // Clear previous grid
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          const cell = document.createElement("div")
          cell.classList.add(
            "border",
            "cursor-pointer",
            "border-gray-300",
            "w-full",
            "h-full",
          )
          cell.dataset.row = row + 1
          cell.dataset.col = col + 1
          const cellKey = `${row + 1}-${col + 1}`

          if (player.type === "human" && player.gameBoard.grid.has(cellKey)) {
            cell.classList.add("bg-orange-500") // Ship present
          }

          gridElement.appendChild(cell)
        }
      }
    },
    updateBoards() {
      this.updateGrid(playerOneGrid, gameLoop.getPlayerOne())
      this.updateGrid(playerTwoGrid, gameLoop.getPlayerTwo())
    },
    checkGameOver() {
      if (gameLoop.getPlayerOne().gameBoard.allShipsSunk()) {
        setTimeout(() => alert("Game Over! The computer wins!"), 200)
        return true
      }

      if (gameLoop.getPlayerTwo().gameBoard.allShipsSunk()) {
        setTimeout(() => alert("Congratulations! You win!"), 200)
        return true
      }

      return false
    },
    updateGrid(grid, player) {
      grid.innerHTML = "" // Clear previous grid

      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          const cell = document.createElement("div")
          cell.classList.add("border", "border-gray-300", "w-full", "h-full")
          cell.dataset.row = row + 1
          cell.dataset.col = col + 1
          const cellKey = `${row + 1}-${col + 1}`

          if (player.type === "human" && player.gameBoard.grid.has(cellKey)) {
            cell.classList.add("bg-orange-500") // Ship present
          }

          if (
            player.gameBoard.attacked.has(cellKey) &&
            !player.gameBoard.missedShots.has(cellKey)
          ) {
            cell.classList.remove("bg-orange-500")
            cell.classList.add("bg-green-500") // Hit
          }

          if (player.gameBoard.missedShots.has(cellKey)) {
            cell.classList.add("bg-gray-300") // Missed shot
          }

          grid.appendChild(cell)
        }
      }
    },
  }
})()

export default displayController
