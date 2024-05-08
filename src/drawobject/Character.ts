import { vec2, vec3 } from "gl-matrix";
import Device from "../device/Device";
import SpriteFeedback from "../feedback/SpriteFeedback";
import SpriteRenderer from "../renderer/SpriteRenderer";
import Drawobject from "./Drawobject";
import { Tween, update } from "@tweenjs/tween.js";

export default class Character extends Drawobject {
    onmessage(data: WorkerMessage): void {
        if (data.type === "path") {
            const points = data.data;
            console.log(points);
            this.tweens.forEach(tween => tween.stop());
            this.tweens.splice(0, this.tweens.length, ...[{ x: 0, y: 0 }, ...points].map((p, i, arr) => {
                const from = arr[i - 1];
                if (from) {
                    return new Tween<vec2>(vec2.fromValues(from.y, from.x))
                        .to(vec2.fromValues(p.y, p.x))
                        .onUpdate(this.onTweenUpdate.bind(this))
                        .duration(100);
                } else {
                    return new Tween<vec2>(vec2.fromValues(p.y, p.x)).duration(0);
                }
            }));
            for (let index = 1; index < this.tweens.length; index++) {
                const tweenTo = this.tweens[index - 1];
                const tweenFrom = this.tweens[index];
                tweenTo.chain(tweenFrom);
            }
            this.tweens[0].start()
        }
    }
    sendmessage?: ((data: MainMessage) => void) | undefined;
    private readonly tweens: Tween<vec2>[];
    constructor(context: WebGL2RenderingContext) {
        const renderer = new SpriteRenderer(context);
        super(renderer, new SpriteFeedback(context, renderer.getTarget()));
        this.tweens = [];
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
        // this.tween.stop().to([x, y]).onUpdate(this.onTweenUpdate.bind(this)).startFromCurrentValues().start()
    }
    async load(device: Device): Promise<void> {
        await super.load(device);
        await this.renderer.loadTextureSource(device, "character");
    }
}