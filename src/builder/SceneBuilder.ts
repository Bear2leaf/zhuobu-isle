import { Map } from "@kayahr/tiled";
import Scene from "../scene/Scene.js";
import TiledScene from "../scene/TiledScene.js";
import Builder from "./Builder.js";
import Device from "../device/Device.js";
import TiledMap from "../tiled/TiledMap.js";
import GameobjectBuilder from "./GameobjectBuilder.js";

export default class SceneBuilder implements Builder<Scene> {
    private scene?: Scene;

    initTiledMap(tiledMap: TiledMap, gameobjectBuilder: GameobjectBuilder) {
        const scene = new TiledScene();
        scene.initTiledMap(tiledMap, gameobjectBuilder)
        this.scene = scene;
        return this;
    }
    async load(device: Device): Promise<this> {
        if (!this.scene) {
            throw new Error("scene is not defined");
        }
        await this.scene.load(device);
        return this;
    }
    init() {
        if (!this.scene) {
            throw new Error("scene is not defined");
        }
        this.scene.initGameobjects();
        return this;
    }
    build(): Scene {
        if (!this.scene) {
            throw new Error("scene is not defined");
        }
        const result = this.scene;
        this.scene = undefined;
        return result;
    }

}