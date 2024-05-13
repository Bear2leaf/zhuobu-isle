import TileInterpreter from "./TileInterpreter.js";
import TiledMap from "./TiledMap.js";

export default class TileHouse implements TileInterpreter {
    private readonly partsX = 5;
    private readonly partsY = 5;
    interpret(context: TiledMap, layerIdx: number, tileIdx: number): boolean {
        const layer = context.getLayers()[layerIdx];
        const mapwidth = context.getWidth();
        const mapheight = context.getWidth();
        const firstgid = context.getTilesetFirstgrid(layer) || 1;
        if (!layer.data) {
            throw new Error("layer.data not found");
        }
        const tile = layer.data[tileIdx];
        if (!tile) {
            throw new Error("tile not found");
        }
        for (let i = 0; i < this.partsY; i++) {
            for (let j = 0; j < this.partsX; j++) {
                const element = layer.data[tileIdx + i * mapwidth + j] - firstgid;
                if (element < 0) {
                    return false;
                }
            }
        }
        return true;
    }

}