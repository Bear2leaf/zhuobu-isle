import GameobjectBuilder from "../builder/GameobjectBuilder.js";
import IslandMap from "../worker/island/IslandMap.js";
import Scene from "./Scene.js";

export default class IslandScene extends Scene {
    initIsland(islandData: IslandMap, builder: GameobjectBuilder) {

        builder.addIsland();
        builder.initIslandFramebuffer(islandData);
        builder.initRenderer();
        this.gameobjects.push(builder.build());
    }
}