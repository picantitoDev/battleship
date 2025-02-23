import "./styles.css"
import displayController from "./render.js"

let UI = displayController

let point = `1-3`
const coords = point.split("-")
console.log(coords)

UI.init()
