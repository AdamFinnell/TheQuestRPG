import { tileSize } from "../main.js";
import { GameObject } from "./gameObj.js";

export class Enemies extends GameObject {
    constructor({ game, sprite, position, scale }) {
        super({ game, sprite, position, scale });

        this.speed = 100;
        this.maxFrame = 8;
        this.moving = false;

        this.roamTimer = 0;
        this.roamInterval = 2000; // random roam every 2 seconds
        this.lastDirection = "down";

        this.attackCooldown = 500;
        this.lastAttackTime = 0;
        this.isAttacking = false;

        this.attackFrame = 0;
        this.attackFrameTimer = 0;
        this.attackFrameInterval = 60;
        this.attackFrames = 5;
        this.attackStartOffset = 1.5;
        this.attackFrameSpacing = 1;

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

        this.lastAttackTime = now;
        this.isAttacking = true;
        this.attackFrame = 0;
        this.attackFrameTimer = 0;

        // Lock position
        this.destinationPosition = { ...this.position };

        this.sprite.y = this.animations.attack[this.lastDirection];
        this.sprite.x = 0;
    }

    update(deltaTime) {
        // === Attack Animation Handling ===
        if (this.isAttacking) {
            this.attackFrameTimer += deltaTime;
            if (this.attackFrameTimer >= this.attackFrameInterval) {
                this.attackFrameTimer = 0;
                this.attackFrame++;
                if (this.attackFrame >= this.attackFrames) {
                    this.isAttacking = false;
                    this.attackFrame = 0;
                    this.sprite.x = 0;
                    this.sprite.y = this.animations.walk[this.lastDirection];
                } else {
                    this.sprite.x = this.attackStartOffset + this.attackFrame * this.attackFrameSpacing;
                }
            }
            this.moving = false;
            return;
        }

        // === Roaming Movement Logic ===
        this.roamTimer += deltaTime;
        if (this.roamTimer >= this.roamInterval) {
            this.roamTimer = 0;

            const dirs = ["up","down","left","right"];
            const dir = dirs[Math.floor(Math.random() * dirs.length)];
            this.lastDirection = dir;

            const offset = {
                up: { x:0, y:-tileSize },
                down: { x:0, y: tileSize },
                left: { x:-tileSize, y:0 },
                right: { x: tileSize, y:0 }
            }[dir];

            const nextPos = {
                x: this.position.x + offset.x,
                y: this.position.y + offset.y
            };
            const col = Math.floor(nextPos.x / tileSize);
            const row = Math.floor(nextPos.y / tileSize);

            if (this.game.world.getTile(this.game.world.level1.collisionLayer, row, col) !== 1) {
                this.destinationPosition = nextPos;
                this.sprite.y = this.animations.walk[dir];
            }
        }

        // === Apply Movement ===
        const speed = this.speed * (deltaTime / 1000);
        const dist = this.moveTowards(this.destinationPosition, speed);
        const arrived = dist <= speed;
        this.moving = !arrived;

        if (this.moving && this.game.eventUpdate) {
            this.sprite.x < this.maxFrame ? this.sprite.x++ : (this.sprite.x = 1);
        } else if (!this.moving) {
            this.sprite.x = 0;
        }

        // === Check For Attack ===
        const dx = Math.abs(this.position.x - this.game.hero.position.x);
        const dy = Math.abs(this.position.y - this.game.hero.position.y);

        if (dx < tileSize && dy < tileSize) {
            this.fight();
        }
    }
}
