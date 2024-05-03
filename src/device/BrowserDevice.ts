import Device from "./Device";
export default class BrowserDevice implements Device {
    private worker?: Worker;
    private isMouseDown: boolean;
    readonly canvasGL: HTMLCanvasElement;
    constructor() {
        const canvasGL = document.createElement("canvas");
        document.body.appendChild(canvasGL);
        canvasGL.width = 512;
        canvasGL.height = 512;
        this.canvasGL = canvasGL;
        this.isMouseDown = false;
    }
    contextGL: WebGL2RenderingContext;
    getWindowInfo(): [number, number] {
        return [
            this.canvasGL.width,
            this.canvasGL.height
        ]
    }
    hideCanvas() {
        this.canvasGL.style.display = "none";
    }
    showCanvas() {
        this.canvasGL.style.display = "block;"
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
        import("../worker/index")
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
        this.canvasGL.onpointerdown = (e: PointerEvent) => {
            this.isMouseDown = true;
            const rect = this.canvasGL.getBoundingClientRect();
            const scaleRatio = windowInfo[0] / rect.width;
            listener({ x: e.clientX * scaleRatio - rect.left, y: e.clientY * scaleRatio - rect.top });
        };
    }
    onTouchMove(listener: Function): void {
        const windowInfo = this.getWindowInfo();
        this.canvasGL.onpointermove = (e: PointerEvent) => {
            if (this.isMouseDown) {
                const rect = this.canvasGL.getBoundingClientRect();
                const scaleRatio = windowInfo[0] / rect.width;
                listener({ x: e.clientX * scaleRatio - rect.left, y: e.clientY * scaleRatio - rect.top });
            }
        };
    }
    onTouchEnd(listener: Function): void {
        const windowInfo = this.getWindowInfo();
        this.canvasGL.onpointerup = (e: PointerEvent) => {
            this.isMouseDown = false;
            const rect = this.canvasGL.getBoundingClientRect();
            const scaleRatio = windowInfo[0] / rect.width;
            listener({ x: e.clientX * scaleRatio - rect.left, y: e.clientY * scaleRatio - rect.top });
        }
    }
    onTouchCancel(listener: Function): void {
        const windowInfo = this.getWindowInfo();
        this.canvasGL.onpointercancel = (e: PointerEvent) => {
            this.isMouseDown = false;
            const rect = this.canvasGL.getBoundingClientRect();
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
