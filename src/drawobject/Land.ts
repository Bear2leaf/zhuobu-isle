import Device from "../device/Device";
import SpriteFeedback from "../feedback/SpriteFeedback";
import SpriteRenderer from "../renderer/SpriteRenderer";
import Drawobject from "./Drawobject";
import {  UnencodedTileLayer } from "@kayahr/tiled";

export default class Land extends Drawobject {
    sendmessage?: ((data: MainMessage) => void) | undefined;
    private readonly buffer: number[] = [];
    private textureName?: string;
    constructor(context: WebGL2RenderingContext) {
        const renderer = new SpriteRenderer(context);
        super(renderer, new SpriteFeedback(context, renderer.getTarget()))
    }
    initLayerBuffer(layer: UnencodedTileLayer): void {
        const buffer: number[] = [];
        const data = layer.data as number[];
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
        this.buffer.splice(0, this.buffer.length, ...buffer);
    }
    init(): void {
        const buffer: number[] = this.buffer;
        this.renderer.initVAO(buffer.length / 9);
        this.feedback.initVAO(buffer.length / 9);
        this.feedback.updateBuffer(0, buffer);
    }
    async loadTexture(name: string, device: Device) {

        await this.renderer.loadTextureSource(device, name);
    }
    onmessage(data: WorkerMessage): void {
        if (data.type === "path") {
            console.log(data);
        }
    }
    worldPositionToTilePoint(x: number, y: number): Point {
        return {
            x: Math.floor(x),
            y: Math.floor(y)
        }
    }
    onclick(x: number, y: number): void {
        this.sendmessage && this.sendmessage({
            type: "findPath",
            data: {
                start: this.worldPositionToTilePoint(0, 0),
                end: this.worldPositionToTilePoint(x, y)
            }
        });
    }
}