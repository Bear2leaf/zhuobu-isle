import { Map } from "@kayahr/tiled";
import Scene from "../../scene/Scene.js";
import TiledScene from "../../scene/TiledScene.js";
import Builder from "./Builder.js";
import Device from "../../device/Device.js";
import MessageListener from "../listener/MessageListener.js";
import InputListener from "../listener/InputListener.js";

export default class SceneBuilder implements Builder<Scene> {
    private scene = new TiledScene();
    setTiledMapData(tiledMapData: Map) {
        this.scene.tiledMapData = tiledMapData;
        return this;
    }
    emitTiledMapData(sendmessage?: (data: MainMessage) => void) {
        sendmessage && sendmessage({
            type: "initTileMap",
            data: this.scene.tiledMapData
        })
        return this;
    }
    addMessageHandler(device: Device) {
        const scene = this.scene;
        device.onmessage = (data: WorkerMessage) => {
            for (const listener of scene.getComponents(MessageListener)) {
                listener.onmessage(data);
            }
        }
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
        this.scene.init();
        return this;
    }

    addClickHandler(sendmessage?: (data: MainMessage) => void) {
        for (const listener of this.scene.getComponents(InputListener)) {
            listener.onclick = (x, y) => {
                sendmessage && sendmessage({
                    type: "findPath",
                    data: {
                        start: {
                            x: Math.floor(0),
                            y: Math.floor(0)
                        },
                        end: {
                            x: Math.floor(x),
                            y: Math.floor(y)
                        }
                    }
                });
            }
        }
        return this;
    }
    build(): Scene {
        const result = this.scene;
        this.scene = new TiledScene();
        return result;
    }

}