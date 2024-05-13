import GameobjectBuilder from "../builder/GameobjectBuilder.js";
import TiledMap from "../tiled/TiledMap.js";
import Scene from "./Scene";

export default class TiledScene extends Scene {
    initTiledMap(tiledMap: TiledMap, builder: GameobjectBuilder) {
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
            builder.initFontCanvas();
            builder.setTiledMap(tiledMap);
            builder.setLayerIndex(layers.indexOf(layer))
            this.gameobjects.push(builder.build());
        }
    }
}