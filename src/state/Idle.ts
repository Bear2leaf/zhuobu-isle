import Character from "../component/drawable/Character.js";
import CharacterState from "./CharacterState.js";
import Goto from "./Goto.js";

export default class Idle implements CharacterState {
    handle(character: Character): void {
        character.updateAnimation(0, 0)
        if (character.getPath().length >= 2) {
            character.state = new Goto();
        }
    }

}