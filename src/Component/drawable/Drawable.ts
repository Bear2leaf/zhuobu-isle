import { mat4, vec3 } from "gl-matrix";
import Device from "../../device/Device";
import Renderer from "../../renderer/Renderer";
import Component from "../Component.js";
import SpriteFeedback from "../../feedback/SpriteFeedback.js";
import SpriteRenderer from "../../renderer/SpriteRenderer.js";
import TextRenderer from "../../renderer/TextRenderer.js";

export default class Drawable extends Component {
    private textureName: string = "";
    protected textRenderer?: TextRenderer;
    protected renderer?: Renderer;
    protected feedback?: Renderer;
     readonly projection: mat4;
     readonly model: mat4;
     readonly view: mat4;
    constructor() {
        super();
        this.projection = mat4.create();
        this.model = mat4.create();
        this.view = mat4.create();
    }
    initFontCanvas(context: WebGL2RenderingContext, context2d: CanvasRenderingContext2D) {
        this.textRenderer = new TextRenderer(context);
        this.textRenderer?.initFontCanvas(context2d)
    }
    initRenderer(context: WebGL2RenderingContext) {
        this.renderer = new SpriteRenderer(context);
        this.feedback = new SpriteFeedback(context, this.renderer.handler);
    }
    setTextureName(name: string) {
        this.textureName = name;
    }
    async load(device: Device) {
        await this.textRenderer?.loadShaderSource(device);
        await this.textRenderer?.loadTextureSource(device);
        await this.renderer?.loadShaderSource(device);
        await this.feedback?.loadShaderSource(device)
        await this.renderer?.loadTextureSource(device, this.textureName);
    }
    draw() {
        this.feedback?.render();
        this.renderer?.render();
        this.textRenderer?.render();
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