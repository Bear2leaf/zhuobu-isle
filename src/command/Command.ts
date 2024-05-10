import Receiver from "../component/receiver/Receiver.js";

export default interface Command {
    setReceiver(receiver: Receiver): void
    execute(): void;
}