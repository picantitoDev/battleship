import gameModule from "./gameLoop.js"

const displayController = (function () {
  const gameLoop = gameModule
  const playerOneGrid = document.getElementById("player-one-container")
  const playerTwoGrid = document.getElementById("player-two-container")
  const randomButton = document.getElementById("randomize")
  const sunkPositions = []

  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  function makeBoardTranslucid(board) {
    // Using Tailwind class:
    board.classList.add("opacity-50")
    // Also disable pointer events for extra clarity
    board.style.pointerEvents = "none"
  }

  function makeBoardOpaque(board) {
    board.classList.remove("opacity-50")
    board.style.pointerEvents = "auto"
  }

  function makeButtonTranslucid() {
    // Using Tailwind class:
    randomButton.classList.add("opacity-50")
    // Also disable pointer events for extra clarity
    randomButton.style.pointerEvents = "none"
  }

  function makeButtonOpaque() {
    randomButton.classList.remove("opacity-50")
    randomButton.style.pointerEvents = "auto"
  }

  return {
    init() {
      gameLoop.newGame()
      this.handleResetButton()
      console.log(gameLoop.getPlayerOne().gameBoard.grid)
      console.log(gameLoop.getPlayerTwo().gameBoard.grid)
      this.createGrid(gameLoop.getPlayerOne(), playerOneGrid)
      this.createGrid(gameLoop.getPlayerTwo(), playerTwoGrid)
      this.handleClicks()
    },
    handleResetButton() {
      randomButton.addEventListener("click", () => {
        gameLoop.newGame()
        this.updateBoards()
      })
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
        turnIndicator.classList.replace("text-red-600", "text-blue-600") // Switch colors if needed
        turnIndicator.innerText = "Hit!"
        turnDetails.innerText = "Turn remains the same!"
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
            let previousPlayerHits =
              gameLoop.getPlayerTwo().gameBoard.attacked.size
            let previousPlayerMisses =
              gameLoop.getPlayerTwo().gameBoard.missedShots.size

            gameLoop.playTurn(row, col)
            this.updateSunk(row, col)
            console.log(sunkPositions)

            let newPlayerHits = gameLoop.getPlayerTwo().gameBoard.attacked.size
            let newPlayerMisses =
              gameLoop.getPlayerTwo().gameBoard.missedShots.size

            if (
              newPlayerHits > previousPlayerHits &&
              previousPlayerMisses === newPlayerMisses
            ) {
              this.updateMessages(4) // Hit! AI continues
            }

            this.updateBoards()
            setTimeout(() => {
              if (this.checkGameOver()) return
            }, 100)

            if (gameLoop.getTurn() === "two") {
              this.updateMessages(2)
              makeBoardTranslucid(playerTwoGrid)

              while (gameLoop.getTurn() === "two") {
                console.log("Computer shoots")
                makeButtonTranslucid()
                await delay(1000)
                let previousHits =
                  gameLoop.getPlayerOne().gameBoard.attacked.size
                let previousMisses =
                  gameLoop.getPlayerOne().gameBoard.missedShots.size
                gameLoop.playTurn(
                  generateRandomNumber(1, 10),
                  generateRandomNumber(1, 10),
                )
                let newHits = gameLoop.getPlayerOne().gameBoard.attacked.size
                let newMisses =
                  gameLoop.getPlayerOne().gameBoard.missedShots.size

                if (newHits > previousHits && previousMisses === newMisses) {
                  this.updateMessages(3) // Hit! AI continues
                }

                this.updateBoards()
                setTimeout(() => {
                  if (this.checkGameOver()) return
                }, 100)
              }
              this.updateMessages(1)
              makeBoardOpaque(playerTwoGrid)
              makeButtonOpaque()
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
            "cell",
            "border",
            "cursor-pointer",
            "border-gray-300",
            "w-full",
            "h-full",
            "sm:h-[50px]",
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
      this.markSunkShip()
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
          cell.classList.add(
            "cell",
            "border",
            "border-gray-300",
            "w-full",
            "h-full",
            "sm:h-[50px]",
          )
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

    updateSunk(x, y) {
      if (gameLoop.getPlayerTwo().gameBoard.grid.has(`${x}-${y}`)) {
        let ship = gameLoop.getPlayerTwo().gameBoard.grid.get(`${x}-${y}`)
        let flag = ship.isSunk()
        if (flag) {
          let positions = gameLoop
            .getPlayerTwo()
            .gameBoard.allShipPositions(ship)
          sunkPositions.push(...positions)
          return positions
        }
      }
    },
    markSunkShip() {
      for (let i = 0; i < sunkPositions.length; i++) {
        const coords = sunkPositions[i].split("-")
        let row = parseInt(coords[0])
        let col = parseInt(coords[1])
        let cell = playerTwoGrid.querySelector(
          `[data-row="${row}"][data-col="${col}"]`,
        )
        if (cell) {
          cell.classList.add("sunk")
        } else {
          console.log(`Cell not found for row=${row}, col=${col}`) // Debugging
        }
      }
    },
  }
})()

export default displayController
