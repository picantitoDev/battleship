import gameModule from "./gameLoop.js"

const displayController = (function () {
  const gameLoop = gameModule

  const playerOneGrid = document.getElementById("player-one-container")
  const playerTwoGrid = document.getElementById("player-one-container")

  return {
    populate(grid) {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          const cell = document.createElement("div")
          cell.classList.add(
            "cell",
            "w-full",
            "aspect-square",
            "border-[1px]",
            "border-blue-500",
            "h-13",
            "w-13",
            "cursor-pointer",
          )

          grid.append(cell)
        }
      }
    },
  }
})()

export default displayController
