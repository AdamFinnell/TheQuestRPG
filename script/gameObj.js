import { halfTile, tileSize } from "../main.js";

export class GameObject {
    constructor({
        game,
        sprite,
        position,
        scale
    }
    ) {
        this.game = game
        this.sprite = sprite ?? { image: "", x: 0, y: 0, width: tileSize, height: tileSize } // setting default values  using the nullish coalescing operator ??
        this.position = position ?? { x: 0, y: 0 }
        this.scale = scale ?? 1


        this.destinationPosition = { x: this.position.x, y: this.position.y }
        this.distanceToTravel = { x: 0, y: 0 }

        this.width = this.sprite.width * this.scale
        this.halfWidth = this.width / 2
        this.height = this.sprite.height * this.scale
    }
    moveTowards(destinationPosition, speed) {    // to calculate the step the object/character wants to move towards
        this.distanceToTravel.x = destinationPosition.x - this.position.x // calculate the distance to travel
        this.distanceToTravel.y = destinationPosition.y - this.position.y

        let distance = Math.hypot(this.distanceToTravel.x, this.distanceToTravel.y) // using the Pythagoras Theorem formula, I can use the imaginary right triangle to calculate the hypotenuse, an easier way of doing the Math function... thank you google!

        if (distance <= speed) {
            // if close enough, snap to position
            this.position.x = destinationPosition.x
            this.position.y = destinationPosition.y
        } else {
            // else take a step towards destination
            const stepX = this.distanceToTravel.x / distance // distance is the hypotenuse and distanceToTravel is the bottom of the right triangle
            const stepY = this.distanceToTravel.y / distance
            // minus value moves to left or up and positive moves to the right or down
            this.position.x += stepX * speed  // scaling the movement vecter
            this.position.y += stepY * speed

            // correct remaining distacne to restrict diagonal mavement
            this.distanceToTravel.x = destinationPosition.x - this.position.x
            this.distanceToTravel.y = destinationPosition.y - this.position.y
            distance = Math.hypot(this.distanceToTravel.x, this.distanceToTravel.y)
        }
        return distance
    }
    draw(ctx) {
        ctx.fillStyle = 'blue'
        ctx.fillRect(
            this.position.x,
            this.position.y,
            tileSize,
            tileSize
        )
        ctx.strokeStyle = 'yellow'
        ctx.strokeRect(
            this.destinationPosition.x,
            this.destinationPosition.y,
            tileSize,
            tileSize
        )
        ctx.drawImage(      //draw on top of the blue square
            this.sprite.image, // what we want to draw
            this.sprite.x * this.sprite.width, // cycle through 0-8 for sprite frames
            this.sprite.y * this.sprite.height, // jumping to the right sprite image
            this.sprite.width, // source width
            this.sprite.height, // source height
            this.position.x + halfTile - this.halfWidth,    // and where to draw it at
            this.position.y + tileSize - this.height,
            this.width,
            this.height // ^ these two scale the MC to be bigger then the single cell
        );
    }
}