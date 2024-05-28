import Camera from "../camera/Camera.js";
import Command from "../command/Command.js";
import GenerateObjectCmd from "../command/GenerateObjectCmd.js";
import InitIslandDataCmd from "../command/InitIslandDataCmd.js";
import InitMapCmd from "../command/InitMapCmd.js";
import InputCmd from "../command/InputCmd.js";
import NoopCmd from "../command/NoopCmd.js";
import PathCmd from "../command/PathCmd.js";
import UpdateLayerCmd from "../command/UpdateLayerCmd.js";
import Character from "../component/drawable/Character.js";
import Island from "../component/drawable/Island.js";
import Layer from "../component/drawable/Layer.js";
import { MainMessage, WorkerMessage } from "../device/Device.js";
import Input from "../input/Input.js";
import Scene from "../scene/Scene.js";
import Tilemap from "../tiled/Tilemap.js";
import Builder from "./Builder.js";

export default class CommandInvoker implements Builder<Command> {
    private command?: Command;
    private sendmessage?: (data: MainMessage) => void;
    private camera?: Camera;
    private input?: Input;
    private handlers?: ((data: WorkerMessage) => void)[];
    private scene?: Scene;
    private islandScene?: Scene;
    setSendMessage(sendmessage: ((data: MainMessage) => void) | undefined) {
        this.sendmessage = sendmessage;
        return this;
    }
    setCamera(camera: Camera | undefined) {
        this.camera = camera;
        return this;
    }
    setInput(input: Input | undefined) {
        this.input = input;
        return this;
    }
    setHandlers(handlers: ((data: WorkerMessage) => void)[] | undefined) {
        this.handlers = handlers
        return this;
    }
    setScene(scene: Scene | undefined) {
        this.scene = scene;
        return this;
    }
    setIslandScene(scene: Scene | undefined) {
        this.islandScene = scene;
        return this;
    }
    prepareSend(data: MainMessage) {
        if (data.type === "initTileMap") {
            this.command = new InitMapCmd(data, this.sendmessage);
            return this;
        }
        throw new Error("unsupport type")
    }
    prepareLayerCmd(data: WorkerMessage, layer: Layer) {
        if (data.type === "updateLayer") {
            this.command = new UpdateLayerCmd(layer, data.data)
        } else if (data.type === "generateObject") {
            this.command = new GenerateObjectCmd(layer, data.data.position, data.data.element)
        } else if (data.type === "removeObject") {
            this.command = new GenerateObjectCmd(layer, data.data.position, data.data.element)
        }
        return this;
    }
    prepareCharacterCmd(data: WorkerMessage, character: Character) {
        if (data.type === "path") {
            this.command = new PathCmd(character, data.data)
        }
        return this;
    }
    prepareInput(x: number, y: number, type: string, character?: Character) {
        this.command = new InputCmd(x, y, type, this.camera, character, this.sendmessage);
        return this;
    }
    build(): Command {
        let command = this.command;
        if (!command) {
            command = new NoopCmd()
        }
        command.execute();
        this.command = undefined;
        return command;
    }
    setup() {
        const input = this.input;
        if (!input) {
            throw new Error("input is undefined");
        }
        const camera = this.camera;
        if (!camera) {
            throw new Error("camera is undefined");
        }
        const handlers = this.handlers;
        if (!handlers) {
            throw new Error("handlers is undefined");
        }
        const scene = this.scene;
        if (!scene) {
            throw new Error("scene is undefined");
        }
        const islandScene = this.islandScene;
        if (!islandScene) {
            throw new Error("islandScene is undefined");
        }
        input.onclick = (x: number, y: number) => {
            this.prepareInput(x, y, "onclick").build();
            for (const character of scene.getComponents(Character)) {
                this.prepareInput(x, y, "onclick", character).build()
            }
        }
        input.onrelease = () => {
            this.prepareInput(0, 0, "onrelease").build();
        }
        input.ondrag = (x: number, y: number) => {
            this.prepareInput(x, y, "ondrag").build();
        }
        const sendmessage = this.sendmessage;
        if (!sendmessage) {
            throw new Error("sendmessage is undefined");
        }
        const tiled = scene.getComponents(Layer)[0].getTiledMap()
        for (const island of islandScene.getComponents(Island)) {
            island.onPixelCreated((pixels) => {
                new InitIslandDataCmd(pixels, tiled, sendmessage).execute();
            })
        }
        const character = scene.getComponents(Character)[0];
        character.setCamera(camera);
        handlers.push((data) => {
            for (const layer of scene.getComponents(Layer)) {
                if (layer instanceof Character) {
                    this.prepareCharacterCmd(data, layer).build();
                } else {
                    this.prepareLayerCmd(data, layer).build();
                }
            }
        })
        return this;
    }

}