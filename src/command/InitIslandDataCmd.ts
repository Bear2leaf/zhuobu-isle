import Command from "./Command.js";
import { MainMessage } from "../device/Device.js";

export default class InitIslandDataCmd implements Command {
    constructor(
        private readonly data: number[],
        private readonly sendmessage: (data: MainMessage) => void
    ) {

    }
    execute(): void {
        this.sendmessage && this.sendmessage({
            type: "initIslandData",
            data: this.data
        })
    }

}