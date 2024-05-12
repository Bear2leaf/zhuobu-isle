import GameobjectBuilder from "../builder/GameobjectBuilder.js";
import TiledMap from "../tiled/TiledMap.js";
import Scene from "./Scene";

export default class TiledScene extends Scene {
    initTiledMap(tiledMap: TiledMap, builder: GameobjectBuilder) {
        const layers = tiledMap.getLayers();
        for (const layer of layers) {
            const image = tiledMap.getTilesetImage(layer)
            const firstgrid = tiledMap.getTilesetFirstgrid(layer)
            if (layer.name === "character") {
                builder.addCharacter(image)
            } else {
                builder.addLayer(image, layer, firstgrid);
            }
            this.gameobjects.push(builder.build());
        }
    }
}