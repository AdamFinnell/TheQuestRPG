import { tileSize } from "../main.js";
import { GameObject } from "./gameObj.js";

export class Enemies extends GameObject {
    constructor({ game, sprite, position, scale }) {
        super({ game, sprite, position, scale });
        this.speed = 100;
        this.maxFrame = 8;
        this.moving = true;

        this.attackCooldown = 500;
        this.lastAttackTime = 0;
        this.isAttacking = false;

        this.attackFrame = 0;
        this.attackFrameTimer = 0;
        this.attackFrameInterval = 60;
        this.attackFrames = 5;

        this.attackFrameSpacing = 1;
        this.attackStartOffset = 1.5;

        this.roamTimer = 0;
        this.roamInterval = 2000;
        this.roamDirection = "down";
        this.aggroRange = 1;

        this.animations = {
            idle: { up: 8, down: 10, left: 9, right: 11 },
            walk: { up: 8, down: 10, left: 9, right: 11 },
            attack: { up: 55, down: 57, left: 56, right: 58 },
        };

        this.originalSpriteWidth = this.sprite.width;
        this.originalSpriteHeight = this.sprite.height;
    }

    fight() {
        if (this.isAttacking) return;

        const now = Date.now();
        if (now - this.lastAttackTime < this.attackCooldown) return;

        this.isAttacking = true;
        this.lastAttackTime = now;

        this.attackFrame = 0;
        this.attackFrameTimer = 0;

        // Stop movement
        this.destinationPosition.x = this.position.x;
        this.destinationPosition.y = this.position.y;

        // Set attack animation start
        const dir = this.game.input.lastDirection || "down";
        this.sprite.y = this.animations.attack[dir];
        this.sprite.x = 0;
    }

    update(deltaTime) {
        // === 🧠 Aggro Tracking ===
        const hero = this.game.hero;
        if (!hero || !hero.position) return;

        const dx = Math.abs(this.position.x - hero.position.x) / tileSize;
        const dy = Math.abs(this.position.y - hero.position.y) / tileSize;

        if (dx <= this.aggroRange && dy <= this.aggroRange) {
            this.fight();
            return;
        }

        // === 🔥 Handle Attacking ===
        if (this.isAttacking) {
            this.attackFrameTimer += deltaTime;

            if (this.attackFrameTimer >= this.attackFrameInterval) {
                this.attackFrameTimer = 0;
                this.attackFrame++;

                if (this.attackFrame >= this.attackFrames) {
                    // End attack
                    this.isAttacking = false;
                    this.attackFrame = 0;

                    const dir = this.game.input.lastDirection || "down";
                    this.sprite.y = this.animations.walk[dir];
                    this.sprite.x = 0;
                } else {
                    this.sprite.x = this.attackStartOffset + this.attackFrame * this.attackFrameSpacing;
                    console.log(
                        `Attack Frame: ${this.attackFrame} | sprite.x = ${this.sprite.x}`
                    );
                }
            }

            this.moving = false;
            return;
        }

        // === 🧭 Roaming AI ===
        this.roamTimer += deltaTime;

        if (this.roamTimer >= this.roamInterval) {
            this.roamTimer = 0;

            const directions = ["up", "down", "left", "right"];
            this.roamDirection = directions[Math.floor(Math.random() * directions.length)];
            const dir = this.roamDirection;

            const offset = {
                up: { x: 0, y: -tileSize },
                down: { x: 0, y: tileSize },
                left: { x: -tileSize, y: 0 },
                right: { x: tileSize, y: 0 },
            };

            const nextPos = {
                x: this.position.x + offset[dir].x,
                y: this.position.y + offset[dir].y,
            };

            const col = nextPos.x / tileSize;
            const row = nextPos.y / tileSize;

            if (this.game.world.getTile(this.game.world.level1.collisionLayer, row, col) !== 1) {
                this.destinationPosition = nextPos;
                this.sprite.y = this.animations.walk[dir];
            }
        }

        // === 🚶‍♀️ Movement ===
        const scaledSpeed = this.speed * (deltaTime / 1000);
        const distance = this.moveTowards(this.destinationPosition, scaledSpeed);
        const arrived = distance <= scaledSpeed;

        this.moving = !arrived;

        // === 🎞️ Walking Animation ===
        if (this.game.eventUpdate && this.moving) {
            this.sprite.x < this.maxFrame ? this.sprite.x++ : (this.sprite.x = 1);
        } else if (!this.moving) {
            this.sprite.x = 0; // Idle frame
        }
    }
}
