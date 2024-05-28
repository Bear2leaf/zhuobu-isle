import { vec2 } from "gl-matrix";
import Layer from "./Layer.js";
import Idle from "../../state/Idle.js";
import State from "../../state/State.js";
import Camera from "../../camera/Camera.js";
export default class Character extends Layer {
    private camera?: Camera;
    setCamera(camera: Camera) {
        this.camera = camera;
    }
    private readonly path: vec2[] = []
    state: State = new Idle(this);
    delta: number = 0;
    addPath(points: vec2[]) {
        this.path.push(...points);
    }
    getPathLength() {
        return this.path.length;
    }
    splicePath(): vec2[] {
        const path = this.path.splice(0, this.path.length);
        return path;
    }
    update(elapsed: number, delta: number): void {
        super.update(elapsed, delta);
        this.delta = delta;
        this.state.handle();
    }
    updatePosition(data: vec2) {
        const x = data[0];
        const y = data[1];
        this.feedback?.updateBuffer(1, [0 + x, 0 + y]);
        this.feedback?.updateBuffer(10, [1 + x, 0 + y]);
        this.feedback?.updateBuffer(19, [1 + x, 2 + y]);
        this.feedback?.updateBuffer(28, [1 + x, 2 + y]);
        this.feedback?.updateBuffer(37, [0 + x, 2 + y]);
        this.feedback?.updateBuffer(46, [0 + x, 0 + y]);
        this.textRenderer?.updatePosition(data);
        this.camera?.setPositionFromPosition([-x, -y])
    }
    updateAnimation(start: number, end: number) {
        this.feedback?.updateBuffer(5, [start, end]);
        this.feedback?.updateBuffer(14, [start, end]);
        this.feedback?.updateBuffer(23, [start, end]);
        this.feedback?.updateBuffer(32, [start, end]);
        this.feedback?.updateBuffer(41, [start, end]);
        this.feedback?.updateBuffer(50, [start, end]);
    }
}