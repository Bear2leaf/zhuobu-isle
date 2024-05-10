import Receiver from "./Receiver.js";
import Component from "../Component.js";
import Character from "../drawable/Character.js";
import { Tween } from "@tweenjs/tween.js";
import { vec2 } from "gl-matrix";

export default class WorkerMessageReceiver extends Component implements Receiver {
    workerMessage?: WorkerMessage;
    character?: Character;
    action(): void {
        if (this.workerMessage) {
            switch (this.workerMessage.type) {
                case "worker":
                    break;
                case "path":
                    this.processPath(this.workerMessage.data, this.character)
                    break;
            }
        }
    }
    processPath(points: Point[], character?: Character) {
        if (!character) {
            return;
        }
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