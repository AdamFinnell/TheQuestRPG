import { tileSize } from "../main.js";
import { GameObject } from "./gameObj.js";
import { down, up, left, right } from "./input.js";

export class Hero extends GameObject {      // to extend the gameObj class into the child class Hero
    constructor({ game, sprite, position, scale }) {
        super({ game, sprite, position, scale })
        this.speed = 2
    }

    update() {
        let nextX = this.destinationPosition.x
        let nextY = this.destinationPosition.y

        const distance = this.moveTowards(this.destinationPosition, this.speed)
        const arrived = distance <= this.speed

        if (arrived) {  // to move only one cell away from current position
            if (this.game.input.lastKey === up) {
                nextY -= tileSize
            } else if (this.game.input.lastKey === down) {
                nextY += tileSize
            } else if (this.game.input.lastKey === left) {
               nextX -= tileSize
            } else if (this.game.input.lastKey === right) {
                nextX += tileSize
            }
            this.destinationPosition.x = nextX
            this.destinationPosition.y = nextY
        }
    }
}