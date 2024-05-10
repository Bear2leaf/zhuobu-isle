import { mat4, vec3 } from "gl-matrix";
import Device from "../../device/Device";
import Renderer from "../../renderer/Renderer";
import Component from "../Component.js";
import SpriteFeedback from "../../feedback/SpriteFeedback.js";
import SpriteRenderer from "../../renderer/SpriteRenderer.js";

export default class Drawable extends Component {
    private textureName: string = "";
    private _renderer?: Renderer;
    private _feedback?: Renderer;

    protected get renderer() {

        if (!this._renderer) {
            throw new Error("renderer is undefined")
        }
        return this._renderer;
    }
    protected get feedback() {

        if (!this._feedback) {
            throw new Error("feedback is undefined")
        }
        return this._feedback;
    }
    private readonly projection: mat4;
    private readonly model: mat4;
    private readonly view: mat4;
    constructor() {
        super();
        this.projection = mat4.create();
        this.model = mat4.create();
        this.view = mat4.create();
    }
    initRenderer(context: WebGL2RenderingContext) {

        this._renderer = new SpriteRenderer(context);
        this._feedback = new SpriteFeedback(context, this.renderer.getTarget());
    }
    setTextureName(name: string) {
        this.textureName = name;
    }
    async load(device: Device) {
        await this.renderer.loadShaderSource(device);
        await this.feedback.loadShaderSource(device)
        await this.renderer.loadTextureSource(device, this.textureName);
    }
    update(elapsed: number, delta: number) {
        if (!this.renderer || !this.feedback) {
            throw new Error("renderers is not inited")
        }
        this.renderer.updateProjection(this.projection);
        this.renderer.updateModel(this.model);
        this.renderer.updateView(this.view);
        this.feedback.updateDelta(delta);
    }
    draw() {
        if (!this.renderer || !this.feedback) {
            throw new Error("renderers is not inited")
        }
        this.feedback.render();
        this.renderer.render();
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
}