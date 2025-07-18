import { rows, cols, tileSize } from "../main.js"

export class World {
    constructor() {
        this.level1 = {
            waterLayer: [],
            groundLayer: [],
            collisionLayer: [
                1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,
                1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
                1,0,0,1,1,0,0,0,0,0,0,0,0,0,1,
                1,0,0,0,0,0,0,1,0,1,1,0,0,0,1,
                1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
                1,0,0,1,1,1,1,1,1,1,1,0,0,0,1,
                1,0,0,1,0,0,0,0,0,0,1,0,0,0,1,
                1,0,0,1,0,0,0,0,0,0,1,0,1,1,1,
                1,0,0,1,0,0,0,0,0,0,1,0,0,0,1,
                1,0,0,1,0,0,0,0,0,0,1,0,0,0,1,
                1,0,0,1,1,1,1,1,1,1,1,0,0,0,1,
                1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
                1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
                1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
                1,0,0,1,1,0,0,1,0,0,0,0,0,0,1,
                1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
                1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
                1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
                1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            ],
            backgroundLayer: document.getElementById("bgLvl1"),
            foregroundLayer: document.getElementById("fgLvl1"),
        }          // a custome property for each level
    }
    getTile(array, row, col){
        return array[cols * row + col]
    }
    drawBackground(ctx){
        ctx.drawImage(this.level1.backgroundLayer, 0, 0)
    }
    drawForeground(ctx){
        ctx.drawImage(this.level1.foregroundLayer, 0, 0)
    }
    drawCollisionMap(ctx) {         // ctx => inpects context 
        ctx.fillStyle = 'rgba(0, 0, 255, 0.5'
        for (let row = 0; row < rows; row++) {     // to cycle over rows from top to bottom in the grid
            for (let col = 0; col < cols; col++) {        // to cycle over columns from left to right in the grid
               if(this.getTile(this.level1.collisionLayer, row, col) === 1){ // to make cell not passable to MC
                 ctx.fillRect(
                    col * tileSize,  // x distance from left == increase 0 to move
                    row * tileSize,  // y from top
                    tileSize,      // width
                    tileSize       // height
                )
               }
               
            } 
        }
    }
     drawGrid(ctx) {         // ctx => inpects context 
        ctx.strokeStyle = 'black'
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
