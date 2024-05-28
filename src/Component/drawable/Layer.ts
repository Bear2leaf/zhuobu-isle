import { vec2 } from "gl-matrix";
import TileHouse from "../../tiled/TileHouse.js";
import TileInterpreter from "../../tiled/TileInterpreter.js";
import Tilemap from "../../tiled/Tilemap.js";
import Drawable from "./Drawable";

export default class Layer extends Drawable {
    getTilesetFirstgid() {
        return this.tiledMap?.getTilesetFirstgid(this.getData())
    }
    protected tiledMap?: Tilemap;
    protected index: number = 0;
    private readonly interpreters: TileInterpreter[] = [
        new TileHouse(),
    ];
    private house = 0;
    protected buffer: number[] = [];
    setTiledMap(tiledMap: Tilemap) {
        this.tiledMap = tiledMap;
    }
    getTiledMap() {
        if (!this.tiledMap) {
            throw new Error("tiledMap not found");
        }
        return this.tiledMap;
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
    update(elapsed: number, delta: number) {
        this.textRenderer?.updateProjection(this.projection);
        this.textRenderer?.updateModel(this.model);
        this.textRenderer?.updateView(this.view);
        this.renderer?.updateProjection(this.projection);
        this.renderer?.updateModel(this.model);
        this.renderer?.updateView(this.view);
        this.feedback?.updateDelta(delta);
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
                this.textRenderer?.updatePosition(vec2.fromValues(j, i))
            }
        }
        this.buffer = buffer;
        this.textRenderer?.initVAO();
        this.renderer?.initVAO(buffer.length / 9);
        this.feedback?.initVAO(buffer.length / 9);
        this.feedback?.updateBuffer(0, buffer);
    }
    updateLayer(grid: number[][]) {
        const tiledMap = this.tiledMap;
        if (!tiledMap) {
            throw new Error("tiledMap is undefined");
        }
        const layer = tiledMap.getLayers()[this.index];
        const firstgid = tiledMap.getTilesetFirstgid(layer) || 1;
        const buffer: number[] = [];
        const maptilewidth = tiledMap.getTilewidth();
        const maptileheight = tiledMap.getTileheight();
        const width = layer.width;
        const height = layer.height;
        const tilewidth = tiledMap.getTilesetWidth(layer);
        const tileheight = tiledMap.getTilesetHeight(layer);
        const fixuv = 0.005;
        console.log(maptilewidth, width, tilewidth)
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const element = grid[i][j];
                for (const interpreter of this.interpreters) {
                    interpreter.interpret(this, i * width + j)
                }
                buffer.push(
                    0, 0 + j, 0 + i                                                         , 0 + fixuv, 0 + fixuv, element, element, tilewidth, tileheight,
                    0, 1 * tilewidth / maptilewidth + j, 0 + i                              , 2 - fixuv, 0 + fixuv, element, element, tilewidth, tileheight,
                    0, 1 * tilewidth / maptilewidth + j, 1 * tileheight / maptileheight + i , 2 - fixuv, 2 - fixuv, element, element, tilewidth, tileheight,
                    0, 1 * tilewidth / maptilewidth + j, 1 * tileheight / maptileheight + i , 2 - fixuv, 2 - fixuv, element, element, tilewidth, tileheight,
                    0, 0 + j, 1 * tileheight / maptileheight + i                            , 0 + fixuv, 2 - fixuv, element, element, tilewidth, tileheight,
                    0, 0 + j, 0 + i                                                         , 0 + fixuv, 0 + fixuv, element, element, tilewidth, tileheight,
                )
            }
        }
        this.buffer = buffer;
        this.feedback?.updateBuffer(0, buffer);

    }
}