import { MainMessage, WorkerMessage } from "../../device/Device.js";

export default interface WorkerDevice {
    onmessage?: (data: MainMessage) => void;
    postmessage(data: WorkerMessage): void;
}