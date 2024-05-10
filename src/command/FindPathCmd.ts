import Command from "./Command.js";
import MainMessageReceiver from "../component/receiver/MainMessageReceiver.js";

export default class FindPathCmd implements Command {
    private receiver?: MainMessageReceiver;
    setReceiver(receiver: MainMessageReceiver): void {
        this.receiver = receiver;
    }
    execute(): void {
        this.receiver?.action();
    }

}