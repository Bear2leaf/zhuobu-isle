import Character from "../component/drawable/Character.js";
import Animate from "./Animate.js";

export default class Idle extends Animate {
    handle(character: Character): void {
        character.updateAnimation(0, 0)
    }

}