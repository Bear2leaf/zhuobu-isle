import WorkerInterface from "./WorkerInterface.js";

export default class BrowserWorker implements WorkerInterface {
    constructor() {
        self.onmessage = (result: { data: MainMessage; }) => this.onmessage!(result.data);
    }
    onmessage?: (data: MainMessage) => void;
    postmessage(data: WorkerMessage): void {
        self.postMessage(data);
    }
}