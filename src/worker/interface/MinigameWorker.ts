import WorkerInterface from "./WorkerInterface.js";

declare const worker: WechatMinigame.Worker;
export default class MinigameWorker implements WorkerInterface {
    constructor() {
        worker.onMessage((result) => this.onmessage!(result as any));
    }
    onmessage?: (data: MainMessage) => void;
    postmessage(data: WorkerMessage): void {
        worker.postMessage(data);
    }
}