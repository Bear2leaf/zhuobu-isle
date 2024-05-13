import TileHouse from "../../tiled/TileHouse.js";
import TileInterpreter from "../../tiled/TileInterpreter.js";
import TiledMap from "../../tiled/TiledMap.js";
import Drawable from "./Drawable";

export default class Layer extends Drawable {
    getTilesetFirstgid() {
        return this.tiledMap?.getTilesetFirstgid(this.getData())
    }
    protected tiledMap?: TiledMap;
    protected index: number = 0;
    private readonly interpreters: TileInterpreter[] = [
        new TileHouse(),
    ];
    private house = 0;
    protected readonly buffer: number[] = [];
    setTiledMap(tiledMap: TiledMap) {
        this.tiledMap = tiledMap;
    }
    setLayerIndex(index: number) {
        this.index = index;
    }
    getData() {
        const layer = this.tiledMap?.getLayers()[this.index];
        if (!layer) {
            throw new Error("layer not found");
        }
        return layer;
    }
    initTexture() {
        const tiledMap = this.tiledMap;
        if (!tiledMap) {
            throw new Error("tiledMap is undefined");
        }
        const image = tiledMap.getTilesetImage(tiledMap.getLayers()[this.index]);
        this.setTextureName(image);
    }
    increaseHouse() {
        this.house++;
    }
    init(): void {
        const tiledMap = this.tiledMap;
        if (!tiledMap) {
            throw new Error("tiledMap is undefined");
        }
        const layer = tiledMap.getLayers()[this.index];
        const firstgid = tiledMap.getTilesetFirstgid(layer) || 1;
        const buffer: number[] = [];
        const data = layer.data as number[];
        const maptilewidth = tiledMap.getTilewidth();
        const maptileheight = tiledMap.getTileheight();
        const width = layer.width;
        const height = layer.height;
        const tilewidth = tiledMap.getTilesetWidth(layer);
        const tileheight = tiledMap.getTilesetHeight(layer);
        const fixuv = 0.005;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const element = data[i * width + j] - firstgid;
                if (element < 0) {
                    continue;
                }
                for (const interpreter of this.interpreters) {
                    interpreter.interpret(this, i * width + j)
                }
                buffer.push(
                    0, 0 + j, 0 + i, 0 + fixuv, 0 + fixuv, element, element, tilewidth, tileheight,
                    0, 1 * tilewidth / maptilewidth + j, 0 + i, 1 - fixuv, 0 + fixuv, element, element, tilewidth, tileheight,
                    0, 1 * tilewidth / maptilewidth + j, 1 * tileheight / maptileheight + i, 1 - fixuv, 1 - fixuv, element, element, tilewidth, tileheight,
                    0, 1 * tilewidth / maptilewidth + j, 1 * tileheight / maptileheight + i, 1 - fixuv, 1 - fixuv, element, element, tilewidth, tileheight,
                    0, 0 + j, 1 * tileheight / maptileheight + i, 0 + fixuv, 1 - fixuv, element, element, tilewidth, tileheight,
                    0, 0 + j, 0 + i, 0 + fixuv, 0 + fixuv, element, element, tilewidth, tileheight,
                )
            }
        }
        this.buffer.splice(0, this.buffer.length, ...buffer);
        this.renderer.initVAO(buffer.length / 9);
        this.feedback.initVAO(buffer.length / 9);
        this.feedback.updateBuffer(0, buffer);
    }
}