import Device from "../../device/Device.js";
import Listener from "./Linstener.js";

export default class MessageListener extends Listener {
    private device?: Device
    constructor() {
        super();
        this.listeners["postmessage"] = (data: MainMessage) => {
            const device = this.device;
            device?.sendmessage && device.sendmessage(data);
        }
    }
    set onmessage(handler: (message: WorkerMessage) => void) {
        this.listeners["message"] = handler;
    }
    get onmessage() {
        return (data: WorkerMessage) => this.emit("message", data)
    }
    protected emit(type: "message", message: WorkerMessage): void
    protected emit(type: "postmessage", message: MainMessage): void
    protected emit(type: "message" | "postmessage", message: WorkerMessage | MainMessage): void {
        super.emit(type, message);
    }
}