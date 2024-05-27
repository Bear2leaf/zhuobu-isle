import { MainMessage } from "../device/Device.js";
import Command from "./Command.js";

export default class InitMapCmd implements Command {
    constructor(
        private readonly data: MainMessage,
        private readonly sendmessage?: (data: MainMessage) => void
    ) { }
    execute(): void {
        this.sendmessage && this.sendmessage(this.data)
    }

}