import { Map } from "@kayahr/tiled";
import Scene from "../scene/Scene.js";
import TiledScene from "../scene/TiledScene.js";
import Builder from "./Builder.js";
import Device from "../device/Device.js";

export default class SceneBuilder implements Builder<Scene> {
    private scene = new TiledScene();
    setData(tiledMapData: Map) {
        this.scene.tiledMapData = tiledMapData;
        return this;
    }
    initContext(context: WebGL2RenderingContext) {
        this.scene.initContext(context);
        return this;
    }
    async load(device: Device): Promise<this> {
        await this.scene.load(device);
        return this;
    }
    init() {
        this.scene.initGameobjects();
        return this;
    }
    build(): Scene {
        const result = this.scene;
        this.scene = new TiledScene();
        return result;
    }

}