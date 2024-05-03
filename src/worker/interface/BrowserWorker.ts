import WorkerInterface from "./WorkerInterface.js";

export default class BrowserWorker implements WorkerInterface {
    constructor() {
        self.onmessage = result => this.onmessage!(result.data);
    }
    onmessage?: (data: any) => void;
    postmessage(data: any): void {
        self.postMessage(data);
    }
}