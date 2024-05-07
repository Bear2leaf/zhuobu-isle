import WorkerDevice from "./WorkerDevice";

declare const worker: WechatMinigame.Worker;
export default class MinigameWorker implements WorkerDevice {
    constructor() {
        worker.onMessage((result) => this.onmessage!(result as any));
    }
    onmessage?: (data: MainMessage) => void;
    postmessage(data: WorkerMessage): void {
        worker.postMessage(data);
    }
}