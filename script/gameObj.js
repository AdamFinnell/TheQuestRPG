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
        this.verticalOffset = this.sprite.height - tileSize;

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
    if (this.game.debug) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.position.x, this.position.y, tileSize, tileSize);
        ctx.strokeStyle = 'yellow';
        ctx.strokeRect(this.destinationPosition.x, this.destinationPosition.y, tileSize, tileSize);
    }

    const isAttacking = this.isAttacking;
    const direction = this.game?.input?.lastDirection ?? "down";

    // Pick correct sprite dimensions
    const frameWidth = isAttacking && this.attackSpriteWidth ? this.attackSpriteWidth : this.sprite.width;
    const frameHeight = isAttacking && this.attackSpriteHeight ? this.attackSpriteHeight : this.sprite.height;

    // Where to draw
    const drawWidth = frameWidth * this.scale;
    const drawHeight = frameHeight * this.scale;

    // Vertical offset based on action
    const verticalOffset = isAttacking
        ? (this.attackVerticalOffsets?.[direction] ?? (frameHeight - tileSize))
        : (this.sprite.height - tileSize);

    // Source X (frame) logic
    let sourceX;
    if (isAttacking) {
        sourceX = (this.attackStartOffset + this.attackFrame * this.attackFrameSpacing) * frameWidth;
    } else {
        sourceX = this.sprite.x * frameWidth;
    }

    // Source Y is based on direction/row
    const sourceY = this.sprite.y * frameHeight;

    ctx.drawImage(
        this.sprite.image,
        sourceX,
        sourceY,
        frameWidth,
        frameHeight,
        this.position.x + tileSize / 2 - drawWidth / 2,
        this.position.y - verticalOffset,
        drawWidth,
        drawHeight
    );
}



    updateDimensions() {
        this.width = this.sprite.width * this.scale;
        this.height = this.sprite.height * this.scale;
        this.halfWidth = this.width / 2;
    }

}