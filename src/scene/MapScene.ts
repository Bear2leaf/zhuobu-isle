import GameobjectBuilder from "../builder/GameobjectBuilder.js";
import Tilemap from "../tiled/Tilemap.js";
import Scene from "./Scene.js";

export default class MapScene extends Scene {
    initTiledMap(tiledMap: Tilemap, builder: GameobjectBuilder) {
        const layers = tiledMap.getLayers();
        for (const layer of layers) {
            if (layer.name === "character") {
                builder.addCharacter();
                builder.initRenderer();
                builder.initFontCanvas();
            } else {
                builder.addLayer();
                builder.initRenderer();
            }
            builder.setTiledMap(tiledMap);
            builder.setLayerIndex(layers.indexOf(layer))
            this.gameobjects.push(builder.build());
        }
    }
}