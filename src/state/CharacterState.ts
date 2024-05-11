import Character from "../component/drawable/Character.js";

export default interface CharacterState {
    handle(character: Character): void;
    
}