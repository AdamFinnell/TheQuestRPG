export const left = "left";
export const right = "right";
export const up = "up";
export const down = "down";
export const attack = "attack";

export class Input {
    constructor(game) {
        this.game = game;
        this.keys = [];
        this.justPressed = [];
        this.lastDirection = down; // default facing down


        window.addEventListener("keydown", (e) => {
            const key = e.key.toLowerCase();
            if (key === "w" || e.key === "ArrowUp") this.keyPressed(up);
            else if (key === "s" || e.key === "ArrowDown") this.keyPressed(down);
            else if (key === "a" || e.key === "ArrowLeft") this.keyPressed(left);
            else if (key === "d" || e.key === "ArrowRight") this.keyPressed(right);
            else if (key === " ") this.keyPressed(attack);
            else if (e.key === "Enter") this.game.toggleDebug();
        });

        window.addEventListener("keyup", (e) => {
            const key = e.key.toLowerCase();
            if (["w", "arrowup"].includes(key)) this.keyReleased(up);
            else if (["s", "arrowdown"].includes(key)) this.keyReleased(down);
            else if (["a", "arrowleft"].includes(key)) this.keyReleased(left);
            else if (["d", "arrowright"].includes(key)) this.keyReleased(right);
            else if (e.key === " ") this.keyReleased(attack);
        });
    }

    keyPressed(key) {
    if ([up, down, left, right].includes(key)) {
        this.lastDirection = key;
    }

    if (!this.keys.includes(key)) {
        this.keys.push(key); 
    }
}


    keyReleased(key) {
        const index = this.keys.indexOf(key)
        if (index > -1) {
            this.keys.splice(index, 1)
            this.justPressed.push(key)  // Track new press
        }
    }
    clearJustPressed() {
        this.justPressed = [];
    }


    get lastKey() {
        return this.keys[0];
    }
}
