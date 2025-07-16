import { rows, cols, tileSize } from "../main.js"

export class World {
    constructor() {
        this.level1 = {
            waterLayer: [],
            groundLayer: [],
            backgroundLayer: document.getElementById("bgLvl1"),
            foregroundLayer: document.getElementById("fgLvl1"),
        }          // a custome property for each level
    }
    drawBackground(ctx){
        ctx.drawImage(this.level1.backgroundLayer, 0, 0)
    }
    drawForeground(ctx){
        ctx.drawImage(this.level1.foregroundLayer, 0, 0)
    }
    drawGrid(ctx) {         // ctx => inpects context 
        ctx.strokeStyle = 'grey'
        for (let row = 0; row < rows; row++) {     // to cycle over rows from top to bottom in the grid
            for (let col = 0; col < cols; col++) {        // to cycle over columns from left to right in the grid
                ctx.strokeRect(
                    col * tileSize,  // x distance from left == increase 0 to move
                    row * tileSize,  // y from top
                    tileSize,      // width
                    tileSize       // height
                )
            } // allows for movement around the tiles
        }
    }
}