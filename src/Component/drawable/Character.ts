import { vec2, vec3 } from "gl-matrix";
import { Tween } from "@tweenjs/tween.js";
import Layer from "./Layer.js";

export default class Character extends Layer {
    readonly tweens: Tween<vec2>[] = [];
    init(): void {
        this.renderer.initVAO(6);
        this.feedback.initVAO(6);
        this.feedback.updateBuffer(0, [
            0, 0, 0, 0, 0, 0, 3, 16, 32,
            0, 1, 0, 1, 0, 0, 3, 16, 32,
            0, 1, 2, 1, 1, 0, 3, 16, 32,
            0, 1, 2, 1, 1, 0, 3, 16, 32,
            0, 0, 2, 0, 1, 0, 3, 16, 32,
            0, 0, 0, 0, 0, 0, 3, 16, 32,
        ])
    }
    onTweenUpdate(data: vec2) {
        const x = data[0];
        const y = data[1];
        this.feedback.updateBuffer(1, [0 + x, 0 + y]);
        this.feedback.updateBuffer(10, [1 + x, 0 + y]);
        this.feedback.updateBuffer(19, [1 + x, 2 + y]);
        this.feedback.updateBuffer(28, [1 + x, 2 + y]);
        this.feedback.updateBuffer(37, [0 + x, 2 + y]);
        this.feedback.updateBuffer(46, [0 + x, 0 + y]);
    }
}