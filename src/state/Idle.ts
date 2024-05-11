import Character from "../component/drawable/Character.js";
import State from "./State.js";
import Goto from "./Goto.js";

export default class Idle implements State {
    constructor(private readonly character: Character) {}
    handle(): void {
        const character = this.character;
        character.updateAnimation(0, 0)
        if (character.getPath().length >= 2) {
            character.state = new Goto(character);
        }
    }

}