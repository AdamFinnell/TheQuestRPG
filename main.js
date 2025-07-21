import { Hero } from "./script/hero.js"
import { Input } from "./script/input.js"
import { World } from "./script/world.js"
import { attack } from "./script/input.js";
import { Enemies } from "./script/enemy.js";


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
                position: { x: 1 * tileSize, y: 2 * tileSize },
                scale: 1,   // MC's starting position // using * tileSize prevents MC from being able to stop between grid
            }),
                this.enemies = new Enemies({
                    game: this,
                    sprite: {
                        image: document.getElementById("enemy"),
                        x: 0,
                        y: 10,
                        width: 64,
                        height: 64
                    },
                    position: { x: 13 * tileSize, y: 13 * tileSize },
                    scale: 1,   // enemies starting position // using * tileSize prevents enemies from being able to stop between grid
                })
            this.input = new Input(this)

            // add helper properties
            this.eventUpdate = false // periodically switch from T/F
            this.eventTimer = 0 // count deltaTimer
            this.eventInt = 60 // event intreval allows eventUpdate to be true every 200 mls 

            this.debug = false
        }
        toggleDebug() {
            this.debug = !this.debug
        }
        render(ctx, deltaTime) {
            if (this.input.justPressed.includes(attack)) {
                this.hero.fight();
            }

            this.hero.update(deltaTime);

            // === NEW: Update the enemy AI and movement
            this.enemies.update(deltaTime);

            this.world.drawBackground(ctx);
            if (this.debug) this.world.drawGrid(ctx);
            this.hero.draw(ctx);
            this.enemies.draw(ctx);
            this.world.drawForeground(ctx);
            if (this.debug) this.world.drawCollisionMap(ctx);
            if (this.eventTimer < this.eventInt) {
                this.eventTimer += deltaTime
                this.eventUpdate = false
            } else {
                this.eventTimer = this.eventInt % this.eventTimer
                this.eventUpdate = true
                this.input.clearJustPressed();
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


