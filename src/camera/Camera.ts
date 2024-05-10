import { mat4, vec2, vec3, vec4 } from "gl-matrix";
import Drawable from "../component/drawable/Drawable";

export default class Camera {
    private readonly velocity: vec2;
    private readonly windowInfo: [number, number];
    private readonly projection: mat4;
    private readonly view: mat4;
    private readonly model: mat4;
    private readonly cameraPosition: vec2;
    private readonly speed;
    constructor() {
        this.cameraPosition = vec2.create();
        this.velocity = vec2.create();
        this.windowInfo = [0, 0];
        this.projection = mat4.create();
        this.view = mat4.create();
        this.model = mat4.create();
        this.speed = 0.1;
    }
    onclick(x: number, y: number): void {
    }
    ondrag(x: number, y: number): void {
        this.velocity[0] = x;
        this.velocity[1] = -y;
    }
    onrelease(): void {
        this.velocity[0] = 0;
        this.velocity[1] = 0;
    }
    action(): void {
        throw new Error("unimplemented")
    }
    screenToWorld(x: number, y: number, p: vec4) {
        const windowInfo = this.windowInfo;
        vec4.copy(p, vec4.fromValues(x / windowInfo[0], y / windowInfo[1], 0, 1));
        vec4.sub(p, vec4.mul(p, p, vec4.fromValues(2, 2, 0, 1)), vec4.fromValues(1, 1, 0, 0));
        p[1] = -p[1];
        vec4.transformMat4(p, p, mat4.invert(mat4.create(), this.projection));
        vec4.transformMat4(p, p, this.view);
        vec4.transformMat4(p, p, mat4.invert(mat4.create(), this.model));
        console.log(`clicked: screen->[${x},${y}], p-> ${p.join(",")}`);
    }
    updateWindowInfo(width: number, height: number) {
        this.windowInfo[0] = width
        this.windowInfo[1] = height;
    }
    update(elapsed: number, delta: number) {
        const cameraPos = this.cameraPosition;
        const velocity = this.velocity;
        cameraPos[0] += velocity[0] * delta * this.speed;
        cameraPos[1] += velocity[1] * delta * this.speed;
        mat4.lookAt(this.view, vec3.fromValues(cameraPos[0], cameraPos[1], 1), vec3.fromValues(cameraPos[0], cameraPos[1], 0), vec3.fromValues(0, 1, 0));
        const [width, height] = this.windowInfo;
        mat4.ortho(this.projection, 0, width, height, 0, 1, -1);
        mat4.fromScaling(this.model, vec3.fromValues(100, 100, 1))
    }
    updateDrawable(drawobject: Drawable) {
        const invert = mat4.create();
        mat4.invert(invert, this.view);
        drawobject.updateProjection(this.projection);
        drawobject.updateModel(this.model);
        drawobject.updateView(invert);
    }
}