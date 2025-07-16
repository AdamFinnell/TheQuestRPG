import { Hero } from "./script/hero.js"
import { Input } from "./script/input.js"
import { World } from "./script/world.js"

export const tileSize = 32
export const cols = 15
export const rows = 20
const gameWidth = tileSize * cols
const gameHeight = tileSize * rows
export const halfTile = tileSize / 2

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
                sprite: {
                    image: document.getElementById("hero1"), 
                    x: 0, 
                    y: 11, 
                    width: 64, 
                    height: 64
                },
                position: {x: 1 * tileSize, y: 2 * tileSize},   // MC's starting position // using * tileSize prevents MC from being able to stop between grid
            })
            this.input = new Input()

                // add helper properties
            this.eventUpdate = false // periodically switch from T/F
            this.eventTimer = 0 // count deltaTimer
            this.eventInt = 200 // event intreval allows eventUpdate to be true every 200 mls 
        }
        render(ctx) {
            this.hero.update()

            this.world.drawBackground(ctx)
            this.world.drawGrid(ctx)
            this.hero.draw(ctx)
            this.world.drawForeground(ctx)      // draw in front of hero

            if (this.eventTimer < this.eventInt){
                this.eventTimer += deltaTime

            }else {
                this.eventTimer = 0
            }
        }
    }
    const game = new Game()

    let lastTime = 0
    function animate(timeStamp) {
        requestAnimationFrame(animate)

        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        
        game.render(ctx, deltaTime)
       
    }
    requestAnimationFrame(animate)
})