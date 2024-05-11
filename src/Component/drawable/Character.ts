import { vec2 } from "gl-matrix";
import Layer from "./Layer.js";
import Idle from "../../state/Idle.js";
import CharacterState from "../../state/CharacterState.js";
export default class Character extends Layer {
    private readonly path: vec2[] = []
    state: CharacterState = new Idle();
    delta: number = 0;
    init(): void {
        this.renderer.initVAO(6);
        this.feedback.initVAO(6);
        this.feedback.updateBuffer(0, [
            0, 0, 0, 0, 0, 0, 0, 16, 32,
            0, 1, 0, 1, 0, 0, 0, 16, 32,
            0, 1, 2, 1, 1, 0, 0, 16, 32,
            0, 1, 2, 1, 1, 0, 0, 16, 32,
            0, 0, 2, 0, 1, 0, 0, 16, 32,
            0, 0, 0, 0, 0, 0, 0, 16, 32,
        ])
    }
    addPath(points: vec2[]) {
        this.path.splice(0, this.path.length, ...points);
    }
    getPath(): vec2[] {
        return this.path;
    }
    update(elapsed: number, delta: number): void {
        super.update(elapsed, delta);
        this.delta = delta;
        this.state.handle(this);
    }
    updatePosition(data: vec2) {
        const x = data[0];
        const y = data[1];
        this.feedback.updateBuffer(1, [0 + x, 0 + y]);
        this.feedback.updateBuffer(10, [1 + x, 0 + y]);
        this.feedback.updateBuffer(19, [1 + x, 2 + y]);
        this.feedback.updateBuffer(28, [1 + x, 2 + y]);
        this.feedback.updateBuffer(37, [0 + x, 2 + y]);
        this.feedback.updateBuffer(46, [0 + x, 0 + y]);
    }
    updateAnimation(start: number, end: number) {
        this.feedback.updateBuffer(5, [start, end]);
        this.feedback.updateBuffer(14, [start, end]);
        this.feedback.updateBuffer(23, [start, end]);
        this.feedback.updateBuffer(32, [start, end]);
        this.feedback.updateBuffer(41, [start, end]);
        this.feedback.updateBuffer(50, [start, end]);
    }
}