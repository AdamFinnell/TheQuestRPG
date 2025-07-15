import { tileSize } from "../main.js";

export class GameObject {
    constructor({
        game,
        sprite,
        position,
        scale
    }
    ) {
        this.game = game
        this.sprite = sprite ?? { x: 0, y: 0, width: tileSize, height: tileSize, image: "" } // setting default values  using the nullish coalescing operator ??
        this.position = position ?? { x: 0, y: 0 }
        this.scale = scale ?? 1


        this.destinationPosition = {x: this.position.x, y: this.position.y}
        this.distanceToTravel = {x: 0, y: 0}
    }
    moveTowards(destinationPosition, speed){
        
    }
    draw(ctx) {
        ctx.fillRect(
            this.position.x * tileSize,
            this.position.y * tileSize,
            tileSize,
            tileSize
        )
    }
}