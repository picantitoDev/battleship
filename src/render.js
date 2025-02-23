import gameModule from "./gameLoop.js"

const displayController = (function () {
  const gameLoop = gameModule
  const playerOneGrid = document.getElementById("player-one-container")
  const playerTwoGrid = document.getElementById("player-two-container")
  const randomButton = document.getElementById("randomize")
  let sunkPositions = []
  let prevRow = 0
  let prevCol = 0
  let numberOfShipsSunks = 0

  const shipColors = {
    5: "bg-blue-500", // Carrier
    4: "bg-green-500", // Battleship
    3: "bg-yellow-500", // Cruiser/Submarine
    2: "bg-purple-500", // Destroyer
  }

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
        this.createGrid(gameLoop.getPlayerOne(), playerOneGrid)
        this.createGrid(gameLoop.getPlayerTwo(), playerTwoGrid)
        console.log(gameLoop.getPlayerOne().gameBoard.grid)
        console.log(gameLoop.getPlayerTwo().gameBoard.grid)
        prevRow = 0
        prevCol = 0
        numberOfShipsSunks = 0
        sunkPositions = []
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
      } else if (option === 5) {
        turnIndicator.classList.replace("text-blue-600", "text-green-600") // Switch colors if needed
        turnIndicator.innerText = "You Won!"
        turnDetails.innerText = "AI never stood a chance"
      } else if (option === 6) {
        turnIndicator.classList.replace("text-blue-600", "text-red-600") // Switch colors if needed
        turnIndicator.innerText = "AI Wins!"
        turnDetails.innerText = "Now there's no one to save us"
      }
    },

    handleClicks() {
      playerTwoGrid.addEventListener("click", async (event) => {
        if (event.target.tagName === "DIV") {
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
              if (this.checkGameOver()) this.updateMessages(5)
              return
            }, 100)

            if (gameLoop.getTurn() === "two") {
              this.updateMessages(2)
              makeBoardTranslucid(playerTwoGrid)
              let targetCells = []
              let hitStreak = false
              while (gameLoop.getTurn() === "two") {
                console.log("Computer shoots")
                makeButtonTranslucid()
                await delay(1000)

                let AIrow, AIcol

                if (targetCells.length > 0) {
                  // Prioritize attacking adjacent cells
                  let coord = targetCells.pop()
                  AIrow = coord[0]
                  AIcol = coord[1]
                } else {
                  // No specific target? Shoot randomly
                  AIrow = generateRandomNumber(1, 10)
                  AIcol = generateRandomNumber(1, 10)

                  while (
                    gameLoop
                      .getPlayerOne()
                      .gameBoard.missedShots.has(`${AIrow}-${AIcol}`) ||
                    gameLoop
                      .getPlayerOne()
                      .gameBoard.attacked.has(`${AIrow}-${AIcol}`)
                  ) {
                    AIrow = generateRandomNumber(1, 10)
                    AIcol = generateRandomNumber(1, 10)
                  }
                }

                gameLoop.playTurn(AIrow, AIcol)

                let hit = gameLoop
                  .getPlayerOne()
                  .gameBoard.attacked.has(`${AIrow}-${AIcol}`)

                if (hit) {
                  hitStreak = true
                  prevRow = AIrow
                  prevCol = AIcol

                  // Add valid adjacent cells to the target list
                  let adjacent = this.getAdjacentCells([AIrow, AIcol])
                  adjacent.forEach(([r, c]) => {
                    if (
                      !gameLoop
                        .getPlayerOne()
                        .gameBoard.missedShots.has(`${r}-${c}`) &&
                      !gameLoop
                        .getPlayerOne()
                        .gameBoard.attacked.has(`${r}-${c}`)
                    ) {
                      targetCells.push([r, c])
                    }
                  })

                  this.updateMessages(3) // Hit! AI continues
                } else if (!hitStreak) {
                  prevRow = 0
                  prevCol = 0
                }

                this.updateBoards()
                setTimeout(() => {
                  if (this.checkGameOver()) this.updateMessages(6)
                  makeButtonOpaque()
                  return
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
    getAdjacentCells([x, y]) {
      return [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ].filter(([a, b]) => a > 0 && a <= 10 && b > 0 && b <= 10)
    },
    getRandomUnattackedCell() {
      const attackHistory = new Set()

      let x, y
      do {
        x = generateRandomNumber(1, 10)
        y = generateRandomNumber(1, 10)
      } while (attackHistory.has(`${x},${y}`))

      attackHistory.add(`${x},${y}`)
      return [x, y]
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
            const shipLength = player.gameBoard.grid.get(cellKey).length
            const shipColor = shipColors[shipLength]
            cell.classList.add(shipColor)
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
        return true
      }

      if (gameLoop.getPlayerTwo().gameBoard.allShipsSunk()) {
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
            const shipLength = player.gameBoard.grid.get(cellKey).length
            const shipColor = shipColors[shipLength]
            cell.classList.add(shipColor)
          }

          if (
            player.gameBoard.attacked.has(cellKey) &&
            !player.gameBoard.missedShots.has(cellKey) &&
            player.type === "computer"
          ) {
            const ship = player.gameBoard.grid.get(cellKey)
            if (ship) {
              cell.classList.add("sunk")
            }
          }

          if (
            player.gameBoard.attacked.has(cellKey) &&
            !player.gameBoard.missedShots.has(cellKey) &&
            player.type === "human"
          ) {
            cell.classList.add("sunk")
          }

          if (player.gameBoard.missedShots.has(cellKey)) {
            cell.classList.add("bg-gray-200") // Missed shot
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
      if (sunkPositions.length === 0) {
        return
      }

      for (let i = 0; i < sunkPositions.length; i++) {
        const coords = sunkPositions[i].split("-")
        let row = parseInt(coords[0])
        let col = parseInt(coords[1])
        let cell = playerTwoGrid.querySelector(
          `[data-row="${row}"][data-col="${col}"]`,
        )
        if (cell) {
          const ship = gameLoop
            .getPlayerTwo()
            .gameBoard.grid.get(sunkPositions[i])
          if (ship) {
            const shipLength = ship.length
            const shipColor = shipColors[shipLength]
            cell.classList.add(shipColor)
          }
        } else {
          console.log(`Cell not found for row=${row}, col=${col}`) // Debugging
        }
      }
    },
  }
})()

export default displayController
