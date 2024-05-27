import GameobjectBuilder from "../builder/GameobjectBuilder.js";
import IslandMap from "../island/IslandMap.js";
import Scene from "./Scene.js";

export default class IslandScene extends Scene {
    initIsland(builder: GameobjectBuilder) {

        builder.addIsland();
        builder.initRenderer();
        this.gameobjects.push(builder.build());
    }
}