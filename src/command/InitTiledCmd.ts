import Command from "./Command.js";

export default class InitTiledCmd implements Command {
    constructor(
        private readonly data: MainMessage,
        private readonly sendmessage?: (data: MainMessage) => void
    ) { }
    execute(): void {
        this.sendmessage && this.sendmessage(this.data)
    }

}