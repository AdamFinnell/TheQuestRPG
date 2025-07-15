import { GameObject } from "./gameObj.js";
import { down, up, left, right } from "./input.js";

export class Hero extends GameObject {      // to extend the gameObj class into the child class Hero
    constructor({game, sprite, position, scale}){
        super({game, sprite, position, scale})
    }
   update(){
    if(this.game.input.lastKey === up){
        this.position.y--
    } else if(this.game.input.lastKey === down){
        this.position.y++
    }else if(this.game.input.lastKey === left){
        this.position.x--
    }else if(this.game.input.lastKey === right){
        this.position.x++
    }
   }
}