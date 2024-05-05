import Device from "./Device";
export default class BrowserDevice extends Device {
    private worker?: Worker;
    private isMouseDown: boolean;
    private readonly windowInfo: readonly [number, number];
    private readonly canvas: HTMLCanvasElement
    constructor() {
        const canvasGL = document.createElement("canvas");
        document.body.appendChild(canvasGL);
        canvasGL.width = 512;
        canvasGL.height = 512;
        super(canvasGL)
        this.canvas = canvasGL;
        this.windowInfo = [canvasGL.width, canvasGL.height];
        this.isMouseDown = false;
    }
    contextGL: WebGL2RenderingContext;
    getWindowInfo(): readonly [number, number] {
        return this.windowInfo
    }
    now(): number {
        return performance.now();
    }
    reload(): void {
        window.location.reload();
    }
    async loadSubpackage() {
        return null;
    }
    async readImage(file: string): Promise<HTMLImageElement> {
        const image = new Image();
        image.src = file;
        await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; });
        return image;
    }
    createWebAudioContext(): AudioContext {
        return new AudioContext();
    }
    createWorker(url: string): void {
        if (this.worker) {
            this.worker.terminate();
        }
        if (!this.onmessage) {
            throw new Error("onmessage not set");
        }
        this.worker = new Worker(url, { type: "module" });
        this.worker.onmessage = (e: MessageEvent) => this.onmessage(e.data);
        this.sendmessage = this.worker!.postMessage.bind(this.worker)
    }
    onmessage: (data: any) => void;
    sendmessage: (data: any) => void;
    terminateWorker(): void {
        this.worker?.terminate();
    }
    onTouchStart(listener: Function): void {
        const windowInfo = this.getWindowInfo();
        this.canvas.onpointerdown = (e: PointerEvent) => {
            this.isMouseDown = true;
            const rect = this.canvas.getBoundingClientRect();
            const scaleRatio = windowInfo[0] / rect.width;
            listener({ x: e.clientX * scaleRatio - rect.left, y: e.clientY * scaleRatio - rect.top });
        };
    }
    onTouchMove(listener: Function): void {
        const windowInfo = this.getWindowInfo();
        this.canvas.onpointermove = (e: PointerEvent) => {
            if (this.isMouseDown) {
                const rect = this.canvas.getBoundingClientRect();
                const scaleRatio = windowInfo[0] / rect.width;
                listener({ x: e.clientX * scaleRatio - rect.left, y: e.clientY * scaleRatio - rect.top });
            }
        };
    }
    onTouchEnd(listener: Function): void {
        const windowInfo = this.getWindowInfo();
        this.canvas.onpointerup = (e: PointerEvent) => {
            this.isMouseDown = false;
            const rect = this.canvas.getBoundingClientRect();
            const scaleRatio = windowInfo[0] / rect.width;
            listener({ x: e.clientX * scaleRatio - rect.left, y: e.clientY * scaleRatio - rect.top });
        }
    }
    onTouchCancel(listener: Function): void {
        const windowInfo = this.getWindowInfo();
        this.canvas.onpointercancel = (e: PointerEvent) => {
            this.isMouseDown = false;
            const rect = this.canvas.getBoundingClientRect();
            const scaleRatio = windowInfo[0] / rect.width;
            listener({ x: e.clientX * scaleRatio - rect.left, y: e.clientY * scaleRatio - rect.top });
        }
    }
    async readJson(file: string): Promise<Object> {
        const response = await fetch(file);
        return await response.json();
    }
    async readText(file: string): Promise<string> {
        const response = await fetch(file);
        return await response.text();
    }
    async readBuffer(file: string): Promise<ArrayBuffer> {
        const response = await fetch(file);
        return await response.arrayBuffer();
    }
}
