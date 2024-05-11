import Character from "../component/drawable/Character.js";
import CharacterState from "./CharacterState.js";

export default class Animate implements CharacterState {
    handle(character: Character): void {
        character.updateAnimation(0, 0)
    }

}