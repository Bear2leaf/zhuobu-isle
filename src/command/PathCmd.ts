import Command from "./Command.js";
import Character from "../component/drawable/Character.js";
import { vec2 } from "gl-matrix";

export default class PathCmd implements Command {
    constructor(
        private readonly character: Character,
        private readonly points: vec2[]
    ) { }
    execute(): void {
        const character = this.character;
        const points = this.points;
        character.addPath(points);
    }

}