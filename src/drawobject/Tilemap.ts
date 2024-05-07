import Device from "../device/Device";
import SpriteFeedback from "../feedback/SpriteFeedback";
import SpriteRenderer from "../renderer/SpriteRenderer";
import Drawobject from "./Drawobject";

export default class Tilemap extends Drawobject {
    private readonly tilemap: any;
    constructor(context: WebGL2RenderingContext) {
        const renderer = new SpriteRenderer(context);
        super(renderer, new SpriteFeedback(context, renderer.getTarget()))
        this.tilemap = {}
    }
    init(): void {
        const layers = this.tilemap.layers;
        const buffer: number[] = [];
        for (let k = 0; k < layers.length; k++) {
            const layer = layers[k];
            const data = layer.data;
            const width = layer.width;
            const height = layer.height;
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    const element = data[i * width + j] - 1;
                    if (element < 0) {
                        continue;
                    }
                    buffer.push(
                        0, 0 + j, 0 + i, 0, 0, element, element, 16, 16,
                        0, 1 + j, 0 + i, 1, 0, element, element, 16, 16,
                        0, 1 + j, 1 + i, 1, 1, element, element, 16, 16,
                        0, 1 + j, 1 + i, 1, 1, element, element, 16, 16,
                        0, 0 + j, 1 + i, 0, 1, element, element, 16, 16,
                        0, 0 + j, 0 + i, 0, 0, element, element, 16, 16,
                    )
                }
            }
        }
        this.renderer.initVAO(buffer.length / 9);
        this.feedback.initVAO(buffer.length / 9);
        this.feedback.updateBuffer(0, buffer);
    }
    async load(device: Device): Promise<void> {
        await super.load(device);
        await this.renderer.loadTextureSource(device, "Overworld");
        Object.assign(this.tilemap, await device.readJson("resources/json/overworld.json"));
    }
}