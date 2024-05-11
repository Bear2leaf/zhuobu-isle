import { vec2 } from "gl-matrix";
import Character from "../component/drawable/Character.js";
import CharacterState from "./CharacterState.js";
import Useobject from "./Useobject.js";

function lerp(x0: number, x1: number, t: number) {
    return x0 + (x1 - x0) * t;
}
function fract(x0: number) {
    return x0 - parseInt('' + x0);
}
export default class Goto implements CharacterState {
    private accumulator = 0;
    private readonly duration = 100;
    handle(character: Character): void {
        this.accumulator += character.delta;
        const point0 = character.getPath()[Math.floor(this.accumulator / this.duration)];
        const point1 = character.getPath()[Math.floor(this.accumulator / this.duration) + 1];
        if (!point0 || !point1) {
            character.state = new Useobject();
            return;
        }
        const horizontal = point0[0] - point1[0];
        const vertical = point0[1] - point1[1];
        const curPoint = vec2.fromValues(
            lerp(point0[0], point1[0], fract(this.accumulator / this.duration)),
            lerp(point0[1], point1[1], fract(this.accumulator / this.duration)),
        )
        const direction = vec2.fromValues(horizontal, vertical);
        if (!direction[1]) {
            if (direction[0] > 0) {
                character.updateAnimation(51, 54)
            } else if (direction[0] < 0) {
                character.updateAnimation(17, 20)
            } else if (direction[0] === 0) {
                character.updateAnimation(0, 3)
            }
        } else {
            if (direction[1] > 0) {
                character.updateAnimation(34, 37)
            } else {
                character.updateAnimation(0, 3)
            }
        }
        character.updatePosition(curPoint);
    }

}