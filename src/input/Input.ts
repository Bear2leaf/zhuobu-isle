import Device from "../device/Device.ts";
type InputType = "TouchStart" | "TouchMove" | "TouchEnd" | "TouchCancel";
export default class Input {
    private last?: InputType;
    private readonly queue: {
        type: InputType,
        x: number,
        y: number
    }[];
    onclick: (x: number, y: number) => void
    ondrag: (x: number, y: number) => void
    constructor(device: Device) {
        this.queue = [];
        device.onTouchStart((e) => {
            this.queue.push(Object.assign(e, { type: "TouchStart" }));
        })
        device.onTouchMove((e) => {
            this.queue.push(Object.assign(e, { type: "TouchMove" }));
        })
        device.onTouchEnd((e) => {
            this.queue.push({ x: 0, y: 0, type: "TouchEnd" });
        })
        device.onTouchCancel((e) => {
            this.queue.push({ x: 0, y: 0, type: "TouchEnd" });
        })
    }
    onrelease: () => void;
    update() {
        const e = this.queue[this.queue.length - 1];
        if (e === undefined) {
            return;
        }
        if (e.type === "TouchStart") {
        }
        if (e.type === "TouchEnd" && (this.last === "TouchStart" || this.last === "TouchMove")) {
            const lastE = this.queue[this.queue.length - 2];
            if (lastE === undefined) {
                return;
            }
            this.onclick(lastE.x, lastE.y);
        }
        if (e.type === "TouchEnd") {
            this.onrelease();
            this.queue.splice(0, this.queue.length);
        }
        if (e.type === "TouchMove") {
            const lastE = this.queue[this.queue.length - 2];
            if (lastE === undefined) {
                return;
            }
            const delta: [number, number] = [e.x - lastE.x, lastE.y - e.y]
            this.ondrag(...delta)
        }
        this.last = e.type;
    }
}