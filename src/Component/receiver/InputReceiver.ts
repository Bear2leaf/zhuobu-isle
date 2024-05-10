import Receiver from "./Receiver.js";

export default interface InputReceiver extends Receiver {
    onclick(x: number, y: number): void;
    ondrag(x: number, y: number): void;
    onrelease(): void;
}