import { MainMessage, WorkerMessage } from "../../message";

export default interface WorkerDevice {
    onmessage?: (data: MainMessage) => void;
    postmessage(data: WorkerMessage): void;
}