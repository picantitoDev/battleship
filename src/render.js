import { create } from "lodash"
import gameModule from "./gameLoop.js"

const displayController = (function () {
  const gameLoop = gameModule
  const playerOneGrid = document.getElementById("player-one-container")
  const playerTwoGrid = document.getElementById("player-two-container")

  return {
    init() {
      gameLoop.newGame()
      this.createGrid(playerOneGrid)
      this.createGrid(playerTwoGrid)
      this.updateBoards()
    },
    createGrid(gridElement) {
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
          cell.dataset.row = row
          cell.dataset.col = col
          const cellKey = `${col + 1}-${row + 1}`

          if (gameBoard.grid.has(cellKey)) {
            cell.classList.add("bg-red-300") // Ship present
          }

          if (
            gameBoard.attacked.has(cellKey) &&
            !gameBoard.missedShots.has(cellKey)
          ) {
            cell.classList.add("bg-orange-300") // Hit
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
