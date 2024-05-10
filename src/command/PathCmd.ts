import Command from "./Command.js";
import WorkerMessageReceiver from "../component/receiver/WorkerMessageReceiver.js";

export default class PathCmd implements Command {
    private receiver?: WorkerMessageReceiver;
    setReceiver(receiver: WorkerMessageReceiver): void {
        this.receiver = receiver;
    }
    execute(): void {
        this.receiver?.action();
    }

}