import Drawable from "./Drawable";
import { UnencodedTileLayer } from "@kayahr/tiled";

export default class Layer extends Drawable {
    private layer?: UnencodedTileLayer;
    private firstgrid?: number;
    setData(layer: UnencodedTileLayer, firstgrid?: number) {
        this.layer = layer
        this.firstgrid = firstgrid
    }
    private readonly buffer: number[] = [];
    init(): void {

        if (!this.layer) {
            throw new Error("layer is undefined");
        }
        const layer = this.layer;
        const buffer: number[] = [];
        const data = layer.data as number[];
        const width = layer.width;
        const height = layer.height;
        const firstgrid = this.firstgrid || 1;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const element = data[i * width + j] - firstgrid;
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
        this.renderer.initVAO(buffer.length / 9);
        this.feedback.initVAO(buffer.length / 9);
        this.feedback.updateBuffer(0, buffer);
    }
}