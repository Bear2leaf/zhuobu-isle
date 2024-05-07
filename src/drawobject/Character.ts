import Device from "../device/Device.ts";
import SpriteFeedback from "../feedback/SpriteFeedback.ts";
import SpriteRenderer from "../renderer/SpriteRenderer.ts";
import Drawobject from "./Drawobject.ts";

export default class Character extends Drawobject {
    constructor(context: WebGL2RenderingContext) {
        const renderer = new SpriteRenderer(context);
        super(renderer, new SpriteFeedback(context, renderer.getTarget()))
    }
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
    onclick(x: number, y: number): void {
        this.feedback.updateBuffer(1, [ 0 + x, 0 + y]);
        this.feedback.updateBuffer(10, [ 1 + x, 0 + y]);
        this.feedback.updateBuffer(19, [ 1 + x, 2 + y]);
        this.feedback.updateBuffer(28, [ 1 + x, 2 + y]);
        this.feedback.updateBuffer(37, [ 0 + x, 2 + y]);
        this.feedback.updateBuffer(46, [ 0 + x, 0 + y]);
    }
    async load(device: Device): Promise<void> {
        await super.load(device);
        await this.renderer.loadTextureSource(device, "character");
    }
}