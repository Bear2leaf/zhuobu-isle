import Device from "./Device";
export default class BrowserDevice implements Device {
    private worker?: Worker;
    private isMouseDown: boolean;
    private readonly windowInfo: [number, number];
    private readonly canvas: HTMLCanvasElement
    private contextCreated: boolean = false;
    constructor() {
        this.canvas = document.createElement("canvas");
        document.body.appendChild(this.canvas);
        this.canvas.width = window.innerWidth * devicePixelRatio
        this.canvas.height = window.innerHeight * devicePixelRatio
        this.windowInfo = [this.canvas.width, this.canvas.height];

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth * devicePixelRatio
            this.canvas.height = window.innerHeight * devicePixelRatio
            this.windowInfo[0] = this.canvas.width;
            this.windowInfo[1] = this.canvas.height;
        })
        this.isMouseDown = false;
    }
    getContext(): WebGL2RenderingContext {
        const context = this.canvas.getContext("webgl2");
        if (!context) {
            throw new Error("context not created");
        }
        if (this.contextCreated) {
            throw new Error("context already created");
        }
        this.contextCreated = true;
        return context;
    }
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
        this.worker.onmessage = (e: MessageEvent) => this.onmessage && this.onmessage(e.data);
        this.sendmessage = this.worker!.postMessage.bind(this.worker)
    }
    onmessage?: (data: any) => void;
    sendmessage?: (data: any) => void;
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
