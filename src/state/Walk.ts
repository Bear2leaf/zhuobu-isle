import { vec2 } from "gl-matrix";
import Character from "../component/drawable/Character.js";
import Animate from "./Animate.js";
export default class Walk extends Animate {
    constructor(
        private readonly curPoint: vec2,
        private readonly direction: vec2
    ) {
        super();
    }
    handle(character: Character): void {
        if (!this.direction[1]) {
            if (this.direction[0] > 0 ) {
                character.updateAnimation(51, 54)
            } else if (this.direction[0] < 0) {
                character.updateAnimation(17, 20)
            } else if (this.direction[0] === 0) {
                character.updateAnimation(0, 3)
            }
        } else {
            if (this.direction[1] > 0) {
                character.updateAnimation(34, 37)
            } else {
                character.updateAnimation(0, 3)
            }
        }
        

        character.updatePosition(this.curPoint);
    }

}