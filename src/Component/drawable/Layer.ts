import TiledMap from "../../tiled/TiledMap.js";
import Drawable from "./Drawable";
import { EmbeddedTileset, UnencodedTileLayer } from "@kayahr/tiled";

export default class Layer extends Drawable {
    protected tiledMap?: TiledMap;
    protected index: number = 0;
    protected readonly buffer: number[] = [];
    setTiledMap(tiledMap: TiledMap) {
        this.tiledMap = tiledMap;
    }
    setLayerIndex(index: number) {
        this.index = index;
    }
    initTexture() {
        const tiledMap = this.tiledMap;
        if (!tiledMap) {
            throw new Error("tiledMap is undefined");
        }
        const image = tiledMap.getTilesetImage(tiledMap.getLayers()[this.index]);
        this.setTextureName(image);
    }
    init(): void {
        const tiledMap = this.tiledMap;
        if (!tiledMap) {
            throw new Error("tiledMap is undefined");
        }
        const layer = tiledMap.getLayers()[this.index];
        const firstgrid = tiledMap.getTilesetFirstgrid(layer) || 1;
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
                const element = data[i * width + j] - firstgrid;
                if (element < 0) {
                    continue;
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