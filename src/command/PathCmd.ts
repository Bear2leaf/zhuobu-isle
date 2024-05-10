import Command from "./Command.js";
import Character from "../component/drawable/Character.js";
import { Tween } from "@tweenjs/tween.js";
import { vec2 } from "gl-matrix";

export default class PathCmd implements Command {
    constructor(
        private readonly character: Character,
        private readonly points: Point[]
    ) { }
    execute(): void {
        const character = this.character;
        const points = this.points;
        const tweens = character.tweens;
        tweens.forEach(tween => tween.stop());
        tweens.splice(0, tweens.length, ...[{ x: 0, y: 0 }, ...points].map((p, i, arr) => {
            const from = arr[i - 1];
            if (from) {
                return new Tween<vec2>(vec2.fromValues(from.y, from.x))
                    .to(vec2.fromValues(p.y, p.x))
                    .onUpdate(character.onTweenUpdate.bind(character))
                    .duration(100);
            } else {
                return new Tween<vec2>(vec2.fromValues(p.y, p.x)).duration(0);
            }
        }));
        for (let index = 1; index < tweens.length; index++) {
            const tweenTo = tweens[index - 1];
            const tweenFrom = tweens[index];
            tweenTo.chain(tweenFrom);
        }
        tweens[0].start()
    }

}