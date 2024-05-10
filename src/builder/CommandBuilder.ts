import Command from "../command/Command.js";
import FindPathCmd from "../command/FindPathCmd.js";
import InitTiledCmd from "../command/InitTiledCmd.js";
import InputCmd from "../command/InputCmd.js";
import PathCmd from "../command/PathCmd.js";
import MainMessageReceiver from "../component/receiver/MainMessageReceiver.js";
import Receiver from "../component/receiver/Receiver.js";
import Builder from "./Builder.js";

export default class CommandBuilder implements Builder<Command> {
    private command?: Command;
    setReceiver(receiver: Receiver) {
        this.command?.setReceiver(receiver);
        return this;
    }
    prepareSend(data: MainMessage, sendmessage?: (data: MainMessage) => void) {
        if (data.type === "initTileMap") {
            this.command = new InitTiledCmd();
        } else if (data.type === "findPath") {
            this.command = new FindPathCmd();
        }
        const receiver = new MainMessageReceiver();
        receiver.mainMessage = data;
        receiver.sendmessage = sendmessage;
        this.command?.setReceiver(receiver)
        return this;
    }
    prepareRecv(data: WorkerMessage) {
        if (data.type === "path") {
            this.command = new PathCmd()
        }
        return this;
    }
    prepareInput(x: number, y: number, type: string) {
        this.command = new InputCmd(x, y, type);
        return this;
    }
    build(): Command {
        if (!this.command) {
            throw new Error("command is not created");
        }
        return this.command;
    }

}