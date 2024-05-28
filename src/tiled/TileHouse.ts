import Layer from "../component/drawable/Layer.js";
import TileInterpreter from "./TileInterpreter.js";

export default class TileHouse implements TileInterpreter {
    // cols & startRowIndices are tile specs, differ from each TileInterpreter
    private readonly cols = 5;
    private readonly startRowIndices: readonly number[] = [
        7, 47, 87, 127, 167
    ]
    interpret(context: Layer, tileIdx: number): void {
        const layer = context.getData();
        if (!layer?.data) {
            throw new Error("data not found");
        }
        const width = layer.width;
        const height = layer.height;
        const firstgid = context.getTilesetFirstgid() || 1;
        const tile = layer.data[tileIdx];
        if (tile === undefined) {
            throw new Error("tile not found");
        }
        for (let i = 0; i < this.startRowIndices.length; i++) {
            const col = []
            for (let j = 0; j < this.cols; j++) {
                const element = layer.data[tileIdx + i * width + j];
                if (element < 0) {
                    return;
                }
                col.push(element)
                if (element !== this.startRowIndices[i] + j) {
                    return;
                }
            }
        }
        context.increaseHouse();
    }

}