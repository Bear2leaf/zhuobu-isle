import { EmbeddedTileset, Map, UnencodedTileLayer } from "@kayahr/tiled";
import { ReadonlyVec2, vec2 } from "gl-matrix";


export default class TiledMap {
    constructor(
        private readonly tilesets: EmbeddedTileset[],
        private readonly layers: UnencodedTileLayer[],
        private readonly width: number,
        private readonly height: number,
        private readonly tilewidth: number,
        private readonly tileheight: number,

    ) { }
    getLayers() {
        return this.layers;
    }
    getTilesets() {
        return this.tilesets;
    }
    getWidth(): number {
        return this.width;
    }
    getHeight(): number {
        return this.height
    }
    getTilewidth(): number {
        return this.tilewidth
    }
    getTileheight(): number {
        return this.tileheight
    }
    getTilesetHeight(layer: UnencodedTileLayer) {
        for (const tileset of this.tilesets) {
            const match = layer.data?.every(tile => !tile || (tileset.firstgid <= tile && tile < tileset.firstgid + tileset.tilecount))
            if (match) {
                return tileset.tileheight;
            }
        }
        throw new Error("tileheight not found")
    }
    getTilesetWidth(layer: UnencodedTileLayer) {
        for (const tileset of this.tilesets) {
            const match = layer.data?.every(tile => !tile || (tileset.firstgid <= tile && tile < tileset.firstgid + tileset.tilecount))
            if (match) {
                return tileset.tilewidth;
            }
        }
        throw new Error("tilewidth not found")
    }
    getCameraPosition(): vec2 {

        for (const layer of this.layers) {
            if (layer.name === "camera") {
                return this.getFirstTilePosition(layer)
            }
        }
        throw new Error("camera not found");
    }
    getFirstTilePosition(layer: UnencodedTileLayer): vec2 {
        const width = this.width;
        const height = this.height;
        const data = layer.data!;
        const firstgid = this.getTilesetFirstgid(layer) || 1;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const element = data[i * width + j] - firstgid;
                if (element < 0) {
                    continue;
                }
                return vec2.fromValues(-j * 100, -i * 100)
            }
        }
        throw new Error("position not found");
    }
    getTilesetFirstgid(layer: UnencodedTileLayer) {
        for (const tileset of this.tilesets) {
            const match = layer.data?.every(tile => !tile || (tileset.firstgid <= tile && tile < tileset.firstgid + tileset.tilecount))
            if (match) {
                const firstgid = tileset.firstgid;
                return firstgid;
            }
        }
    }
    getTilesetImage(layer: UnencodedTileLayer) {
        for (const tileset of this.tilesets) {
            const match = layer.data?.every(tile => !tile || (tileset.firstgid <= tile && tile < tileset.firstgid + tileset.tilecount))
            if (match) {
                const image = tileset.image;
                const imagePaths = `${image}`.split('\/');
                const imageName = imagePaths[imagePaths.length - 1].replace(".png", "");
                return imageName;
            }
        }
        throw new Error("image not found")
    }
}