import WorkerDevice from "./WorkerDevice";

export default class BrowserWorker implements WorkerDevice {
    constructor() {
        self.onmessage = (result: { data: MainMessage; }) => this.onmessage!(result.data);
    }
    onmessage?: (data: MainMessage) => void;
    postmessage(data: WorkerMessage): void {
        self.postMessage(data);
    }
}