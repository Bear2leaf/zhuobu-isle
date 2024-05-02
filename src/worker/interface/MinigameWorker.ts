import WorkerInterface from "./WorkerInterface.js";

declare const worker: WechatMinigame.Worker;
export default class MinigameWorker implements WorkerInterface {
    constructor() {
        worker.onMessage((result: any) => this.onmessage!(result));
    }
    onmessage?: (data: any) => void;
    emit(data: any): void {
        worker.postMessage(data);
    }
}