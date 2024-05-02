import Device from "./Device";
export default class BrowserDevice implements Device {
    private worker?: Worker;
    private isMouseDown: boolean;
    readonly canvasGL: HTMLCanvasElement;
    readonly canvas2D: HTMLCanvasElement;
    readonly contextGL: WebGL2RenderingContext;
    readonly context2D: CanvasRenderingContext2D;
    constructor(canvasGL: HTMLCanvasElement, canvas2D: HTMLCanvasElement) {
        canvasGL.width = 512;
        canvasGL.height = 512;
        canvas2D.style.display = "none";
        this.contextGL = canvasGL.getContext("webgl2")!;
        this.context2D = canvas2D.getContext("2d")!;
        this.canvasGL = canvasGL;
        this.canvas2D = canvas2D;
        this.isMouseDown = false;
    }
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
        image.src = file.replace("public/", "/");
        await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; });
        return image;
    }
    createWebAudioContext(): AudioContext {
        return new AudioContext();
    }
    createWorker(url: string, onMessageCallback: (data: unknown, callback: (data: unknown) => void) => void): void {
        import("../worker/index")
        this.worker = new Worker(url, {type: "module"});
        this.worker.onmessage = (e: MessageEvent) => onMessageCallback(e.data, this.worker!.postMessage.bind(this.worker))
    }
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
        const response = await fetch(file.replace("public/", "/"));
        return await response.json();
    }
    async readText(file: string): Promise<string> {
        const response = await fetch(file.replace("public/", "/"));
        return await response.text();
    }
    async readBuffer(file: string): Promise<ArrayBuffer> {
        const response = await fetch(file.replace("public/", "/"));
        return await response.arrayBuffer();
    }
}
