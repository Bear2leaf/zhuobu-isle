import { mat4, vec3 } from "gl-matrix";
import Device from "../device/Device";
import Renderer from "../renderer/Renderer";

export default abstract class Drawobject {
    private textureName: string = "";
    protected readonly renderer: Renderer;
    protected readonly feedback: Renderer;
    private readonly projection: mat4;
    private readonly model: mat4;
    private readonly view: mat4;
    constructor(renderer: Renderer, feedback: Renderer) {
        this.renderer = renderer;
        this.feedback = feedback;
        this.projection = mat4.create();
        this.model = mat4.create();
        this.view = mat4.create();
    }
    setTextureName(name: string) {
        this.textureName = name;
    }
    async load(device: Device) {
        await this.renderer.loadShaderSource(device);
        await this.feedback.loadShaderSource(device)
        await this.renderer.loadTextureSource(device, this.textureName);
    }
    abstract init(): void;
    update(elapsed: number, delta: number) {
        this.renderer.updateProjection(this.projection);
        this.renderer.updateModel(this.model);
        this.renderer.updateView(this.view);
        this.feedback.updateDelta(delta);
    }
    draw() {
        this.feedback.render();
        this.renderer.render();
    }
    onclick(x: number, y: number): void {
    }
    updateProjection(projection: mat4) {
        mat4.copy(this.projection, projection);
    }
    updateModel(model: mat4) {
        mat4.copy(this.model, model);
    }
    updateView(view: mat4) {
        mat4.copy(this.view, view);
    }
    onmessage(data: WorkerMessage): void {

    };
    abstract sendmessage?: (data: MainMessage) => void;
}