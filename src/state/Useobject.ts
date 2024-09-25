import Character from "../component/drawable/Character.js";
import State from "./State.js";
import Idle from "./Idle.js";

export default class Useobject implements State {
    constructor(private readonly character: Character) {}
    handle(): void {
        const character = this.character;
        // todo
        // currently we dont have any object
        // emit empty path for quickly switch to idle
        character.addPath([])
        character.state = new Idle(character);
    }

}
