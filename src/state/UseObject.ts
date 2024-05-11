import Character from "../component/drawable/Character.js";
import CharacterState from "./CharacterState.js";
import Idle from "./Idle.js";

export default class Useobject implements CharacterState {
    handle(character: Character): void {
        // todo
        // currently we dont have any object
        // emit empty path for quickly switch to idle
        character.addPath([])
        character.state = new Idle();
    }

}