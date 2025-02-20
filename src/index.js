import "./styles.css"
import displayController from "./render.js"

let UI = displayController
let grid = document.getElementById("player-one-container")
let grid2 = document.getElementById("player-two-container")

UI.populate(grid)
UI.populate(grid2)
console.log("Hello")
