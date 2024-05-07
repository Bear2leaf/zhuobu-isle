import { vec2, vec3 } from "gl-matrix";
import Device from "../device/Device.ts";
import SpriteFeedback from "../feedback/SpriteFeedback.ts";
import SpriteRenderer from "../renderer/SpriteRenderer.ts";
import Drawobject from "./Drawobject.ts";
import { Tween } from "@tweenjs/tween.js";

export default class Character extends Drawobject {
    private readonly tween: Tween<vec2>;
    constructor(context: WebGL2RenderingContext) {
        const renderer = new SpriteRenderer(context);
        super(renderer, new SpriteFeedback(context, renderer.getTarget()));
        this.tween = new Tween(vec2.create());
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
    onclick(x: number, y: number): void {
        this.tween.stop().to([x, y]).onUpdate(this.onTweenUpdate.bind(this)).startFromCurrentValues().start()
    }
    async load(device: Device): Promise<void> {
        await super.load(device);
        await this.renderer.loadTextureSource(device, "character");
    }
    update(elapsed: number, delta: number): void {
        this.tween.update(elapsed);
        super.update(elapsed, delta);
    }
}