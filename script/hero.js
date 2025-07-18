import { tileSize } from "../main.js";
import { GameObject } from "./gameObj.js";
import { down, up, left, right } from "./input.js";

export class Hero extends GameObject {
    constructor({ game, sprite, position, scale }) {
        super({ game, sprite, position, scale });
        this.speed = 100;
        this.maxFrame = 8; // add max frames for sprite animation
        this.moving = false;

        this.attackCooldown = 500;
        this.lastAttackTime = 0;
        this.isAttacking = false;

        this.attackFrame = 0;
        this.attackFrameTimer = 0;
        this.attackFrameInterval = 120; // Slower for better visibility
        
        this.attackFrames = 5; // Match your original setting
        this.attackVerticalOffsets = {
            up: 16,
            down: 16,
            left: 16,
            right: 16
        };

        this.animations = {
            idle: { up: 8, down: 10, left: 9, right: 11 }, // Same as walk for idle frame
            walk: { up: 8, down: 10, left: 9, right: 11 },
            attack: { up: 55, down: 57, left: 56, right: 58 }, // Correct starting rows
        };

        // Attack frames might be spaced differently - let's track this
        this.attackFrameSpacing = 1; // spacing is 1 frame apart
        this.attackStartOffset = 1.5; // attack starts 1.5 frames to the right

        // Attack sprite dimensions (adjust these based on your sprite sheet)
        this.attackSpriteWidth = 65;
        this.attackSpriteHeight = 65;

        // Store original sprite dimensions
        this.originalSpriteWidth = this.sprite.width;
        this.originalSpriteHeight = this.sprite.height;

    }

    fight() {
        if (this.isAttacking) return;

        const now = Date.now();
        if (now - this.lastAttackTime < this.attackCooldown) return;

        this.lastAttackTime = now;
        this.isAttacking = true;
        this.attackFrame = 0;
        this.attackFrameTimer = 0;

        // Stop character from sliding
        this.destinationPosition.x = this.position.x;
        this.destinationPosition.y = this.position.y;

        // Set attack animation row based on direction
        this.sprite.y = this.animations.attack[this.game.input.lastDirection];
        this.sprite.x = 0; // Start from first frame

        console.log(`Attack started: direction=${this.game.input.lastDirection}, sprite.y=${this.sprite.y}, sprite.x=${this.sprite.x}`);
    }

    update(deltaTime) {
        if (this.isAttacking) {
            this.attackFrameTimer += deltaTime;

            if (this.attackFrameTimer >= this.attackFrameInterval) {
                this.attackFrameTimer = 0;
                this.attackFrame++;

                if (this.attackFrame >= this.attackFrames) {
                    // End attack animation
                    this.isAttacking = false;
                    this.attackFrame = 0;

                    // Reset to idle animation (use frame 0 of walk animation)
                    this.sprite.x = 0;
                    this.sprite.y = this.animations.walk[this.game.input.lastDirection];

                    console.log("Attack ended, returning to idle");
                } else {
                    // Continue attack animation - use spacing for attack frames
                    this.sprite.x = this.attackStartOffset + this.attackFrame * this.attackFrameSpacing;


                    console.log(`Setting sprite.x to: ${this.sprite.x} (frame ${this.attackFrame} * spacing ${this.attackFrameSpacing})`);
                }
            }

            this.moving = false;
            return; // Don't process movement while attacking
        }

        // Movement logic (unchanged)
        let nextX = this.destinationPosition.x;
        let nextY = this.destinationPosition.y;

        const scaledSpeed = this.speed * (deltaTime / 1000);
        const distance = this.moveTowards(this.destinationPosition, scaledSpeed);
        const arrived = distance <= scaledSpeed;

        if (arrived && this.game.input.keys.length > 0) {
            const key = this.game.input.lastDirection;

            // Set direction-specific sprite animation row
            this.sprite.y = this.animations.walk[key];

            // Actually move the player!
            if (key === up) nextY -= tileSize;
            else if (key === down) nextY += tileSize;
            else if (key === left) nextX -= tileSize;
            else if (key === right) nextX += tileSize;

            const col = nextX / tileSize;
            const row = nextY / tileSize;
            if (this.game.world.getTile(this.game.world.level1.collisionLayer, row, col) !== 1) {
                this.destinationPosition.x = nextX;
                this.destinationPosition.y = nextY;
            }

        }

        this.moving = !arrived;

        // Handle walking animation
        if (this.game.eventUpdate && this.moving) {
            this.sprite.x < this.maxFrame ? this.sprite.x++ : this.sprite.x = 1;
        } else if (!this.moving) {
            // Set to idle (frame 0 of walk animation) when not moving
            this.sprite.x = 0;
            // Keep the same sprite.y as it's already set correctly for the direction
        }

    }

}