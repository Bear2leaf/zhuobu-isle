import WorkerMessageReceiver from "../component/receiver/WorkerMessageReceiver.js";
import Command from "./Command.js";

export default class MainMessageCmd implements Command {
    private receiver?: WorkerMessageReceiver;
    setReceiver(receiver: WorkerMessageReceiver): void {
        this.receiver = receiver;
    }
    execute(): void {
        this.receiver?.action();
    }

}