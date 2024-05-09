import { EmbeddedTileset, Map, UnencodedTileLayer } from "@kayahr/tiled";
import Scene from "./Scene";

export default class TiledScene extends Scene {
    tiledMapData?: Map
    initContext(context: WebGL2RenderingContext) {
        const builder = this.builder;
        const tiledMapData = this.tiledMapData;
        if (!tiledMapData) {
            throw new Error("tiledMapData is undefined");
        }
        const layers = tiledMapData.layers as UnencodedTileLayer[];
        for (const layer of layers) {
            const image = this.getTilesetImage(tiledMapData, layer)
            const firstgrid = this.getTilesetFirstgrid(tiledMapData, layer)
            if (layer.name === "character") {
                builder.addCharacter(context, image)
                builder.addInputListener()
                builder.addMessageListener()
            } else {
                builder.addLayer(context, image, layer, firstgrid);
            }
            this.gameobject.push(builder.build());
        }
    }
    private getTilesetFirstgrid(tiledMapData: Map, layer: UnencodedTileLayer) {
        for (const tileset of tiledMapData.tilesets as EmbeddedTileset[]) {
            const match = layer.data?.every(tile => !tile || (tileset.firstgid <= tile && tile < tileset.firstgid + tileset.tilecount))
            if (match) {
                const firstgid = (tileset as EmbeddedTileset).firstgid;
                return firstgid;
            }
        }
    }
    private getTilesetImage(tiledMapData: Map, layer: UnencodedTileLayer) {
        for (const tileset of tiledMapData.tilesets as EmbeddedTileset[]) {
            const match = layer.data?.every(tile => !tile || (tileset.firstgid <= tile && tile < tileset.firstgid + tileset.tilecount))
            if (match) {
                const image = (tileset as EmbeddedTileset).image;
                const imagePaths = `${image}`.split('\/');
                const imageName = imagePaths[imagePaths.length - 1].replace(".png", "");
                return imageName;
            }
        }
        throw new Error("image not found")
    }
}