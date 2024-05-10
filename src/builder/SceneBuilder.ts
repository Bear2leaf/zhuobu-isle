import { Map } from "@kayahr/tiled";
import Scene from "../scene/Scene.js";
import TiledScene from "../scene/TiledScene.js";
import Builder from "./Builder.js";
import Device from "../device/Device.js";
import Input from "../input/Input.js";
import Camera from "../camera/Camera.js";
import CommandBuilder from "./CommandBuilder.js";
import WorkerMessageReceiver from "../component/receiver/WorkerMessageReceiver.js";
import Character from "../component/drawable/Character.js";
import MainMessageReceiver from "../component/receiver/MainMessageReceiver.js";

export default class SceneBuilder implements Builder<Scene> {
    private scene = new TiledScene();
    setTiledMapData(tiledMapData: Map) {
        this.scene.tiledMapData = tiledMapData;
        return this;
    }
    setupCommands(handlers: ((data: WorkerMessage) => void)[], sendmessage?: (data: MainMessage) => void) {
        const scene = this.scene;
        const commandBuilder = new CommandBuilder();
        handlers.push((data) => {
            for (const receiver of scene.getComponents(WorkerMessageReceiver)) {
                receiver.workerMessage = data;
                commandBuilder
                    .prepareRecv(data)
                    .setReceiver(receiver)
                    .build()
                    .execute();
            }
        })
        commandBuilder.prepareSend({
            type: "initTileMap",
            data: this.scene.tiledMapData
        }, sendmessage).build().execute();
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