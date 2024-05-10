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

export default class CommandBuilder implements Builder<Command> {
    private command?: Command;
    prepareSend(data: MainMessage, sendmessage?: (data: MainMessage) => void) {
        if (data.type === "initTileMap") {
            this.command = new InitTiledCmd(data, sendmessage);
            return this;
        } else if (data.type === "findPath") {
            this.command = new FindPathCmd(data, sendmessage);
            return this;
        }
    }
    preparePath(data: WorkerMessage, character: Character) {
        if (data.type === "path") {
            this.command = new PathCmd(character, data.data)
            return this;
        }
    }
    prepareInput(x: number, y: number, type: string, camera: Camera, character?: Character, sendmessage?: (data: MainMessage) =>void) {
        this.command = new InputCmd(x, y, type, camera, character, sendmessage);
        return this;
    }
    build(): Command {
        if (!this.command) {
            throw new Error("command is not created");
        }
        return this.command;
    }
    setupCommands(
        input: Input,
        handlers: ((data: WorkerMessage) => void)[],
        camera: Camera,
        scene: Scene,
        sendmessage?: (data: MainMessage) => void
    ) {
        input.onclick = (x: number, y: number) => {
            this.prepareInput(x, y, "onclick", camera).build().execute();
            for (const character of scene.getComponents(Character)) {
                this.prepareInput(x, y, "onclick", camera, character, sendmessage).build().execute()
            }
        }
        input.onrelease = () => {
            this.prepareInput(0, 0, "onrelease", camera).build().execute();
        }
        input.ondrag = (x: number, y: number) => {
            this.prepareInput(x, y, "ondrag", camera).build().execute();
        }
        handlers.push((data) => {
            for (const character of scene.getComponents(Character)) {
                this.preparePath(data, character)
                    ?.build()
                    .execute();
            }
        })
    }

}