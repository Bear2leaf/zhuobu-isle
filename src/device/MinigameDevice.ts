import Device from "./Device";


export default class MinigameDevice implements Device {
    private worker?: WechatMinigame.Worker;
    private readonly divideTimeBy: number;
    private readonly canvasGL: WechatMinigame.Canvas
    private readonly canvas2D: WechatMinigame.Canvas;
    readonly contextGL: WebGL2RenderingContext;
    readonly context2D: CanvasRenderingContext2D;
    constructor() {
        this.canvasGL = wx.createCanvas()
        this.canvas2D = wx.createCanvas()
        this.contextGL = this.canvasGL.getContext("webgl2")!;
        this.context2D = this.canvas2D.getContext("2d")!;
        const info = wx.getWindowInfo();
        (this.canvasGL.width) = info.windowWidth * info.pixelRatio;
        (this.canvasGL.height) = info.windowHeight * info.pixelRatio;
        (this.canvas2D.width) = info.windowWidth * info.pixelRatio;
        (this.canvas2D.height) = info.windowHeight * info.pixelRatio;
        const isDevTool = wx.getSystemInfoSync().platform === "devtools";
        this.divideTimeBy = isDevTool ? 1 : 1000;
    }

    getWindowInfo(): [number , number] {
        return [
            this.canvasGL.width,
            this.canvasGL.height
        ];
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
                name: "public",
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
    createWorker(url: string, onMessageCallback: (data: any, callback: (data: any) => void) => void) {
        this.worker = wx.createWorker(url);
        this.worker.onMessage((data) => onMessageCallback(data, this.worker!.postMessage.bind(this.worker)))
    }
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

