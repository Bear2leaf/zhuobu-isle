import Character from "../component/drawable/Character.js";
import CharacterState from "./CharacterState.js";

export default class Useobject implements CharacterState {
    handle(character: Character): void {
        throw new Error("Method not implemented.");
    }

}