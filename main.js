import { Hero } from "./script/hero.js"
import { Input } from "./script/input.js"
import { World } from "./script/world.js"

export const tileSize = 32
export const cols = 15
export const rows = 20
const gameWidth = tileSize * cols
const gameHeight = tileSize * rows

window.addEventListener("load", function () {             // load after
    const canvas = document.getElementById("canvas1")    // get canvas
    const ctx = canvas.getContext("2d")     // draw in context. This sets up the canvas for drawing
    canvas.width = gameWidth
    canvas.height = gameHeight


    class Game {
        constructor() {
            this.world = new World()
            this.hero = new Hero({
                game: this,
                position: { x: 2, y: 2 },   // MC's starting position
            })
            this.input = new Input()
        }
        render(ctx) {
            this.hero.update()

            this.world.drawBackground(ctx)
            this.world.drawGrid(ctx)
            this.hero.draw(ctx)
            this.world.drawForeground(ctx)      // draw in front of hero
        }
    }
    const game = new Game()

    function animate() {
        requestAnimationFrame(animate)
        //ctx.clearRect(0, 0, gameWidth, gameHeight)
        game.render(ctx)
       
    }
    requestAnimationFrame(animate)
})