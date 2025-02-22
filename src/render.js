import gameModule from "./gameLoop.js"

const displayController = (function () {
  const gameLoop = gameModule
  const playerOneGrid = document.getElementById("player-one-container")
  const playerTwoGrid = document.getElementById("player-two-container")

  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
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
    handleClicks() {
      playerTwoGrid.addEventListener("click", (event) => {
        if (event.target.tagName === "DIV") {
          console.log("div was clicked")
          const row = parseInt(event.target.dataset.row) // Get row from dataset
          const col = parseInt(event.target.dataset.col) // Get col from dataset

          if (!isNaN(row) && !isNaN(col)) {
            // Ensure valid numbers
            gameLoop.playTurn(row, col)
            console.log("row: " + row)
            console.log("col: " + col)
            console.log(gameLoop.getPlayerTwo().gameBoard.grid)
            console.log(gameLoop.getPlayerTwo().gameBoard.attacked)
            console.log(gameLoop.getPlayerTwo().gameBoard.missedShots)
            console.log(gameLoop.getPlayerTwo().gameBoard.allShipsSunk())

            if (gameLoop.getTurn() === "two") {
              while (gameLoop.getTurn() === "two") {
                gameLoop.playTurn(
                  generateRandomNumber(1, 10),
                  generateRandomNumber(1, 10),
                )
              }
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
      this.updateGrid(playerOneGrid, gameLoop.getPlayerOne().gameBoard)
      this.updateGrid(playerTwoGrid, gameLoop.getPlayerTwo().gameBoard)
    },
    updateGrid(grid, gameBoard) {
      grid.innerHTML = "" // Clear previous grid

      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          const cell = document.createElement("div")
          cell.classList.add("border", "border-gray-300", "w-full", "h-full")
          cell.dataset.row = row + 1
          cell.dataset.col = col + 1
          const cellKey = `${row + 1}-${col + 1}`

          if (gameBoard.grid.has(cellKey)) {
            cell.classList.add("bg-orange-500") // Ship present
          }

          if (
            gameBoard.attacked.has(cellKey) &&
            !gameBoard.missedShots.has(cellKey)
          ) {
            cell.classList.remove("bg-orange-500")
            cell.classList.add("bg-green-500") // Hit
          }

          if (gameBoard.missedShots.has(cellKey)) {
            cell.classList.add("bg-gray-300") // Missed shot
          }

          grid.appendChild(cell)
        }
      }
    },
  }
})()

export default displayController
