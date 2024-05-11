import Camera from "../camera/Camera.js";
import Command from "../command/Command.js";
import FindPathCmd from "../command/FindPathCmd.js";
import InitTiledCmd from "../command/InitTiledCmd.js";
import InputCmd from "../command/InputCmd.js";
import PathCmd from "../command/PathCmd.js";
import Character from "../component/drawable/Character.js";
import Input from "../input/Input.js";
import Scene from "../scene/Scene.js";
import Builder from "./Builder.js";

export default class CommandInvoker implements Builder<Command> {
    private command?: Command;
    private sendmessage?: (data: MainMessage) => void;
    private camera?: Camera;
    private input?: Input;
    private handlers?: ((data: WorkerMessage) => void)[];
    private scene?: Scene;
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
    prepareSend(data: MainMessage) {
        if (data.type === "initTileMap") {
            this.command = new InitTiledCmd(data, this.sendmessage);
            return this;
        } else if (data.type === "findPath") {
            this.command = new FindPathCmd(data, this.sendmessage);
            return this;
        }
        throw new Error("unsupport type")
    }
    preparePath(data: WorkerMessage, character: Character) {
        if (data.type === "path") {
            this.command = new PathCmd(character, data.data)
            return this;
        }
        throw new Error("unsupport type")
    }
    prepareInput(x: number, y: number, type: string,  character?: Character) {
        this.command = new InputCmd(x, y, type, this.camera, character, this.sendmessage);
        return this;
    }
    build(): Command {
        const command = this.command;
        if (!command) {
            throw new Error("command not created");
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
        const sendmessage = this.sendmessage;
        if (!sendmessage) {
            throw new Error("sendmessage is undefined");
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
        handlers.push((data) => {
            for (const character of scene.getComponents(Character)) {
                this.preparePath(data, character).build();
            }
        })
        return this;
    }

}