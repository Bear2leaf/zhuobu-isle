import 'minigame-api-typings';
import Device from "./Device";


export default class MinigameDevice implements Device {
    private worker?: WechatMinigame.Worker;
    private readonly windowInfo: readonly [number, number];
    private readonly canvas: WechatMinigame.Canvas
    private contextCreated: boolean = false;
    private readonly divideTimeBy: number;
    constructor() {
        this.canvas = wx.createCanvas();
        const info = wx.getWindowInfo();
        (this.canvas.width) = info.windowWidth * info.pixelRatio;
        (this.canvas.height) = info.windowHeight * info.pixelRatio;
        this.windowInfo = [this.canvas.width, this.canvas.height];
        const isDevTool = wx.getSystemInfoSync().platform === "devtools";
        this.divideTimeBy = isDevTool ? 1 : 1000;
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
        return this.windowInfo;
    }
    now(): number {
        return wx.getPerformance().now() / this.divideTimeBy;

    }
    reload(): void {
        throw new Error("MiniGame not support reload.")
    }
    async loadSubpackage() {
        return await new Promise<null>(resolve => {
            const task = wx.loadSubpackage({
                name: "resources",
                success(res: { errMsg: string }) {
                    console.debug("load resources success", res)
                    resolve(null);
                },
                fail(res: { errMsg: string }) {
                    console.error("load resources fail", res)
                },
                complete() {
                    console.debug("load resources complete");
                }
            })

            task.onProgressUpdate((res) => {
                console.debug(`onProgressUpdate: ${res.progress}, ${res.totalBytesExpectedToWrite}, ${res.totalBytesWritten}`)
            })
        });
    }
    async readImage(file: string): Promise<HTMLImageElement> {
        const image = wx.createImage() as HTMLImageElement;
        image.src = file;
        await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; });
        return image;
    }
    createWebAudioContext(): AudioContext {
        return wx.createWebAudioContext() as unknown as AudioContext;
    }
    createWorker(url: string) {
        this.worker = wx.createWorker(url);
        if (!this.onmessage) {
            throw new Error("onmessage not set");
        }
        this.worker.onMessage((data) => this.onmessage(data))
        this.sendmessage = this.worker!.postMessage.bind(this.worker)
    }
    onmessage: (data: any) => void;
    sendmessage: (data: any) => void;
    terminateWorker(): void {
        this.worker?.terminate();
    }
    onTouchStart(listener: Function): void {
        wx.onTouchStart((e) => {
            const touch = e.touches[0];
            if (!touch) {
                throw new Error("touch not exist")
            }
            listener({ x: touch.clientX, y: touch.clientY });
        });
    }
    onTouchMove(listener: Function): void {
        wx.onTouchMove((e) => {
            const touch = e.touches[0];
            if (!touch) {
                throw new Error("touch not exist")
            }
            listener({ x: touch.clientX, y: touch.clientY });
        });
    }
    onTouchEnd(listener: Function): void {
        wx.onTouchEnd((e) => {
            listener();
        });
    }
    onTouchCancel(listener: Function): void {
        wx.onTouchCancel((e) => {
            listener();
        });
    }
    readJson(file: string): Promise<Object> {
        return new Promise(resolve => resolve(JSON.parse(wx.getFileSystemManager().readFileSync(file, 'utf-8') as string)));
    }
    readText(file: string): Promise<string> {
        return new Promise(resolve => resolve(wx.getFileSystemManager().readFileSync(file, 'utf-8') as string));
    }
    readBuffer(file: string): Promise<ArrayBuffer> {
        return new Promise(resolve => resolve(wx.getFileSystemManager().readFileSync(file) as ArrayBuffer));
    }
}

