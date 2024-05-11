import { vec2, vec3 } from "gl-matrix";
import Layer from "./Layer.js";
import Animate from "../../state/Animate.js";
import Idle from "../../state/Idle.js";
import Walk from "../../state/Walk.js";
function lerp(x0: number, x1: number, t: number) {
    return x0 + (x1 - x0) * t;
}
function fract(x0: number) {
    return x0 - parseInt('' + x0);
}
export default class Character extends Layer {
    private readonly path: vec2[] = []
    private readonly duration = 100;
    private state = new Animate();
    private accumulator = 0;
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
        this.accumulator = 0;
        this.path.splice(0, this.path.length, ...points);
    }
    update(elapsed: number, delta: number): void {
        super.update(elapsed, delta);
        this.accumulator += delta;
        const point0 = this.path[Math.floor(this.accumulator / this.duration)];
        const point1 = this.path[Math.floor(this.accumulator / this.duration) + 1];
        if (!point1) {
            this.state = new Idle()
            this.state.handle(this);
            return;
        }
        const horizontal = point0[0] - point1[0];
        const vertical = point0[1] - point1[1];
        const curPoint = vec2.fromValues(
            lerp(point0[0], point1[0], fract(this.accumulator / this.duration)),
            lerp(point0[1], point1[1], fract(this.accumulator / this.duration)),
        )
        this.state = new Walk(curPoint, vec2.fromValues(horizontal, vertical));
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