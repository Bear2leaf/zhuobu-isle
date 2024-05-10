import CommandBuilder from "../../builder/CommandBuilder.js";
import Component from "../Component.js";
import InputReceiver from "./InputReceiver.js";

export default class CharacterInputReceiver extends Component implements InputReceiver {
    sendmessage?: (data: MainMessage) => void
    ondrag(x: number, y: number): void {
    }
    onrelease(): void {
    }
    action(): void {
    }
    onclick(x: number, y: number): void {
        const commandBuilder = new CommandBuilder();
        commandBuilder.prepareSend({
            type: "findPath",
            data: {
                start: { x: 0, y: 0 },
                end: { x: Math.floor(x), y: Math.floor(y) }
            }
        }, this.sendmessage).build().execute();
    }
}