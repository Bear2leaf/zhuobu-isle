import { EmbeddedTileset, Map, UnencodedTileLayer } from "@kayahr/tiled";


export default class TiledMap {
    constructor(
        private readonly tilesets: EmbeddedTileset[],
        private readonly layers: UnencodedTileLayer[],
        private readonly width: number,
        private readonly height: number,

    ) { }
    getLayers() {
        return this.layers;
    }
    getWidth(): number | undefined {
        return this.width;
    }
    getTilesetFirstgrid(layer: UnencodedTileLayer) {
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