import Gameboard from "./gameboard.js"

export default class Player {
  constructor(type) {
    if (!["human", "computer"].includes(type)) {
      throw new Error("Invalid player type")
    }
    this.type = type
    this.gameBoard = new Gameboard()
  }
}
