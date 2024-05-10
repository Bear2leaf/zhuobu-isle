import Command from "./Command.js";
import InputReceiver from "../component/receiver/InputReceiver.js";

export default class InputCmd implements Command {
    private receiver?: InputReceiver;
    constructor(private readonly x: number, private readonly y: number, private readonly type: string) {

    }
    setReceiver(receiver: InputReceiver): void {
        this.receiver = receiver;
    }
    execute(): void {
        if (this.type === "onclick") {
            this.receiver?.onclick(this.x, this.y);
        } else if (this.type === "ondrag") {
            this.receiver?.ondrag(this.x, this.y);

        } else if (this.type === "onrelease") {
            this.receiver?.onrelease();
        }
    }

}