import { Map } from "@kayahr/tiled";
import Scene from "../scene/Scene.js";
import TiledScene from "../scene/TiledScene.js";
import Builder from "./Builder.js";
import Device from "../device/Device.js";
import CommandBuilder from "./CommandBuilder.js";
import Character from "../component/drawable/Character.js";

export default class SceneBuilder implements Builder<Scene> {
    private scene = new TiledScene();
    setTiledMapData(tiledMapData: Map) {
        this.scene.tiledMapData = tiledMapData;
        return this;
    }
    setupCommands(handlers: ((data: WorkerMessage) => void)[], sendmessage?: (data: MainMessage) => void) {
        const scene = this.scene;
        handlers.push((data) => {
            const commandBuilder = new CommandBuilder();
            for (const character of scene.getComponents(Character)) {
                commandBuilder
                    .preparePath(data, character)
                    ?.build()
                    .execute();
            }
        })
        const commandBuilder = new CommandBuilder();
        commandBuilder.prepareSend({
            type: "initTileMap",
            data: this.scene.tiledMapData
        }, sendmessage)
            ?.build()
            .execute();
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